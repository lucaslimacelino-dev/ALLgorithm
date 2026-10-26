// Cifras implementadas do zero, com registros passo a passo para os visualizadores.
// Tabelas usam o formato de numberFrames: { columns, steps: [{ row?, note, result? }] }.

import { sha256Bytes, toHex, utf8 } from './hashFrames.js'

const fail = () => { throw new Error('entrada inválida') }
const hexToBytes = (hex, len) => {
  const h = hex.replace(/\s+/g, '').toLowerCase()
  if (!/^[0-9a-f]*$/.test(h) || h.length % 2 || (len && h.length !== len * 2)) fail()
  return Uint8Array.from(h.match(/../g) ?? [], b => parseInt(b, 16))
}
const hex = (v, n) => v.toString(16).padStart(n, '0')

// ── César e Vigenère (visualizador de alfabetos) ───────────
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()

// Quadros: { plain, key: [desloc. por letra], out, i, shift, note }
export function classicFrames(kind, text, keyInput) {
  const plain = [...strip(text)]
  let shifts
  if (kind === 'caesar') {
    const k = Number(keyInput)
    if (!Number.isInteger(k) || k < 0 || k > 25) fail()
    shifts = () => k
  } else {
    const key = strip(keyInput).replace(/[^A-Z]/g, '')
    if (!key) fail()
    shifts = n => A.indexOf(key[n % key.length])
  }
  const out = [], keyRow = []
  let n = 0
  const frames = [{ plain, keyRow: [], out: [], i: -1, shift: shifts(0), note: kind === 'caesar' ? `Cifra de César com deslocamento ${shifts(0)}: cada letra é trocada pela que está ${shifts(0)} posições adiante no alfabeto.` : `Cifra de Vigenère com a chave "${strip(keyInput).replace(/[^A-Z]/g, '')}": cada letra usa um deslocamento diferente, dado pela letra da chave (A = 0, B = 1, …), que se repete.` }]
  plain.forEach((c, i) => {
    const p = A.indexOf(c)
    if (p < 0) {
      out.push(c); keyRow.push(null)
      frames.push({ plain, keyRow: [...keyRow], out: [...out], i, shift: null, note: `"${c}" não é letra: fica como está${kind === 'vigenere' ? ' e não consome letra da chave' : ''}.` })
      return
    }
    const s = shifts(n++)
    const e = A[(p + s) % 26]
    out.push(e); keyRow.push(s)
    frames.push({ plain, keyRow: [...keyRow], out: [...out], i, shift: s, note: `${c} (${p}) + ${s}${kind === 'vigenere' ? ` (letra ${A[s]} da chave)` : ''} = ${(p + s) % 26} → ${e}.` })
  })
  frames.push({ plain, keyRow, out, i: -1, shift: null, done: true, note: `Texto cifrado: ${out.join('')}. Para decifrar, basta deslocar cada letra no sentido contrário${kind === 'caesar' ? ' — e, como só existem 25 chaves, testar todas leva segundos' : ' com a mesma chave'}.` })
  return frames
}

// ── One-time pad ───────────────────────────────────────────
function otp({ mensagem, chave }) {
  const m = utf8(mensagem)
  if (!m.length) fail()
  const k = hexToBytes(chave)
  const bits = b => b.toString(2).padStart(8, '0')
  const steps = [{ note: `Cada byte da mensagem é combinado com um byte da chave por OU exclusivo (XOR). A chave precisa ser aleatória, tão longa quanto a mensagem e usada uma única vez.` }]
  if (k.length < m.length) steps.push({ note: `Atenção: a chave tem ${k.length} bytes e a mensagem, ${m.length}. Ela será repetida — o que destrói a segurança do one-time pad.` })
  const out = []
  m.forEach((b, i) => {
    const kb = k[i % k.length]
    const c = b ^ kb
    out.push(c)
    steps.push({ row: [i, String.fromCharCode(b).replace(/[^\x20-\x7e]/, '·'), bits(b), bits(kb), bits(c), hex(c, 2)], note: `${bits(b)} XOR ${bits(kb)} = ${bits(c)}: onde os bits são iguais sai 0; onde são diferentes, 1.` })
  })
  steps.push({ note: `Cifrado: ${toHex(out)}. Aplicar o XOR com a mesma chave de novo devolve a mensagem, porque (m ⊕ k) ⊕ k = m.`, result: toHex(out) })
  return { columns: ['i', 'char', 'mensagem', 'chave', 'XOR', 'hex'], steps }
}

