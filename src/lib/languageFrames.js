// Linguagens e computabilidade: descida recursiva, CYK, Earley e a parada (Collatz).

const fail = () => { throw new Error('entrada inválida') }

// ── Descida recursiva (expressões aritméticas) ─────────────
// expr := termo (('+' | '-') termo)* ; termo := fator (('*' | '/') fator)* ; fator := número | '(' expr ')' | '-' fator
export function tokenize(s) {
  const tokens = s.match(/\d+(?:\.\d+)?|[-+*/()]|\S/g) ?? []
  if (!tokens.length || tokens.length > 30 || tokens.some(t => !/^(\d+(\.\d+)?|[-+*/()])$/.test(t))) fail()
  return tokens
}

// Quadros: { tokens, pos, stack: [regras], note, tree? }
// Árvore: { id, label, kids?, value }
export function descentFrames(text) {
  const tokens = tokenize(text)
  let pos = 0, id = 0
  const stack = [], frames = []
  const snap = (note, extra = {}) => frames.push({ tokens, pos, stack: [...stack], note, ...extra })
  const peek = () => tokens[pos]
  const node = (label, kids, value) => ({ id: id++, label, kids, value })
  const enter = name => { stack.push(name); snap(`Chama ${name}() — ${name === 'expr' ? 'uma soma ou subtração de termos' : name === 'termo' ? 'um produto ou divisão de fatores' : 'um número, uma expressão entre parênteses ou um sinal de menos'}.`) }
  const leave = (name, n) => { stack.pop(); snap(`${name}() termina e devolve um nó com valor ${+n.value.toFixed(6)}.`) }
  const expect = t => { if (peek() !== t) fail(); pos++ }

  function expr() {
    enter('expr')
    let left = termo()
    while (peek() === '+' || peek() === '-') {
      const op = tokens[pos++]
      snap(`Lê "${op}": haverá outro termo.`)
      const right = termo()
      left = node(op, [left, right], op === '+' ? left.value + right.value : left.value - right.value)
    }
    leave('expr', left)
    return left
  }
  function termo() {
    enter('termo')
    let left = fator()
    while (peek() === '*' || peek() === '/') {
      const op = tokens[pos++]
      snap(`Lê "${op}": haverá outro fator.`)
      const right = fator()
      if (op === '/' && right.value === 0) fail()
      left = node(op === '*' ? '×' : '÷', [left, right], op === '*' ? left.value * right.value : left.value / right.value)
    }
    leave('termo', left)
    return left
  }
  function fator() {
    enter('fator')
    let n
    const t = peek()
    if (t === '(') {
      pos++
      snap('Lê "(": a expressão interna é analisada por uma nova chamada de expr() — é aqui que a recursão aparece.')
      n = expr()
      expect(')')
      snap('Lê ")": fecha os parênteses.')
    } else if (t === '-') {
      pos++
      snap('Lê "-": menos unário, aplicado ao próximo fator.')
      const inner = fator()
      n = node('−', [inner], -inner.value)
    } else if (t !== undefined && /^\d/.test(t)) {
      pos++
      n = node(t, null, Number(t))
      snap(`Lê o número ${t}.`)
    } else fail()
    leave('fator', n)
    return n
  }
  snap('Os tokens são lidos da esquerda para a direita. Cada regra da gramática é uma função; a precedência (× antes de +) vem de termo() ficar "abaixo" de expr().')
  const tree = expr()
  if (pos !== tokens.length) fail()
  frames.push({ tokens, pos, stack: [], tree, done: true, note: `Análise completa: a árvore sintática mostra a estrutura da expressão, e avaliá-la de baixo para cima dá ${+tree.value.toFixed(6)}.` })
  return frames
}

// ── CYK (gramática em forma normal de Chomsky) ─────────────
export const CYK_GRAMMAR = {
  binary: [['S', 'NP', 'VP'], ['VP', 'VP', 'PP'], ['VP', 'V', 'NP'], ['PP', 'P', 'NP'], ['NP', 'Det', 'N']],
  lexicon: { she: ['NP'], eats: ['V', 'VP'], with: ['P'], fish: ['N', 'NP'], fork: ['N'], a: ['Det'], the: ['Det'], he: ['NP'], cake: ['N'], spoon: ['N'], sees: ['V', 'VP'] },
}

