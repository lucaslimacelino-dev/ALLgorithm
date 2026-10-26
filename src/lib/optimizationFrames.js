// Otimização passo a passo: gradiente, subida de encosta, têmpera simulada, algoritmo genético,
// colônia de formigas e Simplex. Toda aleatoriedade vem de um gerador com semente (reprodutível).

const fail = () => { throw new Error('entrada inválida') }

// Gerador congruencial linear (o mesmo dos exemplos de código): estado de 32 bits.
export function lcg(seed) {
  let s = seed >>> 0
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296 }
}

// ── Paisagens 2D ───────────────────────────────────────────
export const landscapes = {
  bowl: {
    label: 'x² + 10y²', range: [-5, 5, -5, 5], min: [0, 0],
    f: (x, y) => x * x + 10 * y * y,
    grad: (x, y) => [2 * x, 20 * y],
  },
  rosenbrock: {
    label: 'Rosenbrock', range: [-2, 2, -1, 3], min: [1, 1],
    f: (x, y) => (1 - x) ** 2 + 100 * (y - x * x) ** 2,
    grad: (x, y) => [-2 * (1 - x) - 400 * x * (y - x * x), 200 * (y - x * x)],
  },
  himmelblau: {
    label: 'Himmelblau', range: [-5, 5, -5, 5], min: [3, 2],
    f: (x, y) => (x * x + y - 11) ** 2 + (x + y * y - 7) ** 2,
    grad: (x, y) => [4 * x * (x * x + y - 11) + 2 * (x + y * y - 7), 2 * (x * x + y - 11) + 4 * y * (x + y * y - 7)],
  },
  rastrigin: {
    label: 'Rastrigin', range: [-5.12, 5.12, -5.12, 5.12], min: [0, 0],
    f: (x, y) => 20 + x * x + y * y - 10 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y)),
    grad: (x, y) => [2 * x + 20 * Math.PI * Math.sin(2 * Math.PI * x), 2 * y + 20 * Math.PI * Math.sin(2 * Math.PI * y)],
  },
}

const r3 = v => Number(v.toPrecision(4))
const fmtP = ([x, y]) => `(${r3(x)}, ${r3(y)})`
const clampTo = (L, [x, y]) => [Math.min(L.range[1], Math.max(L.range[0], x)), Math.min(L.range[3], Math.max(L.range[2], y))]

// Gradiente descendente. Quadros: { path, cur, arrow?, note }
export function gradientFrames(fn, start, lr) {
  const L = landscapes[fn]
  if (!L || !(lr > 0) || lr > 1) fail()
  let p = start
  const path = [p]
  const frames = [{ path: [...path], cur: p, note: `Começa em ${fmtP(p)}, onde f = ${r3(L.f(...p))}. A cada passo, anda contra o gradiente (a direção de maior subida), multiplicado pela taxa de aprendizado η = ${lr}.` }]
  for (let i = 1; i <= 150; i++) {
    const g = L.grad(...p)
    const norm = Math.hypot(...g)
    const next = [p[0] - lr * g[0], p[1] - lr * g[1]]
    if (!Number.isFinite(next[0]) || Math.abs(next[0]) > 1e6 || Math.abs(next[1]) > 1e6) {
      frames.push({ path: [...path], cur: p, diverged: true, note: `Divergiu: com η = ${lr} os passos ficam cada vez maiores e o ponto escapa. Diminua a taxa de aprendizado.` })
      return frames
    }
    p = next
    path.push(p)
    frames.push({ path: [...path], cur: p, note: `Passo ${i}: gradiente ${fmtP(g)} (módulo ${r3(norm)}); novo ponto ${fmtP(p)}, f = ${r3(L.f(...p))}.` })
    if (norm < 1e-3) break
  }
  const end = frames.at(-1)
  end.note += Math.hypot(...L.grad(...p)) < 1e-3 ? ' O gradiente quase zerou: chegou a um mínimo (local).' : ' Ainda não convergiu — em vales estreitos, o gradiente dá muitos passos pequenos.'
  end.done = true
  return frames
}

