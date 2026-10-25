// Execuções passo a passo dos algoritmos de geometria computacional.
// Mundo de 64 × 36 unidades, com y para cima. Cada quadro é { shapes, note }, e as formas são:
//   { t: 'pt', p, c, r?, label? }            { t: 'seg', a, b, c, w?, dash? }
//   { t: 'poly', pts, c, fill?, op?, w?, dash?, open?, label? }
//   { t: 'band', x1, x2, c, op? }            { t: 'rect', x1, y1, x2, y2, c, dash?, fill?, op? }
// Cores: ink, muted, faint, accent, amber, rose, emerald, violet, sky.

export const WORLD = { w: 64, h: 36 }

export const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
const round = v => Math.round(v * 100) / 100
export const fmtP = p => `(${round(p[0])}, ${round(p[1])})`
const rand = (a, b) => a + Math.random() * (b - a)
const randInt = (a, b) => Math.floor(rand(a, b + 1))

export function randomPoints(n, margin = 4, minDist = 3.5) {
  const pts = []
  for (let tries = 0; pts.length < n && tries < 5000; tries++) {
    const p = [randInt(margin, WORLD.w - margin), randInt(margin, WORLD.h - margin)]
    if (pts.every(q => dist2(p, q) >= minDist ** 2)) pts.push(p)
  }
  return pts
}

// Polígono simples "estrelado": vértices em ângulos crescentes ao redor de um centro.
export function randomPolygon(n = 8, spread = 0.55) {
  const cx = WORLD.w / 2, cy = WORLD.h / 2
  const angles = Array.from({ length: n }, (_, i) => (i + rand(0.15, 0.85)) * ((2 * Math.PI) / n))
  return angles.map(a => {
    const r = rand(1 - spread, 1)
    return [Math.round(cx + Math.cos(a) * 28 * r), Math.round(cy + Math.sin(a) * 16 * r)]
  })
}

const turn = c => (c > 0 ? 'à esquerda (sentido anti-horário)' : c < 0 ? 'à direita (sentido horário)' : 'colinear')
const dots = (pts, c = 'muted') => pts.map(p => ({ t: 'pt', p, c, r: 3 }))

// ── Área de polígono (fórmula do laço) ─────────────────────
function shoelaceFrames({ poly }) {
  const n = poly.length
  const O = [0, 0]
  const labels = poly.map((p, i) => ({ t: 'pt', p, c: 'ink', r: 3.5, label: `P${i}` }))
  const base = [{ t: 'poly', pts: poly, c: 'ink', w: 2 }, ...labels, { t: 'pt', p: O, c: 'muted', r: 3.5, label: 'O' }]
  const frames = [{ shapes: base, note: `Para cada aresta Pᵢ → Pᵢ₊₁, soma xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ. Cada termo é o dobro da área (com sinal) do triângulo O-Pᵢ-Pᵢ₊₁, onde O é a origem.` }]
  let sum = 0
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n]
    const term = a[0] * b[1] - b[0] * a[1]
    sum += term
    frames.push({
      shapes: [{ t: 'poly', pts: [O, a, b], c: term >= 0 ? 'accent' : 'rose', fill: true, op: 0.22 }, ...base, { t: 'seg', a, b, c: 'amber', w: 3.5 }],
      note: `Aresta P${i} → P${(i + 1) % n}: ${a[0]}·${b[1]} − ${b[0]}·${a[1]} = ${term}. ${term >= 0 ? 'Positivo: o triângulo gira no sentido anti-horário e sua área é somada.' : 'Negativo: o triângulo gira no sentido horário e sua área é descontada.'} Soma: ${sum}.`,
    })
  }
  frames.push({
    shapes: [{ t: 'poly', pts: poly, c: 'accent', fill: true, op: 0.25, w: 2.5 }, ...labels],
    note: `As áreas que ficam fora do polígono se cancelam. Soma = ${sum}; área = |soma| / 2 = ${Math.abs(sum) / 2}${sum < 0 ? ' (soma negativa: vértices em sentido horário)' : ''}.`,
  })
  return frames
}

