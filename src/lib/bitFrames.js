// Bits e detecção de erros: paridade, XOR swap, conversão CHS, CRC e Hamming(7,4).
// Tabelas no formato de numberFrames: { columns, steps: [{ row?, note, result? }] }.

const fail = () => { throw new Error('entrada inválida') }
const bitsOf = (s, min, max) => { const b = s.replace(/\s+/g, ''); if (!/^[01]+$/.test(b) || b.length < min || b.length > max) fail(); return b }
const bin = (v, n = 8) => v.toString(2).padStart(n, '0')

function parity({ dados, erro }) {
  const d = bitsOf(dados, 1, 32)
  const flip = Number(erro)
  const ones = [...d].filter(b => b === '1').length
  const p = ones % 2
  const sent = d + p
  const steps = [
    { row: ['dados', d, `${ones} bits 1`], note: `Os dados têm ${ones} bits iguais a 1.` },
    { row: ['paridade par', String(p), p ? 'ímpar → acrescenta 1' : 'par → acrescenta 0'], note: `Bit de paridade par: ${p}, para que o total de 1s (contando ele) seja par.` },
    { row: ['enviado', sent, `${ones + p} bits 1`], note: `Palavra transmitida: ${sent}.` },
  ]
  if (!Number.isInteger(flip) || flip < 0 || flip > sent.length) fail()
  let recv = sent
  if (flip > 0) {
    recv = [...sent].map((b, i) => (i === flip - 1 ? (b === '1' ? '0' : '1') : b)).join('')
    steps.push({ row: ['recebido', recv, `bit ${flip} trocado`], note: `Um ruído inverte o bit ${flip} durante a transmissão.` })
  } else steps.push({ row: ['recebido', recv, 'sem erro'], note: 'A palavra chega sem erros.' })
  const ok = [...recv].filter(b => b === '1').length % 2 === 0
  steps.push({ note: ok ? (flip ? 'Paridade par — mas houve erro! Isso só acontece com um número par de bits trocados; aqui, impossível com um só.' : 'O receptor conta um número par de 1s: nenhum erro detectado. (Dois bits trocados passariam despercebidos.)') : 'O receptor conta um número ímpar de 1s: erro detectado! A paridade não diz qual bit errou — para corrigir, é preciso mais redundância, como no código de Hamming.', result: ok ? 'ok' : 'erro detectado' })
  return { columns: ['etapa', 'bits', 'observação'], steps }
}

function xorSwap({ a, b }) {
  let x = Number(a), y = Number(b)
  if (![x, y].every(v => Number.isInteger(v) && v >= 0 && v <= 255)) fail()
  const steps = [{ row: ['início', bin(x), bin(y), `a = ${x}, b = ${y}`], note: 'Trocar dois valores sem variável auxiliar, usando OU exclusivo (XOR): x ⊕ x = 0 e x ⊕ 0 = x.' }]
  x ^= y; steps.push({ row: ['a ← a ⊕ b', bin(x), bin(y), `a guarda a "diferença" (${x})`], note: 'a ← a ⊕ b: agora a contém a ⊕ b — os bits em que os dois valores diferem.' })
  y ^= x; steps.push({ row: ['b ← a ⊕ b', bin(x), bin(y), `b = (a ⊕ b) ⊕ b = a original (${y})`], note: 'b ← a ⊕ b: como (a ⊕ b) ⊕ b = a, b recebe o valor original de a.' })
  x ^= y; steps.push({ row: ['a ← a ⊕ b', bin(x), bin(y), `a = (a ⊕ b) ⊕ a = b original (${x})`], note: 'a ← a ⊕ b: (a ⊕ b) ⊕ a = b, então a recebe o valor original de b.' })
  steps.push({ note: `Trocados: a = ${x}, b = ${y}. Cuidado: se a e b forem a mesma variável (mesmo endereço), o primeiro XOR zera os dois.`, result: `a = ${x}, b = ${y}` })
  return { columns: ['passo', 'a', 'b', 'explicação'], steps }
}

function chs({ lba, cabecas, setores }) {
  const L = Number(lba), H = Number(cabecas), S = Number(setores)
  if (![L, H, S].every(Number.isInteger) || L < 0 || H < 1 || H > 255 || S < 1 || S > 63) fail()
  const c = Math.floor(L / (H * S)), h = Math.floor(L / S) % H, s = (L % S) + 1
  const back = (c * H + h) * S + (s - 1)
  const steps = [
    { note: `Geometria do disco: ${H} cabeças por cilindro e ${S} setores por trilha. O LBA numera os setores de 0 em diante; o CHS os localiza por cilindro, cabeça e setor (que começa em 1).` },
    { row: ['cilindro', `⌊${L} / (${H} × ${S})⌋`, c], note: `Cada cilindro tem ${H} × ${S} = ${H * S} setores: cilindro = ⌊${L} / ${H * S}⌋ = ${c}.` },
    { row: ['cabeça', `⌊${L} / ${S}⌋ mod ${H}`, h], note: `Trilhas completas antes do setor: ⌊${L} / ${S}⌋ = ${Math.floor(L / S)}; dentro do cilindro, cabeça = ${Math.floor(L / S)} mod ${H} = ${h}.` },
    { row: ['setor', `(${L} mod ${S}) + 1`, s], note: `Posição dentro da trilha: ${L} mod ${S} = ${L % S}; somando 1 (setores começam em 1): ${s}.` },
    { row: ['volta', `(${c}·${H} + ${h})·${S} + ${s} − 1`, back], note: `Conferindo: LBA = (C·cabeças + H)·setores + (S − 1) = ${back}.` },
  ]
  steps.push({ note: `LBA ${L} ↔ CHS (${c}, ${h}, ${s}). Discos modernos usam só LBA; o CHS sobrevive nas tabelas de partição MBR, limitado a cerca de 8 GB.`, result: `(${c}, ${h}, ${s})` })
  return { columns: ['grandeza', 'cálculo', 'valor'], steps }
}

