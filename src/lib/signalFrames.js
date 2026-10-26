// Processamento de sinais passo a passo: média móvel, DFT, FFT, CORDIC, rainflow e OSEM.

import { lcg } from './optimizationFrames.js'

const fail = () => { throw new Error('entrada inválida') }
const r3 = v => Number(v.toFixed(3))
const nums = (s, min, max, maxLen) => {
  const v = s.trim().split(/[\s,;]+/).map(Number)
  if (!v.length || v.length > maxLen || v.some(x => !Number.isFinite(x) || x < min || x > max)) fail()
  return v
}

// ── Média móvel ────────────────────────────────────────────
export function noisySignal(seed = 1, n = 100) {
  const rnd = lcg(seed)
  return Array.from({ length: n }, (_, i) => Math.sin((2 * Math.PI * 2 * i) / n) + 0.35 * (rnd() * 2 - 1))
}

// Quadros: { signal, out: [valor | null], i, w, note }
export function movingAverageFrames(w, seed) {
  if (!Number.isInteger(w) || w < 1 || w > 25) fail()
  const x = noisySignal(seed)
  const out = Array(x.length).fill(null)
  let sum = 0
  const frames = [{ signal: x, out: [...out], i: -1, w, note: `Sinal com ruído (${x.length} amostras). Cada saída é a média das últimas ${w} amostras: o ruído rápido se cancela e a tendência lenta permanece.` }]
  for (let i = 0; i < x.length; i++) {
    sum += x[i]
    if (i >= w) sum -= x[i - w] // soma deslizante: entra uma amostra, sai outra
    out[i] = sum / Math.min(i + 1, w)
    if (i % 2 === 0 || i === x.length - 1) frames.push({ signal: x, out: [...out], i, w, note: `Amostra ${i}: soma deslizante — soma ${r3(x[i])}${i >= w ? `, subtrai a amostra ${i - w}` : ''}; média = ${r3(out[i])}. Cada passo custa O(1), qualquer que seja a janela.` })
  }
  frames.at(-1).note = `Filtrado. Janelas maiores suavizam mais, mas atrasam o sinal (atraso de ${((w - 1) / 2).toFixed(1)} amostras) e achatam picos.`
  frames.at(-1).done = true
  return frames
}

// ── DFT ────────────────────────────────────────────────────
// Componentes "frequência:amplitude" separados por espaço.
export function dftSignal(spec, N = 32) {
  const comps = spec.trim().split(/[\s,;]+/).map(p => p.split(':').map(Number))
  if (!comps.length || comps.length > 4 || comps.some(c => c.length !== 2 || !Number.isInteger(c[0]) || c[0] < 0 || c[0] > N / 2 - 1 || !(c[1] > 0 && c[1] <= 3))) fail()
  return { comps, x: Array.from({ length: N }, (_, n) => comps.reduce((s, [f, a]) => s + a * Math.cos((2 * Math.PI * f * n) / N), 0)) }
}

// Quadros: { x, k, mags: [|X_k| normalizado | null], note }
export function dftFrames(spec) {
  const N = 32
  const { x } = dftSignal(spec, N)
  const mags = Array(N / 2).fill(null)
  const frames = [{ x, k: -1, mags: [...mags], note: `Sinal com ${N} amostras. A DFT mede, para cada frequência k, quanto o sinal "se parece" com uma onda de k ciclos: X_k = Σ x[n]·e^(−2πikn/N). São N somas de N termos: O(N²).` }]
  for (let k = 0; k < N / 2; k++) {
    let re = 0, im = 0
    for (let n = 0; n < N; n++) { re += x[n] * Math.cos((2 * Math.PI * k * n) / N); im -= x[n] * Math.sin((2 * Math.PI * k * n) / N) }
    mags[k] = (k === 0 ? 1 : 2) * Math.hypot(re, im) / N
    frames.push({ x, k, mags: [...mags], note: `k = ${k}: multiplica o sinal por uma onda de ${k} ciclo${k === 1 ? '' : 's'} e soma. Amplitude encontrada: ${r3(mags[k])}${mags[k] > 0.05 ? ' — essa frequência está no sinal!' : '.'}` })
  }
  frames.at(-1).note = `Espectro completo: os picos mostram as frequências e amplitudes que compõem o sinal. Foram ${N * N / 2} multiplicações complexas; a FFT faz o mesmo com cerca de ${(N / 2) * Math.log2(N)}.`
  frames.at(-1).done = true
  return frames
}

