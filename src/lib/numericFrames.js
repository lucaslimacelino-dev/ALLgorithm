// Execuções passo a passo dos métodos numéricos.
// Tabelas usam o mesmo formato de numberFrames: { columns, steps: [{ row?, note, result? }] }.

const fmt = (v, d = 10) => (Number.isFinite(v) ? Number(v.toPrecision(d)).toString() : String(v))

// ── Arredondamento ─────────────────────────────────────────
export const roundingModes = {
  'para cima (teto)': v => Math.ceil(v),
  'para baixo (piso)': v => Math.floor(v),
  'em direção ao zero (truncar)': v => Math.trunc(v),
  'meio para cima': v => Math.floor(v + 0.5),
  'meio para longe do zero': v => Math.sign(v) * Math.floor(Math.abs(v) + 0.5),
  'meio para o par (bancário)': v => {
    const f = Math.floor(v), diff = v - f
    if (diff > 0.5) return f + 1
    if (diff < 0.5) return f
    return f % 2 === 0 ? f : f + 1
  },
}

function rounding({ x }) {
  const v = Number(x)
  const steps = [{ note: `Arredondar ${v} para um inteiro. Cada modo trata de forma diferente os valores negativos e os empates (exatamente ,5).` }]
  for (const [name, fn] of Object.entries(roundingModes)) {
    const r = fn(v) + 0 // evita "-0"
    steps.push({ row: [name, r], note: `Modo "${name}": ${v} → ${r}.` })
  }
  steps.push({ note: 'Compare com valores como 2,5, −2,5 e 3,5: é nos empates e nos negativos que os modos divergem.', result: '' })
  return { columns: ['modo', 'resultado'], steps }
}

// ── Raiz quadrada (Heron) ──────────────────────────────────
function heron({ a }) {
  const A = Number(a)
  let x = A >= 1 ? A / 2 : 1
  const exact = Math.sqrt(A)
  const steps = [{ note: `√${A}: começa com um palpite x₀ = ${fmt(x)} e repete x ← (x + ${A}/x) / 2 — a média entre x e ${A}/x, que ficam um de cada lado da raiz.` }]
  for (let i = 1; i <= 60; i++) {
    const prev = x
    x = (x + A / x) / 2
    const err = Math.abs(x - exact)
    const digits = err === 0 ? '15+' : Math.max(0, Math.floor(-Math.log10(err / exact)))
    steps.push({ row: [i, fmt(x, 16), fmt(err, 3), digits], note: `x${i} = (${fmt(prev, 8)} + ${A}/${fmt(prev, 8)}) / 2 = ${fmt(x, 16)}. Dígitos corretos: ${digits}.` })
    if (Math.abs(x - prev) < 1e-15 * x) break
  }
  steps.push({ note: `Convergência quadrática: o número de dígitos corretos praticamente dobra a cada iteração. √${A} ≈ ${fmt(x, 16)}.`, result: fmt(x, 16) })
  return { columns: ['iteração', 'x', 'erro', 'dígitos corretos'], steps }
}

