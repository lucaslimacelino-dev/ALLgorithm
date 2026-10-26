// Funções de hash implementadas do zero (MD4, MD5, SHA-1, SHA-256, RIPEMD-160).
// Com "record", cada passo da compressão é guardado para o visualizador:
// { block, step, round, regs: [palavras de 32 bits], right?: [...] (linha paralela do RIPEMD), changed }

export const utf8 = s => new TextEncoder().encode(s)
export const toHex = bytes => [...bytes].map(b => b.toString(16).padStart(2, '0')).join('')
export const hex32 = v => (v >>> 0).toString(16).padStart(8, '0')
const rotl = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0
const add = (...xs) => xs.reduce((a, b) => (a + b) >>> 0, 0)

// Preenchimento comum: 0x80, zeros e o tamanho em bits (64 bits) no fim de um bloco de 64 bytes.
export function pad(bytes, littleEndian) {
  const len = bytes.length
  const total = Math.ceil((len + 9) / 64) * 64
  const out = new Uint8Array(total)
  out.set(bytes)
  out[len] = 0x80
  const bits = BigInt(len) * 8n
  for (let i = 0; i < 8; i++) {
    const byte = Number((bits >> BigInt(8 * i)) & 0xffn)
    out[littleEndian ? total - 8 + i : total - 1 - i] = byte
  }
  return out
}

const wordsLE = (b, off) => Array.from({ length: 16 }, (_, i) => (b[off + 4 * i] | (b[off + 4 * i + 1] << 8) | (b[off + 4 * i + 2] << 16) | (b[off + 4 * i + 3] << 24)) >>> 0)
const wordsBE = (b, off) => Array.from({ length: 16 }, (_, i) => ((b[off + 4 * i] << 24) | (b[off + 4 * i + 1] << 16) | (b[off + 4 * i + 2] << 8) | b[off + 4 * i + 3]) >>> 0)
const outLE = hs => hs.map(h => [h & 255, (h >>> 8) & 255, (h >>> 16) & 255, h >>> 24].map(b => b.toString(16).padStart(2, '0')).join('')).join('')
const outBE = hs => hs.map(hex32).join('')

// ── MD5 ────────────────────────────────────────────────────
const MD5_S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21]
const MD5_K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0)

export function md5(bytes, record) {
  const m = pad(bytes, true)
  let h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]
  for (let off = 0; off < m.length; off += 64) {
    const X = wordsLE(m, off)
    let [A, B, C, D] = h
    for (let i = 0; i < 64; i++) {
      let F, g
      if (i < 16) { F = (B & C) | (~B & D); g = i }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16 }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16 }
      else { F = C ^ (B | ~D); g = (7 * i) % 16 }
      F = add(F, A, MD5_K[i], X[g])
      ;[A, D, C] = [D, C, B]
      B = add(B, rotl(F, MD5_S[(i >> 4) * 4 + (i % 4)]))
      record?.({ block: off / 64, step: i, round: i >> 4, regs: [A, B, C, D], changed: 1, word: g })
    }
    h = [add(h[0], A), add(h[1], B), add(h[2], C), add(h[3], D)]
  }
  return outLE(h)
}

// ── MD4 ────────────────────────────────────────────────────
const MD4_ORDER = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15],
  [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15],
]
const MD4_S = [[3, 7, 11, 19], [3, 5, 9, 13], [3, 9, 11, 15]]
const MD4_K = [0, 0x5a827999, 0x6ed9eba1]

