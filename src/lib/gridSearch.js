// Buscas em um labirinto (grade). Cada célula é um nó; vizinhos são as 4 direções.
// O resultado registra a ordem de visita, quando cada célula entrou na fronteira e o caminho final.

class MinHeap {
  constructor() { this.items = [] }
  get size() { return this.items.length }
  less(a, b) {
    for (let i = 0; i < a.key.length; i++) if (a.key[i] !== b.key[i]) return a.key[i] < b.key[i]
    return false
  }
  push(item) {
    const h = this.items
    h.push(item)
    for (let i = h.length - 1; i > 0;) {
      const p = (i - 1) >> 1
      if (!this.less(h[i], h[p])) break
      ;[h[i], h[p]] = [h[p], h[i]]
      i = p
    }
  }
  pop() {
    const h = this.items
    const top = h[0], last = h.pop()
    if (h.length) {
      h[0] = last
      for (let i = 0; ;) {
        const l = 2 * i + 1, r = l + 1
        let m = i
        if (l < h.length && this.less(h[l], h[m])) m = l
        if (r < h.length && this.less(h[r], h[m])) m = r
        if (m === i) break
        ;[h[i], h[m]] = [h[m], h[i]]
        i = m
      }
    }
    return top
  }
}

function neighbors(grid, cell) {
  const { rows, cols, walls } = grid
  const r = Math.floor(cell / cols), c = cell % cols
  const out = []
  if (r > 0) out.push(cell - cols)        // cima
  if (c < cols - 1) out.push(cell + 1)    // direita
  if (r < rows - 1) out.push(cell + cols) // baixo
  if (c > 0) out.push(cell - 1)           // esquerda
  return out.filter(n => !walls.has(n))
}

const manhattan = (grid, a, b) =>
  Math.abs(Math.floor(a / grid.cols) - Math.floor(b / grid.cols)) + Math.abs((a % grid.cols) - (b % grid.cols))

function buildPath(parent, goal) {
  if (!parent.has(goal)) return null
  const path = []
  for (let c = goal; c !== undefined && c !== null; c = parent.get(c)) path.push(c)
  return path.reverse()
}

function bfs(grid, start, goal, rec) {
  const parent = new Map([[start, null]])
  const queue = [start]
  rec.add(start)
  for (let head = 0; head < queue.length; head++) {
    const cur = queue[head]
    rec.visit(cur)
    if (cur === goal) break
    for (const n of neighbors(grid, cur)) {
      if (!parent.has(n)) { parent.set(n, cur); queue.push(n); rec.add(n) }
    }
  }
  return parent
}

function dfs(grid, start, goal, rec) {
  const parent = new Map()
  const visited = new Set()
  const stack = [[start, null]]
  rec.add(start)
  while (stack.length) {
    const [cur, from] = stack.pop()
    if (visited.has(cur)) continue
    visited.add(cur)
    parent.set(cur, from)
    rec.visit(cur)
    if (cur === goal) break
    // empilha ao contrário para explorar primeiro "cima", depois "direita"...
    for (const n of neighbors(grid, cur).reverse()) {
      if (!visited.has(n)) { stack.push([n, cur]); rec.add(n) }
    }
  }
  return parent
}

function bestFirst(grid, start, goal, rec) {
  const parent = new Map([[start, null]])
  const heap = new MinHeap()
  let order = 0
  heap.push({ key: [manhattan(grid, start, goal), order++], cell: start })
  rec.add(start)
  while (heap.size) {
    const { cell: cur } = heap.pop()
    rec.visit(cur)
    if (cur === goal) break
    for (const n of neighbors(grid, cur)) {
      if (!parent.has(n)) {
        parent.set(n, cur)
        heap.push({ key: [manhattan(grid, n, goal), order++], cell: n })
        rec.add(n)
      }
    }
  }
  return parent
}

function aStar(grid, start, goal, rec) {
  const parent = new Map([[start, null]])
  const g = new Map([[start, 0]])
  const closed = new Set()
  const heap = new MinHeap()
  let order = 0
  const h = c => manhattan(grid, c, goal)
  heap.push({ key: [h(start), h(start), order++], cell: start })
  rec.add(start)
  while (heap.size) {
    const { cell: cur } = heap.pop()
    if (closed.has(cur)) continue
    closed.add(cur)
    rec.visit(cur)
    if (cur === goal) break
    for (const n of neighbors(grid, cur)) {
      const ng = g.get(cur) + 1
      if (ng < (g.get(n) ?? Infinity)) {
        if (!g.has(n)) rec.add(n)
        g.set(n, ng)
        parent.set(n, cur)
        heap.push({ key: [ng + h(n), h(n), order++], cell: n })
      }
    }
  }
  return parent
}

export const gridSearches = { 'bfs': bfs, 'dfs': dfs, 'best-first-search': bestFirst, 'a-star': aStar }

export function runGridSearch(id, grid, start, goal) {
  const visitStep = new Map()
  const addStep = new Map()
  const order = []
  const rec = {
    visit: c => { if (!visitStep.has(c)) { visitStep.set(c, order.length); order.push(c) } },
    add: c => { if (!addStep.has(c)) addStep.set(c, order.length) },
  }
  const parent = gridSearches[id](grid, start, goal, rec)
  const path = visitStep.has(goal) ? buildPath(parent, goal) : null
  return { order, visitStep, addStep, path }
}

// Labirinto perfeito (backtracking recursivo) em uma grade de dimensões ímpares.
export function makeMaze(rows, cols) {
  const walls = new Set()
  for (let i = 0; i < rows * cols; i++) walls.add(i)
  const stack = [[1, 1]]
  walls.delete(cols + 1)
  while (stack.length) {
    const [r, c] = stack[stack.length - 1]
    const options = [[-2, 0], [0, 2], [2, 0], [0, -2]]
      .map(([dr, dc]) => [r + dr, c + dc, r + dr / 2, c + dc / 2])
      .filter(([nr, nc]) => nr > 0 && nc > 0 && nr < rows - 1 && nc < cols - 1 && walls.has(nr * cols + nc))
    if (!options.length) { stack.pop(); continue }
    const [nr, nc, wr, wc] = options[Math.floor(Math.random() * options.length)]
    walls.delete(wr * cols + wc)
    walls.delete(nr * cols + nc)
    stack.push([nr, nc])
  }
  // abre algumas passagens extras para existirem vários caminhos
  for (let k = 0; k < (rows * cols) / 18; k++) {
    const r = 1 + Math.floor(Math.random() * (rows - 2)), c = 1 + Math.floor(Math.random() * (cols - 2))
    if ((r + c) % 2 === 1) walls.delete(r * cols + c)
  }
  return walls
}

export function makeRandomWalls(rows, cols, density = 0.27) {
  const walls = new Set()
  for (let i = 0; i < rows * cols; i++) if (Math.random() < density) walls.add(i)
  return walls
}