// ── RC4 ────────────────────────────────────────────────────
function rc4({ chave, mensagem }) {
  const key = utf8(chave), m = utf8(mensagem)
  if (!key.length || key.length > 256 || !m.length) fail()
  const S = Array.from({ length: 256 }, (_, i) => i)
  let j = 0
  for (let i = 0; i < 256; i++) { j = (j + S[i] + key[i % key.length]) & 255; [S[i], S[j]] = [S[j], S[i]] }
  const steps = [{ note: `Agendamento da chave (KSA): S começa como 0, 1, …, 255 e é embaralhado 256 vezes usando os bytes de "${chave}". Primeiros valores de S: ${S.slice(0, 8).join(', ')}…` }]
  let i = 0; j = 0
  const out = []
  m.forEach((b, n) => {
    i = (i + 1) & 255
    j = (j + S[i]) & 255
    ;[S[i], S[j]] = [S[j], S[i]]
    const k = S[(S[i] + S[j]) & 255]
    out.push(b ^ k)
    steps.push({ row: [n, i, j, `S[${(S[i] + S[j]) & 255}] = ${k}`, hex(b, 2), hex(b ^ k, 2)], note: `i = ${i}, j = j + S[i] = ${j}; troca S[i] e S[j]; o byte do fluxo é S[S[i] + S[j]] = ${k} (${hex(k, 2)}). ${hex(b, 2)} XOR ${hex(k, 2)} = ${hex(b ^ k, 2)}.` })
  })
  steps.push({ note: `Cifrado: ${toHex(out).toUpperCase()}. O RC4 gera um fluxo de bytes pseudoaleatórios e faz XOR com a mensagem — decifrar é repetir o mesmo processo.`, result: toHex(out).toUpperCase() })
  return { columns: ['n', 'i', 'j', 'byte do fluxo', 'msg', 'cifrado'], steps }
}

// ── HMAC-SHA-256 ───────────────────────────────────────────
function hmac({ chave, mensagem }) {
  let key = utf8(chave)
  const m = utf8(mensagem)
  if (!key.length) fail()
  const steps = [{ note: 'HMAC(K, m) = H((K₀ ⊕ opad) ‖ H((K₀ ⊕ ipad) ‖ m)), com H = SHA-256 (blocos de 64 bytes), ipad = 0x36 repetido e opad = 0x5c repetido.' }]
  const short = h => (h.length > 32 ? h.slice(0, 32) + '…' : h)
  if (key.length > 64) { key = sha256Bytes(key); steps.push({ row: ['chave longa', 'SHA-256(K)', short(toHex(key))], note: 'A chave tem mais de 64 bytes: é substituída pelo seu hash.' }) }
  const k0 = new Uint8Array(64); k0.set(key)
  steps.push({ row: ['K₀', 'chave + zeros até 64 bytes', short(toHex(k0))], note: `A chave "${chave}" (${key.length} bytes) é completada com zeros até 64 bytes.` })
  const ipad = k0.map(b => b ^ 0x36), opad = k0.map(b => b ^ 0x5c)
  steps.push({ row: ['K₀ ⊕ ipad', 'XOR com 0x36', short(toHex(ipad))], note: 'Chave interna: cada byte de K₀ com XOR 0x36.' })
  const inner = sha256Bytes(new Uint8Array([...ipad, ...m]))
  steps.push({ row: ['interno', 'SHA-256(K₀ ⊕ ipad ‖ m)', short(toHex(inner))], note: `Hash interno: SHA-256 da chave interna seguida da mensagem "${mensagem}".` })
  steps.push({ row: ['K₀ ⊕ opad', 'XOR com 0x5c', short(toHex(opad))], note: 'Chave externa: cada byte de K₀ com XOR 0x5c.' })
  const outer = toHex(sha256Bytes(new Uint8Array([...opad, ...inner])))
  steps.push({ row: ['HMAC', 'SHA-256(K₀ ⊕ opad ‖ interno)', short(outer)], note: 'Hash externo: SHA-256 da chave externa seguida do hash interno. Esse é o código de autenticação.' })
  steps.push({ note: `HMAC-SHA-256 = ${outer}. Sem a chave, não dá para produzir esse código — nem para outra mensagem, mesmo conhecendo esta.`, result: outer.slice(0, 16) + '…' })
  return { columns: ['etapa', 'operação', 'valor (hex)'], steps }
}