// ── Raiz n-ésima dígito a dígito ───────────────────────────
function nthRootDigits({ a, n, digits }) {
  const N = BigInt(n), base = 10n ** N
  const intPart = BigInt(a)
  // separa o número em blocos de n dígitos a partir da vírgula
  const intStr = intPart.toString()
  const pad = (Number(N) - (intStr.length % Number(N))) % Number(N)
  const padded = '0'.repeat(pad) + intStr
  const blocks = []
  for (let i = 0; i < padded.length; i += Number(N)) blocks.push(BigInt(padded.slice(i, i + Number(N))))
  const intBlocks = blocks.length
  for (let i = 0; i < digits; i++) blocks.push(0n)
  let y = 0n, r = 0n
  const steps = [{ note: `Raiz ${n}-ésima de ${a}: separa o número em blocos de ${n} dígitos (${blocks.slice(0, intBlocks).join(' | ')}) e acrescenta blocos de zeros para as casas decimais.` }]
  blocks.forEach((block, i) => {
    const c = base * r + block
    let beta = 0n
    for (let d = 9n; d >= 0n; d--) {
      if ((10n * y + d) ** N - base * y ** N <= c) { beta = d; break }
    }
    r = c - ((10n * y + beta) ** N - base * y ** N)
    y = 10n * y + beta
    const s = y.toString()
    const shown = i < intBlocks ? s : `${s.slice(0, intBlocks) || '0'},${s.slice(intBlocks)}`
    steps.push({ row: [i + 1, block, beta, shown, r], note: `Desce o bloco ${block}: o maior dígito β com (10·y + β)^${n} − 10^${n}·y^${n} ≤ ${c} é ${beta}. Raiz até aqui: ${shown}.` })
  })
  const s = y.toString()
  const result = `${s.slice(0, intBlocks) || '0'},${s.slice(intBlocks)}`
  steps.push({ note: `Cada bloco produz exatamente um dígito correto: ${result}…`, result })
  return { columns: ['bloco', 'valor do bloco', 'dígito', 'raiz parcial', 'resto'], steps }
}

// ── Gauss-Legendre (π) com ponto fixo em BigInt ────────────
function gaussLegendre({ iterations }) {
  const D = 70n, ONE = 10n ** D
  const mul = (x, y) => (x * y) / ONE
  const div = (x, y) => (x * ONE) / y
  const sqrt = x => { // Newton em inteiros: raiz de x·ONE
    const v = x * ONE
    let r = BigInt(Math.floor(Math.sqrt(Number(x) / Number(ONE)) * 1e15)) * (ONE / 10n ** 15n)
    if (r === 0n) r = ONE
    for (let i = 0; i < 200; i++) { const nr = (r + v / r) / 2n; if (nr === r || nr === r - 1n) { r = nr; break } r = nr }
    return r
  }
  const PI = '3.14159265358979323846264338327950288419716939937510582097494459230781640628'
  let a = ONE, b = div(ONE, sqrt(2n * ONE)), t = ONE / 4n, p = ONE
  const steps = [{ note: 'Começa com a = 1, b = 1/√2, t = 1/4 e p = 1. A cada iteração, a e b se aproximam pelas médias aritmética e geométrica.' }]
  const show = x => { const s = x.toString().padStart(Number(D) + 1, '0'); return `${s.slice(0, -Number(D))}.${s.slice(-Number(D))}` }
  for (let i = 1; i <= iterations; i++) {
    const an = (a + b) / 2n
    b = sqrt(mul(a, b))
    t = t - mul(p, mul(a - an, a - an))
    a = an
    p = 2n * p
    const pi = div(mul(a + b, a + b), 4n * t)
    const str = show(pi).slice(0, 62)
    let ok = 0
    while (ok < str.length && str[ok] === PI[ok]) ok++
    const correct = Math.max(0, ok - 2)
    steps.push({ row: [i, `${str.slice(0, Math.min(str.length, correct + 4))}…`, correct], note: `Iteração ${i}: π ≈ ${str.slice(0, Math.min(40, correct + 4))}… — ${correct} casas decimais corretas.` })
  }
  steps.push({ note: 'O número de dígitos corretos dobra a cada iteração: 25 iterações bastam para mais de 45 milhões de dígitos.', result: `${steps.at(-1).row[2]} casas corretas` })
  return { columns: ['iteração', 'aproximação de π', 'casas corretas'], steps }
}

