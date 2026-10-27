// Simulador de vetor de estado para Deutsch-Jozsa e Grover (amplitudes reais bastam) e Shor
// (distribuição exata da QFT aplicada ao "pente" de períodos).

import { lcg } from './optimizationFrames.js'

const fail = () => { throw new Error('entrada inválida') }
const r3 = v => Number(v.toFixed(3))
const bin = (x, n) => x.toString(2).padStart(n, '0')

// Transformada de Walsh-Hadamard (H em todos os qubits), in-place, para amplitudes reais.
export function hadamardAll(a) {
  const N = a.length, out = [...a]
  for (let h = 1; h < N; h *= 2) {
    for (let i = 0; i < N; i += 2 * h) for (let j = i; j < i + h; j++) {
      const x = out[j], y = out[j + h]
      out[j] = (x + y) / Math.SQRT2
      out[j + h] = (x - y) / Math.SQRT2
    }
  }
  return out
}

// ── Deutsch-Jozsa ──────────────────────────────────────────
export const DJ_ORACLES = {
  const0: { label: 'f(x) = 0', en: 'f(x) = 0', f: () => 0, kind: 'constante' },
  const1: { label: 'f(x) = 1', en: 'f(x) = 1', f: () => 1, kind: 'constante' },
  bit0: { label: 'f(x) = último bit', en: 'f(x) = last bit', f: x => x & 1, kind: 'balanceada' },
  parity: { label: 'f(x) = paridade', en: 'f(x) = parity', f: x => { let p = 0; while (x) { p ^= x & 1; x >>= 1 } return p }, kind: 'balanceada' },
  half: { label: 'f(x) = 1 se x ≥ N/2', en: 'f(x) = 1 if x ≥ N/2', f: (x, N) => (x >= N / 2 ? 1 : 0), kind: 'balanceada' },
}

// Quadros: { amps: [números reais], n, step, note }
export function djFrames(oracle, n = 3) {
  const o = DJ_ORACLES[oracle]
  if (!o) fail()
  const N = 2 ** n
  let a = Array(N).fill(0); a[0] = 1
  const values = Array.from({ length: N }, (_, x) => o.f(x, N))
  const frames = [{ amps: [...a], n, step: 0, values, note: `A função f recebe ${n} bits e devolve 0 ou 1. Prometem que ela é constante (mesma saída para tudo) ou balanceada (metade 0, metade 1). Classicamente, no pior caso é preciso consultá-la ${N / 2 + 1} vezes. O registrador começa em |${'0'.repeat(n)}⟩.` }]
  a = hadamardAll(a)
  frames.push({ amps: [...a], n, step: 1, values, note: `Hadamard em todos os qubits: superposição uniforme dos ${N} valores de x, cada um com amplitude 1/√${N} ≈ ${r3(1 / Math.sqrt(N))}.` })
  a = a.map((v, x) => (values[x] ? -v : v))
  frames.push({ amps: [...a], n, step: 2, values, note: `Uma única consulta ao oráculo: com o qubit auxiliar em |−⟩, ele inverte o sinal da amplitude de cada x com f(x) = 1 ("retrocesso de fase"). Agora a informação sobre f está nos sinais.` })
  a = hadamardAll(a)
  frames.push({ amps: [...a], n, step: 3, values, note: `Hadamard de novo: as amplitudes interferem. A amplitude de |${'0'.repeat(n)}⟩ é a média dos sinais: ${r3(a[0])}.` })
  const p0 = a[0] * a[0]
  frames.push({ amps: [...a], n, step: 4, values, done: true, note: `Medição: P(|${'0'.repeat(n)}⟩) = ${r3(p0)}. ${p0 > 0.5 ? 'Resultado só zeros: a função é CONSTANTE.' : 'Nunca dá só zeros: a função é BALANCEADA.'} Uma consulta quântica contra até ${N / 2 + 1} clássicas — foi o primeiro exemplo de vantagem quântica exponencial (para respostas exatas).` })
  return frames
}