export function md4(bytes, record) {
  const m = pad(bytes, true)
  let h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]
  const fns = [(x, y, z) => (x & y) | (~x & z), (x, y, z) => (x & y) | (x & z) | (y & z), (x, y, z) => x ^ y ^ z]
  for (let off = 0; off < m.length; off += 64) {
    const X = wordsLE(m, off)
    let [A, B, C, D] = h
    for (let r = 0; r < 3; r++) {
      for (let i = 0; i < 16; i++) {
        const t = rotl(add(A, fns[r](B, C, D), X[MD4_ORDER[r][i]], MD4_K[r]), MD4_S[r][i % 4])
        ;[A, B, C, D] = [D, t, B, C]
        record?.({ block: off / 64, step: r * 16 + i, round: r, regs: rotateBack([A, B, C, D], i), changed: (4 - (i % 4)) % 4, word: MD4_ORDER[r][i] })
      }
    }
    h = [add(h[0], A), add(h[1], B), add(h[2], C), add(h[3], D)]
  }
  return outLE(h)
}
// Mostra os registradores na ordem fixa a, b, c, d (o laço acima os gira a cada passo).
function rotateBack([A, B, C, D], i) {
  const k = (i + 1) % 4
  const regs = [A, B, C, D]
  return [0, 1, 2, 3].map(j => regs[(j + k) % 4])
}

// ── SHA-1 ──────────────────────────────────────────────────
export function sha1(bytes, record) {
  const m = pad(bytes, false)
  let h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]
  for (let off = 0; off < m.length; off += 64) {
    const w = wordsBE(m, off)
    for (let i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1)
    let [a, b, c, d, e] = h
    for (let i = 0; i < 80; i++) {
      let f, k
      if (i < 20) { f = (b & c) | (~b & d); k = 0x5a827999 }
      else if (i < 40) { f = b ^ c ^ d; k = 0x6ed9eba1 }
      else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc }
      else { f = b ^ c ^ d; k = 0xca62c1d6 }
      const t = add(rotl(a, 5), f >>> 0, e, k, w[i])
      ;[e, d, c, b, a] = [d, c, rotl(b, 30), a, t]
      record?.({ block: off / 64, step: i, round: Math.floor(i / 20), regs: [a, b, c, d, e], changed: 0, word: i })
    }
    h = h.map((x, i) => add(x, [a, b, c, d, e][i]))
  }
  return outBE(h)
}

// ── SHA-256 (usado no HMAC) ────────────────────────────────
const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]
const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0

export function sha256Bytes(bytes) {
  const m = pad(bytes, false)
  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]
  for (let off = 0; off < m.length; off += 64) {
    const w = wordsBE(m, off)
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)
      w[i] = add(w[i - 16], s0 >>> 0, w[i - 7], s1 >>> 0)
    }
    let [a, b, c, d, e, f, g, hh] = h
    for (let i = 0; i < 64; i++) {
      const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0
      const ch = ((e & f) ^ (~e & g)) >>> 0
      const t1 = add(hh, S1, ch, SHA256_K[i], w[i])
      const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0
      const t2 = add(S0, maj)
      ;[hh, g, f, e, d, c, b, a] = [g, f, e, add(d, t1), c, b, a, add(t1, t2)]
    }
    ;[a, b, c, d, e, f, g, hh].forEach((v, i) => { h[i] = add(h[i], v) })
  }
  const out = new Uint8Array(32)
  h.forEach((v, i) => { out[4 * i] = v >>> 24; out[4 * i + 1] = (v >>> 16) & 255; out[4 * i + 2] = (v >>> 8) & 255; out[4 * i + 3] = v & 255 })
  return out
}

// ── RIPEMD-160 ─────────────────────────────────────────────
const RMD_R = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
]
const RMD_RP = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
]
const RMD_S = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
]
const RMD_SP = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
]
const RMD_K = [0, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e]
const RMD_KP = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0]
const rmdF = (j, x, y, z) => (j < 16 ? x ^ y ^ z : j < 32 ? (x & y) | (~x & z) : j < 48 ? (x | ~y) ^ z : j < 64 ? (x & z) | (y & ~z) : x ^ (y | ~z)) >>> 0

