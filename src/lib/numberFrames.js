// Execuções passo a passo dos algoritmos de teoria dos números, no formato de tabela.
// Cada algoritmo declara suas entradas e devolve { columns, steps: [{ row?, note }] }.
// Usa BigInt onde os números podem crescer além do limite seguro do JavaScript.

const big = BigInt
const abs = x => (x < 0n ? -x : x)
const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a }
const modPow = (b, e, m) => { let r = 1n; b %= m; while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n } return r }
const isqrt = n => { if (n < 2n) return n; let x = big(Math.floor(Math.sqrt(Number(n)))); while (x * x > n) x--; while ((x + 1n) * (x + 1n) <= n) x++; return x }
const mod = (a, m) => ((a % m) + m) % m

function euclid({ a, b }) {
  let x = big(a), y = big(b)
  const steps = [{ note: `mdc(${x}, ${y}): divide o maior pelo menor e troca o par por (divisor, resto) até o resto ser zero.` }]
  while (y !== 0n) {
    const q = x / y, r = x % y
    steps.push({ row: [x, y, q, r], note: `${x} = ${q} × ${y} + ${r}. Agora calcula mdc(${y}, ${r}).` })
    ;[x, y] = [y, r]
  }
  steps.push({ note: `O resto chegou a zero: mdc = ${x}.`, result: `mdc = ${x}` })
  return { columns: ['a', 'b', 'quociente', 'resto'], steps }
}

function trialDivision({ n }) {
  let m = big(n)
  const factors = []
  const steps = [{ note: `Fatorar ${m}: testa divisores d = 2, 3, 4… enquanto d² ≤ o que resta.` }]
  for (let d = 2n; d * d <= m; d++) {
    if (m % d === 0n) {
      while (m % d === 0n) {
        factors.push(d)
        steps.push({ row: [m, d, '✓ divide', m / d], note: `${d} divide ${m}: guarda o fator ${d} e continua com ${m / d}.` })
        m /= d
      }
    } else if (steps.length < 60) {
      steps.push({ row: [m, d, '—', m], note: `${d} não divide ${m}.` })
    }
  }
  if (m > 1n) {
    factors.push(m)
    steps.push({ row: [m, '—', 'primo', 1], note: `Nenhum divisor até √${m}: o que sobrou (${m}) é primo.` })
  }
  steps.push({ note: `${n} = ${factors.join(' × ')}`, result: factors.join(' × ') })
  return { columns: ['resta', 'divisor', 'divide?', 'quociente'], steps }
}

function fastPow({ base, exp, mod: m }) {
  let b = big(base), e = big(exp)
  const M = big(m)
  let r = 1n
  b %= M
  const steps = [{ note: `${base}^${exp} mod ${m}: ${exp} em binário é ${big(exp).toString(2)}. Percorre os bits do menos significativo ao mais significativo.` }]
  while (e > 0n) {
    const bit = e & 1n
    const before = r
    if (bit) r = (r * b) % M
    steps.push({
      row: [bit, b, r],
      note: bit ? `Bit 1: resultado = ${before} × ${b} mod ${m} = ${r}.` : `Bit 0: o resultado não muda (${r}).`,
    })
    b = (b * b) % M
    e >>= 1n
  }
  steps.push({ note: `Pronto em ${steps.length - 1} passos (contra ${exp} multiplicações do método ingênuo): ${base}^${exp} mod ${m} = ${r}.`, result: String(r) })
  return { columns: ['bit', 'base atual (b^2^i)', 'resultado'], steps }
}

function karatsuba({ x, y }) {
  const steps = [{ note: `${x} × ${y}: divide cada número ao meio e troca 4 multiplicações por 3.` }]
  const rec = (a, b, depth) => {
    if (a < 10n || b < 10n) {
      const p = a * b
      steps.push({ row: ['  '.repeat(depth) + `${a} × ${b}`, '—', p], note: `Caso base: ${a} × ${b} = ${p}.` })
      return p
    }
    const m = Math.floor(Math.max(a.toString().length, b.toString().length) / 2)
    const p10 = 10n ** big(m)
    const [a1, a0, b1, b0] = [a / p10, a % p10, b / p10, b % p10]
    const z2 = rec(a1, b1, depth + 1)
    const z0 = rec(a0, b0, depth + 1)
    const z1 = rec(a1 + a0, b1 + b0, depth + 1) - z2 - z0
    const p = z2 * p10 * p10 + z1 * p10 + z0
    steps.push({
      row: ['  '.repeat(depth) + `${a} × ${b}`, `z2=${z2}, z1=${z1}, z0=${z0}`, p],
      note: `${a} × ${b}: corta em 10^${m}. z2 = ${a1}×${b1}, z0 = ${a0}×${b0}, z1 = (${a1}+${a0})(${b1}+${b0}) − z2 − z0. Resultado: z2·10^${2 * m} + z1·10^${m} + z0 = ${p}.`,
    })
    return p
  }
  const r = rec(big(x), big(y), 0)
  steps.push({ note: `${x} × ${y} = ${r}.`, result: String(r) })
  return { columns: ['multiplicação', 'partes', 'produto'], steps }
}