function crc({ mensagem, gerador }) {
  const m = bitsOf(mensagem, 1, 32), g = bitsOf(gerador, 2, 17)
  if (g[0] !== '1') fail()
  const k = g.length - 1
  const bits = [...m + '0'.repeat(k)].map(Number)
  const steps = [{ row: ['', m + ' ' + '0'.repeat(k), `acrescenta ${k} zeros`], note: `Gerador ${g} (grau ${k}). Acrescenta ${k} zeros à mensagem e faz uma divisão de polinômios em binário, em que subtrair é fazer XOR.` }]
  for (let i = 0; i + k < bits.length; i++) {
    if (!bits[i]) continue
    for (let j = 0; j <= k; j++) bits[i + j] ^= Number(g[j])
    const line = bits.map((b, idx) => (idx < i ? ' ' : b)).join('')
    steps.push({ row: [`posição ${i}`, ' '.repeat(i) + g, line.slice(0, m.length) + ' ' + line.slice(m.length)], note: `O bit ${i} vale 1: alinha o gerador ali e faz XOR. Bits já zerados à esquerda não importam mais.` })
  }
  const rem = bits.slice(-k).join('')
  steps.push({ note: `Resto: ${rem}. Esse é o CRC: transmite-se ${m}${rem}. O receptor divide a palavra recebida pelo mesmo gerador; resto zero significa que nenhum erro detectável aconteceu.`, result: rem })
  return { columns: ['passo', 'gerador alinhado', 'resto parcial'], steps }
}

function hamming({ dados, erro }) {
  const d = bitsOf(dados, 4, 4).split('').map(Number)
  const e = Number(erro)
  if (!Number.isInteger(e) || e < 0 || e > 7) fail()
  // posições 1..7: p1 p2 d1 p3 d2 d3 d4
  const c = [0, 0, 0, d[0], 0, d[1], d[2], d[3]]
  c[1] = c[3] ^ c[5] ^ c[7]; c[2] = c[3] ^ c[6] ^ c[7]; c[4] = c[5] ^ c[6] ^ c[7]
  const word = c.slice(1).join('')
  const steps = [
    { row: ['dados', d.join(''), 'd1 d2 d3 d4'], note: 'Hamming(7,4): 4 bits de dados em 7, com 3 bits de paridade nas posições 1, 2 e 4 (as potências de 2).' },
    { row: ['p1 (posições 1,3,5,7)', String(c[1]), `${c[3]} ⊕ ${c[5]} ⊕ ${c[7]}`], note: 'p1 cobre as posições cujo número tem o bit 1 ligado: 1, 3, 5 e 7.' },
    { row: ['p2 (posições 2,3,6,7)', String(c[2]), `${c[3]} ⊕ ${c[6]} ⊕ ${c[7]}`], note: 'p2 cobre as posições com o bit 2 ligado: 2, 3, 6 e 7.' },
    { row: ['p3 (posições 4,5,6,7)', String(c[4]), `${c[5]} ⊕ ${c[6]} ⊕ ${c[7]}`], note: 'p3 cobre as posições com o bit 4 ligado: 4, 5, 6 e 7.' },
    { row: ['palavra', word, 'p1 p2 d1 p3 d2 d3 d4'], note: `Palavra de código: ${word}.` },
  ]
  const r = [...c]
  if (e) { r[e] ^= 1; steps.push({ row: ['recebida', r.slice(1).join(''), `bit ${e} trocado`], note: `Um ruído inverte o bit da posição ${e}.` }) }
  else steps.push({ row: ['recebida', r.slice(1).join(''), 'sem erro'], note: 'A palavra chega intacta.' })
  const s1 = r[1] ^ r[3] ^ r[5] ^ r[7], s2 = r[2] ^ r[3] ^ r[6] ^ r[7], s4 = r[4] ^ r[5] ^ r[6] ^ r[7]
  const syn = s1 + 2 * s2 + 4 * s4
  steps.push({ row: ['síndrome', `${s4}${s2}${s1}`, `= ${syn}`], note: `O receptor recalcula as três paridades: (s3 s2 s1) = ${s4}${s2}${s1}. Em binário, ${s4}${s2}${s1} = ${syn}: ${syn ? `o número da posição com erro!` : 'zero, nenhum erro.'}` })
  if (syn) r[syn] ^= 1
  const out = [r[3], r[5], r[6], r[7]].join('')
  steps.push({ note: syn ? `Inverte de volta o bit ${syn} e extrai os dados: ${out}. O código de Hamming corrige qualquer erro de 1 bit com só 3 bits extras.` : `Dados extraídos: ${out}.`, result: out })
  return { columns: ['etapa', 'bits', 'detalhe'], steps }
}

export const bitTraces = {
  'parity-bit': { run: parity, inputs: [['dados', '1011001', 1, 32, 'text'], ['erro', 3, 0, 33]] },
  'xor-swap': { run: xorSwap, inputs: [['a', 5, 0, 255], ['b', 9, 0, 255]] },
  'chs-conversion': { run: chs, inputs: [['lba', 1234, 0, 16777215], ['cabecas', 16, 1, 255], ['setores', 63, 1, 63]] },
  'crc': { run: crc, inputs: [['mensagem', '11010011101100', 1, 32, 'text'], ['gerador', '1011', 2, 17, 'text']] },
  'hamming-code': { run: hamming, inputs: [['dados', '1011', 4, 4, 'text'], ['erro', 5, 0, 7]] },
}
