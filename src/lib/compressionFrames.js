// Execuções passo a passo dos algoritmos de compressão.
// Tabelas usam o formato de numberFrames: { columns, steps: [{ row?, note, result? }] }.
// As funções de tabela lançam um erro quando a entrada é inválida.

export const visible = s => s.replace(/ /g, '␣').replace(/\n/g, '↵')

const fail = () => { throw new Error('entrada inválida') }

// Frequência de cada símbolo, em ordem crescente de símbolo.
export function countFreq(text) {
  const freq = new Map()
  for (const c of [...text].sort()) freq.set(c, (freq.get(c) ?? 0) + 1)
  return freq
}

export function entropyBits(text) {
  const n = [...text].length
  let h = 0
  for (const f of countFreq(text).values()) h -= f * Math.log2(f / n)
  return h
}

// Huffman determinístico: desempate pela ordem de criação (folhas primeiro, em ordem de símbolo).
export function huffmanCodes(freq) {
  let order = 0
  const nodes = [...freq].map(([s, w]) => ({ s, w, id: order++ }))
  if (nodes.length === 1) return new Map([[nodes[0].s, '0']])
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.w - b.w || a.id - b.id)
    const [a, b] = nodes.splice(0, 2)
    nodes.push({ w: a.w + b.w, id: order++, kids: [a, b] })
  }
  const codes = new Map()
  const walk = (n, code) => (n.kids ? (walk(n.kids[0], code + '0'), walk(n.kids[1], code + '1')) : codes.set(n.s, code))
  walk(nodes[0], '')
  return codes
}

const percent = (a, b) => Math.round((100 * a) / b)

// ── Run-length ─────────────────────────────────────────────
function runLength({ texto }) {
  const chars = [...texto]
  if (!chars.length) fail()
  const steps = [{ note: `Percorre "${visible(texto)}" (${chars.length} caracteres) e troca cada sequência de caracteres iguais por "quantidade + caractere".` }]
  let out = '', i = 0, run = 0
  while (i < chars.length) {
    let j = i
    while (j < chars.length && chars[j] === chars[i]) j++
    out += (j - i) + chars[i]
    run++
    steps.push({ row: [run, visible(chars[i]), j - i, visible(out)], note: `${j - i} × "${visible(chars[i])}" a partir da posição ${i} → "${j - i}${visible(chars[i])}".` })
    i = j
  }
  const size = [...out].length
  steps.push({
    note: size >= chars.length
      ? `${chars.length} caracteres viraram ${size}: o texto não diminuiu. RLE só compensa quando há sequências longas de símbolos repetidos.`
      : `${chars.length} caracteres viraram ${size} — ${percent(size, chars.length)}% do tamanho original.`,
    result: visible(out),
  })
  return { columns: ['sequência', 'caractere', 'repetições', 'saída até aqui'], steps }
}

// ── Codificação delta ──────────────────────────────────────
const bitsFor = v => (v === 0 ? 1 : Math.floor(Math.log2(Math.abs(v))) + 2) // com bit de sinal

function delta({ valores }) {
  const nums = valores.trim().split(/[\s,;]+/).map(Number)
  if (nums.length < 2 || nums.length > 40 || nums.some(v => !Number.isSafeInteger(v) || Math.abs(v) > 1e12)) fail()
  const steps = [{ note: `Em vez de guardar cada valor, guarda a diferença para o anterior. O primeiro valor (${nums[0]}) é guardado inteiro.` }]
  const out = []
  nums.forEach((v, i) => {
    const d = i === 0 ? v : v - nums[i - 1]
    out.push(d)
    steps.push({ row: [i, v, i === 0 ? `${d} (inicial)` : d], note: i === 0 ? `Primeiro valor: ${v}.` : `${v} − ${nums[i - 1]} = ${d}.` })
  })
  const before = Math.max(...nums.map(bitsFor)), after = Math.max(...out.slice(1).map(bitsFor))
  steps.push({
    note: `Os valores originais precisam de até ${before} bits cada; as diferenças, de só ${after}. Somando as diferenças em ordem, os valores voltam exatamente.`,
    result: out.join(' '),
  })
  return { columns: ['i', 'valor', 'delta'], steps }
}

