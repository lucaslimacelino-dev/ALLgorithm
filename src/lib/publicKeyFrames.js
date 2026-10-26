// Criptografia de chave pública com números pequenos o bastante para acompanhar cada passo.
// Tabelas usam o formato de numberFrames: { columns, steps: [{ row?, note, result? }] }.

import { sha256Bytes, toHex, utf8 } from './hashFrames.js'

const fail = () => { throw new Error('entrada inválida') }
const B = v => BigInt(v)
const mod = (a, m) => ((a % m) + m) % m

export function modPow(base, exp, m) {
  let r = 1n, b = mod(base, m), e = exp
  while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n }
  return r
}

export function egcd(a, b) {
  let [r0, r1, s0, s1] = [a, b, 1n, 0n]
  while (r1) { const q = r0 / r1; [r0, r1] = [r1, r0 - q * r1]; [s0, s1] = [s1, s0 - q * s1] }
  return { g: r0, x: s0 } // a·x ≡ g (mod b)
}

export function modInv(a, m) {
  const { g, x } = egcd(mod(a, m), m)
  if (g !== 1n) return null
  return mod(x, m)
}

export function isPrime(n) {
  if (n < 2n) return false
  for (let d = 2n; d * d <= n; d++) if (n % d === 0n) return false
  return true
}

// Exponenciação rápida com o registro de cada bit (quadrado e multiplicação).
function powRows(base, exp, m, label) {
  const rows = []
  let r = 1n
  for (const bit of exp.toString(2)) {
    r = (r * r) % m
    if (bit === '1') r = (r * base) % m
    rows.push({ row: [label, `bit ${bit}`, r.toString()], note: `Bit ${bit} do expoente: eleva o resultado ao quadrado${bit === '1' ? ` e multiplica por ${base}` : ''} (mod ${m}) → ${r}.` })
  }
  return { rows, r }
}

// ── RSA ────────────────────────────────────────────────────
function rsa({ p, q, e, m }) {
  const [P, Q, E, M] = [p, q, e, m].map(B)
  if (!isPrime(P) || !isPrime(Q) || P === Q) fail()
  const n = P * Q, phi = (P - 1n) * (Q - 1n)
  const d = modInv(E, phi)
  if (!d || E < 2n || M < 0n || M >= n) fail()
  const steps = [
    { note: `Geração das chaves com os primos p = ${p} e q = ${q}. Num sistema real, cada primo tem mais de 300 dígitos.` },
    { row: ['n = p·q', n.toString(), 'módulo — público'], note: `n = ${p} × ${q} = ${n}. Fatorar n de volta em p e q é o problema difícil que protege o RSA.` },
    { row: ['φ(n) = (p−1)(q−1)', phi.toString(), 'secreto'], note: `φ(n) = ${p - 1} × ${q - 1} = ${phi}: quantos números até n são primos com n. Só quem conhece p e q consegue calculá-lo.` },
    { row: ['e', E.toString(), 'expoente público'], note: `O expoente público e = ${e} precisa ser primo com φ(n) (mdc = 1).` },
    { row: ['d = e⁻¹ mod φ(n)', d.toString(), 'expoente privado'], note: `Com o algoritmo de Euclides estendido: d = ${d}, porque ${e} × ${d} = ${E * d} ≡ 1 (mod ${phi}). Chave pública: (n, e) = (${n}, ${e}). Chave privada: d = ${d}.` },
  ]
  const enc = powRows(M, E, n, 'cifrar')
  steps.push({ note: `Cifrar a mensagem m = ${m}: c = m^e mod n, por exponenciação rápida (um passo por bit de e = ${E.toString(2)}₂).` }, ...enc.rows)
  steps.push({ row: ['c', enc.r.toString(), 'texto cifrado'], note: `Texto cifrado: c = ${m}^${e} mod ${n} = ${enc.r}.` })
  const dec = modPow(enc.r, d, n)
  steps.push({ row: ['m = c^d mod n', dec.toString(), 'decifrado'], note: `Decifrar: ${enc.r}^${d} mod ${n} = ${dec} — a mensagem original, graças ao teorema de Euler: m^(e·d) ≡ m (mod n).`, result: `c = ${enc.r} → m = ${dec}` })
  return { columns: ['etapa', 'valor', 'papel'], steps }
}