// ── Método da potência ─────────────────────────────────────
function powerIteration({ m11, m12, m21, m22 }) {
  const A = [[m11, m12], [m21, m22]].map(r => r.map(Number))
  let v = [1, 0.5]
  let lambda = 0
  const steps = [{ note: `Matriz A = [[${A[0].join(', ')}], [${A[1].join(', ')}]]. Multiplica um vetor inicial por A repetidamente e normaliza: ele gira até a direção do autovetor dominante.` }]
  for (let i = 1; i <= 25; i++) {
    const w = [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]]
    const norm = Math.hypot(w[0], w[1])
    if (norm === 0) { steps.push({ note: 'O vetor foi anulado: A não tem autovalor dominante a partir deste vetor.', result: '—' }); return { columns: ['iteração', 'vetor normalizado', 'estimativa de λ'], steps } }
    const next = [w[0] / norm, w[1] / norm]
    const Av = [A[0][0] * next[0] + A[0][1] * next[1], A[1][0] * next[0] + A[1][1] * next[1]]
    const newLambda = next[0] * Av[0] + next[1] * Av[1] // quociente de Rayleigh (vetor unitário)
    steps.push({ row: [i, `(${fmt(next[0], 6)}, ${fmt(next[1], 6)})`, fmt(newLambda, 10)], note: `v${i} = A·v${i - 1} normalizado. Estimativa do autovalor (quociente de Rayleigh): ${fmt(newLambda, 10)}.` })
    const done = Math.abs(newLambda - lambda) < 1e-10
    v = next
    lambda = newLambda
    if (done) break
  }
  steps.push({ note: `Autovalor dominante ≈ ${fmt(lambda, 10)}, com autovetor ≈ (${fmt(v[0], 6)}, ${fmt(v[1], 6)}). A velocidade depende da razão entre os dois maiores autovalores.`, result: `λ ≈ ${fmt(lambda, 10)}` })
  return { columns: ['iteração', 'vetor normalizado', 'estimativa de λ'], steps }
}

export const numericTraces = {
  'rounding': { run: rounding, inputs: [['x', 2.5, -1e9, 1e9, true]] },
  'babylonian-sqrt': { run: heron, inputs: [['a', 2, 0.0001, 1e12, true]] },
  'nth-root-digits': { run: nthRootDigits, inputs: [['a', 2, 1, 1e12], ['n', 2, 2, 5], ['digits', 12, 1, 30]] },
  'gauss-legendre': { run: gaussLegendre, inputs: [['iterations', 5, 1, 6]] },
  'power-iteration': { run: powerIteration, inputs: [['m11', 2, -100, 100, true], ['m12', 1, -100, 100, true], ['m21', 1, -100, 100, true], ['m22', 3, -100, 100, true]] },
}

// ── Raízes de funções: Newton, Secante, Falsa Posição ──────
export const functions = [
  { label: 'x² − 2', f: x => x * x - 2, df: x => 2 * x, range: [-0.5, 3], guesses: { newton: [3], secant: [3, 2.5], falsePosition: [0, 2] } },
  { label: 'cos(x) − x', f: x => Math.cos(x) - x, df: x => -Math.sin(x) - 1, range: [-0.5, 2], guesses: { newton: [2], secant: [2, 1.5], falsePosition: [0, 1.5] } },
  { label: 'x³ − 2x − 5', f: x => x ** 3 - 2 * x - 5, df: x => 3 * x * x - 2, range: [0.5, 3.5], guesses: { newton: [3.4], secant: [3.4, 3], falsePosition: [1, 3] } },
]