// ── Codificação incremental ────────────────────────────────
function incremental({ palavras }) {
  const given = palavras.trim().split(/\s+/).filter(Boolean)
  if (given.length < 2 || given.length > 25) fail()
  const words = [...given].sort()
  const wasSorted = words.every((w, i) => w === given[i])
  const steps = [{ note: wasSorted ? 'A lista já está em ordem alfabética: palavras vizinhas compartilham prefixos.' : 'Primeiro ordena a lista: em ordem alfabética, palavras vizinhas compartilham prefixos.' }]
  let prev = '', original = 0, encoded = 0
  for (const w of words) {
    let k = 0
    while (k < prev.length && k < w.length && prev[k] === w[k]) k++
    const suffix = w.slice(k)
    original += w.length
    encoded += 1 + suffix.length // 1 byte para o tamanho do prefixo
    steps.push({ row: [w, k, suffix || '—', `${k} ${suffix}`], note: k ? `"${w}" repete os ${k} primeiros caracteres de "${prev}": guarda só ${k} e "${suffix}".` : `"${w}" não tem prefixo em comum com a anterior: guarda 0 e a palavra inteira.` })
    prev = w
  }
  steps.push({ note: `${original} caracteres viraram ${encoded} bytes (contando 1 byte para cada tamanho de prefixo) — ${percent(encoded, original)}% do original.`, result: `${encoded} / ${original}` })
  return { columns: ['palavra', 'prefixo comum', 'sufixo', 'código'], steps }
}

// ── Move-to-front ──────────────────────────────────────────
function moveToFront({ texto }) {
  const chars = [...texto]
  if (!chars.length) fail()
  let list = [...new Set(chars)].sort()
  const steps = [{ note: `Alfabeto inicial em ordem: ${visible(list.join(''))}. Cada símbolo é trocado pela sua posição na lista e, em seguida, levado para a frente.` }]
  const out = []
  for (const c of chars) {
    const idx = list.indexOf(c)
    const before = list.join('')
    list = [c, ...list.slice(0, idx), ...list.slice(idx + 1)]
    out.push(idx)
    steps.push({ row: [visible(c), visible(before), idx, visible(list.join(''))], note: idx === 0 ? `"${visible(c)}" já está na frente: emite 0.` : `"${visible(c)}" está na posição ${idx}: emite ${idx} e o move para a frente.` })
  }
  const zeros = out.filter(v => v === 0).length
  steps.push({ note: `Símbolos repetidos em sequência viram zeros (${zeros} de ${out.length}). Números pequenos e repetidos são ótimos para Huffman ou codificação aritmética.`, result: out.join(' ') })
  return { columns: ['símbolo', 'lista antes', 'índice', 'lista depois'], steps }
}

// ── LZ78 ───────────────────────────────────────────────────
function lz78({ texto }) {
  const chars = [...texto]
  if (!chars.length) fail()
  const dict = new Map()
  const steps = [{ note: 'O dicionário começa vazio. Lê o texto até formar uma frase que ainda não está nele.' }]
  const out = []
  let w = ''
  for (const c of chars) {
    if (dict.has(w + c)) { w += c; continue }
    const idx = w ? dict.get(w) : 0
    dict.set(w + c, dict.size + 1)
    out.push(`(${idx},${visible(c)})`)
    steps.push({
      row: [out.length, visible(w + c), `(${idx}, ${visible(c)})`, `${dict.size}: ${visible(w + c)}`],
      note: w
        ? `"${visible(w)}" já está no dicionário (entrada ${idx}), mas "${visible(w + c)}" não: emite (${idx}, ${visible(c)}) e cria a entrada ${dict.size}.`
        : `"${visible(c)}" ainda não está no dicionário: emite (0, ${visible(c)}) — 0 significa "sem prefixo" — e cria a entrada ${dict.size}.`,
    })
    w = ''
  }
  if (w) {
    out.push(`(${dict.get(w)},)`)
    steps.push({ row: [out.length, visible(w), `(${dict.get(w)}, —)`, '—'], note: `O texto acabou no meio de uma frase conhecida ("${visible(w)}"): emite só o índice ${dict.get(w)}.` })
  }
  steps.push({ note: `${chars.length} caracteres viraram ${out.length} pares. Quanto maior o texto, mais longas ficam as frases do dicionário.`, result: out.join(' ') })
  return { columns: ['passo', 'frase', 'saída (índice, caractere)', 'nova entrada'], steps }
}