// ── Interseção de segmentos ────────────────────────────────
const onSegment = (p, q, r) => Math.min(p[0], q[0]) <= r[0] && r[0] <= Math.max(p[0], q[0]) && Math.min(p[1], q[1]) <= r[1] && r[1] <= Math.max(p[1], q[1])

function segmentFrames({ segs }) {
  const [[p1, q1], [p2, q2]] = segs
  const base = [
    { t: 'seg', a: p1, b: q1, c: 'accent', w: 3 }, { t: 'seg', a: p2, b: q2, c: 'violet', w: 3 },
    { t: 'pt', p: p1, c: 'accent', label: 'p1' }, { t: 'pt', p: q1, c: 'accent', label: 'q1' },
    { t: 'pt', p: p2, c: 'violet', label: 'p2' }, { t: 'pt', p: q2, c: 'violet', label: 'q2' },
  ]
  const frames = [{ shapes: base, note: 'Dois segmentos se cruzam quando as pontas de cada um ficam em lados opostos da reta do outro. O "lado" sai do sinal de um produto vetorial (teste de orientação).' }]
  const tests = [['p1', 'q1', 'p2', p1, q1, p2], ['p1', 'q1', 'q2', p1, q1, q2], ['p2', 'q2', 'p1', p2, q2, p1], ['p2', 'q2', 'q1', p2, q2, q1]]
  const o = tests.map(([na, nb, nc, a, b, c]) => {
    const v = cross(a, b, c)
    frames.push({
      shapes: [{ t: 'poly', pts: [a, b, c], c: v > 0 ? 'emerald' : v < 0 ? 'rose' : 'muted', fill: true, op: 0.22 }, ...base],
      note: v === 0
        ? `Orientação (${na}, ${nb}, ${nc}) = 0: ${nc} está na mesma reta de ${na} → ${nb}.`
        : `Orientação (${na}, ${nb}, ${nc}) = ${round(v)}: ${nc} está ${v > 0 ? 'à esquerda' : 'à direita'} de ${na} → ${nb} (${turn(v).split('(')[1].replace(')', '')}).`,
    })
    return Math.sign(v)
  })
  const hit = (o[0] !== o[1] && o[2] !== o[3])
    || (o[0] === 0 && onSegment(p1, q1, p2)) || (o[1] === 0 && onSegment(p1, q1, q2))
    || (o[2] === 0 && onSegment(p2, q2, p1)) || (o[3] === 0 && onSegment(p2, q2, q1))
  let point = null
  const d = (q1[0] - p1[0]) * (q2[1] - p2[1]) - (q1[1] - p1[1]) * (q2[0] - p2[0])
  if (hit && d !== 0) {
    const t = ((p2[0] - p1[0]) * (q2[1] - p2[1]) - (p2[1] - p1[1]) * (q2[0] - p2[0])) / d
    point = [p1[0] + t * (q1[0] - p1[0]), p1[1] + t * (q1[1] - p1[1])]
  }
  frames.push({
    shapes: [...base, ...(point ? [{ t: 'pt', p: point, c: 'amber', r: 6, label: fmtP(point) }] : [])],
    note: hit
      ? `As pontas de cada segmento estão em lados opostos do outro (ou uma ponta está sobre o outro): os segmentos se cruzam${point ? ` em ${fmtP(point)}` : ''}.`
      : 'Pelo menos um segmento tem as duas pontas do mesmo lado da reta do outro: os segmentos não se cruzam.',
  })
  return frames
}

