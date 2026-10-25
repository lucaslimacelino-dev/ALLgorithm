// Algoritmos de rasterização em uma grade de pixels (x para a direita, y para baixo, como na tela).
// Quadros: { cells: [[x, y, tipo]], overlay?: { line?: [a, b], circle?: [c, r] }, note }
// Tipos de célula: wall, fill, frontier, seed, pixel, current, mirror, end.

export const GRID = { cols: 32, rows: 18 }

const key = (x, y) => `${x},${y}`
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
const inside = (x, y) => x >= 0 && y >= 0 && x < GRID.cols && y < GRID.rows

// Linha de Bresenham para todos os octantes (versão com erro inteiro de Zingl).
export function bresenhamPoints([x0, y0], [x1, y1], record) {
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1
  let err = dx + dy
  const pts = []
  for (;;) {
    pts.push([x0, y0])
    if (x0 === x1 && y0 === y1) { record?.({ x: x0, y: y0, err, last: true }); break }
    const e2 = 2 * err
    const stepX = e2 >= dy, stepY = e2 <= dx
    record?.({ x: x0, y: y0, err, e2, stepX, stepY, dx, dy })
    if (stepX) { err += dy; x0 += sx }
    if (stepY) { err += dx; y0 += sy }
  }
  return pts
}

function bresenhamFrames({ a, b }) {
  const dx = Math.abs(b[0] - a[0]), dy = Math.abs(b[1] - a[1])
  const frames = [{ cells: [[...a, 'end'], [...b, 'end']], overlay: { line: [a, b] }, note: `Linha de (${a}) até (${b}): dx = ${dx} e dy = −${dy} (negativo por convenção). O erro começa em dx + dy = ${dx - dy}. A cada passo, um termo de erro inteiro decide se o próximo pixel avança em x, em y ou nos dois — sem multiplicações nem números decimais.` }]
  const lit = []
  bresenhamPoints(a, b, s => {
    lit.push([s.x, s.y, 'pixel'])
    const cells = [...lit.slice(0, -1), [s.x, s.y, 'current'], [...b, 'end']]
    let note
    if (s.last) note = `Chegou ao ponto final (${b}): ${lit.length} pixels acesos.`
    else {
      const moves = [s.stepX && `2·erro = ${s.e2} ≥ dy = ${s.dy} → avança em x`, s.stepY && `2·erro = ${s.e2} ≤ dx = ${s.dx} → avança em y`].filter(Boolean)
      note = `Acende (${s.x}, ${s.y}). Erro = ${s.err}: ${moves.join('; ')}.`
    }
    frames.push({ cells, overlay: { line: [a, b] }, note })
  })
  frames.push({ cells: lit, overlay: { line: [a, b] }, note: `Pronto: ${lit.length} pixels, um por coluna (ou por linha, se a reta for mais vertical) — os mais próximos da reta ideal, calculados só com somas inteiras.` })
  return frames
}

function circleFrames({ c, r }) {
  const [cx, cy] = c
  let x = r, y = 0, d = 1 - r
  const lit = new Map()
  const frames = [{ cells: [[cx, cy, 'end']], overlay: { circle: [c, r] }, note: `Círculo de centro (${cx}, ${cy}) e raio ${r}. Calcula só um oitavo do círculo e espelha cada ponto nos outros 7 octantes. O parâmetro de decisão começa em d = 1 − r = ${d}.` }]
  while (x >= y) {
    const [px, py] = [x, y]
    const mirrors = [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]].map(([u, v]) => [cx + u, cy - v])
    const fresh = mirrors.filter(([u, v]) => !lit.has(key(u, v)))
    const cells = [...lit.values(), ...fresh.map(([u, v]) => [u, v, u === cx + px && v === cy - py ? 'current' : 'mirror']), [cx, cy, 'end']]
    for (const [u, v] of fresh) lit.set(key(u, v), [u, v, 'pixel'])
    const dPrev = d
    y++
    let move
    if (d < 0) { d += 2 * y + 1; move = `d = ${dPrev} < 0: o ponto médio está dentro do círculo — mantém x. Novo d = ${d}.` }
    else { x--; d += 2 * (y - x) + 1; move = `d = ${dPrev} ≥ 0: o ponto médio está fora — diminui x. Novo d = ${d}.` }
    frames.push({ cells, overlay: { circle: [c, r] }, note: `Deslocamento (x, y) = (${px}, ${py}) a partir do centro, no primeiro octante, e seus 7 reflexos. ${move}` })
  }
  frames.push({ cells: [...lit.values(), [cx, cy, 'end']], overlay: { circle: [c, r] }, note: `Pronto: ${lit.size} pixels calculados com somas inteiras — só ${Math.ceil(lit.size / 8)} pontos de verdade; o resto é simetria.` })
  return frames
}