// ── LZW ────────────────────────────────────────────────────
function lzw({ texto }) {
  const chars = [...texto]
  if (!chars.length || chars.some(c => c.charCodeAt(0) > 255)) fail()
  const dict = new Map()
  for (let i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i)
  let next = 256, w = ''
  const out = []
  const label = (code, s) => `${code} (${visible(s)})`
  const steps = [{ note: 'O dicionário começa com os 256 caracteres de um byte (códigos 0 a 255). Novas sequências recebem códigos a partir de 256.' }]
  for (const c of chars) {
    if (dict.has(w + c)) { w += c; continue }
    out.push(dict.get(w))
    dict.set(w + c, next++)
    steps.push({ row: [visible(w), visible(c), label(dict.get(w), w), `${next - 1} = ${visible(w + c)}`], note: `"${visible(w)}" está no dicionário, mas "${visible(w + c)}" não: emite o código de "${visible(w)}" (${dict.get(w)}) e cria ${next - 1} = "${visible(w + c)}".` })
    w = c
  }
  out.push(dict.get(w))
  steps.push({ row: [visible(w), '—', label(dict.get(w), w), '—'], note: `Fim do texto: emite o código da sequência pendente "${visible(w)}".` })
  const bits = Math.max(9, Math.ceil(Math.log2(next)))
  steps.push({ note: `${chars.length} caracteres (${chars.length * 8} bits) viraram ${out.length} códigos de ${bits} bits (${out.length * bits} bits).`, result: out.join(' ') })
  return { columns: ['w', 'próximo', 'saída', 'nova entrada'], steps }
}

// ── DEFLATE (didático) ─────────────────────────────────────
export function lz77Pairs(chars, minLen = 3, maxLen = 258, window = 32768) {
  const tokens = []
  let i = 0
  while (i < chars.length) {
    let bestLen = 0, bestDist = 0
    for (let j = i - 1; j >= Math.max(0, i - window); j--) {
      let k = 0
      while (k < maxLen && i + k < chars.length && chars[j + k] === chars[i + k]) k++
      if (k > bestLen) { bestLen = k; bestDist = i - j }
    }
    if (bestLen >= minLen) { tokens.push({ len: bestLen, dist: bestDist }); i += bestLen }
    else { tokens.push({ lit: chars[i] }); i++ }
  }
  return tokens
}

function deflate({ texto }) {
  const chars = [...texto]
  if (!chars.length) fail()
  const tokens = lz77Pairs(chars)
  const steps = [{ note: 'Etapa 1 (LZ77): troca repetições por pares <comprimento, distância> — "copie N caracteres de D posições atrás". Repetições com menos de 3 caracteres ficam como literais.' }]
  let pos = 0
  for (const t of tokens) {
    if (t.lit !== undefined) {
      steps.push({ row: ['LZ77', visible(t.lit), 'literal'], note: `Posição ${pos}: "${visible(t.lit)}" não inicia uma repetição de 3+ caracteres — vira um literal.` })
      pos++
    } else {
      const copied = chars.slice(pos, pos + t.len).join('')
      steps.push({ row: ['LZ77', `<${t.len}, ${t.dist}>`, `copia "${visible(copied)}"`], note: `Posição ${pos}: "${visible(copied)}" já apareceu ${t.dist} posições atrás — vira <${t.len}, ${t.dist}>.` })
      pos += t.len
    }
  }
  const litLen = new Map(), dists = new Map()
  for (const t of tokens) {
    const key = t.lit !== undefined ? visible(t.lit) : `comp ${t.len}`
    litLen.set(key, (litLen.get(key) ?? 0) + 1)
    if (t.dist) dists.set(`dist ${t.dist}`, (dists.get(`dist ${t.dist}`) ?? 0) + 1)
  }
  steps.push({ note: 'Etapa 2 (Huffman): literais e comprimentos formam um alfabeto; distâncias formam outro. Cada um recebe um código de Huffman — símbolos frequentes ganham códigos curtos.' })
  let bits = 0
  for (const [name, table] of [['literais/comprimentos', litLen], ['distâncias', dists]]) {
    if (!table.size) continue
    const codes = huffmanCodes(new Map([...table].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))))
    for (const [sym, f] of table) {
      const code = codes.get(sym)
      bits += f * code.length
      steps.push({ row: ['Huffman', sym, `${f}× → ${code}`], note: `Alfabeto de ${name}: "${sym}" aparece ${f} vez(es) e recebe o código ${code} (${code.length} bit${code.length > 1 ? 's' : ''}).` })
    }
  }
  steps.push({
    note: `${chars.length * 8} bits em ASCII → ${tokens.length} tokens → cerca de ${bits} bits de dados. O DEFLATE real ainda grava as tabelas de Huffman e bits extras, que só compensam em textos maiores.`,
    result: `${bits} bits`,
  })
  return { columns: ['etapa', 'símbolo', 'detalhe'], steps }
}