// ── ElGamal ────────────────────────────────────────────────
function elgamal({ p, g, x, k, m }) {
  const [P, G, X, K, M] = [p, g, x, k, m].map(B)
  if (!isPrime(P) || G < 2n || G >= P || X < 1n || X > P - 2n || K < 1n || K > P - 2n || M < 1n || M >= P) fail()
  const h = modPow(G, X, P), c1 = modPow(G, K, P), hk = modPow(h, K, P), c2 = (M * hk) % P
  const s = modPow(c1, X, P), sInv = modInv(s, P), back = (c2 * sInv) % P
  const steps = [
    { note: `Parâmetros públicos: o primo p = ${p} e o gerador g = ${g}. A segurança vem do logaritmo discreto: dado g^x mod p, achar x é difícil.` },
    { row: ['chave privada', 'x', X.toString()], note: `O destinatário escolhe a chave privada x = ${x}.` },
    { row: ['chave pública', 'h = g^x mod p', h.toString()], note: `Chave pública: h = ${g}^${x} mod ${p} = ${h}.` },
    { row: ['cifrar', 'k (aleatório, só desta mensagem)', K.toString()], note: `Quem envia escolhe um número aleatório k = ${k}, novo a cada mensagem.` },
    { row: ['cifrar', 'c₁ = g^k mod p', c1.toString()], note: `c₁ = ${g}^${k} mod ${p} = ${c1}: a "pista" que permite ao destinatário reconstruir a máscara.` },
    { row: ['cifrar', 'c₂ = m · h^k mod p', c2.toString()], note: `A máscara é h^k = ${hk}; c₂ = ${m} × ${hk} mod ${p} = ${c2}. O texto cifrado é o par (${c1}, ${c2}).` },
    { row: ['decifrar', 's = c₁^x mod p', s.toString()], note: `O destinatário calcula s = c₁^x = g^(k·x) = h^k = ${s} — a mesma máscara, sem conhecer k.` },
    { row: ['decifrar', 's⁻¹ mod p', sInv.toString()], note: `Inverso modular da máscara: ${s} × ${sInv} ≡ 1 (mod ${p}).` },
    { row: ['decifrar', 'm = c₂ · s⁻¹ mod p', back.toString()], note: `m = ${c2} × ${sInv} mod ${p} = ${back}. Como k é aleatório, a mesma mensagem cifrada duas vezes dá resultados diferentes.`, result: `(${c1}, ${c2}) → ${back}` },
  ]
  return { columns: ['fase', 'cálculo', 'valor'], steps }
}

// ── DSA ────────────────────────────────────────────────────
export const DSA_PARAMS = (() => {
  const p = 7879n, q = 101n // q divide p − 1 = 7878 = 2 · 3 · 13 · 101
  const g = modPow(3n, (p - 1n) / q, p)
  return { p, q, g }
})()
const hashModQ = (text, q) => BigInt('0x' + toHex(sha256Bytes(utf8(text)))) % q

