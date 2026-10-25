import { useMemo, useState } from 'react'
import { gramSchmidtFrames } from '../../lib/numericFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const W = 640, H = 340, UNIT = 52
const EXAMPLE = [[3, 1], [2, 2.5]]

const randomVectors = () => {
  const r = () => Math.round((Math.random() * 6 - 3) * 2) / 2
  let v1, v2
  do { v1 = [r(), r()]; v2 = [r(), r()] } while (Math.abs(v1[0] * v2[1] - v1[1] * v2[0]) < 1)
  return [v1, v2]
}

function Arrow({ v, color, width = 2.4, dashed, label, from = [0, 0] }) {
  const ox = W / 2 + from[0] * UNIT, oy = H / 2 - from[1] * UNIT
  const x = W / 2 + (from[0] + v[0]) * UNIT, y = H / 2 - (from[1] + v[1]) * UNIT
  const ang = Math.atan2(y - oy, x - ox)
  const head = [[x, y], [x - 10 * Math.cos(ang - 0.4), y - 10 * Math.sin(ang - 0.4)], [x - 10 * Math.cos(ang + 0.4), y - 10 * Math.sin(ang + 0.4)]]
  return (
    <g>
      <line x1={ox} y1={oy} x2={x} y2={y} stroke={color} strokeWidth={width} strokeDasharray={dashed ? '6 4' : undefined} />
      <polygon points={head.map(p => p.join(',')).join(' ')} fill={color} />
      {label && <text x={x + 8 * Math.cos(ang)} y={y + 8 * Math.sin(ang) + 4} fontSize="13" fontFamily="Geist Mono, monospace" fill={color}>{label}</text>}
    </g>
  )
}

export default function GramSchmidtVisualizer() {
  const { t } = useI18n()
  const [vectors, setVectors] = useState(EXAMPLE)
  const frames = useMemo(() => gramSchmidtFrames(vectors), [vectors])
  const player = usePlayer(frames.length, { speedScale: 1.8 })
  const frame = frames[player.step]

  return (
    <figure className="card overflow-hidden">
      <div className="px-2 sm:px-4 pt-4 pb-2 border-b border-line">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Gram-Schmidt">
          {Array.from({ length: 13 }, (_, i) => i - 6).map(k => (
            <g key={k}>
              <line x1={W / 2 + k * UNIT} x2={W / 2 + k * UNIT} y1={0} y2={H} stroke="rgb(var(--line) / 0.6)" />
              <line x1={0} x2={W} y1={H / 2 + k * UNIT} y2={H / 2 + k * UNIT} stroke="rgb(var(--line) / 0.6)" />
            </g>
          ))}
          <line x1={0} x2={W} y1={H / 2} y2={H / 2} stroke="rgb(var(--faint))" />
          <line x1={W / 2} x2={W / 2} y1={0} y2={H} stroke="rgb(var(--faint))" />
          {frame.vs.map((v, i) => <Arrow key={`v${i}`} v={v} color="rgb(var(--faint))" width={2} label={`v${i + 1}`} />)}
          {frame.proj && <Arrow v={frame.proj} color="#f43f5e" dashed label="proj" />}
          {frame.u && <Arrow v={frame.u} color="#f59e0b" width={2.8} label={`u${frame.current + 1}`} />}
          {frame.es.map((e, i) => <Arrow key={`e${i}`} v={e} color="rgb(var(--accent))" width={3.2} label={`e${i + 1}`} />)}
          <circle cx={W / 2} cy={H / 2} r="3" fill="rgb(var(--ink))" />
        </svg>
      </div>
      <StepNote>{frame.note}</StepNote>
      <PlayerControls player={player}>
        <button onClick={() => { player.reset(); setVectors(randomVectors()) }} className="btn-ghost !h-9">{t('viz.newVectors')}</button>
      </PlayerControls>
      <Legend
        items={[['bg-faint', t('viz.inputVectors')], ['bg-rose-500', t('viz.projection')], ['bg-amber-400', t('viz.residual')], ['bg-accent', t('viz.orthonormal')]]}
        status={t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