// ── FFT (Cooley-Tukey, raiz 2, iterativa) ──────────────────
const cfmt = ([re, im]) => {
  const a = r3(re), b = r3(im)
  return b === 0 ? `${a}` : a === 0 ? `${b}i` : `${a}${b < 0 ? '−' : '+'}${Math.abs(b)}i`
}

// Quadros: { stages: [[valores complexos por coluna]], col, pair?, note }
export function fftFrames(values) {
  const x = nums(values, -100, 100, 16)
  const N = x.length
  if (N < 2 || (N & (N - 1))) fail()
  const bits = Math.log2(N)
  const rev = i => parseInt(i.toString(2).padStart(bits, '0').split('').reverse().join(''), 2)
  let a = x.map((_, i) => [x[rev(i)], 0])
  const cols = [x.map(v => [v, 0]), a.map(v => [...v])]
  const frames = [
    { cols: [cols[0]], order: x.map((_, i) => i), note: `Entrada: ${N} amostras. A FFT de Cooley-Tukey divide a DFT em metades pares e ímpares, recursivamente — ${bits} estágios de ${N / 2} "borboletas".` },
    { cols: cols.map(c => c.map(v => [...v])), order: x.map((_, i) => rev(i)), note: `Reordena as amostras pela inversão de bits dos índices (${x.map((_, i) => rev(i)).join(', ')}): assim cada estágio combina vizinhos.` },
  ]
  for (let s = 1; s <= bits; s++) {
    const m = 1 << s, half = m / 2
    const next = a.map(v => [...v])
    for (let k = 0; k < N; k += m) {
      for (let j = 0; j < half; j++) {
        const ang = (-2 * Math.PI * j) / m
        const w = [Math.cos(ang), Math.sin(ang)]
        const u = a[k + j], t = [w[0] * a[k + j + half][0] - w[1] * a[k + j + half][1], w[0] * a[k + j + half][1] + w[1] * a[k + j + half][0]]
        next[k + j] = [u[0] + t[0], u[1] + t[1]]
        next[k + j + half] = [u[0] - t[0], u[1] - t[1]]
        const partial = [...cols.map(c => c.map(v => [...v])), next.map(v => [...v])]
        frames.push({ cols: partial, stage: s, pair: [k + j, k + j + half], note: `Estágio ${s}, borboleta (${k + j}, ${k + j + half}): t = W·a[${k + j + half}] com W = e^(−2πi·${j}/${m}) = ${cfmt(w)}; saídas a[${k + j}] + t = ${cfmt(next[k + j])} e a[${k + j}] − t = ${cfmt(next[k + j + half])}.` })
      }
    }
    a = next
    cols.push(a.map(v => [...v]))
  }
  const mags = a.map(v => Math.hypot(v[0], v[1]))
  frames.push({ cols: cols.map(c => c.map(v => [...v])), done: true, mags, note: `Resultado: X = [${a.map(cfmt).join(', ')}]. Com N = ${N}, foram ${(N / 2) * bits} borboletas em vez de ${N * N} produtos da DFT direta — para N = 1.048.576, a diferença é de 100 mil vezes.` })
  return frames
}

// ── CORDIC ─────────────────────────────────────────────────
export const CORDIC_ANGLES = Array.from({ length: 24 }, (_, i) => Math.atan(2 ** -i))
export const CORDIC_K = CORDIC_ANGLES.reduce((k, _, i) => k / Math.sqrt(1 + 2 ** (-2 * i)), 1)