export function rootFrames(method, fn) {
  const { f, df } = fn
  const frames = []
  if (method === 'newton') {
    let x = fn.guesses.newton[0]
    frames.push({ x, note: `Palpite inicial x₀ = ${fmt(x, 6)}.` })
    for (let i = 1; i <= 7; i++) {
      const fx = f(x), d = df(x)
      if (d === 0) { frames.push({ x, note: 'Derivada zero: a tangente é horizontal e o método falha.' }); break }
      const nx = x - fx / d
      frames.push({ x, nx, tangent: { x0: x, y0: fx, slope: d }, note: `Tangente em x${i - 1} = ${fmt(x, 8)} cruza o eixo em x${i} = x − f(x)/f'(x) = ${fmt(nx, 12)}.` })
      if (Math.abs(nx - x) < 1e-12) { x = nx; break }
      x = nx
    }
    frames.push({ x, note: `Raiz ≈ ${fmt(x, 12)}, com f(x) = ${fmt(f(x), 3)}.` })
  } else if (method === 'secant') {
    let [x0, x1] = fn.guesses.secant
    frames.push({ x: x1, points: [x0, x1], note: `Dois palpites iniciais: ${fmt(x0, 6)} e ${fmt(x1, 6)}.` })
    for (let i = 2; i <= 9; i++) {
      const f0 = f(x0), f1 = f(x1)
      if (f1 === f0) break
      const x2 = x1 - f1 * (x1 - x0) / (f1 - f0)
      frames.push({ x: x1, nx: x2, secant: [x0, x1], note: `Reta pelos pontos em ${fmt(x0, 8)} e ${fmt(x1, 8)} cruza o eixo em x${i} = ${fmt(x2, 12)}.` })
      if (Math.abs(x2 - x1) < 1e-12) { x1 = x2; break }
      ;[x0, x1] = [x1, x2]
    }
    frames.push({ x: x1, note: `Raiz ≈ ${fmt(x1, 12)}, com f(x) = ${fmt(f(x1), 3)}.` })
  } else {
    let [a, b] = fn.guesses.falsePosition
    frames.push({ x: a, bracket: [a, b], note: `Intervalo inicial [${fmt(a, 6)}, ${fmt(b, 6)}]: f muda de sinal nele, então há uma raiz lá dentro.` })
    let c = a
    for (let i = 1; i <= 60; i++) {
      const fa = f(a), fb = f(b)
      const prevC = c
      c = b - fb * (b - a) / (fb - fa)
      frames.push({ x: c, nx: c, secant: [a, b], bracket: [a, b], note: `Reta entre (${fmt(a, 6)}, f(a)) e (${fmt(b, 6)}, f(b)) cruza o eixo em c = ${fmt(c, 12)}.` })
      const fc = f(c)
      if (Math.abs(fc) < 1e-12 || (i > 1 && Math.abs(c - prevC) < 1e-13)) break
      if (fa * fc < 0) b = c; else a = c
      frames.push({ x: c, bracket: [a, b], note: `f(c) = ${fmt(fc, 4)}: a raiz fica em [${fmt(a, 8)}, ${fmt(b, 8)}] — o intervalo sempre contém a raiz.` })
    }
    frames.push({ x: c, bracket: [a, b], note: `Raiz ≈ ${fmt(c, 12)}, com f(c) = ${fmt(f(c), 3)}.` })
  }
  return frames
}

// ── Gauss-Jordan ───────────────────────────────────────────
export function gaussJordanFrames(M) {
  const A = M.map(r => [...r])
  const n = A.length
  const snap = (extra) => ({ m: A.map(r => [...r]), ...extra })
  const frames = [snap({ note: 'Matriz aumentada [A | b]. Objetivo: transformar A na identidade com operações de linha; a última coluna vira a solução.' })]
  for (let col = 0; col < n; col++) {
    let piv = col
    for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r
    if (Math.abs(A[piv][col]) < 1e-12) { frames.push(snap({ note: 'Coluna sem pivô: o sistema é singular (sem solução única).' })); return frames }
    if (piv !== col) {
      ;[A[piv], A[col]] = [A[col], A[piv]]
      frames.push(snap({ pivot: [col, col], rows: [piv, col], note: `Pivoteamento parcial: troca as linhas ${col + 1} e ${piv + 1} para usar o maior valor da coluna como pivô.` }))
    }
    const p = A[col][col]
    A[col] = A[col].map(v => v / p)
    frames.push(snap({ pivot: [col, col], rows: [col], note: `Divide a linha ${col + 1} por ${fmt(p, 6)} para o pivô virar 1.` }))
    for (let r = 0; r < n; r++) {
      if (r === col || A[r][col] === 0) continue
      const k = A[r][col]
      A[r] = A[r].map((v, j) => v - k * A[col][j])
      frames.push(snap({ pivot: [col, col], rows: [r], note: `Linha ${r + 1} ← linha ${r + 1} − (${fmt(k, 6)}) × linha ${col + 1}: zera a coluna ${col + 1} fora do pivô.` }))
    }
  }
  frames.push(snap({ done: true, note: `A virou a identidade. Solução: ${A.map((r, i) => `x${i + 1} = ${fmt(r[n], 8)}`).join(', ')}.` }))
  return frames
}

