import { useMemo, useState } from 'react'
import { gaussJordanFrames } from '../../lib/numericFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const EXAMPLE = [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]]

function randomSystem() {
  const x = Array.from({ length: 3 }, () => Math.round(Math.random() * 10 - 5))
  const A = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => Math.round(Math.random() * 12 - 6)))
  return A.map(row => [...row, row.reduce((s, a, j) => s + a * x[j], 0)])
}

const show = v => {
  const r = Math.round(v * 1000) / 1000
  return Object.is(r, -0) ? '0' : String(r)
}

// Gauss-Jordan: a matriz aumentada é transformada linha a linha até a identidade.
export default function MatrixVisualizer() {
  const { t } = useI18n()
  const [M, setM] = useState(EXAMPLE)
  const frames = useMemo(() => gaussJordanFrames(M), [M])
  const player = usePlayer(frames.length, { speedScale: 1.6 })
  const frame = frames[player.step]
  const n = frame.m.length

  const cellClass = (r, c) => {
    if (frame.pivot && frame.pivot[0] === r && frame.pivot[1] === c) return 'bg-amber-400 text-ink font-semibold'
    if (frame.rows?.includes(r)) return 'bg-accent/15 text-ink'
    if (frame.done && c === n) return 'bg-ink text-paper font-semibold'
    return 'bg-subtle text-ink'
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-6 pb-6 border-b border-line flex justify-center overflow-x-auto">
        <table className="font-mono text-sm border-separate border-spacing-1.5">
          <tbody>
            {frame.m.map((row, r) => (
              <tr key={r}>
                {row.map((v, c) => (
                  <td key={c} className={`w-16 sm:w-20 h-11 text-center rounded-lg transition-colors duration-300 ${cellClass(r, c)} ${c === n ? 'border-l-4 border-paper' : ''}`}>
                    {show(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <StepNote>{frame.note}</StepNote>
      <PlayerControls player={player}>
        <button onClick={() => { player.reset(); setM(randomSystem()) }} className="btn-ghost !h-9">{t('viz.newSystem')}</button>
        <button onClick={() => { player.reset(); setM(EXAMPLE) }} className="btn-ghost !h-9">{t('viz.example')}</button>
      </PlayerControls>
      <Legend items={[['bg-amber-400', t('viz.pivot')], ['bg-accent/20', t('viz.rowChanged')], ['bg-ink', t('viz.solution')]]} status={t('player.step', { s: player.step, t: player.last })} />
    </figure>
  )
}
