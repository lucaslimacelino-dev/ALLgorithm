import { useMemo, useState } from 'react'
import { bwtFrames, visible } from '../../lib/compressionFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import TextForm from './TextForm'

const EXAMPLE = 'BANANA'
const MAX = 12

// Burrows-Wheeler: todas as rotações, ordenadas; a saída é a última coluna.
export default function BwtVisualizer() {
  const { t } = useI18n()
  const [text, setText] = useState(EXAMPLE)
  const frames = useMemo(() => bwtFrames(text), [text])
  const player = usePlayer(frames.length, { speedScale: 1.4 })
  const f = frames[player.step]
  const n = text.length + 1

  const cellClass = (r, c) => {
    if (f.phase === 'last' && c === n - 1) return 'bg-accent text-white font-semibold'
    if (f.phase !== 'rot' && c === 0) return 'bg-subtle text-ink'
    if (f.phase !== 'rot' && r === f.orig) return 'bg-amber-200/70 dark:bg-amber-400/25 text-ink'
    return 'text-ink/80'
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <TextForm value={text} example={EXAMPLE} max={MAX} valid={v => !v.includes('$')} onApply={v => { player.reset(); setText(v) }} />
        <div className="flex justify-center overflow-x-auto">
          <table className="font-mono text-sm border-separate border-spacing-[3px]">
            <tbody>
              {f.rows.map((row, r) => (
                <tr key={r}>
                  <td className="pr-2 text-right text-[10px] text-faint">{r}</td>
                  {[...row].map((ch, c) => (
                    <td key={c} className={`w-7 h-7 text-center rounded transition-colors duration-300 ${cellClass(r, c)} ${f.phase !== 'rot' && r === f.orig ? 'ring-1 ring-amber-400' : ''}`}>{visible(ch)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {f.out && (
          <p className="mt-4 text-center text-sm">
            <span className="text-muted">{t('viz.result')}: </span>
            <span className="font-mono font-medium text-ink">{visible(f.out)}</span>
            <span className="text-muted"> · {t('viz.originalRow')}: {f.orig}</span>
          </p>
        )}
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-subtle border border-line', t('viz.firstColumn')], ['bg-amber-300', t('viz.originalRow')], ['bg-accent', t('viz.lastColumn')]]}
        status={t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