const text = (value, max = 120) => [value, 1, max, 'text']

export const compressionTraces = {
  'run-length-encoding': { run: runLength, inputs: [['texto', ...text('WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW', 200)]] },
  'delta-encoding': { run: delta, inputs: [['valores', ...text('1000 1002 1005 1005 1010 1013 1020 1021 1019 1025', 300)]] },
  'incremental-encoding': { run: incremental, inputs: [['palavras', ...text('myxa myxophyta myxopod nab nabbed nabbing nabit nabk nabob nacarat nacelle', 300)]] },
  'move-to-front': { run: moveToFront, inputs: [['texto', ...text('bananaaa', 60)]] },
  'lz78': { run: lz78, inputs: [['texto', ...text('ABBCBCABABCAABCAAB')]] },
  'lzw': { run: lzw, inputs: [['texto', ...text('TOBEORNOTTOBEORTOBEORNOT')]] },
  'deflate': { run: deflate, inputs: [['texto', ...text('blah blah blah blah! blah blah!')]] },
}

// ── Árvores de código (Huffman e Shannon-Fano) ─────────────
// Quadros: { forest: [nó], hl: [ids], note, codes?: [[símbolo, freq, código]], bits?, total?, entropy? }
// Nó: { id, w, label?, kids?: [esquerda, direita] }

const clone = v => JSON.parse(JSON.stringify(v))

function codeTable(root, freq) {
  const codes = new Map()
  const walk = (n, code) => (n.kids ? (walk(n.kids[0], code + '0'), walk(n.kids[1], code + '1')) : codes.set(n.label, code || '0'))
  walk(root, '')
  const rows = [...freq].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([s, f]) => [s, f, codes.get(s)])
  return { rows, bits: rows.reduce((sum, [, f, c]) => sum + f * c.length, 0) }
}

function finalFrame(forest, freq, text, intro) {
  const { rows, bits } = codeTable(forest[0], freq)
  const n = [...text].length
  const h = entropyBits(text)
  return {
    forest, hl: [], codes: rows, bits, total: n * 8, entropy: h,
    note: `${intro} ${bits} bits no total, contra ${n * 8} em ASCII de 8 bits — ${(bits / n).toFixed(2)} bits por símbolo. Limite teórico (entropia): ${h.toFixed(1)} bits.`,
  }
}

const describe = node => (node.label !== undefined && !node.kids ? `"${visible(node.label)}" (${node.w})` : `o nó de peso ${node.w}`)