// Quadros no formato das tabelas de PD: linha = tamanho do trecho, coluna = posição inicial.
export function cykFrames({ frase }) {
  const words = frase.trim().toLowerCase().split(/\s+/)
  if (!words.length || words.length > 9 || words.some(w => !CYK_GRAMMAR.lexicon[w])) fail()
  const n = words.length
  const T = Array.from({ length: n }, (_, l) => Array.from({ length: n }, (_, i) => (i + l < n ? null : '')))
  const sets = Array.from({ length: n }, () => Array.from({ length: n }, () => new Set()))
  const show = () => T.map(r => [...r])
  const rows = Array.from({ length: n }, (_, l) => `${l + 1} palavra${l ? 's' : ''}`), cols = words
  const frames = [{ table: show(), rows, cols, rowTitle: 'tamanho', colTitle: 'início', note: 'Gramática em forma normal de Chomsky: S → NP VP; VP → VP PP | V NP; PP → P NP; NP → Det N; mais as palavras. A célula (tamanho, início) guarda os símbolos que geram aquele trecho da frase.' }]
  words.forEach((w, i) => {
    CYK_GRAMMAR.lexicon[w].forEach(s => sets[0][i].add(s))
    T[0][i] = [...sets[0][i]].join(' ')
    frames.push({ table: show(), rows, cols, cur: [0, i], note: `"${w}" pode ser ${[...sets[0][i]].join(' ou ')}.` })
  })
  for (let l = 1; l < n; l++) for (let i = 0; i + l < n; i++) {
    const deps = [], found = []
    for (let k = 0; k < l; k++) {
      const left = sets[k][i], right = sets[l - k - 1][i + k + 1]
      deps.push([k, i], [l - k - 1, i + k + 1])
      for (const [A, B, C] of CYK_GRAMMAR.binary) if (left.has(B) && right.has(C) && !sets[l][i].has(A)) { sets[l][i].add(A); found.push(`${A} → ${B} ${C} (dividindo após "${words[i + k]}")`) }
    }
    T[l][i] = sets[l][i].size ? [...sets[l][i]].join(' ') : '—'
    frames.push({ table: show(), rows, cols, cur: [l, i], deps, note: `"${words.slice(i, i + l + 1).join(' ')}": testa todas as divisões em duas partes. ${found.length ? found.join('; ') + '.' : 'Nenhuma regra combina as partes.'}` })
  }
  const ok = sets[n - 1][0].has('S')
  frames.push({ table: show(), rows, cols, path: ok ? [[n - 1, 0]] : [], note: ok ? `S aparece na célula da frase inteira: a frase pertence à linguagem. O CYK custa O(n³ · |G|) e encontra todas as análises possíveis — inclusive ambiguidades, como "with a fork" modificar "eats" ou "fish".` : 'S não aparece na célula da frase inteira: a frase não pode ser gerada pela gramática.', result: ok ? 'aceita' : 'rejeitada' })
  return frames
}

// ── Earley ─────────────────────────────────────────────────
export const EARLEY_GRAMMAR = [['E', ['E', '+', 'T']], ['E', ['T']], ['T', ['T', '*', 'F']], ['T', ['F']], ['F', ['(', 'E', ')']], ['F', ['n']]]
const NONTERM = new Set(['E', 'T', 'F'])
const itemText = ([r, dot, origin]) => { const [lhs, rhs] = EARLEY_GRAMMAR[r]; return `${lhs} → ${[...rhs.slice(0, dot), '•', ...rhs.slice(dot)].join(' ')}  (${origin})` }