// Subida de encosta (aqui, "descida": minimiza). Quadros: { path, cur, cands?, note }
export function hillFrames(fn, start, step, seed) {
  const L = landscapes[fn]
  if (!L || !(step > 0)) fail()
  const rnd = lcg(seed)
  let p = start, fp = L.f(...p)
  const path = [p]
  const frames = [{ path: [...path], cur: p, note: `Começa em ${fmtP(p)}, f = ${r3(fp)}. A cada passo, sorteia 8 vizinhos a uma distância de até ${step} e vai para o melhor — se ele melhorar.` }]
  for (let i = 1; i <= 120; i++) {
    const cands = Array.from({ length: 8 }, () => { const a = rnd() * 2 * Math.PI, r = step * (0.3 + 0.7 * rnd()); return clampTo(L, [p[0] + r * Math.cos(a), p[1] + r * Math.sin(a)]) })
    const best = cands.reduce((b, c) => (L.f(...c) < L.f(...b) ? c : b))
    const fb = L.f(...best)
    if (fb >= fp) {
      frames.push({ path: [...path], cur: p, cands, done: true, note: `Nenhum dos 8 vizinhos é melhor que f = ${r3(fp)}: parou em ${fmtP(p)}. ${Math.hypot(p[0] - L.min[0], p[1] - L.min[1]) > 0.5 ? 'É um mínimo local — a subida de encosta não consegue sair dele.' : 'Encontrou a região do mínimo global.'}` })
      return frames
    }
    p = best; fp = fb
    path.push(p)
    frames.push({ path: [...path], cur: p, cands, note: `Passo ${i}: o melhor vizinho tem f = ${r3(fb)} — move para ${fmtP(p)}.` })
  }
  frames.at(-1).done = true
  return frames
}

// Têmpera simulada. Quadros: { path, cur, cand, accepted, T, note }
export function annealingFrames(fn, start, T0, seed) {
  const L = landscapes[fn]
  if (!L || !(T0 > 0)) fail()
  const rnd = lcg(seed)
  const span = L.range[1] - L.range[0]
  let p = start, fp = L.f(...p), best = p, fbest = fp, T = T0
  const path = [p]
  const frames = [{ path: [...path], cur: p, best, T, note: `Começa em ${fmtP(p)}, f = ${r3(fp)}, com temperatura T = ${T0}. Um vizinho pior é aceito com probabilidade e^(−Δ/T): com T alto, explora; ao esfriar, só melhora.` }]
  for (let i = 1; i <= 800; i++) {
    const radius = span * 0.2 * (0.25 + 0.75 * Math.min(1, (3 * T) / T0)) // passos menores ao esfriar
    const cand = clampTo(L, [p[0] + (rnd() * 2 - 1) * radius, p[1] + (rnd() * 2 - 1) * radius])
    const fc = L.f(...cand), delta = fc - fp
    const prob = delta <= 0 ? 1 : Math.exp(-delta / T)
    const accepted = rnd() < prob
    if (accepted) { p = cand; fp = fc; path.push(p); if (fp < fbest) { best = p; fbest = fp } }
    if (i % 5 === 0) {
      frames.push({
        path: [...path], cur: p, cand, accepted, best, T,
        note: `Passo ${i}, T = ${r3(T)}: vizinho com f = ${r3(fc)} (Δ = ${r3(delta)}). ${delta <= 0 ? 'Melhor: aceito.' : `Pior: aceito com probabilidade ${r3(prob * 100)}% — ${accepted ? 'aceito, subindo a encosta para escapar' : 'rejeitado'}.`}`,
      })
    }
    T *= 0.991
  }
  frames.push({ path, cur: best, best, T, done: true, note: `Temperatura final ${r3(T)}. Melhor ponto encontrado: ${fmtP(best)}, f = ${r3(fbest)}. Compare com a subida de encosta partindo do mesmo lugar.` })
  return frames
}