// ── Gram-Schmidt (2D e 3D) ─────────────────────────────────
const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0)
const sub = (u, v) => u.map((x, i) => x - v[i])
const scale = (u, k) => u.map(x => x * k)

export function gramSchmidtFrames(vectors) {
  const es = []
  const frames = [{ vs: vectors, es: [], note: 'Vetores de entrada. Objetivo: uma base ortonormal (vetores perpendiculares e de comprimento 1) que gere o mesmo espaço.' }]
  vectors.forEach((v, k) => {
    let u = [...v]
    es.forEach((e, j) => {
      const c = dot(v, e)
      const proj = scale(e, c)
      frames.push({ vs: vectors, es: [...es], current: k, proj, u, note: `Remove de v${k + 1} sua componente na direção de e${j + 1}: projeção = (v${k + 1} · e${j + 1}) e${j + 1} = ${fmt(c, 4)} · e${j + 1}.` })
      u = sub(u, proj)
    })
    const len = Math.hypot(...u)
    frames.push({ vs: vectors, es: [...es], current: k, u, note: es.length ? `O que sobra (u${k + 1}) é perpendicular a todos os anteriores. Comprimento: ${fmt(len, 4)}.` : `O primeiro vetor só precisa ser normalizado. Comprimento: ${fmt(len, 4)}.` })
    es.push(scale(u, 1 / len))
    frames.push({ vs: vectors, es: [...es], current: k, note: `e${k + 1} = u${k + 1} / ${fmt(len, 4)}: vetor unitário.` })
  })
  frames.push({ vs: vectors, es, note: `Base ortonormal pronta: e1 · e2 = ${fmt(dot(es[0], es[1]), 3)} (perpendiculares).` })
  return frames
}

// ── Curvas: De Casteljau e De Boor ─────────────────────────
const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]

// Níveis intermediários de De Casteljau para um t (para desenhar a construção).
export function deCasteljauLevels(points, t) {
  const levels = [points]
  while (levels.at(-1).length > 1) {
    const prev = levels.at(-1)
    levels.push(prev.slice(1).map((p, i) => lerp(prev[i], p, t)))
  }
  return levels
}

export const bezierCurve = (points, samples = 80) =>
  Array.from({ length: samples + 1 }, (_, i) => deCasteljauLevels(points, i / samples).at(-1)[0])

// B-spline uniforme "clamped" de grau p, avaliada pelo algoritmo de De Boor.
export function clampedKnots(nPoints, p) {
  const inner = nPoints - p - 1
  return [...Array(p + 1).fill(0), ...Array.from({ length: inner }, (_, i) => (i + 1) / (inner + 1)), ...Array(p + 1).fill(1)]
}

// Devolve o intervalo de nós k e os pontos de cada nível da construção (o último nível é o ponto da curva).
export function deBoorLevels(points, p, knots, t) {
  let k = p
  while (k < points.length - 1 && t >= knots[k + 1]) k++
  const d = points.slice(k - p, k + 1).map(q => [...q])
  const levels = [d.map(q => [...q])]
  for (let r = 1; r <= p; r++) {
    for (let j = p; j >= r; j--) {
      const i = j + k - p
      const alpha = (t - knots[i]) / (knots[i + 1 + p - r] - knots[i])
      d[j] = lerp(d[j - 1], d[j], alpha)
    }
    levels.push(d.slice(r).map(q => [...q]))
  }
  return { span: k, levels }
}

export function bsplineCurve(points, p, samples = 120) {
  const knots = clampedKnots(points.length, p)
  return Array.from({ length: samples + 1 }, (_, i) => {
    const t = Math.min(i / samples, 1 - 1e-9)
    return deBoorLevels(points, p, knots, t).levels.at(-1)[0]
  })
}
