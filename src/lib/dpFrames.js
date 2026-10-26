// Programação dinâmica e backtracking passo a passo.
// Tabelas: quadros { table, rows, cols, rowTitle?, colTitle?, cur?, deps?, path?, note, result? }
//   table[r][c] é o valor exibido (null = ainda não calculado).
// Tabuleiros: quadros { n, cells: [[valor]], fixed?, cur?, conflict?, kind, note }

const fail = () => { throw new Error('entrada inválida') }
const nums = (s, min, max) => {
  const v = s.trim().split(/[\s,;]+/).map(Number)
  if (!v.length || v.some(x => !Number.isInteger(x) || x < min || x > max)) fail()
  return v
}
const word = (s, max) => { const w = [...s.trim()]; if (!w.length || w.length > max) fail(); return w }
const snap = t => t.map(r => [...r])

// ── Fibonacci ──────────────────────────────────────────────
function fibonacci({ n }) {
  const N = Number(n)
  if (!Number.isInteger(N) || N < 1 || N > 40) fail()
  const t = [Array(N + 1).fill(null)]
  const cols = Array.from({ length: N + 1 }, (_, i) => String(i))
  const frames = [{ table: snap(t), rows: ['F'], cols, note: `F(n) = F(n−1) + F(n−2). A recursão ingênua refaria os mesmos subproblemas: F(${N}) faria ${2 * fibNum(N + 1) - 1} chamadas. A programação dinâmica calcula cada valor uma vez só, guardando-o em uma tabela.` }]
  t[0][0] = 0
  frames.push({ table: snap(t), rows: ['F'], cols, cur: [0, 0], note: 'Casos base: F(0) = 0…' })
  if (N >= 1) { t[0][1] = 1; frames.push({ table: snap(t), rows: ['F'], cols, cur: [0, 1], note: '…e F(1) = 1.' }) }
  for (let i = 2; i <= N; i++) {
    t[0][i] = t[0][i - 1] + t[0][i - 2]
    frames.push({ table: snap(t), rows: ['F'], cols, cur: [0, i], deps: [[0, i - 1], [0, i - 2]], note: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${t[0][i - 1]} + ${t[0][i - 2]} = ${t[0][i]}.` })
  }
  frames.push({ table: snap(t), rows: ['F'], cols, path: [[0, N]], note: `F(${N}) = ${t[0][N]}, com ${N - 1} somas em vez de ${2 * fibNum(N + 1) - 1} chamadas recursivas.`, result: String(t[0][N]) })
  return frames
}
const fibNum = n => { let a = 0, b = 1; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a }

// ── Troco de moedas (menor número de moedas) ───────────────
function coinChange({ moedas, valor }) {
  const coins = [...new Set(nums(moedas, 1, 100))].sort((a, b) => a - b)
  const V = Number(valor)
  if (!Number.isInteger(V) || V < 1 || V > 40 || coins.length > 6) fail()
  const INF = Infinity
  const dp = Array(V + 1).fill(INF), from = Array(V + 1).fill(-1)
  dp[0] = 0
  const view = () => [dp.map((x, i) => (i > cur ? null : x === INF ? '∞' : x))]
  const cols = Array.from({ length: V + 1 }, (_, i) => String(i))
  let cur = 0
  const frames = [{ table: view(), rows: ['moedas'], cols, cur: [0, 0], note: `Moedas disponíveis: ${coins.join(', ')}. dp[v] = menor número de moedas para formar v. dp[0] = 0.` }]
  for (cur = 1; cur <= V; cur++) {
    const deps = []
    for (const c of coins) {
      if (c <= cur && dp[cur - c] + 1 < dp[cur]) { dp[cur] = dp[cur - c] + 1; from[cur] = c }
      if (c <= cur) deps.push([0, cur - c])
    }
    frames.push({
      table: view(), rows: ['moedas'], cols, cur: [0, cur], deps,
      note: dp[cur] === INF ? `Nenhuma moeda completa ${cur}: dp[${cur}] = ∞.` : `dp[${cur}] = 1 + min(${coins.filter(c => c <= cur).map(c => `dp[${cur - c}]`).join(', ')}) = ${dp[cur]}, usando uma moeda de ${from[cur]}.`,
    })
  }
  const used = [], path = []
  for (let v = V; v > 0 && from[v] > 0; v -= from[v]) { used.push(from[v]); path.push([0, v]) }
  path.push([0, 0])
  frames.push({
    table: view(), rows: ['moedas'], cols, path,
    note: dp[V] === INF ? `Não é possível formar ${V} com essas moedas.` : `Mínimo: ${dp[V]} moeda${dp[V] > 1 ? 's' : ''} (${used.join(' + ')}). Voltando pelas escolhas registradas, reconstrói-se a combinação.`,
    result: dp[V] === INF ? '∞' : `${dp[V]}: ${used.join(' + ')}`,
  })
  return frames
}

// ── Mochila 0/1 ────────────────────────────────────────────
function knapsack({ itens, capacidade }) {
  const parts = itens.trim().split(/[\s,;]+/).map(p => p.split(':').map(Number))
  if (!parts.length || parts.length > 6 || parts.some(p => p.length !== 2 || p.some(x => !Number.isInteger(x) || x < 1 || x > 99))) fail()
  const W = Number(capacidade)
  if (!Number.isInteger(W) || W < 1 || W > 15) fail()
  const n = parts.length
  const t = Array.from({ length: n + 1 }, (_, i) => Array(W + 1).fill(i === 0 ? 0 : null))
  const rows = ['—', ...parts.map(([w, v], i) => `${i + 1} (p${w}, v${v})`)]
  const cols = Array.from({ length: W + 1 }, (_, i) => String(i))
  const frames = [{ table: snap(t), rows, cols, rowTitle: 'itens', colTitle: 'capacidade', note: `Itens (peso:valor): ${itens}. Capacidade ${W}. dp[i][c] = maior valor usando os i primeiros itens com capacidade c. A linha 0 (nenhum item) vale 0.` }]
  for (let i = 1; i <= n; i++) {
    const [w, v] = parts[i - 1]
    for (let c = 0; c <= W; c++) {
      const skip = t[i - 1][c]
      const take = w <= c ? t[i - 1][c - w] + v : -1
      t[i][c] = Math.max(skip, take)
      frames.push({
        table: snap(t), rows, cols, cur: [i, c], deps: w <= c ? [[i - 1, c], [i - 1, c - w]] : [[i - 1, c]],
        note: w > c ? `Item ${i} (peso ${w}) não cabe em ${c}: dp = dp[${i - 1}][${c}] = ${skip}.` : `Item ${i}: deixar (${skip}) ou levar (dp[${i - 1}][${c - w}] + ${v} = ${take}) → ${t[i][c]}.`,
      })
    }
  }
  const path = [], chosen = []
  for (let i = n, c = W; i > 0; i--) {
    path.push([i, c])
    if (t[i][c] !== t[i - 1][c]) { chosen.unshift(i); c -= parts[i - 1][0] }
  }
  frames.push({ table: snap(t), rows, cols, path, note: `Valor máximo: ${t[n][W]}. Voltando pela tabela (onde o valor mudou, o item foi levado): itens ${chosen.join(', ') || 'nenhum'}.`, result: `${t[n][W]} (itens ${chosen.join(', ')})` })
  return frames
}

// ── Maior subsequência comum ───────────────────────────────
function lcs({ a, b }) {
  const A = word(a, 12), Bw = word(b, 12)
  const m = A.length, n = Bw.length
  const t = Array.from({ length: m + 1 }, (_, i) => Array(n + 1).fill(null).map((_, j) => (i === 0 || j === 0 ? 0 : null)))
  const rows = ['—', ...A], cols = ['—', ...Bw]
  const frames = [{ table: snap(t), rows, cols, note: `dp[i][j] = tamanho da maior subsequência comum entre os i primeiros caracteres de "${a}" e os j primeiros de "${b}". Linha e coluna 0 valem 0.` }]
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    if (A[i - 1] === Bw[j - 1]) {
      t[i][j] = t[i - 1][j - 1] + 1
      frames.push({ table: snap(t), rows, cols, cur: [i, j], deps: [[i - 1, j - 1]], note: `"${A[i - 1]}" = "${Bw[j - 1]}": estende a diagonal, dp = ${t[i - 1][j - 1]} + 1 = ${t[i][j]}.` })
    } else {
      t[i][j] = Math.max(t[i - 1][j], t[i][j - 1])
      frames.push({ table: snap(t), rows, cols, cur: [i, j], deps: [[i - 1, j], [i, j - 1]], note: `"${A[i - 1]}" ≠ "${Bw[j - 1]}": o maior entre cima (${t[i - 1][j]}) e esquerda (${t[i][j - 1]}) = ${t[i][j]}.` })
    }
  }
  const path = [], out = []
  for (let i = m, j = n; i > 0 && j > 0;) {
    path.push([i, j])
    if (A[i - 1] === Bw[j - 1]) { out.unshift(A[i - 1]); i--; j-- }
    else if (t[i - 1][j] >= t[i][j - 1]) i--
    else j--
  }
  frames.push({ table: snap(t), rows, cols, path, note: `Tamanho ${t[m][n]}. Voltando da última célula pelas diagonais (caracteres iguais), a subsequência é "${out.join('')}".`, result: `"${out.join('')}" (${t[m][n]})` })
  return frames
}

// ── Distância de edição (Levenshtein) ──────────────────────
function editDistance({ a, b }) {
  const A = word(a, 12), Bw = word(b, 12)
  const m = A.length, n = Bw.length
  const t = Array.from({ length: m + 1 }, (_, i) => Array(n + 1).fill(null).map((_, j) => (i === 0 ? j : j === 0 ? i : null)))
  const rows = ['—', ...A], cols = ['—', ...Bw]
  const frames = [{ table: snap(t), rows, cols, note: `dp[i][j] = menor número de inserções, remoções e trocas para transformar os i primeiros caracteres de "${a}" nos j primeiros de "${b}". A primeira linha e a primeira coluna são só inserções ou só remoções.` }]
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    const same = A[i - 1] === Bw[j - 1]
    const sub = t[i - 1][j - 1] + (same ? 0 : 1), del = t[i - 1][j] + 1, ins = t[i][j - 1] + 1
    t[i][j] = Math.min(sub, del, ins)
    frames.push({
      table: snap(t), rows, cols, cur: [i, j], deps: [[i - 1, j - 1], [i - 1, j], [i, j - 1]],
      note: same ? `"${A[i - 1]}" = "${Bw[j - 1]}": sem custo pela diagonal → min(${sub}, ${del}, ${ins}) = ${t[i][j]}.` : `"${A[i - 1]}" ≠ "${Bw[j - 1]}": trocar (${sub}), remover (${del}) ou inserir (${ins}) → ${t[i][j]}.`,
    })
  }
  const path = [], ops = []
  for (let i = m, j = n; i > 0 || j > 0;) {
    path.push([i, j])
    if (i > 0 && j > 0 && t[i][j] === t[i - 1][j - 1] + (A[i - 1] === Bw[j - 1] ? 0 : 1)) { if (A[i - 1] !== Bw[j - 1]) ops.unshift(`trocar ${A[i - 1]}→${Bw[j - 1]}`); i--; j-- }
    else if (i > 0 && t[i][j] === t[i - 1][j] + 1) { ops.unshift(`remover ${A[i - 1]}`); i-- }
    else { ops.unshift(`inserir ${Bw[j - 1]}`); j-- }
  }
  path.push([0, 0])
  frames.push({ table: snap(t), rows, cols, path, note: `Distância = ${t[m][n]}: ${ops.join(', ') || 'as palavras são iguais'}.`, result: String(t[m][n]) })
  return frames
}

// ── Soma de subconjuntos ───────────────────────────────────
function subsetSum({ numeros, alvo }) {
  const v = nums(numeros, 1, 50)
  const S = Number(alvo)
  if (v.length > 8 || !Number.isInteger(S) || S < 1 || S > 40) fail()
  const n = v.length
  const t = Array.from({ length: n + 1 }, (_, i) => Array(S + 1).fill(null).map((_, s) => (s === 0 ? true : i === 0 ? false : null)))
  const show = () => t.map(r => r.map(x => (x === null ? null : x ? '✓' : '·')))
  const rows = ['—', ...v.map(String)], cols = Array.from({ length: S + 1 }, (_, i) => String(i))
  const frames = [{ table: show(), rows, cols, rowTitle: 'números', colTitle: 'soma', note: `dp[i][s] = existe um subconjunto dos i primeiros números (${v.join(', ')}) que soma s? Soma 0 é sempre possível (conjunto vazio).` }]
  for (let i = 1; i <= n; i++) for (let s = 1; s <= S; s++) {
    const x = v[i - 1]
    t[i][s] = t[i - 1][s] || (x <= s && t[i - 1][s - x])
    frames.push({ table: show(), rows, cols, cur: [i, s], deps: x <= s ? [[i - 1, s], [i - 1, s - x]] : [[i - 1, s]], note: `Soma ${s} com ${x}: sem usar ${x} (${t[i - 1][s] ? 'sim' : 'não'})${x <= s ? ` ou usando ${x} e formando ${s - x} antes (${t[i - 1][s - x] ? 'sim' : 'não'})` : ''} → ${t[i][s] ? 'possível' : 'impossível'}.` })
  }
  const path = [], chosen = []
  if (t[n][S]) for (let i = n, s = S; i > 0 && s > 0; i--) { path.push([i, s]); if (!t[i - 1][s]) { chosen.unshift(v[i - 1]); s -= v[i - 1] } }
  frames.push({ table: show(), rows, cols, path, note: t[n][S] ? `Sim: ${chosen.join(' + ')} = ${S}. O problema é NP-completo; a tabela custa O(n·S), o que é pseudo-polinomial — cresce com o valor de S, não com o número de dígitos.` : `Não existe subconjunto que some ${S}.`, result: t[n][S] ? chosen.join(' + ') : 'impossível' })
  return frames
}

// ── Maior subsequência crescente ───────────────────────────
function lis({ sequencia }) {
  const a = nums(sequencia, -999, 999)
  if (a.length > 16) fail()
  const n = a.length
  const dp = Array(n).fill(null), prev = Array(n).fill(-1)
  const rows = ['valor', 'dp'], cols = a.map((_, i) => String(i))
  const view = () => [a.map(String), dp]
  const frames = [{ table: view(), rows, cols, note: 'dp[i] = tamanho da maior subsequência crescente que termina no elemento i. Cada elemento sozinho já forma uma de tamanho 1.' }]
  for (let i = 0; i < n; i++) {
    dp[i] = 1
    const deps = []
    for (let j = 0; j < i; j++) if (a[j] < a[i]) { deps.push([1, j]); if (dp[j] + 1 > dp[i]) { dp[i] = dp[j] + 1; prev[i] = j } }
    frames.push({ table: view(), rows, cols, cur: [1, i], deps, note: deps.length ? `${a[i]}: pode estender as sequências que terminam em valores menores (${deps.map(([, j]) => a[j]).join(', ')}). dp[${i}] = ${dp[i]}${prev[i] >= 0 ? `, vindo de ${a[prev[i]]}` : ''}.` : `${a[i]}: nenhum valor menor antes dele — dp[${i}] = 1.` })
  }
  let best = 0
  for (let i = 1; i < n; i++) if (dp[i] > dp[best]) best = i
  const path = [], seq = []
  for (let i = best; i >= 0; i = prev[i]) { path.push([0, i], [1, i]); seq.unshift(a[i]) }
  frames.push({ table: view(), rows, cols, path, note: `Maior subsequência crescente: ${seq.join(', ')} (tamanho ${dp[best]}). Esta tabela é O(n²); com busca binária (paciência), dá para fazer em O(n log n).`, result: seq.join(' ') })
  return frames
}

// ── Multiplicação de cadeia de matrizes ────────────────────
function matrixChain({ dimensoes }) {
  const d = nums(dimensoes, 1, 100)
  if (d.length < 3 || d.length > 7) fail()
  const n = d.length - 1
  const t = Array.from({ length: n }, (_, i) => Array(n).fill(null).map((_, j) => (i === j ? 0 : null)))
  const split = Array.from({ length: n }, () => Array(n).fill(-1))
  const names = Array.from({ length: n }, (_, i) => `A${i + 1}`)
  const frames = [{ table: snap(t), rows: names, cols: names, note: `Matrizes: ${names.map((x, i) => `${x} (${d[i]}×${d[i + 1]})`).join(', ')}. dp[i][j] = menor número de multiplicações escalares para calcular Aᵢ·…·Aⱼ. A diagonal (uma matriz só) custa 0.` }]
  for (let len = 2; len <= n; len++) for (let i = 0; i + len - 1 < n; i++) {
    const j = i + len - 1
    let best = Infinity, bk = -1
    const tries = []
    for (let k = i; k < j; k++) {
      const cost = t[i][k] + t[k + 1][j] + d[i] * d[k + 1] * d[j + 1]
      tries.push(`k=${k + 1}: ${cost}`)
      if (cost < best) { best = cost; bk = k }
    }
    t[i][j] = best; split[i][j] = bk
    frames.push({ table: snap(t), rows: names, cols: names, cur: [i, j], deps: [[i, bk], [bk + 1, j]], note: `${names[i]}…${names[j]}: testa cada ponto de divisão (${tries.join('; ')}). Melhor: dividir depois de ${names[bk]}, custo ${best}.` })
  }
  const paren = (i, j) => (i === j ? names[i] : `(${paren(i, split[i][j])}·${paren(split[i][j] + 1, j)})`)
  const order = paren(0, n - 1)
  let naive = 0
  for (let k = 1; k < n; k++) naive += d[0] * d[k] * d[k + 1]
  frames.push({ table: snap(t), rows: names, cols: names, path: [[0, n - 1]], note: `Melhor ordem: ${order}, com ${t[0][n - 1]} multiplicações — contra ${naive} da ordem da esquerda para a direita.`, result: `${order} = ${t[0][n - 1]}` })
  return frames
}

export const dpAlgorithms = {
  'fibonacci-dp': { run: fibonacci, fields: [['n', '12', 3]] },
  'coin-change': { run: coinChange, fields: [['moedas', '1 3 4', 30], ['valor', '10', 3]] },
  'knapsack': { run: knapsack, fields: [['itens', '1:1 3:4 4:5 5:7', 60], ['capacidade', '7', 3]] },
  'lcs': { run: lcs, fields: [['a', 'ABCBDAB', 12], ['b', 'BDCABA', 12]] },
  'edit-distance': { run: editDistance, fields: [['a', 'kitten', 12], ['b', 'sitting', 12]] },
  'subset-sum': { run: subsetSum, fields: [['numeros', '3 34 4 12 5 2', 40], ['alvo', '9', 3]] },
  'lis': { run: lis, fields: [['sequencia', '10 9 2 5 3 7 101 18 4 19', 80]] },
  'matrix-chain': { run: matrixChain, fields: [['dimensoes', '40 20 30 10 30', 40]] },
}

// ── N-rainhas (backtracking) ───────────────────────────────
const MAX_FRAMES = 4000

export function queensFrames(N) {
  if (!Number.isInteger(N) || N < 4 || N > 10) fail()
  const cols = Array(N).fill(-1)
  const frames = []
  const board = () => Array.from({ length: N }, (_, r) => Array.from({ length: N }, (_, c) => (cols[r] === c ? 'Q' : null)))
  const attacker = (r, c) => { for (let i = 0; i < r; i++) if (cols[i] === c || Math.abs(cols[i] - c) === r - i) return [i, cols[i]]; return null }
  let placed = 0, backs = 0, done = false
  frames.push({ n: N, cells: board(), kind: 'start', note: `Colocar ${N} rainhas em um tabuleiro ${N}×${N} sem que nenhuma ataque outra (mesma linha, coluna ou diagonal). Uma rainha por linha; em cada linha, testa as colunas da esquerda para a direita.` })
  const solve = r => {
    if (r === N) { done = true; return true }
    for (let c = 0; c < N; c++) {
      if (frames.length > MAX_FRAMES) return false
      const att = attacker(r, c)
      if (att) {
        frames.push({ n: N, cells: board(), cur: [r, c], conflict: att, kind: 'conflict', note: `Linha ${r + 1}, coluna ${c + 1}: atacada pela rainha da linha ${att[0] + 1}.` })
        continue
      }
      cols[r] = c; placed++
      frames.push({ n: N, cells: board(), cur: [r, c], kind: 'place', note: `Linha ${r + 1}: coluna ${c + 1} está livre — coloca a rainha e passa para a próxima linha.` })
      if (solve(r + 1)) return true
      cols[r] = -1; backs++
      frames.push({ n: N, cells: board(), cur: [r, c], kind: 'back', note: `Nenhuma coluna da linha ${r + 2} funciona: retrocede (backtrack) e remove a rainha da linha ${r + 1}, coluna ${c + 1}.` })
    }
    return false
  }
  solve(0)
  frames.push({ n: N, cells: board(), kind: 'done', note: done ? `Solução encontrada com ${placed} rainhas colocadas e ${backs} retrocessos. O backtracking descarta cada ramo assim que ele se mostra impossível, em vez de testar as ${N}^${N} combinações.` : 'Limite de passos atingido.' })
  return frames
}

// ── Sudoku (backtracking com "menos candidatos primeiro") ──
export const SUDOKU_EXAMPLE = '000000907000420180000705026100904000050000040000507009920108000034059000507000000'

export function sudokuFrames(puzzle) {
  const p = puzzle.replace(/[^0-9.]/g, '').replace(/\./g, '0')
  if (p.length !== 81) fail()
  const g = [...p].map(Number)
  const fixed = g.map(v => v > 0)
  const ok = (i, v) => {
    const r = Math.floor(i / 9), c = i % 9, br = r - (r % 3), bc = c - (c % 3)
    for (let k = 0; k < 9; k++) {
      if (g[r * 9 + k] === v || g[k * 9 + c] === v) return false
      if (g[(br + Math.floor(k / 3)) * 9 + bc + (k % 3)] === v) return false
    }
    return true
  }
  for (let i = 0; i < 81; i++) if (g[i]) { const v = g[i]; g[i] = 0; if (!ok(i, v)) fail(); g[i] = v }
  const frames = [{ n: 9, cells: g.map(v => v || null), fixed, kind: 'start', note: 'Escolhe sempre a célula vazia com menos candidatos possíveis, tenta cada candidato e retrocede quando chega a uma célula sem nenhum.' }]
  let tries = 0, backs = 0
  const solve = () => {
    if (frames.length > MAX_FRAMES) return false
    let best = -1, bestCands = null
    for (let i = 0; i < 81; i++) if (!g[i]) {
      const cands = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(v => ok(i, v))
      if (!bestCands || cands.length < bestCands.length) { best = i; bestCands = cands; if (cands.length <= 1) break }
    }
    if (best < 0) return true
    if (!bestCands.length) return false
    for (const v of bestCands) {
      g[best] = v; tries++
      frames.push({ n: 9, cells: g.map(x => x || null), fixed, cur: best, kind: bestCands.length === 1 ? 'forced' : 'place', note: bestCands.length === 1 ? `Linha ${Math.floor(best / 9) + 1}, coluna ${(best % 9) + 1}: só ${v} é possível.` : `Linha ${Math.floor(best / 9) + 1}, coluna ${(best % 9) + 1}: candidatos ${bestCands.join(', ')} — tenta ${v}.` })
      if (solve()) return true
      g[best] = 0; backs++
      frames.push({ n: 9, cells: g.map(x => x || null), fixed, cur: best, kind: 'back', note: `O ${v} em (${Math.floor(best / 9) + 1}, ${(best % 9) + 1}) levou a um beco sem saída: apaga e tenta o próximo candidato.` })
    }
    return false
  }
  const solved = solve()
  frames.push({ n: 9, cells: g.map(v => v || null), fixed, kind: 'done', note: solved ? `Resolvido com ${tries} tentativas e ${backs} retrocessos. Sem a regra de escolher a célula com menos candidatos, o mesmo quebra-cabeça exigiria muito mais retrocessos.` : frames.length > MAX_FRAMES ? 'Limite de passos da animação atingido.' : 'Este quebra-cabeça não tem solução.' })
  return frames
}