// ── Ponto no polígono (lançamento de raio) ─────────────────
function pipFrames({ poly, p }) {
  const n = poly.length
  const ray = { t: 'seg', a: p, b: [WORLD.w, p[1]], c: 'amber', w: 2, dash: true }
  const base = [{ t: 'poly', pts: poly, c: 'ink', w: 2 }, ray]
  const frames = [{ shapes: [...base, { t: 'pt', p, c: 'amber', r: 5 }], note: `Lança um raio horizontal do ponto ${fmtP(p)} para a direita e conta quantas arestas do polígono ele cruza. Número ímpar = dentro; par = fora.` }]
  const hits = []
  let inside = false
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const a = poly[j], b = poly[i]
    const straddles = (b[1] > p[1]) !== (a[1] > p[1])
    let note, crossed = false
    if (!straddles) note = `Aresta ${fmtP(a)} → ${fmtP(b)}: fica toda acima ou toda abaixo da altura do ponto — não cruza.`
    else {
      const x = ((a[0] - b[0]) * (p[1] - b[1])) / (a[1] - b[1]) + b[0]
      if (p[0] < x) { crossed = true; inside = !inside; hits.push([x, p[1]]) }
      note = crossed
        ? `Aresta ${fmtP(a)} → ${fmtP(b)}: atravessa a altura do ponto em x = ${round(x)}, à direita dele — o raio cruza. Cruzamentos: ${hits.length}.`
        : `Aresta ${fmtP(a)} → ${fmtP(b)}: atravessa a altura do ponto em x = ${round(x)}, mas à esquerda dele — o raio não a cruza.`
    }
    frames.push({
      shapes: [...base, { t: 'seg', a, b, c: crossed ? 'rose' : 'sky', w: 4 }, ...hits.map(h => ({ t: 'pt', p: h, c: 'rose', r: 4 })), { t: 'pt', p, c: 'amber', r: 5 }],
      note,
    })
  }
  frames.push({
    shapes: [{ t: 'poly', pts: poly, c: inside ? 'emerald' : 'ink', fill: inside, op: 0.18, w: 2 }, ray, ...hits.map(h => ({ t: 'pt', p: h, c: 'rose', r: 4 })), { t: 'pt', p, c: inside ? 'emerald' : 'rose', r: 6 }],
    note: `${hits.length} cruzamento${hits.length === 1 ? '' : 's'}: número ${hits.length % 2 ? 'ímpar — o ponto está DENTRO' : 'par — o ponto está FORA'} do polígono. Clique em outro lugar para testar outro ponto.`,
  })
  return frames
}

// ── Envoltório convexo: embrulho para presente (Jarvis) ────
function jarvisFrames({ pts }) {
  const n = pts.length
  const start = pts.reduce((m, p) => (p[0] < m[0] || (p[0] === m[0] && p[1] < m[1]) ? p : m))
  const hull = []
  const frames = [
    { shapes: dots(pts), note: `${n} pontos. O embrulho para presente começa no ponto mais à esquerda — que com certeza está no envoltório — e "embrulha" o conjunto, como um barbante esticado.` },
    { shapes: [...dots(pts), { t: 'pt', p: start, c: 'accent', r: 6 }], note: `Ponto mais à esquerda: ${fmtP(start)}.` },
  ]
  let p = start
  do {
    hull.push(p)
    let q = pts.find(r => r !== p)
    const chain = { t: 'poly', pts: [...hull], c: 'accent', w: 3, open: true }
    for (const r of pts) {
      if (r === p || r === q) continue
      const c = cross(p, q, r)
      const better = c < 0 || (c === 0 && dist2(p, r) > dist2(p, q))
      frames.push({
        shapes: [...dots(pts), chain, { t: 'seg', a: p, b: q, c: 'emerald', w: 2.5 }, { t: 'seg', a: p, b: r, c: better ? 'rose' : 'faint', w: 1.5, dash: true }, { t: 'pt', p, c: 'amber', r: 6 }, { t: 'pt', p: r, c: better ? 'rose' : 'muted', r: 4.5 }],
        note: better
          ? `${fmtP(r)} está à direita de ${fmtP(p)} → ${fmtP(q)}${c === 0 ? ' (colinear e mais longe)' : ''}: vira o novo candidato.`
          : `${fmtP(r)} está à esquerda do candidato atual — mantém ${fmtP(q)}.`,
      })
      if (better) q = r
    }
    frames.push({ shapes: [...dots(pts), { t: 'poly', pts: [...hull, q], c: 'accent', w: 3, open: true }, { t: 'pt', p: q, c: 'accent', r: 6 }], note: `Nenhum ponto ficou à direita de ${fmtP(p)} → ${fmtP(q)}: essa é uma aresta do envoltório.` })
    p = q
  } while (p !== start && hull.length <= n)
  frames.push({ shapes: [{ t: 'poly', pts: hull, c: 'accent', fill: true, op: 0.15, w: 3 }, ...dots(pts), ...hull.map(h => ({ t: 'pt', p: h, c: 'accent', r: 5 }))], note: `Voltou ao início: envoltório convexo com ${hull.length} vértices. Custo O(n·h): cada um dos h vértices exige testar os n pontos.` })
  return frames
}