// ── Algoritmo genético (evoluir uma frase) ─────────────────
const GENES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ '

// Quadros: { gen, pop: [[texto, aptidão]], best, history: [melhor aptidão por geração], note }
export function geneticFrames(target, mutation, seed) {
  const T = target.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  if (!T.length || T.length > 30 || [...T].some(c => !GENES.includes(c)) || !(mutation >= 0 && mutation <= 0.5)) fail()
  const rnd = lcg(seed)
  const pick = n => Math.floor(rnd() * n)
  const fitness = s => [...s].reduce((k, c, i) => k + (c === T[i]), 0)
  const size = 80
  let pop = Array.from({ length: size }, () => Array.from({ length: T.length }, () => GENES[pick(GENES.length)]).join(''))
  const sorted = () => pop.map(s => [s, fitness(s)]).sort((a, b) => b[1] - a[1])
  const history = []
  const frames = []
  for (let gen = 0; gen <= 400; gen++) {
    const ranked = sorted()
    history.push(ranked[0][1])
    const done = ranked[0][1] === T.length
    if (gen % 2 === 0 || done || gen < 6) {
      frames.push({
        gen, pop: ranked.slice(0, 8), best: ranked[0][0], history: [...history], target: T, done,
        note: gen === 0
          ? `Geração 0: ${size} frases aleatórias. Aptidão = quantas letras estão certas (de ${T.length}). Cada nova geração escolhe pais por torneio, cruza-os em um ponto e muta cada letra com probabilidade ${mutation}.`
          : done ? `Geração ${gen}: a frase "${T}" apareceu! A seleção acumulou melhorias que, por puro acaso, levariam ${GENES.length}^${T.length} tentativas.` : `Geração ${gen}: melhor indivíduo com ${ranked[0][1]} de ${T.length} letras certas.`,
      })
    }
    if (done) return frames
    const tournament = () => { let b = pop[pick(size)]; for (let k = 0; k < 2; k++) { const c = pop[pick(size)]; if (fitness(c) > fitness(b)) b = c } return b }
    const next = [ranked[0][0]] // elitismo: o melhor passa intacto
    while (next.length < size) {
      const a = tournament(), b = tournament(), cut = pick(T.length)
      const child = [...(a.slice(0, cut) + b.slice(cut))].map(c => (rnd() < mutation ? GENES[pick(GENES.length)] : c)).join('')
      next.push(child)
    }
    pop = next
  }
  frames.at(-1).note += ' (limite de gerações atingido — tente outra taxa de mutação)'
  frames.at(-1).done = true
  return frames
}

// ── Colônia de formigas (caixeiro-viajante) ────────────────
export function randomCities(n, seed) {
  const rnd = lcg(seed)
  return Array.from({ length: n }, () => [Math.round(5 + rnd() * 90), Math.round(5 + rnd() * 90)])
}
export const tourLength = (cities, t) => t.reduce((s, c, i) => s + Math.hypot(cities[c][0] - cities[t[(i + 1) % t.length]][0], cities[c][1] - cities[t[(i + 1) % t.length]][1]), 0)