function earley({ entrada }) {
  const tokens = entrada.replace(/\s+/g, '').split('')
  if (!tokens.length || tokens.length > 15 || tokens.some(t => !'n+*()'.includes(t))) fail()
  const S = Array.from({ length: tokens.length + 1 }, () => [])
  const keys = S.map(() => new Set())
  const steps = [{ note: 'Gramática: E → E + T | T; T → T * F | F; F → ( E ) | n. Cada conjunto Sᵢ guarda itens "regra com um ponto" — o quanto da regra já foi reconhecido — e a posição em que ela começou.' }]
  const add = (i, item, op) => {
    const k = item.join(',')
    if (keys[i].has(k)) return
    keys[i].add(k); S[i].push(item)
    steps.push({ row: [`S${i}`, itemText(item), op], note: `${op} em S${i}: ${itemText(item)}.` })
  }
  for (let r = 0; r < EARLEY_GRAMMAR.length; r++) if (EARLEY_GRAMMAR[r][0] === 'E') add(0, [r, 0, 0], 'início')
  for (let i = 0; i <= tokens.length; i++) {
    for (let j = 0; j < S[i].length; j++) {
      const [r, dot, origin] = S[i][j]
      const rhs = EARLEY_GRAMMAR[r][1]
      if (dot < rhs.length) {
        const next = rhs[dot]
        if (NONTERM.has(next)) {
          for (let q = 0; q < EARLEY_GRAMMAR.length; q++) if (EARLEY_GRAMMAR[q][0] === next) add(i, [q, 0, i], `previsão (${next})`)
          // regra anulável não existe nesta gramática
        } else if (tokens[i] === next) add(i + 1, [r, dot + 1, origin], `leitura de "${next}"`)
      } else {
        const lhs = EARLEY_GRAMMAR[r][0]
        for (const [r2, dot2, origin2] of [...S[origin]]) {
          const rhs2 = EARLEY_GRAMMAR[r2][1]
          if (rhs2[dot2] === lhs) add(i, [r2, dot2 + 1, origin2], `conclusão (${lhs})`)
        }
      }
    }
    if (i < tokens.length && !S[i + 1].length) {
      steps.push({ note: `Nenhum item espera "${tokens[i]}" na posição ${i}: a entrada é rejeitada aqui.`, result: 'rejeitada' })
      return { columns: ['conjunto', 'item', 'operação'], steps }
    }
  }
  const ok = S[tokens.length].some(([r, dot, origin]) => origin === 0 && EARLEY_GRAMMAR[r][0] === 'E' && dot === EARLEY_GRAMMAR[r][1].length)
  steps.push({ note: ok ? `O último conjunto contém E completo começando em 0: "${tokens.join(' ')}" pertence à linguagem. O Earley aceita qualquer gramática livre de contexto — inclusive recursiva à esquerda, como esta —, em O(n³) no pior caso e O(n) para gramáticas não ambíguas comuns.` : `Nenhum E completo cobre a entrada inteira: rejeitada.`, result: ok ? 'aceita' : 'rejeitada' })
  return { columns: ['conjunto', 'item', 'operação'], steps }
}

export const languageTraces = {
  'earley': { run: earley, inputs: [['entrada', 'n+n*n', 1, 15, 'text']] },
}

// ── Collatz (o problema da parada na prática) ──────────────
// Quadros: { values, n, note, done? }
export function collatzFrames(start) {
  if (!Number.isInteger(start) || start < 1 || start > 1e9) fail()
  const values = [start]
  let n = start
  while (n !== 1 && values.length < 2000) { n = n % 2 ? 3 * n + 1 : n / 2; values.push(n) }
  const frames = [{ values: [start], note: `Programa: enquanto n ≠ 1, se n é par divide por 2, senão faz 3n + 1. Começando em ${start}. Ninguém conseguiu provar que ele sempre para — é a conjectura de Collatz.` }]
  const every = Math.max(1, Math.ceil(values.length / 120))
  for (let i = 1; i < values.length; i += every) frames.push({ values: values.slice(0, i + 1), note: `Passo ${i}: n = ${values[i]}${values[i] === Math.max(...values.slice(0, i + 1)) && i > 0 ? ' (novo pico)' : ''}.` })
  const peak = Math.max(...values)
  frames.push({ values, done: true, note: `Parou: chegou a 1 em ${values.length - 1} passos, com pico ${peak}. Isso já foi verificado para todo n até 2⁶⁸, mas nenhum argumento garante que todo n chega a 1 — e Turing provou que não existe um algoritmo que decida, para qualquer programa, se ele para.` })
  return frames
}

// Tabelas no formato do visualizador de programação dinâmica.
export const languageTables = {
  'cyk': { run: cykFrames, fields: [['frase', 'she eats a fish with a fork', 60]] },
}