// ── Envoltório convexo: varredura de Graham ────────────────
function grahamFrames({ pts }) {
  const pivot = pts.reduce((m, p) => (p[1] < m[1] || (p[1] === m[1] && p[0] < m[0]) ? p : m))
  const rest = pts.filter(p => p !== pivot).sort((a, b) => {
    const c = cross(pivot, a, b)
    return c !== 0 ? -c : dist2(pivot, a) - dist2(pivot, b)
  })
  const frames = [
    { shapes: dots(pts), note: `${pts.length} pontos. A varredura de Graham começa pelo ponto mais baixo, que com certeza está no envoltório.` },
    { shapes: [...dots(pts), { t: 'pt', p: pivot, c: 'amber', r: 6 }], note: `Pivô: ${fmtP(pivot)}.` },
    { shapes: [...rest.map(p => ({ t: 'seg', a: pivot, b: p, c: 'faint', w: 1 })), ...rest.map((p, i) => ({ t: 'pt', p, c: 'muted', r: 3, label: String(i + 1) })), { t: 'pt', p: pivot, c: 'amber', r: 6 }], note: 'Ordena os outros pontos pelo ângulo em relação ao pivô (do menor para o maior) — com produtos vetoriais, sem calcular ângulos.' },
  ]
  const stack = [pivot]
  for (const p of rest) {
    while (stack.length >= 2 && cross(stack.at(-2), stack.at(-1), p) <= 0) {
      const [a, b] = [stack.at(-2), stack.at(-1)]
      frames.push({
        shapes: [...dots(pts), { t: 'poly', pts: [...stack], c: 'accent', w: 3, open: true }, { t: 'poly', pts: [a, b, p], c: 'rose', fill: true, op: 0.25 }, { t: 'pt', p, c: 'amber', r: 5 }, { t: 'pt', p: b, c: 'rose', r: 5 }],
        note: `${fmtP(a)} → ${fmtP(b)} → ${fmtP(p)} faz uma curva ${cross(a, b, p) === 0 ? 'reta' : 'à direita'}: ${fmtP(b)} não pode estar no envoltório — sai da pilha.`,
      })
      stack.pop()
    }
    stack.push(p)
    frames.push({ shapes: [...dots(pts), { t: 'poly', pts: [...stack], c: 'accent', w: 3, open: true }, { t: 'pt', p, c: 'amber', r: 5 }], note: `${stack.length > 2 ? 'Curva à esquerda: ' : ''}${fmtP(p)} entra na pilha (${stack.length} pontos).` })
  }
  frames.push({ shapes: [{ t: 'poly', pts: stack, c: 'accent', fill: true, op: 0.15, w: 3 }, ...dots(pts), ...stack.map(h => ({ t: 'pt', p: h, c: 'accent', r: 5 }))], note: `A pilha final é o envoltório convexo: ${stack.length} vértices. A ordenação domina o custo: O(n log n).` })
  return frames
}