// Quadros: { x, y, z, i, d?, target, note }
export function cordicFrames(degrees, iters = 16) {
  if (!Number.isFinite(degrees) || degrees < -90 || degrees > 90) fail()
  const target = (degrees * Math.PI) / 180
  let x = CORDIC_K, y = 0, z = target
  const frames = [{ x, y, z, i: -1, target, note: `Ângulo-alvo ${degrees}°. O vetor começa em (K, 0), com K = ${r3(CORDIC_K)} — o fator que compensa o "alongamento" das rotações. A cada passo gira ±arctan(2⁻ⁱ), usando só somas e deslocamentos de bits.` }]
  for (let i = 0; i < iters; i++) {
    const d = z >= 0 ? 1 : -1
    const nx = x - d * y * 2 ** -i, ny = y + d * x * 2 ** -i
    z -= d * CORDIC_ANGLES[i]
    x = nx; y = ny
    frames.push({ x, y, z, i, d, target, note: `Passo ${i}: falta ${r3((z + d * CORDIC_ANGLES[i]) * 180 / Math.PI)}°, então gira ${d > 0 ? 'anti-horário' : 'horário'} por arctan(2^−${i}) = ${r3(CORDIC_ANGLES[i] * 180 / Math.PI)}°. x = ${r3(x)}, y = ${r3(y)}.` })
  }
  frames.push({ x, y, z, i: iters, target, done: true, note: `Após ${iters} passos: cos ≈ ${x.toFixed(6)} e sen ≈ ${y.toFixed(6)} (valores exatos: ${Math.cos(target).toFixed(6)} e ${Math.sin(target).toFixed(6)}). Cada passo acrescenta cerca de 1 bit de precisão.` })
  return frames
}

// ── Rainflow (ASTM E1049, método de 3 pontos) ──────────────
export function reversals(series) {
  const out = [series[0]]
  for (let i = 1; i < series.length; i++) {
    const v = series[i]
    if (v === out.at(-1)) continue
    if (out.length >= 2 && (out.at(-1) - out.at(-2)) * (v - out.at(-1)) > 0) out[out.length - 1] = v // continua subindo/descendo
    else out.push(v)
  }
  return out
}

// Quadros: { series, stack: [índices], cycles: [[amplitude, média, contagem, i, j]], cur?, note }
export function rainflowFrames(values) {
  const raw = nums(values, -1000, 1000, 30)
  if (raw.length < 3) fail()
  const series = reversals(raw)
  const stack = [], cycles = []
  const frames = [{ series, stack: [], cycles: [], note: `Histórico de tensões reduzido aos picos e vales: ${series.join(', ')}. O rainflow empilha os pontos e, sempre que uma faixa nova é maior ou igual à anterior, extrai um ciclo.` }]
  const snapshot = (note, extra = {}) => frames.push({ series, stack: [...stack], cycles: cycles.map(c => [...c]), note, ...extra })
  for (let i = 0; i < series.length; i++) {
    stack.push(i)
    snapshot(`Lê o ponto ${series[i]} e o põe na pilha.`, { cur: i })
    while (stack.length >= 3) {
      const [a, b, c] = stack.slice(-3)
      const X = Math.abs(series[c] - series[b]), Y = Math.abs(series[b] - series[a])
      if (X < Y) break
      if (stack.length === 3) {
        cycles.push([Y, (series[a] + series[b]) / 2, 0.5, a, b])
        stack.shift()
        snapshot(`Faixa X = ${X} ≥ Y = ${Y}, e Y contém o ponto inicial: conta meio ciclo de amplitude ${Y} e descarta o primeiro ponto.`, { highlight: [a, b] })
      } else {
        cycles.push([Y, (series[a] + series[b]) / 2, 1, a, b])
        stack.splice(stack.length - 3, 2)
        snapshot(`Faixa X = ${X} ≥ Y = ${Y}: conta um ciclo completo de amplitude ${Y} (entre ${series[a]} e ${series[b]}) e remove esses dois pontos.`, { highlight: [a, b] })
      }
    }
  }
  for (let k = 0; k + 1 < stack.length; k++) {
    const a = stack[k], b = stack[k + 1]
    cycles.push([Math.abs(series[b] - series[a]), (series[a] + series[b]) / 2, 0.5, a, b])
  }
  snapshot(`Fim do histórico: as faixas que sobraram na pilha contam como meios ciclos. Esses ciclos alimentam a regra de Miner para estimar o dano por fadiga.`, { done: true })
  return frames
}