export function ripemd160(bytes, record) {
  const m = pad(bytes, true)
  let h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]
  for (let off = 0; off < m.length; off += 64) {
    const X = wordsLE(m, off)
    let [A, B, C, D, E] = h, [Ap, Bp, Cp, Dp, Ep] = h
    for (let j = 0; j < 80; j++) {
      let T = add(rotl(add(A, rmdF(j, B, C, D), X[RMD_R[j]], RMD_K[j >> 4]), RMD_S[j]), E)
      ;[A, E, D, C, B] = [E, D, rotl(C, 10), B, T]
      T = add(rotl(add(Ap, rmdF(79 - j, Bp, Cp, Dp), X[RMD_RP[j]], RMD_KP[j >> 4]), RMD_SP[j]), Ep)
      ;[Ap, Ep, Dp, Cp, Bp] = [Ep, Dp, rotl(Cp, 10), Bp, T]
      record?.({ block: off / 64, step: j, round: j >> 4, regs: [A, B, C, D, E], right: [Ap, Bp, Cp, Dp, Ep], changed: 1, word: RMD_R[j] })
    }
    const T = add(h[1], C, Dp)
    h = [T, add(h[2], D, Ep), add(h[3], E, Ap), add(h[4], A, Bp), add(h[0], B, Cp)]
  }
  return outLE(h)
}

export const hashes = {
  'md4': { fn: md4, regs: ['A', 'B', 'C', 'D'], le: true, rounds: 3, perRound: 16 },
  'md5': { fn: md5, regs: ['A', 'B', 'C', 'D'], le: true, rounds: 4, perRound: 16 },
  'sha-1': { fn: sha1, regs: ['A', 'B', 'C', 'D', 'E'], le: false, rounds: 4, perRound: 20 },
  'ripemd-160': { fn: ripemd160, regs: ['A', 'B', 'C', 'D', 'E'], le: true, rounds: 5, perRound: 16, parallel: true },
}

const bitsDiff = (h1, h2) => {
  let n = 0
  for (let i = 0; i < h1.length; i++) { let x = parseInt(h1[i], 16) ^ parseInt(h2[i], 16); while (x) { n += x & 1; x >>= 1 } }
  return n
}

// Quadros do visualizador de hash: mensagem → bloco preenchido → passos → resumo e efeito avalanche.
export function hashFrames(id, text) {
  const spec = hashes[id]
  const bytes = utf8(text)
  const block = pad(bytes, spec.le).slice(0, 64)
  const steps = []
  const digest = spec.fn(bytes, s => { if (s.block === 0) steps.push(s) })
  const flipped = new Uint8Array(bytes.length ? bytes : [0])
  if (bytes.length) flipped[flipped.length - 1] ^= 1
  const other = spec.fn(bytes.length ? flipped : utf8('\u0001'))
  const frames = [
    { phase: 'pad', block, len: bytes.length, note: `A mensagem tem ${bytes.length} byte${bytes.length === 1 ? '' : 's'}. Ela é completada até 64 bytes: um byte 0x80, zeros e, nos últimos 8 bytes, o tamanho original em bits (${bytes.length * 8}), em ordem ${spec.le ? 'little-endian' : 'big-endian'}.` },
  ]
  for (const s of steps) {
    frames.push({ phase: 'step', block, len: bytes.length, step: s, note: `Rodada ${s.round + 1}, passo ${s.step + 1}: mistura a palavra M[${s.word}] da mensagem nos registradores com somas, rotações e uma função lógica${spec.parallel ? ' — nas duas linhas paralelas' : ''}.` })
  }
  frames.push({
    phase: 'done', block, len: bytes.length, step: steps.at(-1), digest, other, diff: bitsDiff(digest, other),
    note: `Os registradores finais, somados aos valores iniciais, formam o resumo de ${digest.length * 4} bits. Trocar um único bit da mensagem muda ${bitsDiff(digest, other)} bits do resumo — o efeito avalanche.`,
  })
  return frames
}