function millerRabin({ n }) {
  const N = big(n)
  const steps = []
  if (N < 4n) return { columns: ['base a', 'sequência', 'veredito'], steps: [{ note: N < 2n ? `${n} não é primo.` : `${n} é primo.`, result: N < 2n ? 'composto' : 'primo' }] }
  if (N % 2n === 0n) return { columns: ['base a', 'sequência', 'veredito'], steps: [{ note: `${n} é par: composto.`, result: 'composto' }] }
  let d = N - 1n, s = 0
  while (d % 2n === 0n) { d /= 2n; s++ }
  steps.push({ note: `${n} − 1 = 2^${s} × ${d}. Para cada base a, calcula a^${d} e eleva ao quadrado até ${s - 1} vezes.` })
  for (const a of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    if (a >= N) break
    let x = modPow(a, d, N)
    const seq = [x]
    let ok = x === 1n || x === N - 1n
    for (let r = 1; r < s && !ok; r++) {
      x = (x * x) % N
      seq.push(x)
      if (x === N - 1n) ok = true
    }
    const shown = seq.map(v => (v === N - 1n ? '−1' : String(v))).join(' → ')
    if (!ok) {
      steps.push({ row: [a, shown, '✗ testemunha'], note: `Base ${a}: a sequência nunca chega a 1 nem a −1 (= ${N - 1n}). ${a} é uma testemunha: ${n} é composto com certeza.` })
      steps.push({ note: `${n} é composto.`, result: 'composto' })
      return { columns: ['base a', 'sequência mod n', 'veredito'], steps }
    }
    steps.push({ row: [a, shown, '✓ passou'], note: `Base ${a}: a sequência começa em 1 ou passa por −1 — consistente com um primo.` })
  }
  steps.push({ note: `${n} passou em todas as bases: é primo (estas bases bastam para qualquer número de 64 bits).`, result: 'primo' })
  return { columns: ['base a', 'sequência mod n', 'veredito'], steps }
}

function fermatFactor({ n }) {
  const N = big(n)
  if (N % 2n === 0n) return { columns: ['a', 'a² − n', 'quadrado?'], steps: [{ note: `${n} é par: 2 × ${N / 2n}. O método de Fermat é para números ímpares.`, result: `2 × ${N / 2n}` }] }
  let a = isqrt(N)
  if (a * a < N) a++
  const steps = [{ note: `Procura a tal que a² − ${n} seja um quadrado perfeito b². Começa em a = ⌈√${n}⌉ = ${a}.` }]
  for (let i = 0; i < 200; i++, a++) {
    const b2 = a * a - N
    const b = isqrt(b2)
    if (b * b === b2) {
      steps.push({ row: [a, b2, `✓ = ${b}²`], note: `${a}² − ${n} = ${b2} = ${b}². Então ${n} = (${a} − ${b})(${a} + ${b}) = ${a - b} × ${a + b}.` })
      steps.push({ note: `${n} = ${a - b} × ${a + b}`, result: `${a - b} × ${a + b}` })
      return { columns: ['a', 'a² − n', 'quadrado?'], steps }
    }
    steps.push({ row: [a, b2, '—'], note: `${a}² − ${n} = ${b2}, que não é quadrado perfeito.` })
  }
  steps.push({ note: 'Muitas tentativas: os fatores estão longe de √n, caso em que o método de Fermat é lento.' })
  return { columns: ['a', 'a² − n', 'quadrado?'], steps }
}