function floodFrames({ walls, seed }) {
  const wallCells = [...walls].map(k => [...k.split(',').map(Number), 'wall'])
  if (walls.has(key(...seed))) return [{ cells: wallCells, note: 'A semente caiu em uma parede. Clique em uma célula vazia.' }]
  const filled = new Set([key(...seed)])
  let frontier = [seed]
  const frames = [{ cells: [...wallCells, [...seed, 'seed']], note: `Semente em (${seed}). O preenchimento por inundação pinta a semente e espalha a cor para os 4 vizinhos (cima, baixo, esquerda, direita) que ainda têm a cor original.` }]
  let layer = 0
  while (frontier.length) {
    const next = []
    for (const [x, y] of frontier) {
      for (const [u, v] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        const k = key(u, v)
        if (inside(u, v) && !walls.has(k) && !filled.has(k)) { filled.add(k); next.push([u, v]) }
      }
    }
    layer++
    const all = [...filled].map(k => [...k.split(',').map(Number), 'fill'])
    const front = new Set(next.map(p => key(...p)))
    frames.push({
      cells: [...wallCells, ...all.map(([x, y]) => [x, y, front.has(key(x, y)) ? 'frontier' : 'fill'])],
      note: next.length ? `Onda ${layer}: ${next.length} célula${next.length > 1 ? 's' : ''} nova${next.length > 1 ? 's' : ''} entra${next.length > 1 ? 'm' : ''} na fila (em amarelo). Total pintado: ${filled.size}.` : `A fila esvaziou: nenhum vizinho com a cor original. ${filled.size} células pintadas.`,
    })
    frontier = next
  }
  return frames
}

// Paredes: contornos de retângulos e linhas, desenhados com Bresenham.
function rectWalls(set, x0, y0, x1, y1) {
  for (let x = x0; x <= x1; x++) { set.add(key(x, y0)); set.add(key(x, y1)) }
  for (let y = y0; y <= y1; y++) { set.add(key(x0, y)); set.add(key(x1, y)) }
}

function exampleWalls() {
  const s = new Set()
  rectWalls(s, 2, 1, 29, 16)
  rectWalls(s, 9, 5, 18, 11)
  bresenhamPoints([22, 1], [26, 10]).forEach(p => s.add(key(...p)))
  bresenhamPoints([2, 12], [8, 16]).forEach(p => s.add(key(...p)))
  for (let x = 12; x <= 15; x++) s.delete(key(x, 5)) // abertura na caixa interna
  return { walls: s, seed: [5, 4] }
}

function randomWalls() {
  const s = new Set()
  for (let i = 0; i < 4; i++) {
    const x0 = randInt(0, 22), y0 = randInt(0, 10)
    rectWalls(s, x0, y0, Math.min(GRID.cols - 1, x0 + randInt(4, 12)), Math.min(GRID.rows - 1, y0 + randInt(3, 7)))
  }
  for (let i = 0; i < 3; i++) bresenhamPoints([randInt(0, 31), randInt(0, 17)], [randInt(0, 31), randInt(0, 17)]).forEach(p => s.add(key(...p)))
  let seed
  do seed = [randInt(0, 31), randInt(0, 17)]; while (s.has(key(...seed)))
  return { walls: s, seed }
}

export const rasterAlgorithms = {
  'bresenham-line': {
    example: () => ({ a: [2, 14], b: [29, 3] }),
    random: () => ({ a: [randInt(1, 30), randInt(1, 16)], b: [randInt(1, 30), randInt(1, 16)] }),
    click: (input, cell, n) => (n % 2 === 0 ? { ...input, a: cell } : { ...input, b: cell }),
    frames: bresenhamFrames, hintKey: 'viz.clickEndpoints', newKey: 'viz.newLine',
    legend: [['bg-accent', 'viz.pixelLit'], ['bg-amber-400', 'viz.currentPixel'], ['bg-rose-500', 'viz.idealLine']],
  },
  'midpoint-circle': {
    example: () => ({ c: [16, 9], r: 7 }),
    random: () => ({ c: [randInt(9, 22), randInt(6, 11)], r: randInt(3, 8) }),
    click: (input, cell) => ({ ...input, c: cell }),
    frames: circleFrames, hintKey: 'viz.clickCenter', newKey: 'viz.newCircle',
    legend: [['bg-accent', 'viz.pixelLit'], ['bg-amber-400', 'viz.currentPixel'], ['bg-violet-500', 'viz.mirrored'], ['bg-rose-500', 'viz.idealCircle']],
  },
  'flood-fill': {
    example: exampleWalls,
    random: randomWalls,
    click: (input, cell) => ({ ...input, seed: cell }),
    frames: floodFrames, hintKey: 'viz.clickToFill', newKey: 'viz.newDrawing',
    legend: [['bg-ink', 'viz.wall'], ['bg-accent', 'viz.filled'], ['bg-amber-400', 'viz.frontier']],
  },
}