// Quadros: { it, pher: matriz normalizada, best, bestLen, iterBest, note }
export function antFrames(n, seed) {
  if (!Number.isInteger(n) || n < 5 || n > 20) fail()
  const cities = randomCities(n, seed)
  const rnd = lcg(seed ^ 0x9e3779b9)
  const d = cities.map(a => cities.map(b => Math.hypot(a[0] - b[0], a[1] - b[1]) || 1e-9))
  // vizinho mais próximo, para comparação e para a feromônio inicial
  const nn = [0]
  while (nn.length < n) { const last = nn.at(-1); let bestC = -1; for (let c = 0; c < n; c++) if (!nn.includes(c) && (bestC < 0 || d[last][c] < d[last][bestC])) bestC = c; nn.push(bestC) }
  const nnLen = tourLength(cities, nn)
  const tau0 = 1 / (n * nnLen)
  const tau = cities.map(() => Array(n).fill(tau0))
  const ants = 10, rho = 0.5, alpha = 1, beta = 2
  let best = null, bestLen = Infinity
  const norm = () => { const mx = Math.max(...tau.flat()); return tau.map(r => r.map(v => v / mx)) }
  const frames = [{ it: 0, cities, pher: norm(), best: null, bestLen: null, nnLen, note: `${n} cidades. ${ants} formigas por iteração constroem rotas escolhendo a próxima cidade com probabilidade proporcional a feromônio^${alpha} × (1/distância)^${beta}. Rota gulosa do vizinho mais próximo: ${nnLen.toFixed(1)}.` }]
  for (let it = 1; it <= 40; it++) {
    const tours = []
    for (let k = 0; k < ants; k++) {
      const t = [Math.floor(rnd() * n)], used = new Set(t)
      while (t.length < n) {
        const i = t.at(-1)
        const opts = [], weights = []
        for (let j = 0; j < n; j++) if (!used.has(j)) { opts.push(j); weights.push(tau[i][j] ** alpha / d[i][j] ** beta) }
        let r = rnd() * weights.reduce((a, b) => a + b, 0), idx = 0
        while (idx < weights.length - 1 && r >= weights[idx]) { r -= weights[idx]; idx++ }
        t.push(opts[idx]); used.add(opts[idx])
      }
      tours.push([t, tourLength(cities, t)])
    }
    for (const row of tau) for (let j = 0; j < n; j++) row[j] *= 1 - rho // evaporação
    for (const [t, len] of tours) for (let i = 0; i < n; i++) { const a = t[i], b = t[(i + 1) % n]; tau[a][b] += 1 / len; tau[b][a] += 1 / len }
    const iterBest = tours.reduce((a, b) => (b[1] < a[1] ? b : a))
    const improved = iterBest[1] < bestLen - 1e-9
    if (improved) { best = iterBest[0]; bestLen = iterBest[1] }
    frames.push({ it, cities, pher: norm(), best, bestLen, iterBest: iterBest[0], nnLen, note: `Iteração ${it}: melhor rota desta iteração ${iterBest[1].toFixed(1)}${improved ? ' — novo recorde' : ''}. A feromônio evapora ${rho * 100}% e cada formiga deposita 1/comprimento nas arestas que usou: rotas curtas reforçam mais.` })
  }
  frames.at(-1).note = `Depois de 40 iterações, melhor rota: ${bestLen.toFixed(1)} (vizinho mais próximo: ${nnLen.toFixed(1)}). As arestas mais grossas são as que concentraram feromônio — a "memória" coletiva da colônia.`
  frames.at(-1).done = true
  return frames
}

// ── Simplex (duas variáveis, para desenhar) ────────────────
// Formato: objetivo "3x + 5y" (maximizar) e restrições "x <= 4; 2y <= 12; 3x + 2y <= 18", com coeficientes ≥ 0.
function parseLinear(s) {
  const t = s.replace(/\s+/g, '').replace(/−/g, '-')
  if (!t) fail()
  let x = 0, y = 0
  for (const term of t.match(/[+-]?[^+-]+/g) ?? []) {
    const m = term.match(/^([+-]?)(\d*\.?\d*)\*?([xy])$/)
    if (!m) fail()
    const coef = (m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : Number(m[2]))
    if (!Number.isFinite(coef)) fail()
    if (m[3] === 'x') x += coef; else y += coef
  }
  return [x, y]
}