function pollardRho({ n }) {
  const N = big(n)
  const f = v => (v * v + 1n) % N
  let x = 2n, y = 2n, d = 1n
  const steps = [{ note: `Sequência x → x² + 1 (mod ${n}), começando em 2. A "tartaruga" anda 1 passo, a "lebre" anda 2. Quando o mdc da diferença com n passa de 1, achamos um fator.` }]
  for (let i = 1; d === 1n && i < 200; i++) {
    x = f(x); y = f(f(y)); d = gcd(x - y, N)
    steps.push({ row: [i, x, y, d], note: d === 1n ? `mdc(|${x} − ${y}|, ${n}) = 1: continua.` : `mdc(|${x} − ${y}|, ${n}) = ${d}!` })
  }
  if (d === N || d === 1n) steps.push({ note: 'Falhou com esta função: na prática, tenta-se outra constante (x² + c).', result: 'falhou' })
  else steps.push({ note: `${n} = ${d} × ${N / d}`, result: `${d} × ${N / d}` })
  return { columns: ['passo', 'x (tartaruga)', 'y (lebre)', 'mdc(|x − y|, n)'], steps }
}

function pollardPm1({ n }) {
  const N = big(n)
  let a = 2n
  const steps = [{ note: `Calcula a = 2^(k!) mod ${n} para k = 2, 3, 4… Se p − 1 dividir k! para algum fator primo p, então p divide a − 1.` }]
  for (let k = 2n; k <= 60n; k++) {
    a = modPow(a, k, N)
    const d = gcd(a - 1n, N)
    steps.push({ row: [k, a, d], note: d === 1n ? `mdc(${a} − 1, ${n}) = 1: continua.` : d === N ? `mdc = ${n}: todos os fatores apareceram juntos.` : `mdc(${a} − 1, ${n}) = ${d}: fator encontrado!` })
    if (d !== 1n) {
      steps.push(d === N ? { note: 'Falhou (fatores "suaves" demais ao mesmo tempo); tenta-se outra base.', result: 'falhou' } : { note: `${n} = ${d} × ${N / d}`, result: `${d} × ${N / d}` })
      return { columns: ['k', '2^(k!) mod n', 'mdc(a − 1, n)'], steps }
    }
  }
  steps.push({ note: 'Nenhum fator até k = 60: os p − 1 dos fatores têm algum primo grande.', result: 'falhou' })
  return { columns: ['k', '2^(k!) mod n', 'mdc(a − 1, n)'], steps }
}

// Crivo quadrático simplificado: acha relações suaves, combina com eliminação em GF(2) e tira o mdc.
function quadraticSieve({ n }) {
  const N = big(n)
  const columns = ['x', 'x² − n', 'fatoração na base', 'suave?']
  const steps = []
  const primes = []
  const r0 = isqrt(N)
  if (r0 * r0 === N) return { columns, steps: [{ note: `${n} = ${r0}², um quadrado perfeito.`, result: `${r0} × ${r0}` }] }
  for (let p = 2; primes.length < 8 && p < 200; p++) {
    if ([...Array(p - 2)].some((_, i) => p % (i + 2) === 0)) continue
    if (N % big(p) === 0n && N !== big(p)) return { columns, steps: [{ note: `O primo ${p} divide ${n} diretamente.`, result: `${p} × ${N / big(p)}` }] }
    if (p === 2 || modPow(N % big(p), big((p - 1) / 2), big(p)) === 1n) primes.push(p)
  }
  steps.push({ note: `Base de fatores: primos p em que ${n} é resíduo quadrático — [${primes.join(', ')}]. Só eles podem dividir x² − n.` })
  const rels = []
  let x = isqrt(N)
  if (x * x < N) x++
  for (let tries = 0; rels.length < primes.length + 2 && tries < 400; tries++, x++) {
    let v = x * x - N
    const exps = primes.map(p => { let e = 0; while (v % big(p) === 0n) { v /= big(p); e++ } return e })
    const smooth = v === 1n
    const parts = exps.map((e, i) => (e ? `${primes[i]}${e > 1 ? '^' + e : ''}` : null)).filter(Boolean)
    if (!smooth) parts.push(String(v))
    const text = parts.join(' · ')
    if (smooth) rels.push({ x, exps })
    if (smooth || steps.length < 25) steps.push({ row: [x, x * x - N, text || '1', smooth ? '✓' : '—'], note: smooth ? `${x}² − ${n} se fatora só com a base: relação suave nº ${rels.length}.` : `${x}² − ${n} tem um fator fora da base (${v}).` })
  }
  // Eliminação de Gauss em GF(2): cada relação vira um vetor de paridades; procura combinações com expoentes todos pares.
  const rows = rels.map((r, i) => ({ bits: r.exps.reduce((acc, e, j) => acc | (BigInt(e & 1) << BigInt(j)), 0n), combo: 1n << BigInt(i) }))
  for (let col = 0; col < primes.length; col++) {
    const pivot = rows.findIndex(r => !r.used && (r.bits >> BigInt(col)) & 1n)
    if (pivot < 0) continue
    rows[pivot].used = true
    rows.forEach((r, i) => { if (i !== pivot && (r.bits >> BigInt(col)) & 1n) { r.bits ^= rows[pivot].bits; r.combo ^= rows[pivot].combo } })
  }
  for (const r of rows.filter(r => r.bits === 0n)) {
    const chosen = rels.filter((_, i) => (r.combo >> BigInt(i)) & 1n)
    const X = chosen.reduce((acc, c) => (acc * c.x) % N, 1n)
    const total = primes.map((_, j) => chosen.reduce((s, c) => s + c.exps[j], 0))
    const Y = total.reduce((acc, e, j) => (acc * modPow(big(primes[j]), big(e / 2), N)) % N, 1n)
    const d = gcd(X - Y, N)
    if (d !== 1n && d !== N) {
      steps.push({ note: `Combinando x = ${chosen.map(c => c.x).join(', ')}: o produto dos x² − n tem todos os expoentes pares, logo é um quadrado. X = ${X}, Y = ${Y} (mod ${n}), e X² ≡ Y².` })
      steps.push({ note: `mdc(X − Y, ${n}) = ${d}. Logo ${n} = ${d} × ${N / d}.`, result: `${d} × ${N / d}` })
      return { columns, steps }
    }
  }
  steps.push({ note: 'Nenhuma combinação útil com estas relações; seria preciso coletar mais.', result: 'falhou' })
  return { columns, steps }
}