export function huffmanFrames(text) {
  const freq = countFreq(text)
  let order = 0
  const sortForest = f => [...f].sort((a, b) => a.w - b.w || a.id - b.id)
  let forest = sortForest([...freq].map(([s, w]) => ({ id: order++, label: s, w })))
  const frames = [{ forest, hl: [], note: `Conta quantas vezes cada símbolo aparece em "${visible(text)}" e cria uma folha para cada um, ordenadas pelo peso (frequência).` }]
  while (forest.length > 1) {
    const [a, b] = forest
    frames.push({ forest, hl: [a.id, b.id], note: `Retira da fila as duas árvores de menor peso: ${describe(a)} e ${describe(b)}.` })
    const node = { id: order++, w: a.w + b.w, kids: [a, b] }
    forest = sortForest([...forest.slice(2), node])
    frames.push({ forest, hl: [node.id], note: `Junta as duas em um novo nó de peso ${a.w} + ${b.w} = ${node.w} e o devolve à fila. Resta${forest.length > 1 ? 'm' : ''} ${forest.length} árvore${forest.length > 1 ? 's' : ''}.` })
  }
  frames.push(finalFrame(forest, freq, text, 'Pronto: o código de cada símbolo é o caminho da raiz até a folha (esquerda = 0, direita = 1).'))
  return frames
}

export function shannonFanoFrames(text) {
  const items = [...countFreq(text)].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
  let order = 0
  const make = list => ({ id: order++, label: list.map(x => x[0]).join(''), w: list.reduce((s, x) => s + x[1], 0), items: list })
  const root = make(items)
  const frames = [{ forest: [clone(root)], hl: [root.id], note: 'Ordena os símbolos da maior para a menor frequência e começa com todos em um único grupo.' }]
  const queue = [root]
  while (queue.length) {
    const node = queue.shift()
    if (node.items.length === 1) continue
    let best = 1, bestDiff = Infinity, left = 0
    for (let k = 1; k < node.items.length; k++) {
      left += node.items[k - 1][1]
      const diff = Math.abs(node.w - 2 * left)
      if (diff < bestDiff) { bestDiff = diff; best = k }
    }
    node.kids = [make(node.items.slice(0, best)), make(node.items.slice(best))]
    const [l, r] = node.kids
    frames.push({ forest: [clone(root)], hl: [l.id, r.id], note: `Divide {${visible(node.label)}} em {${visible(l.label)}} (peso ${l.w}) e {${visible(r.label)}} (peso ${r.w}), com somas o mais parecidas possível. A esquerda recebe 0; a direita, 1.` })
    queue.push(...node.kids)
  }
  frames.push(finalFrame([clone(root)], countFreq(text), text, 'Pronto: cada grupo foi dividido até sobrar um símbolo; o código é a sequência de 0s e 1s das divisões.'))
  return frames
}

// ── LZ77 (janela deslizante) ───────────────────────────────
// Quadros: { s, i, start, ahead, match: [j, len] | null, tokens, note, done? }
export function lz77Frames(text, window = 16, lookahead = 8) {
  const s = [...text], n = s.length
  const tokens = []
  const frames = [{ s, i: 0, start: 0, ahead: Math.min(n, lookahead), match: null, tokens: [], note: `LZ77 com janela de busca de ${window} caracteres e área de leitura de ${lookahead}. Cada passo emite um token (distância, comprimento, próximo caractere).` }]
  let i = 0
  while (i < n) {
    const start = Math.max(0, i - window)
    const maxLen = Math.min(lookahead, n - i - 1)
    let bestLen = 0, bestJ = -1
    for (let j = i - 1; j >= start; j--) {
      let k = 0
      while (k < maxLen && s[j + k] === s[i + k]) k++
      if (k > bestLen) { bestLen = k; bestJ = j }
    }
    const offset = bestLen ? i - bestJ : 0
    const nextChar = s[i + bestLen]
    tokens.push([offset, bestLen, nextChar])
    const piece = visible(s.slice(i, i + bestLen).join(''))
    let note
    if (start === i) note = `A janela ainda está vazia: não há o que copiar. Emite (0, 0, ${visible(nextChar)}).`
    else if (!bestLen) note = `Nenhum trecho da janela começa com "${visible(nextChar)}": emite (0, 0, ${visible(nextChar)}).`
    else note = `O maior trecho da janela igual ao início da área de leitura é "${piece}" (${bestLen} caractere${bestLen > 1 ? 's' : ''}), ${offset} posições atrás: emite (${offset}, ${bestLen}, ${visible(nextChar)}) e avança ${bestLen + 1}.`
    frames.push({ s, i, start, ahead: Math.min(n, i + lookahead), match: bestLen ? [bestJ, bestLen] : null, tokens: [...tokens], note })
    i += bestLen + 1
  }
  frames.push({ s, i: n, start: n, ahead: n, match: null, tokens, done: true, note: `Fim: ${n} caracteres viraram ${tokens.length} tokens. Para descomprimir, basta repetir as cópias — sem precisar de dicionário.` })
  return frames
}

