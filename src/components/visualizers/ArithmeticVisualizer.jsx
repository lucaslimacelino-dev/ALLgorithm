import { useMemo, useState } from 'react'
import { arithmeticFrames, visible } from '../../lib/compressionFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import TextForm from './TextForm'

const EXAMPLE = 'ABRACADABRA'
const MAX = 12
const W = 640, PAD = 92, BAR = 22, GAP = 16
const BW = W - PAD * 2
const num = v => Number(v.toPrecision(7)).toString()

// Codificação aritmética: cada símbolo encolhe o intervalo para a sua fatia; cada barra é um "zoom".
export default function ArithmeticVisualizer() {
  const { t } = useI18n()
  const [text, setText] = useState(EXAMPLE)
  const frames = useMemo(() => arithmeticFrames(text), [text])
  const player = usePlayer(frames.length, { speedScale: 1.6 })
  const f = frames[player.step]
  const rows = [...f.path, { low: f.low, high: f.high, current: true }]
  const H = rows.length * (BAR + GAP) + 10
  const y = k => 8 + k * (BAR + GAP)

  return (
    <figure className="card overflow-hidden">
      <div className="px-2 sm:px-4 pt-5 pb-3 border-b border-line">
        <div className="px-2 sm:px-2"><TextForm value={text} example={EXAMPLE} max={MAX} onApply={v => { player.reset(); setText(v) }} /></div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t('viz.interval')}>
          {rows.map((r, k) => {
            const chosen = r.sym !== undefined ? f.model.find(m => m.sym === r.sym) : null
            return (
              <g key={k}>
                <text x={PAD - 8} y={y(k) + BAR / 2 + 4} textAnchor="end" fontSize="10" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">{num(r.low)}</text>
                <text x={W - PAD + 8} y={y(k) + BAR / 2 + 4} fontSize="10" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">{num(r.high)}</text>
                {r.current && f.done ? (
                  <rect x={PAD} y={y(k)} width={BW} height={BAR} rx="5" fill="rgb(var(--accent))" />
                ) : (
                  f.model.map(m => {
                    const isChosen = chosen === m
                    return (
                      <g key={m.sym}>
                        <rect x={PAD + m.lo * BW} y={y(k)} width={(m.hi - m.lo) * BW} height={BAR} fill={isChosen ? 'rgb(var(--accent))' : 'rgb(var(--subtle))'} stroke="rgb(var(--surface))" strokeWidth="1.5" />
                        {(m.hi - m.lo) * BW > 14 && (
                          <text x={PAD + ((m.lo + m.hi) / 2) * BW} y={y(k) + BAR / 2 + 4} textAnchor="middle" fontSize="11" fontWeight={isChosen ? 600 : 400} fontFamily="Geist Mono, monospace" fill={isChosen ? 'white' : 'rgb(var(--muted))'}>{visible(m.sym)}</text>
                        )}
                      </g>
                    )
                  })
                )}
                {chosen && (
                  <g stroke="rgb(var(--accent) / 0.5)" strokeDasharray="3 3">
                    <line x1={PAD + chosen.lo * BW} y1={y(k) + BAR} x2={PAD} y2={y(k + 1)} />
                    <line x1={PAD + chosen.hi * BW} y1={y(k) + BAR} x2={PAD + BW} y2={y(k + 1)} />
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-subtle border border-line', t('viz.interval')], ['bg-accent', t('viz.chosenSlice')]]}
        status={f.done ? t('viz.codeBits', { c: f.code, n: f.code.length }) : t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