// ── Par de pontos mais próximo (dividir e conquistar) ──────
function closestFrames({ pts }) {
  const frames = []
  let best = { d: Infinity, a: null, b: null }
  const bestShape = () => (best.a ? [{ t: 'seg', a: best.a, b: best.b, c: 'amber', w: 3.5 }] : [])
  const snap = (extra, note) => frames.push({ shapes: [...extra, ...dots(pts), ...bestShape()], note })
  const consider = (a, b, ctx) => {
    const d = Math.sqrt(dist2(a, b))
    const improved = d < best.d
    if (improved) best = { d, a, b }
    snap([...ctx, { t: 'seg', a, b, c: improved ? 'emerald' : 'rose', w: 2, dash: !improved }], `Distância ${fmtP(a)}–${fmtP(b)} = ${round(d)}${improved ? ': novo melhor par.' : ` — não melhora (${round(best.d)}).`}`)
  }
  const solve = (P, depth) => {
    const x1 = P[0][0] - 0.8, x2 = P.at(-1)[0] + 0.8
    const range = { t: 'band', x1, x2, c: 'sky', op: 0.07 }
    if (P.length <= 3) {
      snap([range], `Subproblema com ${P.length} pontos: compara todos os pares diretamente.`)
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) consider(P[i], P[j], [range])
      return
    }
    const mid = Math.floor(P.length / 2)
    const midX = (P[mid - 1][0] + P[mid][0]) / 2
    const line = { t: 'seg', a: [midX, 0], b: [midX, WORLD.h], c: 'violet', w: 2 }
    snap([range, line], `Divide os ${P.length} pontos ao meio pela reta x = ${round(midX)} e resolve cada lado (nível ${depth}).`)
    solve(P.slice(0, mid), depth + 1)
    solve(P.slice(mid), depth + 1)
    const d = best.d
    const strip = P.filter(p => Math.abs(p[0] - midX) < d).sort((a, b) => a[1] - b[1])
    const band = { t: 'band', x1: midX - d, x2: midX + d, c: 'amber', op: 0.14 }
    snap([range, band, line], `Combinação: um par melhor só pode cruzar a divisão se os dois pontos estiverem a menos de d = ${round(d)} da reta. Faixa com ${strip.length} ponto${strip.length === 1 ? '' : 's'}, ordenados por y.`)
    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && strip[j][1] - strip[i][1] < best.d; j++) consider(strip[i], strip[j], [range, band, line])
    }
  }
  const sorted = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  frames.push({ shapes: dots(pts), note: `${pts.length} pontos. Força bruta compararia ${(pts.length * (pts.length - 1)) / 2} pares; dividir e conquistar resolve em O(n log n). Primeiro, ordena os pontos por x.` })
  solve(sorted, 0)
  frames.push({ shapes: [...dots(pts), { t: 'seg', a: best.a, b: best.b, c: 'amber', w: 4 }, { t: 'pt', p: best.a, c: 'amber', r: 6 }, { t: 'pt', p: best.b, c: 'amber', r: 6 }], note: `Par mais próximo: ${fmtP(best.a)} e ${fmtP(best.b)}, distância ${round(best.d)}. Na faixa, cada ponto precisa ser comparado com no máximo 7 vizinhos.` })
  return frames
}

// ── Recorte de Cohen-Sutherland ────────────────────────────
const LEFT = 1, RIGHT = 2, BOTTOM = 4, TOP = 8
const outcode = ([x, y], [x1, y1, x2, y2]) => (x < x1 ? LEFT : x > x2 ? RIGHT : 0) | (y < y1 ? BOTTOM : y > y2 ? TOP : 0)
const bits = c => c.toString(2).padStart(4, '0')
const edgeName = { [TOP]: 'de cima', [BOTTOM]: 'de baixo', [RIGHT]: 'da direita', [LEFT]: 'da esquerda' }

export function clipSegment(a, b, win) {
  let [p, q] = [a, b], c1 = outcode(p, win), c2 = outcode(q, win)
  const steps = []
  for (;;) {
    if (!(c1 | c2)) { steps.push({ kind: 'accept', p, q, c1, c2 }); return { steps, result: [p, q] } }
    if (c1 & c2) { steps.push({ kind: 'reject', p, q, c1, c2 }); return { steps, result: null } }
    const out = c1 || c2
    const [x1, y1, x2, y2] = win
    const [px, py] = out === c1 ? p : q, [ox, oy] = out === c1 ? q : p
    let np, edge
    if (out & TOP) { edge = TOP; np = [px + ((ox - px) * (y2 - py)) / (oy - py), y2] }
    else if (out & BOTTOM) { edge = BOTTOM; np = [px + ((ox - px) * (y1 - py)) / (oy - py), y1] }
    else if (out & RIGHT) { edge = RIGHT; np = [x2, py + ((oy - py) * (x2 - px)) / (ox - px)] }
    else { edge = LEFT; np = [x1, py + ((oy - py) * (x1 - px)) / (ox - px)] }
    steps.push({ kind: 'clip', p, q, c1, c2, edge, from: out === c1 ? p : q, to: np })
    if (out === c1) { p = np; c1 = outcode(p, win) } else { q = np; c2 = outcode(q, win) }
  }
}