function dsa({ mensagem, x, k }) {
  const { p, q, g } = DSA_PARAMS
  const X = B(x), K = B(k)
  if (X < 1n || X >= q || K < 1n || K >= q || !mensagem.length) fail()
  const y = modPow(g, X, p)
  const H = hashModQ(mensagem, q)
  const r = modPow(g, K, p) % q
  const kInv = modInv(K, q)
  const s = (kInv * (H + X * r)) % q
  if (r === 0n || s === 0n) fail()
  const verify = text => {
    const Hm = hashModQ(text, q), w = modInv(s, q), u1 = (Hm * w) % q, u2 = (r * w) % q
    return { Hm, w, u1, u2, v: ((modPow(g, u1, p) * modPow(y, u2, p)) % p) % q }
  }
  const ok = verify(mensagem), bad = verify(mensagem + '!')
  const steps = [
    { note: `Parâmetros públicos (pequenos, para acompanhar): p = ${p}, q = ${q} (q divide p − 1) e g = 3^((p−1)/q) mod p = ${g}, que tem ordem q.` },
    { row: ['chaves', 'x (privada) / y = g^x mod p (pública)', `${X} / ${y}`], note: `Chave privada x = ${x}; chave pública y = ${g}^${x} mod ${p} = ${y}.` },
    { row: ['assinar', 'H = SHA-256(m) mod q', H.toString()], note: `Resumo da mensagem "${mensagem}" com SHA-256, reduzido módulo q: H = ${H}.` },
    { row: ['assinar', 'r = (g^k mod p) mod q', r.toString()], note: `Com o número secreto k = ${k} (único por assinatura!): r = (${g}^${k} mod ${p}) mod ${q} = ${r}.` },
    { row: ['assinar', 's = k⁻¹ · (H + x·r) mod q', s.toString()], note: `k⁻¹ mod q = ${kInv}; s = ${kInv} × (${H} + ${x} × ${r}) mod ${q} = ${s}. A assinatura é o par (r, s) = (${r}, ${s}).` },
    { row: ['verificar', 'w = s⁻¹; u₁ = H·w; u₂ = r·w', `${ok.w}; ${ok.u1}; ${ok.u2}`], note: `Quem verifica usa só dados públicos: w = s⁻¹ mod q = ${ok.w}, u₁ = ${ok.u1}, u₂ = ${ok.u2}.` },
    { row: ['verificar', 'v = (g^u₁ · y^u₂ mod p) mod q', ok.v.toString()], note: `v = ${ok.v}. Como v = r = ${r}, a assinatura é válida.` },
    { row: ['falsificação', `"${mensagem}!" → H = ${bad.Hm}`, `v = ${bad.v}`], note: `Se a mensagem for alterada para "${mensagem}!", o resumo muda e v = ${bad.v} ${bad.v === r ? '(coincidência rara com q tão pequeno!)' : `≠ r: assinatura inválida`}. Com q de 256 bits, coincidências são impossíveis na prática.`, result: `(r, s) = (${r}, ${s})` },
  ]
  return { columns: ['fase', 'cálculo', 'valor'], steps }
}

// ── NTRU (exemplo clássico com N = 11, p = 3, q = 32) ──────
export const NTRU = {
  N: 11, p: 3, q: 32,
  f: [-1, 1, 1, 0, -1, 0, 1, 0, 0, 1, -1],
  g: [-1, 0, 1, 1, 0, 1, 0, 0, -1, 0, -1],
  fp: [1, 2, 0, 2, 2, 1, 0, 2, 1, 2, 0],
  fq: [5, 9, 6, 16, 4, 15, 16, 22, 20, 18, 30],
}
export const conv = (a, b, N) => {
  const c = Array(N).fill(0)
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) c[(i + j) % N] += a[i] * b[j]
  return c
}
export const center = (a, m) => a.map(v => { const r = mod(v, m); return r > m / 2 ? r - m : r })
const modPoly = (a, m) => a.map(v => mod(v, m))
const showPoly = a => a.join(' ')

function parseTernary(s, N) {
  const v = s.trim().split(/[\s,;]+/).map(Number)
  if (v.length !== N || v.some(x => ![-1, 0, 1].includes(x))) fail()
  return v
}