// Lenstra (ECM): multiplica um ponto da curva y² = x³ + ax + 1 por 2, 3, 4…; uma inversão impossível revela um fator.
function ecm({ n }) {
  const N = big(n)
  const steps = []
  const columns = ['curva / k', 'ponto kP', 'observação']
  for (let a = 1n; a <= 6n; a++) {
    steps.push({ note: `Curva y² = x³ + ${a}x + 1 (mod ${n}) e ponto P = (0, 1). Calcula 2P, depois 3·(2P), 4·(3!P)…` })
    let P = [0n, 1n]
    let factor = null
    const add = (A, B) => {
      if (A === null) return B
      if (B === null) return A
      const [x1, y1] = A, [x2, y2] = B
      let num, den
      if (x1 === x2 && y1 === y2) { num = 3n * x1 * x1 + a; den = 2n * y1 } else { num = y2 - y1; den = x2 - x1 }
      den = mod(den, N)
      const g = gcd(den, N)
      if (g !== 1n) { factor = g; return null }
      // inverso modular pelo Euclides estendido
      let [r0, r1, s0, s1] = [den, N, 1n, 0n]
      while (r1) { const q = r0 / r1;[r0, r1] = [r1, r0 - q * r1];[s0, s1] = [s1, s0 - q * s1] }
      const l = mod(num * s0, N)
      const x3 = mod(l * l - x1 - x2, N)
      return [x3, mod(l * (x1 - x3) - y1, N)]
    }
    for (let k = 2n; k <= 30n && P; k++) {
      let R = null, Q = P, e = k
      while (e > 0n && factor === null) { if (e & 1n) R = add(R, Q); Q = add(Q, Q); e >>= 1n }
      if (factor !== null) {
        if (factor === N) { steps.push({ row: [`a=${a}, k=${k}`, '—', 'mdc = n: troca de curva'], note: 'A inversão falhou para todos os fatores ao mesmo tempo; tenta outra curva.' }); break }
        steps.push({ row: [`a=${a}, k=${k}`, '—', `inversão falhou: mdc = ${factor}`], note: `Para somar os pontos foi preciso inverter um número que divide ${factor} — que é um fator de ${n}!` })
        steps.push({ note: `${n} = ${factor} × ${N / factor}`, result: `${factor} × ${N / factor}` })
        return { columns, steps }
      }
      P = R
      if (steps.length < 40) steps.push({ row: [`a=${a}, k=${k}`, `(${P[0]}, ${P[1]})`, 'ok'], note: `${k}·P calculado normalmente: todas as inversões existiram.` })
    }
  }
  steps.push({ note: 'Nenhuma das curvas testadas revelou um fator; o ECM real usa muitas curvas e limites maiores.', result: 'falhou' })
  return { columns, steps }
}