function cohenFrames({ win, segs }) {
  const [x1, y1, x2, y2] = win
  const grid = [
    { t: 'seg', a: [x1, 0], b: [x1, WORLD.h], c: 'faint', w: 1, dash: true }, { t: 'seg', a: [x2, 0], b: [x2, WORLD.h], c: 'faint', w: 1, dash: true },
    { t: 'seg', a: [0, y1], b: [WORLD.w, y1], c: 'faint', w: 1, dash: true }, { t: 'seg', a: [0, y2], b: [WORLD.w, y2], c: 'faint', w: 1, dash: true },
    { t: 'rect', x1, y1, x2, y2, c: 'ink', w: 2, fill: true, op: 0.05 },
  ]
  const kept = [], lost = []
  const doneShapes = () => [...lost.map(([a, b]) => ({ t: 'seg', a, b, c: 'faint', w: 1.5, dash: true })), ...kept.map(([a, b]) => ({ t: 'seg', a, b, c: 'emerald', w: 3 }))]
  const pending = i => segs.slice(i + 1).map(([a, b]) => ({ t: 'seg', a, b, c: 'muted', w: 1.5 }))
  const frames = [{ shapes: [...grid, ...segs.map(([a, b]) => ({ t: 'seg', a, b, c: 'muted', w: 1.5 }))], note: 'As retas da janela dividem o plano em 9 regiões. Cada ponta recebe um código de 4 bits (cima, baixo, direita, esquerda); 0000 = dentro da janela.' }]
  segs.forEach(([a, b], i) => {
    const { steps, result } = clipSegment(a, b, win)
    let cut = []
    for (const s of steps) {
      const shapes = [...grid, ...doneShapes(), ...pending(i), ...cut.map(([u, v]) => ({ t: 'seg', a: u, b: v, c: 'faint', w: 1.5, dash: true })), { t: 'seg', a: s.p, b: s.q, c: s.kind === 'reject' ? 'rose' : s.kind === 'accept' ? 'emerald' : 'accent', w: 3 }, { t: 'pt', p: s.p, c: 'ink', r: 4, label: bits(s.c1) }, { t: 'pt', p: s.q, c: 'ink', r: 4, label: bits(s.c2) }]
      let note
      if (s.kind === 'accept') note = `Os dois códigos são 0000: o segmento (ou o que sobrou dele) está todo dentro — aceito.`
      else if (s.kind === 'reject') note = `${bits(s.c1)} AND ${bits(s.c2)} = ${bits(s.c1 & s.c2)} ≠ 0000: as duas pontas estão do mesmo lado de fora — rejeitado sem cálculos.`
      else {
        note = `Códigos ${bits(s.c1)} e ${bits(s.c2)}: nem aceito nem rejeitado de imediato. Corta na borda ${edgeName[s.edge]}: a ponta ${fmtP(s.from)} vira ${fmtP(s.to)}.`
        shapes.push({ t: 'pt', p: s.to, c: 'amber', r: 5 })
        cut.push([s.from, s.to])
      }
      frames.push({ shapes, note })
    }
    if (result) kept.push(result)
    lost.push([a, b])
  })
  frames.push({ shapes: [...grid, ...doneShapes()], note: `Pronto: ${kept.length} de ${segs.length} segmentos têm uma parte dentro da janela. Os casos triviais (aceitar ou rejeitar) custam só operações de bits.` })
  return frames
}

