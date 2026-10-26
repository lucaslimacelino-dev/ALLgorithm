import { useMemo, useState } from 'react'
import { CURVE, GENERATOR, curvePoints, ecFrames } from '../../lib/publicKeyFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const SIZE = 360, PAD = 20
const S = (SIZE - 2 * PAD) / (CURVE.p - 1)
const X = x => PAD + x * S
const Y = y => SIZE - PAD - y * S
const POINTS = curvePoints()
const EXAMPLE = { k: '37' }

// Multiplicação escalar em uma curva elíptica sobre um corpo finito (dobra e soma).
export default function EllipticCurveVisualizer() {
  const { t } = useI18n()
  const [input, setInput] = useState(EXAMPLE)
  const frames = useMemo(() => ecFrames(Number(input.k)), [input])
  const player = usePlayer(frames.length, { speedScale: 2 })
  const f = frames[player.step]
  const { G, n } = GENERATOR
  const trail = [G, ...f.path].filter(Boolean)

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-line">
        <FieldsForm
          fields={[{ name: 'k', label: t('viz.scalarK', { n: n - 1 }), max: 3, width: 'w-40' }]}
          values={input}
          example={EXAMPLE}
          valid={v => /^\d+$/.test(v.k) && ecFrames(Number(v.k)).length > 0}
          onApply={v => { player.reset(); setInput(v) }}
        />
        <div className="flex flex-wrap items-center justify-center gap-6">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[400px]" role="img" aria-label="Curva elíptica">
            <rect x={PAD - 6} y={PAD - 6} width={SIZE - 2 * PAD + 12} height={SIZE - 2 * PAD + 12} rx="8" fill="rgb(var(--subtle) / 0.6)" />
            {POINTS.map(([x, y]) => <circle key={`${x},${y}`} cx={X(x)} cy={Y(y)} r="2.4" fill="rgb(var(--faint))" />)}
            <polyline points={trail.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')} fill="none" stroke="rgb(var(--accent) / 0.45)" strokeWidth="1.5" strokeDasharray="4 3" />
            {f.path.map(([x, y], i) => <circle key={i} cx={X(x)} cy={Y(y)} r="3.5" fill="rgb(var(--accent) / 0.6)" />)}
            <circle cx={X(G[0])} cy={Y(G[1])} r="6" fill="#10b981" />
            <text x={X(G[0]) + 8} y={Y(G[1]) + 4} fontSize="12" fontFamily="Geist Mono, monospace" fill="#10b981">G</text>
            {f.R && <circle cx={X(f.R[0])} cy={Y(f.R[1])} r="7" fill="#f59e0b" stroke="rgb(var(--surface))" strokeWidth="2" />}
          </svg>
          <div className="text-sm space-y-3 min-w-[180px]">
            <p className="text-muted">y² = x³ + {CURVE.a}x + {CURVE.b} (mod {CURVE.p})</p>
            <p className="font-mono text-ink">k = {input.k} = {f.bits.split('').map((b, i) => <span key={i} className={i === f.i ? 'text-amber-500 font-semibold' : i < f.i ? 'text-ink' : 'text-faint'}>{b}</span>)}₂</p>
            <p className="font-mono">R = <span className="text-amber-500">{f.R ? `(${f.R[0]}, ${f.R[1]})` : 'O'}</span></p>
            <p className="text-xs text-muted">{t('viz.curveStats', { pts: POINTS.length, n })}</p>
          </div>
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={[['bg-emerald-500', t('viz.basePoint')], ['bg-amber-400', t('viz.currentPoint')], ['bg-accent/60', t('viz.visitedPoints')]]} status={t('player.step', { s: player.step, t: player.last })} />
    </figure>
  )
}
