import { useMemo, useState } from 'react'
import { functions, rootFrames } from '../../lib/numericFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const W = 640, H = 300, PAD = 32
const methodOf = { 'newton-method': 'newton', 'secant-method': 'secant', 'false-position': 'falsePosition' }

// Newton, Secante e Falsa Posição: o gráfico mostra cada reta usada para estimar a raiz.
export default function RootFindingVisualizer({ algorithm }) {
  const { t } = useI18n()
  const method = methodOf[algorithm.id]
  const [fnIndex, setFnIndex] = useState(0)
  const fn = functions[fnIndex]
  const frames = useMemo(() => rootFrames(method, fn), [method, fn])
  const player = usePlayer(frames.length, { speedScale: 1.4 })
  const frame = frames[player.step]

  const [x0, x1] = fn.range
  const samples = useMemo(() => Array.from({ length: 161 }, (_, i) => x0 + (x1 - x0) * i / 160), [x0, x1])
  const ys = samples.map(fn.f)
  const yMin = Math.min(...ys, 0), yMax = Math.max(...ys, 0)
  const sx = x => PAD + (x - x0) / (x1 - x0) * (W - 2 * PAD)
  const sy = y => H - PAD - (y - yMin) / (yMax - yMin) * (H - 2 * PAD)
  const clampY = y => Math.max(PAD / 2, Math.min(H - PAD / 2, y))
  const path = samples.map((x, i) => `${i ? 'L' : 'M'} ${sx(x)} ${sy(ys[i])}`).join(' ')

  // reta para desenhar: tangente (Newton) ou secante entre dois pontos
  let line = null
  if (frame.tangent) {
    const { x0: tx, y0: ty, slope } = frame.tangent
    line = [[x0, ty + slope * (x0 - tx)], [x1, ty + slope * (x1 - tx)]]
  } else if (frame.secant) {
    const [a, b] = frame.secant
    const fa = fn.f(a), fb = fn.f(b), m = (fb - fa) / (b - a)
    line = [[x0, fa + m * (x0 - a)], [x1, fa + m * (x1 - a)]]
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-line">
        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
          <span className="text-muted mr-1">{t('viz.function')}</span>
          {functions.map((f, i) => (
            <button key={f.label} onClick={() => { player.reset(); setFnIndex(i) }} className={`h-8 px-3 rounded-full text-[13px] font-mono border ${i === fnIndex ? 'bg-ink text-paper border-ink' : 'border-line text-muted hover:text-ink'}`}>
              f(x) = {f.label}
            </button>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`f(x) = ${fn.label}`}>
          <defs><clipPath id="plot"><rect x={PAD / 2} y={PAD / 2} width={W - PAD} height={H - PAD} /></clipPath></defs>
          {frame.bracket && (
            <rect x={sx(frame.bracket[0])} y={PAD / 2} width={Math.max(1, sx(frame.bracket[1]) - sx(frame.bracket[0]))} height={H - PAD} fill="rgb(var(--accent) / 0.08)" />
          )}
          <line x1={PAD / 2} x2={W - PAD / 2} y1={sy(0)} y2={sy(0)} stroke="rgb(var(--line))" strokeWidth="1.5" />
          {x0 < 0 && x1 > 0 && <line x1={sx(0)} x2={sx(0)} y1={PAD / 2} y2={H - PAD / 2} stroke="rgb(var(--line))" strokeWidth="1" />}
          <path d={path} fill="none" stroke="rgb(var(--ink))" strokeWidth="2.2" clipPath="url(#plot)" />
          {line && (
            <line x1={sx(line[0][0])} y1={clampY(sy(line[0][1]))} x2={sx(line[1][0])} y2={clampY(sy(line[1][1]))} stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="6 4" clipPath="url(#plot)" />
          )}
          {frame.x !== undefined && (
            <g>
              <line x1={sx(frame.x)} x2={sx(frame.x)} y1={sy(0)} y2={sy(fn.f(frame.x))} stroke="rgb(var(--faint))" strokeDasharray="2 3" clipPath="url(#plot)" />
              <circle cx={sx(frame.x)} cy={clampY(sy(fn.f(frame.x)))} r="5" fill="#f59e0b" />
            </g>
          )}
          {frame.nx !== undefined && <circle cx={sx(frame.nx)} cy={sy(0)} r="5.5" fill="rgb(var(--accent))" stroke="rgb(var(--surface))" strokeWidth="2" />}
          {[x0, (x0 + x1) / 2, x1].map(v => (
            <text key={v} x={sx(v)} y={H - 6} textAnchor="middle" fontSize="11" fontFamily="Geist Mono, monospace" fill="rgb(var(--faint))">{Number(v.toFixed(2))}</text>
          ))}
        </svg>
      </div>
      <StepNote>{frame.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-amber-400', t('viz.iterate')], ['bg-amber-300', t('viz.tangent')], ['bg-accent', t('viz.estimate')], ...(method === 'falsePosition' ? [['bg-accent/20', t('viz.bracket')]] : [])]}
        status={t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