// ── Algoritmo do pintor ────────────────────────────────────
const PALETTE = ['sky', 'emerald', 'violet', 'amber', 'rose', 'accent']

function painterFrames({ shapes }) {
  const order = [...shapes].sort((a, b) => b.z - a.z)
  const outline = s => ({ t: 'poly', pts: s.pts, c: 'muted', w: 1.5, dash: true, label: `${s.name} · z=${s.z}` })
  const frames = [
    { shapes: shapes.map(outline), note: `${shapes.length} objetos, cada um com uma profundidade z (maior = mais longe da câmera). Sem cuidado, a ordem de desenho decide quem aparece na frente.` },
    { shapes: shapes.map(outline), note: `Ordena do mais distante para o mais próximo: ${order.map(s => `${s.name} (${s.z})`).join(' → ')}.` },
  ]
  order.forEach((s, k) => {
    frames.push({
      shapes: [
        ...order.slice(0, k + 1).map((o, i) => ({ t: 'poly', pts: o.pts, c: o.color, fill: true, op: 1, w: i === k ? 3 : 1.5, label: `${o.name} · z=${o.z}`, stroke: i === k ? 'amber' : 'surface' })),
        ...order.slice(k + 1).map(outline), // contornos dos que ainda faltam, por cima
      ],
      note: `Pinta "${s.name}" (z = ${s.z}) por cima de tudo o que já foi desenhado${k ? ', cobrindo as partes mais distantes que ficam atrás dele' : ''}.`,
    })
  })
  frames.push({ shapes: frames.at(-1).shapes.map(sh => ({ ...sh, w: 1.5, stroke: 'surface' })), note: 'Como um pintor, que pinta o fundo primeiro e os detalhes da frente por último. Limitação: objetos que se cruzam ou se sobrepõem em ciclo não têm ordem correta — por isso as GPUs usam o z-buffer, que decide pixel a pixel.' })
  return frames
}

function randomScene() {
  const names = ['A', 'B', 'C', 'D', 'E']
  const zs = [...Array(9).keys()].map(i => i + 1).sort(() => Math.random() - 0.5)
  return {
    shapes: names.map((name, i) => {
      const cx = rand(14, 50), cy = rand(10, 26), w = rand(8, 16), h = rand(6, 11)
      const tri = Math.random() < 0.4
      const pts = tri
        ? [[cx - w, cy - h], [cx + w, cy - h], [cx, cy + h]]
        : [[cx - w, cy - h], [cx + w, cy - h], [cx + w, cy + h], [cx - w, cy + h]]
      return { name, z: zs[i], pts: pts.map(p => p.map(Math.round)), color: PALETTE[i] }
    }),
  }
}

const EXAMPLE_SCENE = {
  shapes: [
    { name: 'montanha', z: 9, color: 'violet', pts: [[4, 6], [30, 32], [56, 6]] },
    { name: 'sol', z: 8, color: 'amber', pts: [[46, 24], [50, 22], [54, 24], [55, 28], [52, 32], [47, 32], [44, 28]] },
    { name: 'casa', z: 5, color: 'sky', pts: [[20, 4], [40, 4], [40, 18], [20, 18]] },
    { name: 'telhado', z: 4, color: 'rose', pts: [[17, 17], [43, 17], [30, 26]] },
    { name: 'árvore', z: 2, color: 'emerald', pts: [[38, 3], [52, 3], [45, 20]] },
  ],
}

// ── Configuração dos visualizadores ────────────────────────
const randomSegments = (n, margin = 2) => Array.from({ length: n }, () => [[randInt(margin, WORLD.w - margin), randInt(margin, WORLD.h - margin)], [randInt(margin, WORLD.w - margin), randInt(margin, WORLD.h - margin)]])

