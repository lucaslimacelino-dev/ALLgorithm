import { useMemo, useRef, useState } from 'react'
import { GRID, rasterAlgorithms } from '../../lib/rasterFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const C = 20, W = GRID.cols * C, H = GRID.rows * C
const FILL = {
  wall: 'rgb(var(--ink))', fill: 'rgb(var(--accent) / 0.7)', frontier: '#fbbf24', seed: '#f59e0b',
  pixel: 'rgb(var(--accent))', current: '#f59e0b', mirror: '#8b5cf6', end: 'rgb(var(--ink) / 0.18)',
}
const center = v => v * C + C / 2

// Grade de pixels: rasterização de linhas e círculos e preenchimento por inundação.
export default function RasterVisualizer({ algorithm }) {
  const { t } = useI18n()
  const config = rasterAlgorithms[algorithm.id]
  const [input, setInput] = useState(config.example)
  const frames = useMemo(() => config.frames(input), [config, input])
  const player = usePlayer(frames.length, { speedScale: 0.9 })
  const frame = frames[player.step]
  const svg = useRef(null)
  const clicks = useRef(0)

  const replace = next => { player.reset(); setInput(next) }
  const onClick = e => {
    const pt = svg.current.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const q = pt.matrixTransform(svg.current.getScreenCTM().inverse())
    const cell = [Math.floor(q.x / C), Math.floor(q.y / C)]
    if (cell[0] < 0 || cell[1] < 0 || cell[0] >= GRID.cols || cell[1] >= GRID.rows) return
    replace(config.click(input, cell, clicks.current++))
  }

  const { line, circle } = frame.overlay ?? {}
  return (
    <figure className="card overflow-hidden">
      <div className="px-2 sm:px-4 pt-4 pb-3 border-b border-line">
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="w-full cursor-crosshair select-none" onClick={onClick} role="img" aria-label={algorithm.name}>
          <rect width={W} height={H} fill="rgb(var(--surface))" />
          {frame.cells.map(([x, y, kind]) => (
            <rect key={`${x},${y},${kind}`} x={x * C + 1} y={y * C + 1} width={C - 2} height={C - 2} rx="3" fill={FILL[kind]} className="transition-colors duration-200" />
          ))}
          {Array.from({ length: GRID.cols + 1 }, (_, i) => <line key={`v${i}`} x1={i * C} x2={i * C} y1={0} y2={H} stroke="rgb(var(--line) / 0.7)" />)}
          {Array.from({ length: GRID.rows + 1 }, (_, i) => <line key={`h${i}`} y1={i * C} y2={i * C} x1={0} x2={W} stroke="rgb(var(--line) / 0.7)" />)}
          {line && <line x1={center(line[0][0])} y1={center(line[0][1])} x2={center(line[1][0])} y2={center(line[1][1])} stroke="#f43f5e" strokeWidth="2" />}
          {circle && <circle cx={center(circle[0][0])} cy={center(circle[0][1])} r={circle[1] * C} fill="none" stroke="#f43f5e" strokeWidth="2" />}
        </svg>
      </div>
      <StepNote>{frame.note}</StepNote>
      <PlayerControls player={player}>
        <button onClick={() => replace(config.random())} className="btn-ghost !h-9">{t(config.newKey)}</button>
        <button onClick={() => replace(config.example())} className="btn-ghost !h-9">{t('viz.example')}</button>
      </PlayerControls>
      <Legend items={config.legend.map(([cls, k]) => [cls, t(k)])} status={t(config.hintKey)} />
    </figure>
  )
}