function ntru({ mensagem, r }) {
  const { N, p, q, f, g, fp, fq } = NTRU
  const m = parseTernary(mensagem, N), rr = parseTernary(r, N)
  const h = modPoly(conv(fq, g, N).map(v => p * v), q)
  const e = modPoly(conv(rr, h, N).map((v, i) => v + m[i]), q)
  const a = center(conv(f, e, N), q)
  const b = center(a, p)
  const c = center(conv(fp, b, N), p)
  const okInv = [modPoly(conv(f, fp, N), p), modPoly(conv(f, fq, N), q)].every(x => x[0] === 1 && x.slice(1).every(v => v === 0))
  const steps = [
    { note: `NTRU trabalha com polinômios de grau menor que N = ${N}, multiplicados "em círculo" (x¹¹ = 1). Coeficientes listados de x⁰ a x¹⁰. Parâmetros: p = ${p} (pequeno) e q = ${q} (grande).` },
    { row: ['f (privada)', showPoly(f)], note: 'Chave privada f: polinômio pequeno, com coeficientes −1, 0 e 1.' },
    { row: ['g (privada)', showPoly(g)], note: 'Outro polinômio pequeno g, usado só para gerar a chave pública.' },
    { row: ['f_p = f⁻¹ mod 3', showPoly(fp)], note: `Inversos de f módulo p e módulo q (calculados com o algoritmo de Euclides para polinômios). Conferência: f · f_p ≡ 1 e f · f_q ≡ 1 — ${okInv ? 'ok' : 'falhou'}.` },
    { row: ['f_q = f⁻¹ mod 32', showPoly(fq)], note: 'O inverso módulo 32 também faz parte da chave privada (só é usado para gerar h).' },
    { row: ['h = p · f_q · g mod q', showPoly(h)], note: 'Chave pública h: parece aleatória. Descobrir f e g a partir de h é achar um vetor curto em um reticulado — difícil até para computadores quânticos.' },
    { row: ['m (mensagem)', showPoly(m)], note: 'A mensagem é codificada como um polinômio com coeficientes −1, 0, 1.' },
    { row: ['r (aleatório)', showPoly(rr)], note: 'Quem cifra escolhe um polinômio pequeno aleatório r, novo a cada mensagem.' },
    { row: ['e = r · h + m mod q', showPoly(e)], note: 'Texto cifrado: e = r·h + m (mod 32). Só multiplicações e somas de inteiros pequenos — por isso o NTRU é muito rápido.' },
    { row: ['a = f · e mod q (centrado)', showPoly(a)], note: 'Para decifrar: a = f·e mod q, com coeficientes entre −16 e 16. Como f·e = p·r·g + f·m e tudo é pequeno, nenhum coeficiente "deu a volta" em q.' },
    { row: ['b = a mod p', showPoly(b)], note: 'Reduzindo módulo 3, o termo p·r·g some: sobra b = f·m (mod 3).' },
    { row: ['c = f_p · b mod p', showPoly(c)], note: `Multiplicando por f_p = f⁻¹: c = m. ${c.every((v, i) => v === m[i]) ? 'A mensagem foi recuperada.' : 'A decifragem falhou: com parâmetros tão pequenos, algum coeficiente passou de q/2 (falha de decifragem).'}`, result: showPoly(c) },
  ]
  return { columns: ['etapa', 'polinômio (x⁰ … x¹⁰)'], steps }
}

export const publicKeyTraces = {
  'rsa': { run: rsa, inputs: [['p', 61, 2, 100000], ['q', 53, 2, 100000], ['e', 17, 3, 1e9], ['m', 65, 0, 1e10]] },
  'elgamal': { run: elgamal, inputs: [['p', 467, 5, 1e6], ['g', 2, 2, 1e6], ['x', 127, 1, 1e6], ['k', 213, 1, 1e6], ['m', 100, 1, 1e6]] },
  'dsa': { run: dsa, inputs: [['mensagem', 'transferir R$ 100', 1, 60, 'text'], ['x', 75, 1, 100], ['k', 50, 1, 100]] },
  'ntru': { run: ntru, inputs: [['mensagem', '-1 0 0 1 -1 0 0 0 -1 1 1', 11, 60, 'text'], ['r', '-1 0 1 1 1 -1 0 -1 0 0 0', 11, 60, 'text']] },
}

// ── Diffie-Hellman (quadros para o visualizador) ───────────
// Quadros: { alice: [[rótulo, valor, secreto?]], bob: [...], canal: [...], novo: 'alice'|'bob'|'canal', note }
export function dhFrames(p, g, a, b) {
  const [P, G, A, Bs] = [p, g, a, b].map(B)
  if (!isPrime(P) || G < 2n || G >= P || A < 1n || A >= P - 1n || Bs < 1n || Bs >= P - 1n) fail()
  const pubA = modPow(G, A, P), pubB = modPow(G, Bs, P), sA = modPow(pubB, A, P), sB = modPow(pubA, Bs, P)
  const s = v => v.toString()
  const frames = []
  const alice = [], bob = [], canal = []
  const push = (who, item, note) => {
    ({ alice, bob, canal })[who].push(item)
    frames.push({ alice: [...alice], bob: [...bob], canal: [...canal], novo: who, note })
  }
  push('canal', ['p, g', `${p}, ${g}`], `Alice e Bob combinam em público um primo p = ${p} e um gerador g = ${g}. Eva, que escuta tudo, também os conhece.`)
  push('alice', ['a (segredo)', s(A), true], `Alice escolhe um número secreto a = ${a} e não conta a ninguém.`)
  push('alice', ['A = gᵃ mod p', s(pubA)], `Alice calcula A = ${g}^${a} mod ${p} = ${pubA}.`)
  push('bob', ['b (segredo)', s(Bs), true], `Bob escolhe seu número secreto b = ${b}.`)
  push('bob', ['B = gᵇ mod p', s(pubB)], `Bob calcula B = ${g}^${b} mod ${p} = ${pubB}.`)
  push('canal', ['A', s(pubA)], `Alice envia A = ${pubA} pelo canal público. Eva vê o valor, mas não consegue tirar a dele.`)
  push('canal', ['B', s(pubB)], `Bob envia B = ${pubB}. Agora Eva conhece p, g, A e B — e nenhum segredo.`)
  push('alice', ['s = Bᵃ mod p', s(sA), true], `Alice calcula ${pubB}^${a} mod ${p} = ${sA}, que é g^(b·a).`)
  push('bob', ['s = Aᵇ mod p', s(sB), true], `Bob calcula ${pubA}^${b} mod ${p} = ${sB}, que é g^(a·b) — o mesmo número!`)
  frames.push({ alice, bob, canal, novo: null, done: true, shared: s(sA), note: `Segredo compartilhado: ${sA}, sem que ele tenha passado pelo canal. Para descobri-lo, Eva precisaria do logaritmo discreto de A ou B — fácil com p = ${p}, inviável com p de 2048 bits.` })
  return frames
}