export const geometryAlgorithms = {
  'shoelace-formula': {
    example: () => ({ poly: [[12, 6], [40, 4], [56, 14], [48, 30], [26, 32], [8, 20]] }),
    random: () => ({ poly: randomPolygon(7, 0.45) }),
    frames: shoelaceFrames, newKey: 'viz.newPolygon',
    legend: [['bg-accent/40', 'viz.positiveArea'], ['bg-rose-500/40', 'viz.negativeArea'], ['bg-amber-400', 'viz.currentEdge']],
  },
  'segment-intersection': {
    example: () => ({ segs: [[[8, 6], [50, 30]], [[10, 30], [56, 8]]] }),
    random: () => ({ segs: randomSegments(2, 4) }),
    frames: segmentFrames, newKey: 'viz.newSegments',
    legend: [['bg-emerald-500/50', 'viz.leftTurn'], ['bg-rose-500/50', 'viz.rightTurn'], ['bg-amber-400', 'viz.intersection']],
  },
  'point-in-polygon': {
    example: () => ({ poly: [[8, 4], [56, 4], [56, 32], [32, 14], [8, 32]], p: [20, 20] }),
    random: () => ({ poly: randomPolygon(9, 0.6), p: [randInt(10, 54), randInt(6, 30)] }),
    click: (input, p) => ({ ...input, p: p.map(Math.round) }),
    frames: pipFrames, newKey: 'viz.newPolygon', hintKey: 'viz.clickToPlace',
    legend: [['bg-amber-400', 'viz.ray'], ['bg-rose-500', 'viz.crossing'], ['bg-sky-500', 'viz.currentEdge']],
  },
  'gift-wrapping': {
    example: () => ({ pts: [[8, 12], [14, 28], [20, 8], [24, 20], [30, 31], [33, 14], [38, 4], [40, 24], [46, 12], [50, 30], [55, 18], [28, 26], [17, 17], [44, 19]] }),
    random: () => ({ pts: randomPoints(14) }),
    frames: jarvisFrames, newKey: 'viz.newPoints', speedScale: 0.6,
    legend: [['bg-accent', 'viz.hull'], ['bg-emerald-500', 'viz.candidate'], ['bg-rose-500', 'viz.testing']],
  },
  'graham-scan': {
    example: () => ({ pts: [[8, 12], [14, 28], [20, 8], [24, 20], [30, 31], [33, 14], [38, 4], [40, 24], [46, 12], [50, 30], [55, 18], [28, 26], [17, 17], [44, 19]] }),
    random: () => ({ pts: randomPoints(14) }),
    frames: grahamFrames, newKey: 'viz.newPoints', speedScale: 0.9,
    legend: [['bg-amber-400', 'viz.pivot'], ['bg-accent', 'viz.stackHull'], ['bg-rose-500/50', 'viz.rightTurn']],
  },
  'closest-pair': {
    example: () => ({ pts: [[6, 10], [10, 28], [16, 18], [21, 6], [24, 26], [29, 15], [33, 30], [36, 9], [39, 20], [41.5, 22.5], [47, 6], [50, 27], [55, 15], [59, 24]] }),
    random: () => ({ pts: randomPoints(14, 4, 3) }),
    frames: closestFrames, newKey: 'viz.newPoints', speedScale: 0.8,
    legend: [['bg-violet-500', 'viz.splitLine'], ['bg-amber-400/40', 'viz.strip'], ['bg-amber-400', 'viz.closest']],
  },
  'cohen-sutherland': {
    example: () => ({ win: [18, 9, 46, 27], segs: [[[4, 18], [60, 20]], [[24, 13], [40, 23]], [[50, 4], [62, 14]], [[10, 30], [30, 34]], [[12, 4], [36, 33]], [[40, 32], [56, 16]]] }),
    random: () => ({ win: [18, 9, 46, 27], segs: randomSegments(6) }),
    frames: cohenFrames, newKey: 'viz.newSegments',
    legend: [['bg-accent', 'viz.current'], ['bg-emerald-500', 'viz.accepted'], ['bg-rose-500', 'viz.rejected'], ['bg-amber-400', 'viz.clipPoint']],
  },
  'painters-algorithm': {
    example: () => EXAMPLE_SCENE,
    random: randomScene,
    frames: painterFrames, newKey: 'viz.newScene',
    legend: [['bg-amber-400', 'viz.drawingNow']],
  },
}