// ── Grover ─────────────────────────────────────────────────
// Quadros: { amps, n, marked, mean?, phase, note }
export function groverFrames(n, marked) {
  if (!Number.isInteger(n) || n < 2 || n > 7) fail()
  const N = 2 ** n
  if (!Number.isInteger(marked) || marked < 0 || marked >= N) fail()
  const k = Math.floor((Math.PI / 4) * Math.sqrt(N))
  let a = Array(N).fill(1 / Math.sqrt(N))
  const mean = v => v.reduce((s, x) => s + x, 0) / v.length
  const frames = [{ amps: [...a], n, marked, phase: 'init', note: `Procurar 1 item marcado (|${bin(marked, n)}⟩ = ${marked}) entre ${N}. Classicamente, em média ${N / 2} consultas. Começa em superposição uniforme: cada item com probabilidade 1/${N}.` }]
  for (let it = 1; it <= k; it++) {
    a = a.map((v, x) => (x === marked ? -v : v))
    frames.push({ amps: [...a], n, marked, mean: mean(a), phase: 'oracle', it, note: `Iteração ${it}, oráculo: inverte o sinal da amplitude do item marcado. A probabilidade ainda não mudou — só a fase.` })
    const m = mean(a)
    a = a.map(v => 2 * m - v)
    frames.push({ amps: [...a], n, marked, mean: m, phase: 'diffusion', it, note: `Iteração ${it}, difusão (inversão em torno da média ${r3(m)}): cada amplitude vira 2·média − amplitude. A do item marcado cresce: probabilidade ${r3(a[marked] ** 2 * 100)}%.` })
  }
  frames.push({ amps: [...a], n, marked, phase: 'measure', done: true, note: `Depois de ${k} iteração${k > 1 ? 'ões' : ''} (≈ π/4·√${N}), medir dá o item marcado com probabilidade ${r3(a[marked] ** 2 * 100)}%. Grover precisa de O(√N) consultas — e iterar demais faz a probabilidade voltar a cair.` })
  return frames
}

// ── Shor ───────────────────────────────────────────────────
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a }
const modpow = (b, e, m) => { let r = 1; b %= m; while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e >>= 1 } return r }
const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true }
const isPrimePower = n => { for (let p = 2; p <= n; p++) if (isPrime(p) && n % p === 0) { let m = n; while (m % p === 0) m /= p; return m === 1 } return false }

export function convergents(num, den) {
  const out = []
  let [h0, h1, k0, k1] = [0, 1, 1, 0], a = num, b = den
  while (b) {
    const q = Math.floor(a / b);
    [a, b] = [b, a - q * b]
    ;[h0, h1] = [h1, q * h1 + h0]
    ;[k0, k1] = [k1, q * k1 + k0]
    out.push([h1, k1])
  }
  return out
}

