import { useMemo, useRef, useState } from 'react'
import { makeMaze, makeRandomWalls, runGridSearch } from '../../lib/gridSearch'
import { Legend, PlayerControls, usePlayer } from './Player'

const ROWS = 15
const COLS = 31
const START = 1 * COLS + 1
const GOAL = (ROWS - 2) * COLS + (COLS - 2)

const clearEnds = walls => { walls.delete(START); walls.delete(GOAL); return walls }

export default function GridSearchVisualizer({ algorithm }) {
  const [walls, setWalls] = useState(() => clearEnds(makeRandomWalls(ROWS, COLS)))
  const grid = useMemo(() => ({ rows: ROWS, cols: COLS, walls }), [walls])
  const result = useMemo(() => runGridSearch(algorithm.id, grid, START, GOAL), [algorithm.id, grid])
  // quadros: 0 = início, 1..N = cada visita, N+1 = caminho final
  const player = usePlayer(result.order.length + 2, { speedScale: 0.1 })
  const showPath = player.step === player.last
  const visited = Math.min(player.step, result.order.length)

  const painting = useRef(null)
  const paint = cell => {
    if (cell === START || cell === GOAL) return
    setWalls(prev => {
      const next = new Set(prev)
      if (painting.current === 'add') next.add(cell)
      else next.delete(cell)
      return next
    })
  }
  const onPointerDown = cell => {
    painting.current = walls.has(cell) ? 'remove' : 'add'
    player.reset()
    paint(cell)
  }
  const replaceWalls = w => { player.reset(); setWalls(clearEnds(w)) }

  const pathSet = useMemo(() => new Set(showPath && result.path ? result.path : []), [showPath, result.path])
  const current = player.step >= 1 && player.step <= result.order.length ? result.order[player.step - 1] : null

  const cellClass = cell => {
    if (cell === START) return 'bg-emerald-500'
    if (cell === GOAL) return 'bg-rose-500'
    if (walls.has(cell)) return 'bg-ink/80'
    if (pathSet.has(cell)) return 'bg-accent'
    if (cell === current) return 'bg-amber-500'
    const v = result.visitStep.get(cell)
    if (v !== undefined && v < visited) return 'bg-accent/20'
    const a = result.addStep.get(cell)
    if (a !== undefined && a <= visited) return 'bg-amber-300/70'
    return 'bg-surface'
  }

  const status = showPath
    ? (result.path ? `${result.order.length} células visitadas · caminho de ${result.path.length - 1} passos` : `${result.order.length} células visitadas · sem caminho`)
    : `${visited} células visitadas`

  return (
    <figure className="card overflow-hidden">
      <div className="p-3 sm:p-5 border-b border-line">
        <div
          className="grid gap-px bg-line/70 rounded-lg overflow-hidden border border-line select-none touch-none"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          onPointerUp={() => { painting.current = null }}
          onPointerLeave={() => { painting.current = null }}
        >
          {Array.from({ length: ROWS * COLS }, (_, cell) => (
            <div
              key={cell}
              onPointerDown={e => { e.preventDefault(); onPointerDown(cell) }}
              onPointerEnter={() => painting.current && paint(cell)}
              className={`aspect-square transition-colors duration-150 cursor-crosshair ${cellClass(cell)}`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-faint">Clique e arraste na grade para desenhar ou apagar paredes.</p>
      </div>

      <PlayerControls player={player}>
        <button onClick={() => replaceWalls(makeMaze(ROWS, COLS))} className="btn-ghost !h-9">Labirinto</button>
        <button onClick={() => replaceWalls(makeRandomWalls(ROWS, COLS))} className="btn-ghost !h-9">Aleatório</button>
        <button onClick={() => replaceWalls(new Set())} className="btn-ghost !h-9">Limpar</button>
      </PlayerControls>

      <Legend
        items={[
          ['bg-emerald-500', 'Início'],
          ['bg-rose-500', 'Destino'],
          ['bg-amber-300', 'Fronteira'],
          ['bg-accent/20', 'Visitado'],
          ['bg-accent', 'Caminho'],
        ]}
        status={status}
      />
    </figure>
  )
}
