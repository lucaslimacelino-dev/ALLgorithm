import { useMemo, useRef, useState } from 'react'
import { WORLD, geometryAlgorithms } from '../../lib/geometryFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const S = 10, W = WORLD.w * S, H = WORLD.h * S
const X = x => x * S
const Y = y => H - y * S
export const COLORS = {
  ink: 'rgb(var(--ink))', muted: 'rgb(var(--muted))', faint: 'rgb(var(--faint))', accent: 'rgb(var(--accent))', surface: 'rgb(var(--surface))',
  amber: '#f59e0b', rose: '#f43f5e', emerald: '#10b981', violet: '#8b5cf6', sky: '#0ea5e9',
}
const mono = { fontSize: 11, fontFamily: 'Geist Mono, monospace' }

function Shape({ s }) {
  const color = COLORS[s.c] ?? s.c
  const dash = s.dash ? '6 5' : undefined
  switch (s.t) {
    case 'pt':
      return (
        <g>
          <circle cx={X(s.p[0])} cy={Y(s.p[1])} r={s.r ?? 3.5} fill={color} stroke="rgb(var(--surface))" strokeWidth="1.5" />
          {s.label && <text x={X(s.p[0]) + 7} y={Y(s.p[1]) - 7} {...mono} fill={color}>{s.label}</text>}
        </g>
      )
    case 'seg':
      return <line x1={X(s.a[0])} y1={Y(s.a[1])} x2={X(s.b[0])} y2={Y(s.b[1])} stroke={color} strokeWidth={s.w ?? 2} strokeDasharray={dash} strokeLinecap="round" />
    case 'poly': {
      const points = s.pts.map(p => `${X(p[0])},${Y(p[1])}`).join(' ')
      const cx = s.pts.reduce((a, p) => a + p[0], 0) / s.pts.length, cy = s.pts.reduce((a, p) => a + p[1], 0) / s.pts.length
      const props = { points, fill: s.fill ? color : 'none', fillOpacity: s.op ?? 1, stroke: s.stroke ? COLORS[s.stroke] : color, strokeWidth: s.w ?? 2, strokeDasharray: dash, strokeLinejoin: 'round' }
      return (
        <g>
          {s.open ? <polyline {...props} fill="none" /> : <polygon {...props} />}
          {s.label && <text x={X(cx)} y={Y(cy) + 4} textAnchor="middle" {...mono} fontWeight="600" fill="rgb(var(--ink))">{s.label}</text>}
        </g>
      )
    }
    case 'band':
      return <rect x={X(s.x1)} y={0} width={X(s.x2) - X(s.x1)} height={H} fill={color} fillOpacity={s.op ?? 0.1} />
    case 'rect':
      return <rect x={X(s.x1)} y={Y(s.y2)} width={X(s.x2 - s.x1)} height={(s.y2 - s.y1) * S} fill={s.fill ? color : 'none'} fillOpacity={s.op ?? 1} stroke={color} strokeWidth={s.w ?? 2} strokeDasharray={dash} />
    default:
      return null
  }
}

// Visualizador genérico de geometria: cada quadro é uma lista de formas no plano (y para cima).
export default function GeometryVisualizer({ algorithm }) {
  const { t } = useI18n()
  const config = geometryAlgorithms[algorithm.id]
  const [input, setInput] = useState(config.example)
  const frames = useMemo(() => config.frames(input), [config, input])
  const player = usePlayer(frames.length, { speedScale: config.speedScale ?? 1 })
  const frame = frames[player.step]
  const svg = useRef(null)

  const replace = next => { player.reset(); setInput(next) }
  const onClick = e => {
    if (!config.click) return
    const pt = svg.current.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const q = pt.matrixTransform(svg.current.getScreenCTM().inverse())
    replace(config.click(input, [q.x / S, (H - q.y) / S]))
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-2 sm:px-4 pt-4 pb-2 border-b border-line">
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className={`w-full select-none ${config.click ? 'cursor-crosshair' : ''}`} onClick={onClick} role="img" aria-label={algorithm.name}>
          <rect width={W} height={H} fill="transparent" />
          {frame.shapes.map((s, i) => <Shape key={i} s={s} />)}
        </svg>
      </div>
      <StepNote>{frame.note}</StepNote>
      <PlayerControls player={player}>
        <button onClick={() => replace(config.random())} className="btn-ghost !h-9">{t(config.newKey)}</button>
        <button onClick={() => replace(config.example())} className="btn-ghost !h-9">{t('viz.example')}</button>
      </PlayerControls>
      <Legend
        items={config.legend.map(([cls, k]) => [cls, t(k)])}
        status={config.hintKey ? t(config.hintKey) : t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