// Quadros: { phase, Q, N, a, values?, probs?, comb?, k?, note }
export function shorFrames(N, aIn, seed) {
  if (!Number.isInteger(N) || N < 15 || N > 63 || N % 2 === 0 || isPrime(N) || isPrimePower(N)) fail()
  const rnd = lcg(seed)
  let Q = 1, t = 0
  while (Q < N * N) { Q *= 2; t++ }
  const a = aIn || 2 + Math.floor(rnd() * (N - 3))
  if (!Number.isInteger(a) || a < 2 || a >= N) fail()
  const frames = [{ phase: 'classic', Q, N, a, note: `Fatorar N = ${N}. N é ímpar e não é potência de primo. Escolhe a = ${a}. Se mdc(a, N) já fosse maior que 1, teríamos um fator de graça.` }]
  const g = gcd(a, N)
  if (g > 1) {
    frames.push({ phase: 'done', Q, N, a, done: true, factors: [g, N / g], note: `mdc(${a}, ${N}) = ${g}: fator encontrado sem precisar da parte quântica! ${N} = ${g} × ${N / g}.` })
    return frames
  }
  const values = Array.from({ length: Q }, (_, x) => modpow(a, x, N))
  let r = 1
  while (modpow(a, r, N) !== 1) r++
  frames.push({ phase: 'superpose', Q, N, a, note: `O problema vira achar o período r de f(x) = ${a}ˣ mod ${N}. Primeiro registrador: ${t} qubits em superposição de x = 0 … ${Q - 1} (Q = ${Q} ≥ N²).` })
  frames.push({ phase: 'function', Q, N, a, values, note: `Calcula f(x) = ${a}ˣ mod ${N} para todos os x ao mesmo tempo, no segundo registrador. A sequência se repete — o computador quântico "sabe" o período, mas ainda não podemos lê-lo diretamente.` })
  const x0 = Math.floor(rnd() * r)
  const v = values[x0]
  const comb = []
  for (let x = x0; x < Q; x += r) comb.push(x)
  frames.push({ phase: 'comb', Q, N, a, values, comb, note: `Mede o segundo registrador e obtém f = ${v}. O primeiro registrador colapsa para os x com ${a}ˣ mod ${N} = ${v}: x = ${comb.slice(0, 4).join(', ')}, … — um "pente" com ${comb.length} dentes espaçados de r (ainda desconhecido).` })
  const M = comb.length
  const probs = Array.from({ length: Q }, (_, k) => {
    const theta = (Math.PI * k * r) / Q
    const s = Math.abs(Math.sin(theta)) < 1e-12 ? M * M : Math.sin(M * theta) ** 2 / Math.sin(theta) ** 2
    return s / (Q * M)
  })
  frames.push({ phase: 'qft', Q, N, a, probs, note: `Transformada de Fourier quântica: o pente vira picos de probabilidade perto dos múltiplos de Q/r. A posição do pente (x₀) só muda fases — os picos não dependem dela.` })
  let u = rnd(), k = 0
  while (k < Q - 1 && u >= probs[k]) { u -= probs[k]; k++ }
  const conv = convergents(k, Q)
  let found = null
  for (const [, d] of conv) {
    if (d >= N) break
    for (let m = 1; m * d < N && !found; m++) if (modpow(a, m * d, N) === 1) found = m * d
    if (found) break
  }
  frames.push({ phase: 'measure', Q, N, a, probs, k, note: `Mede o primeiro registrador: k = ${k}. Frações contínuas de ${k}/${Q}: ${conv.map(([h, d]) => `${h}/${d}`).join(', ')}. ${found ? `O denominador ${found} satisfaz ${a}^${found} ≡ 1 (mod ${N}): r = ${found}.` : 'Nenhum denominador serve como período — seria preciso repetir a parte quântica.'}` })
  if (!found) { frames.at(-1).done = true; return frames }
  if (found % 2 === 1 || modpow(a, found / 2, N) === N - 1) {
    frames.push({ phase: 'done', Q, N, a, probs, k, done: true, note: `r = ${found} ${found % 2 ? 'é ímpar' : `mas ${a}^${found / 2} ≡ −1 (mod ${N})`}: este a não ajuda. Escolhe outro a e repete (isso acontece com probabilidade baixa).` })
    return frames
  }
  const h = modpow(a, found / 2, N)
  const f1 = gcd(h - 1, N), f2 = gcd(h + 1, N)
  frames.push({ phase: 'done', Q, N, a, probs, k, done: true, factors: [f1, f2], note: `Com r = ${found} par: ${a}^${found / 2} mod ${N} = ${h}. mdc(${h} − 1, ${N}) = ${f1} e mdc(${h} + 1, ${N}) = ${f2}. ${N} = ${f1} × ${f2}! Em um computador quântico grande, o mesmo processo fatoraria números de 2048 bits — o que quebraria o RSA.` })
  return frames
}