export function parseLP(objective, constraints) {
  const c = parseLinear(objective)
  const rows = constraints.split(/[;\n]+/).map(s => s.trim()).filter(Boolean).map(s => {
    const [lhs, rhs] = s.split('<=')
    if (rhs === undefined) fail()
    const [a, b] = parseLinear(lhs), r = Number(rhs.trim())
    if (!Number.isFinite(r) || r < 0 || a < 0 || b < 0 || (a === 0 && b === 0)) fail()
    return [a, b, r]
  })
  if (!rows.length || rows.length > 6) fail()
  return { c, rows }
}

const vName = (j, m) => (j === 0 ? 'x' : j === 1 ? 'y' : `s${j - 1}`)

// Quadros: { tableau, basis, vertex, enter?, leave?, path, note, done? }
export function simplexFrames(objective, constraints) {
  const { c, rows } = parseLP(objective, constraints)
  const m = rows.length, nv = 2 + m
  // tableau: m linhas de restrição + linha do objetivo (z − c·x = 0)
  const T = rows.map(([a, b, r], i) => [a, b, ...Array.from({ length: m }, (_, k) => (k === i ? 1 : 0)), r])
  T.push([-c[0], -c[1], ...Array(m).fill(0), 0])
  const basis = rows.map((_, i) => 2 + i)
  const vertex = () => { const v = [0, 0]; basis.forEach((b, i) => { if (b < 2) v[b] = T[i][nv] }); return v }
  const snapT = () => T.map(r => r.map(v => Number(v.toFixed(3))))
  const path = [vertex()]
  const frames = [{ tableau: snapT(), basis: [...basis], vertex: vertex(), path: [...path], rows, c, note: `Maximizar z = ${objective} sujeito às restrições. Cada restrição ganha uma variável de folga (s1, s2…). O Simplex começa no vértice (0, 0), onde só as folgas são diferentes de zero: z = 0.` }]
  for (let it = 0; it < 20; it++) {
    const z = T[m]
    let enter = -1
    for (let j = 0; j < nv; j++) if (z[j] < -1e-9 && (enter < 0 || z[j] < z[enter])) enter = j
    if (enter < 0) {
      frames.push({ tableau: snapT(), basis: [...basis], vertex: vertex(), path: [...path], rows, c, done: true, note: `Nenhum coeficiente negativo na linha de z: nenhuma direção melhora o objetivo. Ótimo no vértice ${fmtP(vertex())}, com z = ${r3(z[nv])}.` })
      return frames
    }
    let leave = -1, bestRatio = Infinity
    const ratios = []
    for (let i = 0; i < m; i++) if (T[i][enter] > 1e-9) { const ratio = T[i][nv] / T[i][enter]; ratios.push(`${vName(basis[i])}: ${r3(ratio)}`); if (ratio < bestRatio - 1e-12) { bestRatio = ratio; leave = i } }
    if (leave < 0) {
      frames.push({ tableau: snapT(), basis: [...basis], vertex: vertex(), path: [...path], rows, c, done: true, note: `A variável ${vName(enter)} pode crescer sem limite: o problema é ilimitado.` })
      return frames
    }
    frames.push({ tableau: snapT(), basis: [...basis], vertex: vertex(), path: [...path], rows, c, enter, leave, note: `Entra ${vName(enter)} (coeficiente mais negativo em z: ${r3(z[enter])}). Teste da razão — até onde ela pode crescer: ${ratios.join('; ')}. Sai ${vName(basis[leave])}, a de menor razão.` })
    const pv = T[leave][enter]
    T[leave] = T[leave].map(v => v / pv)
    for (let i = 0; i <= m; i++) if (i !== leave) { const f = T[i][enter]; T[i] = T[i].map((v, j) => v - f * T[leave][j]) }
    basis[leave] = enter
    path.push(vertex())
    frames.push({ tableau: snapT(), basis: [...basis], vertex: vertex(), path: [...path], rows, c, note: `Pivoteamento: o algoritmo anda por uma aresta da região viável até o vértice ${fmtP(vertex())}, onde z = ${r3(T[m][nv])}.` })
  }
  return frames
}

export const VAR_NAME = vName
