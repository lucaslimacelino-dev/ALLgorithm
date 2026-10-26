import { useMemo, useState } from 'react'
import { dpAlgorithms } from '../../lib/dpFrames'
import { languageTables } from '../../lib/languageFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const has = (list, r, c) => list?.some(([a, b]) => a === r && b === c)

// Programação dinâmica: a tabela sendo preenchida, com as células de que cada valor depende.
export default function DpTableVisualizer({ algorithm }) {
  const { t } = useI18n()
  const config = dpAlgorithms[algorithm.id] ?? languageTables[algorithm.id]
  const example = Object.fromEntries(config.fields.map(([k, v]) => [k, v]))
  const [input, setInput] = useState(example)
  const frames = useMemo(() => config.run(input), [config, input])
  const player = usePlayer(frames.length, { speedScale: 0.8 })
  const f = frames[player.step]

  const cellClass = (r, c) => {
    if (f.cur && f.cur[0] === r && f.cur[1] === c) return 'bg-amber-400 text-ink font-semibold'
    if (has(f.path, r, c)) return 'bg-accent text-white font-semibold'
    if (has(f.deps, r, c)) return 'bg-sky-500/25 text-ink ring-1 ring-sky-500'
    return f.table[r][c] === null ? 'bg-subtle/40 text-faint' : 'bg-subtle text-ink'
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={config.fields.map(([name, , max]) => ({ name, label: name, max, width: max > 12 ? 'flex-1 min-w-[180px]' : 'w-28' }))}
          values={input}
          example={example}
          valid={v => config.run(v).length > 0}
          onApply={v => { player.reset(); setInput(v) }}
        />
        <div className="overflow-x-auto">
          <table className="mx-auto font-mono text-[13px] border-separate border-spacing-[3px]">
            <thead>
              <tr>
                <th className="text-[10px] text-faint font-normal text-right pr-1">{frames[0].rowTitle && frames[0].colTitle ? `${frames[0].rowTitle} ╲ ${frames[0].colTitle}` : ''}</th>
                {f.cols.map((c, j) => <th key={j} className="min-w-[30px] text-xs text-muted font-medium">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {f.table.map((row, r) => (
                <tr key={r}>
                  <th className="pr-2 text-right text-xs text-muted font-medium whitespace-nowrap">{f.rows[r]}</th>
                  {row.map((v, c) => (
                    <td key={c} className={`min-w-[30px] h-8 px-1.5 text-center rounded-md transition-colors duration-200 ${cellClass(r, c)}`}>{v ?? ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-amber-400', t('viz.computing')], ['bg-sky-500/40', t('viz.dependsOn')], ['bg-accent', t('viz.answerPath')]]}
        status={f.result ? `${t('viz.result')}: ${f.result}` : t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