// ── DES ────────────────────────────────────────────────────
const IP = [58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7]
const FP = IP.map((_, i) => IP.indexOf(i + 1) + 1)
const E = Array.from({ length: 48 }, (_, n) => ((4 * Math.floor(n / 6) + (n % 6) - 1 + 32) % 32) + 1)
const P = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25]
const PC1 = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4]
const PC2 = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32]
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]
const SBOX = [
  [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7, 0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8, 4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0, 15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
  [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10, 3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5, 0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15, 13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
  [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8, 13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1, 13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7, 1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
  [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15, 13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9, 10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4, 3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
  [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9, 14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6, 4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14, 11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
  [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11, 10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8, 9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6, 4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
  [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1, 13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6, 1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2, 6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
  [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7, 1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2, 7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8, 2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
]
const permute = (x, table, n) => table.reduce((out, p) => (out << 1n) | ((x >> BigInt(n - p)) & 1n), 0n)

export function desEncrypt(block, key, record) {
  const k56 = permute(key, PC1, 64)
  let C = k56 >> 28n, D = k56 & 0xfffffffn
  const rot28 = (v, s) => ((v << BigInt(s)) | (v >> BigInt(28 - s))) & 0xfffffffn
  const subkeys = SHIFTS.map(s => { C = rot28(C, s); D = rot28(D, s); return permute((C << 28n) | D, PC2, 56) })
  const ip = permute(block, IP, 64)
  let L = ip >> 32n, R = ip & 0xffffffffn
  record?.({ round: 0, L, R })
  subkeys.forEach((k, r) => {
    const x = permute(R, E, 32) ^ k
    let s = 0n
    for (let i = 0; i < 8; i++) {
      const six = Number((x >> BigInt(42 - 6 * i)) & 63n)
      const row = ((six & 32) >> 4) | (six & 1), col = (six >> 1) & 15
      s = (s << 4n) | BigInt(SBOX[i][row * 16 + col])
    }
    ;[L, R] = [R, L ^ permute(s, P, 32)]
    record?.({ round: r + 1, L, R, k })
  })
  return permute((R << 32n) | L, FP, 64)
}

function desTrace({ texto, chave }) {
  const pt = BigInt('0x' + toHex(hexToBytes(texto, 8))), key = BigInt('0x' + toHex(hexToBytes(chave, 8)))
  const steps = [{ note: 'Bloco de 64 bits, chave de 64 bits (56 efetivos). A permutação inicial embaralha os bits e divide o bloco em duas metades, L e R; seguem 16 rodadas de uma rede de Feistel.' }]
  const ct = desEncrypt(pt, key, s => {
    if (!s.round) { steps.push({ row: ['IP', '—', hex(s.L, 8), hex(s.R, 8)], note: `Depois da permutação inicial: L₀ = ${hex(s.L, 8)}, R₀ = ${hex(s.R, 8)}.` }); return }
    steps.push({ row: [s.round, hex(s.k, 12), hex(s.L, 8), hex(s.R, 8)], note: `Rodada ${s.round}: a subchave de 48 bits K${s.round} = ${hex(s.k, 12)}. L${s.round} = R${s.round - 1}; R${s.round} = L${s.round - 1} ⊕ f(R${s.round - 1}, K${s.round}), onde f expande R para 48 bits, faz XOR com a subchave, passa pelas 8 S-boxes e permuta.` })
  })
  steps.push({ note: `Troca final das metades e permutação inversa: o bloco cifrado é ${hex(ct, 16).toUpperCase()}. Decifrar é o mesmo processo com as subchaves em ordem inversa.`, result: hex(ct, 16).toUpperCase() })
  return { columns: ['rodada', 'subchave', 'L', 'R'], steps }
}

// ── AES-128 ────────────────────────────────────────────────
const xtime = b => ((b << 1) ^ (b & 0x80 ? 0x1b : 0)) & 0xff
const gmul = (a, b) => { let p = 0; while (b) { if (b & 1) p ^= a; a = xtime(a); b >>= 1 } return p }
const rotl8 = (x, s) => ((x << s) | (x >> (8 - s))) & 0xff
export const AES_SBOX = Array.from({ length: 256 }, (_, a) => {
  let inv = 0
  if (a) for (let b = 1; b < 256; b++) if (gmul(a, b) === 1) { inv = b; break }
  return inv ^ rotl8(inv, 1) ^ rotl8(inv, 2) ^ rotl8(inv, 3) ^ rotl8(inv, 4) ^ 0x63
})

export function aesExpandKey(key) {
  const w = []
  for (let i = 0; i < 4; i++) w.push([...key.slice(4 * i, 4 * i + 4)])
  let rcon = 1
  for (let i = 4; i < 44; i++) {
    let t = [...w[i - 1]]
    if (i % 4 === 0) {
      t = [t[1], t[2], t[3], t[0]].map(b => AES_SBOX[b])
      t[0] ^= rcon
      rcon = xtime(rcon)
    }
    w.push(w[i - 4].map((b, j) => b ^ t[j]))
  }
  return Array.from({ length: 11 }, (_, r) => w.slice(4 * r, 4 * r + 4).flat())
}

// Estado em ordem de colunas: s[r + 4c]. Quadros: { state, roundKey?, op, round, changed, note }
export function aesFrames(ptHex, keyHex) {
  let s = [...hexToBytes(ptHex, 16)]
  const keys = aesExpandKey(hexToBytes(keyHex, 16))
  const frames = [{ state: [...s], roundKey: keys[0], op: 'input', round: 0, note: 'O bloco de 16 bytes vira uma matriz 4 × 4 (preenchida coluna por coluna). A chave de 128 bits é expandida em 11 chaves de rodada.' }]
  const addKey = r => { s = s.map((b, i) => b ^ keys[r][i]); frames.push({ state: [...s], roundKey: keys[r], op: 'AddRoundKey', round: r, changed: 'all', note: `AddRoundKey: XOR de cada byte com a chave da rodada ${r}.` }) }
  const subBytes = r => { s = s.map(b => AES_SBOX[b]); frames.push({ state: [...s], op: 'SubBytes', round: r, changed: 'all', note: 'SubBytes: cada byte é trocado pelo valor da S-box (inverso no corpo GF(2⁸) seguido de uma transformação afim) — a parte não linear da cifra.' }) }
  const shiftRows = r => { s = s.map((_, i) => { const row = i % 4, col = Math.floor(i / 4); return s[row + 4 * ((col + row) % 4)] }); frames.push({ state: [...s], op: 'ShiftRows', round: r, changed: 'rows', note: 'ShiftRows: a linha 0 fica; a linha 1 gira 1 posição para a esquerda, a linha 2 gira 2 e a linha 3 gira 3. Assim os bytes de uma coluna se espalham por colunas diferentes.' }) }
  const mixColumns = r => {
    const t = [...s]
    for (let c = 0; c < 4; c++) {
      const [a0, a1, a2, a3] = t.slice(4 * c, 4 * c + 4)
      s[4 * c] = gmul(a0, 2) ^ gmul(a1, 3) ^ a2 ^ a3
      s[4 * c + 1] = a0 ^ gmul(a1, 2) ^ gmul(a2, 3) ^ a3
      s[4 * c + 2] = a0 ^ a1 ^ gmul(a2, 2) ^ gmul(a3, 3)
      s[4 * c + 3] = gmul(a0, 3) ^ a1 ^ a2 ^ gmul(a3, 2)
    }
    frames.push({ state: [...s], op: 'MixColumns', round: r, changed: 'cols', note: 'MixColumns: cada coluna é multiplicada por uma matriz fixa em GF(2⁸); cada byte de saída depende dos 4 bytes da coluna.' })
  }
  addKey(0)
  for (let r = 1; r <= 10; r++) {
    subBytes(r); shiftRows(r)
    if (r < 10) mixColumns(r)
    addKey(r)
  }
  const out = toHex(s)
  frames.push({ state: [...s], op: 'output', round: 10, note: `Depois de 10 rodadas (a última sem MixColumns), o bloco cifrado é ${out}. Uma mudança de um bit na entrada já altera cerca de metade dos bits da saída.`, out })
  return frames
}

// ── Blowfish ───────────────────────────────────────────────
// P-array e S-boxes começam com os dígitos hexadecimais de π, calculados pela fórmula de Machin.
let piWordsCache = null
export function piWords(count = 18 + 1024) {
  if (piWordsCache) return piWordsCache
  const bits = BigInt(32 * count + 64)
  const one = 1n << bits
  const arctanInv = x => {
    let term = one / x, sum = term, n = 3n, sign = -1n
    const x2 = x * x
    while (term) { term /= x2; sum += sign * (term / n); sign = -sign; n += 2n }
    return sum
  }
  const pi = 4n * (4n * arctanInv(5n) - arctanInv(239n))
  const frac = pi - (3n << bits)
  piWordsCache = Array.from({ length: count }, (_, k) => Number((frac >> (bits - 32n * BigInt(k + 1))) & 0xffffffffn))
  return piWordsCache
}

export function blowfishSetup(key) {
  const words = piWords()
  const P = words.slice(0, 18)
  const S = [0, 1, 2, 3].map(i => words.slice(18 + 256 * i, 18 + 256 * (i + 1)))
  let k = 0
  for (let i = 0; i < 18; i++) {
    let d = 0
    for (let j = 0; j < 4; j++) { d = ((d << 8) | key[k]) >>> 0; k = (k + 1) % key.length }
    P[i] = (P[i] ^ d) >>> 0
  }
  const ctx = { P, S }
  let L = 0, R = 0
  for (let i = 0; i < 18; i += 2) { [L, R] = blowfishEncrypt(ctx, L, R); P[i] = L; P[i + 1] = R }
  for (let b = 0; b < 4; b++) for (let i = 0; i < 256; i += 2) { [L, R] = blowfishEncrypt(ctx, L, R); S[b][i] = L; S[b][i + 1] = R }
  return ctx
}

export function blowfishEncrypt({ P, S }, L, R, record) {
  const F = x => ((((S[0][x >>> 24] + S[1][(x >>> 16) & 255]) >>> 0) ^ S[2][(x >>> 8) & 255]) + S[3][x & 255]) >>> 0
  for (let i = 0; i < 16; i++) {
    L = (L ^ P[i]) >>> 0
    R = (R ^ F(L)) >>> 0
    ;[L, R] = [R, L]
    record?.({ round: i + 1, L, R, p: P[i] })
  }
  ;[L, R] = [R, L]
  R = (R ^ P[16]) >>> 0
  L = (L ^ P[17]) >>> 0
  return [L, R]
}

function blowfishTrace({ chave, texto }) {
  const key = hexToBytes(chave)
  if (key.length < 4 || key.length > 56) fail()
  const block = hexToBytes(texto, 8)
  const ctx = blowfishSetup(key)
  const steps = [
    { note: `O P-array (18 palavras) e as 4 S-boxes (4 × 256 palavras) começam com os dígitos hexadecimais de π: P₁ = 243f6a88, P₂ = 85a308d3… A chave (${key.length} bytes) é misturada por XOR no P-array.` },
    { note: 'Expansão da chave: o próprio Blowfish cifra repetidamente um bloco de zeros e vai substituindo P e as S-boxes pelos resultados — 521 cifragens. Por isso trocar de chave é lento (o que dificulta ataques de força bruta).' },
  ]
  const L0 = ((block[0] << 24) | (block[1] << 16) | (block[2] << 8) | block[3]) >>> 0
  const R0 = ((block[4] << 24) | (block[5] << 16) | (block[6] << 8) | block[7]) >>> 0
  const [L, R] = blowfishEncrypt(ctx, L0, R0, s => {
    steps.push({ row: [s.round, hex(s.p, 8), hex(s.L, 8), hex(s.R, 8)], note: `Rodada ${s.round}: L ⊕= P${s.round}; R ⊕= F(L), onde F soma e combina 4 consultas às S-boxes (uma por byte de L); depois troca as metades.` })
  })
  const out = hex(L, 8) + hex(R, 8)
  steps.push({ note: `Desfaz a última troca e aplica P₁₇ e P₁₈: bloco cifrado = ${out.toUpperCase()}.`, result: out.toUpperCase() })
  return { columns: ['rodada', 'P[i]', 'L', 'R'], steps }
}

// ── IDEA ───────────────────────────────────────────────────
const mul = (a, b) => { const x = a || 65536, y = b || 65536; return Number((BigInt(x) * BigInt(y)) % 65537n) & 0xffff }
const addw = (a, b) => (a + b) & 0xffff

export function ideaSubkeys(key) {
  let k = BigInt('0x' + toHex(key))
  const mask = (1n << 128n) - 1n, Z = []
  while (Z.length < 52) {
    for (let i = 0; i < 8 && Z.length < 52; i++) Z.push(Number((k >> BigInt(112 - 16 * i)) & 0xffffn))
    k = ((k << 25n) | (k >> 103n)) & mask
  }
  return Z
}

export function ideaEncrypt(block, Z, record) {
  let [x1, x2, x3, x4] = [0, 2, 4, 6].map(i => (block[i] << 8) | block[i + 1])
  for (let r = 0; r < 8; r++) {
    const k = Z.slice(6 * r, 6 * r + 6)
    const a = mul(x1, k[0]), b = addw(x2, k[1]), c = addw(x3, k[2]), d = mul(x4, k[3])
    let e = a ^ c, f = b ^ d
    e = mul(e, k[4]); f = addw(f, e); f = mul(f, k[5]); e = addw(e, f)
    ;[x1, x2, x3, x4] = [a ^ f, c ^ f, b ^ e, d ^ e]
    record?.({ round: r + 1, x: [x1, x2, x3, x4], k })
  }
  return [mul(x1, Z[48]), addw(x3, Z[49]), addw(x2, Z[50]), mul(x4, Z[51])]
}

function ideaTrace({ chave, texto }) {
  const Z = ideaSubkeys(hexToBytes(chave, 16))
  const block = hexToBytes(texto, 8)
  const w = v => hex(v, 4)
  const steps = [{ note: 'Bloco de 64 bits em 4 palavras de 16 bits; a chave de 128 bits gera 52 subchaves de 16 bits (blocos de 16 bits da chave, girando-a 25 bits a cada 8 subchaves). IDEA mistura três operações de grupos diferentes: XOR, soma mod 2¹⁶ e multiplicação mod 2¹⁶ + 1.' }]
  const out = ideaEncrypt(block, Z, s => {
    steps.push({ row: [s.round, s.k.map(w).join(' '), s.x.map(w).join(' ')], note: `Rodada ${s.round}: multiplica X1 e X4 e soma X2 e X3 com 4 subchaves; a estrutura MA (multiplica–soma) usa as outras 2 e o resultado é misturado por XOR. As palavras do meio trocam de lugar.` })
  })
  const result = out.map(w).join('').toUpperCase()
  steps.push({ note: `Meia rodada final com as subchaves 49 a 52 (desfazendo a troca do meio): bloco cifrado = ${result}.`, result })
  return { columns: ['rodada', 'subchaves', 'X1 X2 X3 X4'], steps }
}

export const cryptoTraces = {
  'one-time-pad': { run: otp, inputs: [['mensagem', 'ATAQUE', 1, 40, 'text'], ['chave', '3c 91 7e 0f d2 55', 2, 200, 'text']] },
  'rc4': { run: rc4, inputs: [['chave', 'Key', 1, 64, 'text'], ['mensagem', 'Plaintext', 1, 40, 'text']] },
  'hmac': { run: hmac, inputs: [['chave', 'key', 1, 100, 'text'], ['mensagem', 'The quick brown fox jumps over the lazy dog', 1, 100, 'text']] },
  'des': { run: desTrace, inputs: [['texto', '0123456789ABCDEF', 16, 16, 'text'], ['chave', '133457799BBCDFF1', 16, 16, 'text']] },
  'blowfish': { run: blowfishTrace, inputs: [['chave', '0000000000000000', 8, 112, 'text'], ['texto', '0000000000000000', 16, 16, 'text']] },
  'idea': { run: ideaTrace, inputs: [['chave', '00010002000300040005000600070008', 32, 32, 'text'], ['texto', '0000000100020003', 16, 16, 'text']] },
}