// ── Codificação aritmética ─────────────────────────────────
// Quadros: { model: [{ sym, lo, hi }], path: [{ low, high, sym }], low, high, note, code? }
const fmt = v => Number(v.toPrecision(8)).toString()

export function arithmeticFrames(text) {
  const s = [...text], n = s.length
  const model = []
  let c = 0
  for (const [sym, f] of countFreq(text)) { model.push({ sym, f, lo: c / n, hi: (c + f) / n }); c += f }
  const describeModel = model.map(m => `${visible(m.sym)} = ${m.f}/${n}`).join(', ')
  const frames = [{ model, path: [], low: 0, high: 1, note: `Modelo: ${describeModel}. Cada símbolo ganha uma fatia de [0, 1) proporcional à sua probabilidade. Começa com o intervalo [0, 1).` }]
  let low = 0, high = 1
  const path = []
  for (const sym of s) {
    const m = model.find(x => x.sym === sym)
    const w = high - low
    const nl = low + w * m.lo, nh = low + w * m.hi
    path.push({ low, high, sym })
    frames.push({ model, path: [...path], low: nl, high: nh, note: `"${visible(sym)}" ocupa a fatia [${fmt(m.lo)}, ${fmt(m.hi)}) do intervalo atual: o novo intervalo é [${fmt(nl)}, ${fmt(nh)}), de largura ${fmt(nh - nl)}.` })
    low = nl
    high = nh
  }
  let code = ''
  for (let k = 1; k <= 60; k++) {
    const x = Math.ceil(low * 2 ** k)
    if (x / 2 ** k < high) { code = x.toString(2).padStart(k, '0'); break }
  }
  const h = entropyBits(text)
  frames.push({ model, path, low, high, code, done: true, note: `Qualquer número em [${fmt(low)}, ${fmt(high)}) identifica a mensagem inteira. O mais curto em binário é 0,${code}: ${code.length} bits, contra ${n * 8} em ASCII (entropia: ${h.toFixed(1)} bits).` })
  return frames
}

// ── Burrows-Wheeler ────────────────────────────────────────
// Quadros: { rows: [string], orig, phase: 'rot' | 'sorted' | 'last', out?, note }
const sortKey = r => r.replace(/\$/g, '\u0000') // "$" é menor que qualquer caractere

export function bwtFrames(text) {
  const s = text + '$', n = s.length
  const rot = i => s.slice(i) + s.slice(0, i)
  const frames = [{ rows: [s], orig: 0, phase: 'rot', note: `Acrescenta o marcador de fim "$", considerado menor que qualquer caractere: "${visible(s)}".` }]
  for (let i = 1; i < n; i++) {
    frames.push({ rows: Array.from({ length: i + 1 }, (_, k) => rot(k)), orig: 0, phase: 'rot', note: `Rotação ${i}: move o primeiro caractere da rotação anterior para o fim.` })
  }
  const sorted = Array.from({ length: n }, (_, k) => rot(k)).sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : 1))
  const orig = sorted.indexOf(s)
  frames.push({ rows: sorted, orig, phase: 'sorted', note: `Ordena as ${n} rotações. O texto original foi parar na linha ${orig}.` })
  const out = sorted.map(r => r[n - 1]).join('')
  frames.push({ rows: sorted, orig, phase: 'last', out, note: `A saída é a última coluna: "${visible(out)}". Caracteres iguais tendem a ficar juntos — ótimo para move-to-front e RLE. Ela é reversível: a partir dela dá para reconstruir o texto.` })
  return frames
}