// ── OSEM (reconstrução tomográfica em uma grade pequena) ───
const SIZE = 12
export function phantom() {
  const img = Array.from({ length: SIZE * SIZE }, (_, k) => {
    const r = Math.floor(k / SIZE), c = k % SIZE
    const d1 = Math.hypot(r - 4, c - 4), d2 = Math.hypot(r - 7.5, c - 7.5)
    return (d1 < 2.6 ? 1 : 0) + (d2 < 3.2 ? 0.6 : 0) + (r === 9 && c >= 2 && c <= 4 ? 1 : 0)
  })
  return img
}

// Linhas de projeção em 4 ângulos (0°, 90°, 45°, 135°): cada linha soma os pixels que atravessa.
function projectionLines() {
  const lines = [[], [], [], []]
  for (let r = 0; r < SIZE; r++) lines[0].push(Array.from({ length: SIZE }, (_, c) => r * SIZE + c))
  for (let c = 0; c < SIZE; c++) lines[1].push(Array.from({ length: SIZE }, (_, r) => r * SIZE + c))
  for (let s = 0; s < 2 * SIZE - 1; s++) { lines[2].push([]); lines[3].push([]) }
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) { lines[2][r + c].push(r * SIZE + c); lines[3][r - c + SIZE - 1].push(r * SIZE + c) }
  return lines
}

// Quadros: { truth, img, subset, it, err, note }
export function osemFrames(iterations) {
  if (!Number.isInteger(iterations) || iterations < 1 || iterations > 20) fail()
  const truth = phantom()
  const subsets = projectionLines()
  const measured = subsets.map(lines => lines.map(line => line.reduce((s, j) => s + truth[j], 0)))
  let img = Array(SIZE * SIZE).fill(1)
  const err = () => Math.sqrt(img.reduce((s, v, j) => s + (v - truth[j]) ** 2, 0) / img.length)
  const names = ['horizontal (0°)', 'vertical (90°)', 'diagonal (45°)', 'diagonal (135°)']
  const frames = [{ truth, img: [...img], subset: -1, it: 0, err: err(), note: `Objeto desconhecido (à esquerda) medido por raios em 4 direções; cada medida é a soma dos pixels atravessados. A reconstrução começa com uma imagem uniforme.` }]
  for (let it = 1; it <= iterations; it++) {
    subsets.forEach((lines, s) => {
      const back = Array(img.length).fill(0), sens = Array(img.length).fill(0)
      lines.forEach((line, i) => {
        const proj = line.reduce((sum, j) => sum + img[j], 0)
        const ratio = proj > 0 ? measured[s][i] / proj : 0
        for (const j of line) { back[j] += ratio; sens[j] += 1 }
      })
      img = img.map((v, j) => (sens[j] ? (v * back[j]) / sens[j] : v))
      frames.push({ truth, img: [...img], subset: s, it, err: err(), note: `Iteração ${it}, subconjunto ${s + 1} (${names[s]}): projeta a imagem atual, compara com as medidas (razão medido/estimado) e multiplica cada pixel pela média das razões dos raios que o atravessam. Erro médio: ${r3(err())}.` })
    })
  }
  frames.at(-1).note += ' Com só 4 ângulos a reconstrução é aproximada; tomógrafos reais usam centenas de ângulos — e o OSEM converge muito mais rápido que o EM clássico porque atualiza a imagem a cada subconjunto.'
  frames.at(-1).done = true
  return frames
}

export const OSEM_SIZE = SIZE
