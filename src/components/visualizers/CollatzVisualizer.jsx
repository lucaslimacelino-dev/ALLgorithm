import { useMemo, useState } from 'react'
import { collatzFrames } from '../../lib/languageFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const W = 640, H = 220, EXAMPLE = { n: '27' }

// O programa de Collatz: ninguém provou que ele sempre para.
export default function CollatzVisualizer() {
  const { t } = useI18n()
  const [input, setInput] = useState(EXAMPLE)
  const frames = useMemo(() => collatzFrames(Number(input.n)), [input])
  const player = usePlayer(frames.length, { speedScale: 0.4 })
  const f = frames[player.step]
  const all = frames.at(-1).values
  const max = Math.max(...all), len = Math.max(1, all.length - 1)
  const P = (v, i) => `${10 + (i / len) * (W - 20)},${H - 10 - (v / max) * (H - 30)}`
  const cur = f.values.at(-1)

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={[{ name: 'n', label: 'n (1 – 10⁹)', max: 10, width: 'w-40' }]}
          values={input}
          example={EXAMPLE}
          valid={v => /^\d+$/.test(v.n) && collatzFrames(Number(v.n)).length > 0}
          onApply={v => { player.reset(); setInput(v) }}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <polyline points={f.values.map(P).join(' ')} fill="none" stroke="rgb(var(--accent))" strokeWidth="2" strokeLinejoin="round" />
          {(() => { const [x, y] = P(cur, f.values.length - 1).split(','); return <circle cx={x} cy={y} r="5" fill="#f59e0b" /> })()}
        </svg>
        <p className="mt-2 text-sm text-muted text-center">
          n = <span className="font-mono text-ink">{cur}</span> · {t('viz.stepsSoFar')}: <span className="font-mono text-ink">{f.values.length - 1}</span> · {t('viz.peak')}: <span className="font-mono text-ink">{Math.max(...f.values)}</span>
        </p>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={[['bg-accent', t('viz.trajectory')], ['bg-amber-400', t('viz.currentValue')]]} status={t('player.step', { s: player.step, t: player.last })} />
    </figure>
  )
}