// ── Curvas elípticas (quadros para o visualizador) ─────────
export const CURVE = { p: 97, a: 2, b: 3 }
const O = null // ponto no infinito

export function ecAdd(P1, P2, { p, a } = CURVE) {
  if (P1 === O) return P2
  if (P2 === O) return P1
  const [x1, y1] = P1, [x2, y2] = P2
  if (x1 === x2 && mod(y1 + y2, p) === 0) return O
  const inv = v => Number(modInv(B(mod(v, p)), B(p)))
  const l = x1 === x2 && y1 === y2 ? mod((3 * x1 * x1 + a) * inv(2 * y1), p) : mod((y2 - y1) * inv(x2 - x1), p)
  const x3 = mod(l * l - x1 - x2, p)
  return [x3, mod(l * (x1 - x3) - y1, p)]
}

export function curvePoints({ p, a, b } = CURVE) {
  const pts = []
  for (let x = 0; x < p; x++) for (let y = 0; y < p; y++) if (mod(y * y - (x * x * x + a * x + b), p) === 0) pts.push([x, y])
  return pts
}

const orderOf = P => { let R = P, n = 1; while (R !== O) { R = ecAdd(R, P); n++ } return n }
export const GENERATOR = (() => {
  let best = null, bestOrder = 0
  for (const P of curvePoints()) { const n = orderOf(P); if (n > bestOrder) { best = P; bestOrder = n } }
  return { G: best, n: bestOrder }
})()

const fmtPt = P => (P === O ? 'O (infinito)' : `(${P[0]}, ${P[1]})`)

// Multiplicação escalar k·G por "dobra e soma". Quadros: { R, path: [pontos], op, bits, i, note }
export function ecFrames(k) {
  const { G, n } = GENERATOR
  if (!Number.isInteger(k) || k < 1 || k >= n) fail()
  const bits = k.toString(2)
  let R = O
  const path = []
  const frames = [{ R, path: [], op: 'start', bits, i: -1, note: `Curva y² = x³ + ${CURVE.a}x + ${CURVE.b} sobre os inteiros módulo ${CURVE.p}: ${curvePoints().length} pontos (mais o ponto no infinito). O ponto base G = ${fmtPt(G)} gera ${n} pontos. Calcular ${k}·G = ${bits}₂ · G por dobra e soma.` }]
  for (let i = 0; i < bits.length; i++) {
    if (R !== O) {
      R = ecAdd(R, R)
      path.push(R)
      frames.push({ R, path: [...path], op: 'double', bits, i, note: `Bit ${i + 1} (${bits[i]}): dobra o ponto — tangente à curva, reflexão — R = 2R = ${fmtPt(R)}.` })
    }
    if (bits[i] === '1') {
      R = ecAdd(R, G)
      path.push(R)
      frames.push({ R, path: [...path], op: 'add', bits, i, note: `Bit ${bits[i]}: soma G — reta pelos dois pontos, terceiro ponto refletido — R = R + G = ${fmtPt(R)}.` })
    }
  }
  frames.push({ R, path, op: 'done', bits, i: bits.length, done: true, note: `${k}·G = ${fmtPt(R)}, com só ${path.length} operações em vez de ${k - 1} somas. O caminho inverso — achar k a partir de k·G — é o logaritmo discreto em curvas elípticas, que protege o ECDH e o ECDSA.` })
  return frames
}