function aks({ n }) {
  const N = Number(n)
  const columns = ['etapa', 'verificação', 'resultado']
  const steps = [{ note: `Teste AKS para ${N}: decide primalidade em tempo polinomial, sem nenhuma aleatoriedade.` }]
  const done = (isPrime, note) => { steps.push({ note, result: isPrime ? 'primo' : 'composto' }); return { columns, steps } }
  if (N < 2) return done(false, `${N} não é primo.`)
  for (let b = 2; 2 ** b <= N; b++) {
    const a = Math.round(N ** (1 / b))
    for (const c of [a - 1, a, a + 1]) {
      if (c > 1 && c ** b === N) { steps.push({ row: ['1', `${N} é potência perfeita?`, `sim: ${c}^${b}`] }); return done(false, `${N} = ${c}^${b}: composto.`) }
    }
  }
  steps.push({ row: ['1', `${N} é potência perfeita?`, 'não'], note: `${N} não é da forma aᵇ com b > 1.` })
  const L = Math.log2(N)
  let r = 2
  const order = (n0, rr) => { let k = 1, v = n0 % rr; while (v !== 1 && k <= rr) { v = (v * n0) % rr; k++ } return k }
  const g = (u, v) => { while (v) [u, v] = [v, u % v]; return u }
  while (g(r, N) !== 1 || order(N, r) <= L * L) r++
  steps.push({ row: ['2', `menor r com ordem de ${N} mod r > log²n ≈ ${(L * L).toFixed(1)}`, `r = ${r}`], note: `Escolhe r = ${r}.` })
  for (let a = 2; a <= Math.min(r, N - 1); a++) {
    const d = g(a, N)
    if (d > 1 && d < N) { steps.push({ row: ['3', `1 < mdc(${a}, ${N}) < ${N}?`, `sim: ${d}`] }); return done(false, `${d} divide ${N}: composto.`) }
  }
  steps.push({ row: ['3', `algum a ≤ ${r} com 1 < mdc(a, n) < n?`, 'não'], note: 'Nenhum fator pequeno.' })
  if (N <= r) { steps.push({ row: ['4', `n ≤ r?`, 'sim'] }); return done(true, `${N} ≤ r: primo.`) }
  steps.push({ row: ['4', `n ≤ r?`, 'não'] })
  const phi = [...Array(r).keys()].filter(k => k > 0 && g(k, r) === 1).length
  const limit = Math.floor(Math.sqrt(phi) * L)
  const mulmod = (p, q) => { const out = new Array(r).fill(0); for (let i = 0; i < r; i++) if (p[i]) for (let j = 0; j < r; j++) if (q[j]) out[(i + j) % r] = (out[(i + j) % r] + p[i] * q[j]) % N; return out }
  for (let a = 1; a <= limit; a++) {
    let res = new Array(r).fill(0); res[0] = 1
    let base = new Array(r).fill(0); base[0] = a % N; base[1 % r] = (base[1 % r] + 1) % N
    for (let e = N; e > 0; e = Math.floor(e / 2)) { if (e & 1) res = mulmod(res, base); base = mulmod(base, base) }
    const expected = new Array(r).fill(0); expected[N % r] = 1; expected[0] = (expected[0] + a) % N
    const ok = res.every((c, i) => c === expected[i])
    steps.push({ row: ['5', `(x + ${a})^${N} ≡ x^${N} + ${a}  (mod x^${r} − 1, ${N})?`, ok ? 'sim' : 'não'], note: ok ? `Identidade polinomial vale para a = ${a}.` : `Falhou para a = ${a}.` })
    if (!ok) return done(false, `A identidade falhou: ${N} é composto.`)
  }
  return done(true, `A identidade vale para todo a até ${limit}: ${N} é primo.`)
}

export const numberAlgorithms = {
  'euclid': { run: euclid, inputs: [['a', 1071, 1, 1e15], ['b', 462, 1, 1e15]] },
  'trial-division': { run: trialDivision, inputs: [['n', 360, 2, 1e12]] },
  'fast-exponentiation': { run: fastPow, inputs: [['base', 3, 0, 1e9], ['exp', 13, 0, 1e15], ['mod', 1000, 2, 1e15]] },
  'karatsuba': { run: karatsuba, inputs: [['x', 1234, 0, 1e15], ['y', 5678, 0, 1e15]] },
  'miller-rabin': { run: millerRabin, inputs: [['n', 561, 1, 1e15]] },
  'fermat-factorization': { run: fermatFactor, inputs: [['n', 5959, 3, 1e13]] },
  'pollard-rho': { run: pollardRho, inputs: [['n', 8051, 4, 1e13]] },
  'pollard-p-1': { run: pollardPm1, inputs: [['n', 299, 4, 1e13]] },
  'quadratic-sieve': { run: quadraticSieve, inputs: [['n', 15347, 15, 1e9]] },
  'lenstra-ecm': { run: ecm, inputs: [['n', 455839, 15, 1e9]] },
  'aks': { run: aks, inputs: [['n', 31, 2, 400]] },
}
