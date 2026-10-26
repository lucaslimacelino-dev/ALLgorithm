import { useMemo, useState } from 'react'
import { numberAlgorithms } from '../../lib/numberFrames'
import { numericTraces } from '../../lib/numericFrames'
import { compressionTraces } from '../../lib/compressionFrames'
import { cryptoTraces } from '../../lib/cipherFrames'
import { publicKeyTraces } from '../../lib/publicKeyFrames'
import { languageTraces } from '../../lib/languageFrames'
import { bitTraces } from '../../lib/bitFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

// Entradas: [nome, padrão, mínimo, máximo, tipo?] — tipo true aceita decimais; 'text' recebe texto
// (mínimo e máximo viram limites de tamanho).
const toNumber = v => Number(String(v).replace(',', '.'))
const parse = (config, values) => Object.fromEntries(config.inputs.map(([name, , , , kind]) => [name, kind === 'text' ? values[name] : toNumber(values[name])]))
const defaults = config => Object.fromEntries(config.inputs.map(([name, value]) => [name, String(value)]))

// Tabela de execução: cada passo do algoritmo acrescenta uma linha, com a explicação abaixo.
export default function NumberTraceVisualizer({ algorithm }) {
  const { t } = useI18n()
  const config = numberAlgorithms[algorithm.id] ?? numericTraces[algorithm.id] ?? compressionTraces[algorithm.id] ?? cryptoTraces[algorithm.id] ?? publicKeyTraces[algorithm.id] ?? languageTraces[algorithm.id] ?? bitTraces[algorithm.id]
  const [draft, setDraft] = useState(() => defaults(config))
  const [inputs, setInputs] = useState(() => defaults(config))
  const [error, setError] = useState(null)

  const trace = useMemo(() => config.run(parse(config, inputs)), [config, inputs])
  const player = usePlayer(trace.steps.length)

  const apply = next => {
    for (const [name, , min, max, decimal] of config.inputs) {
      if (decimal === 'text') {
        const size = [...next[name]].length
        if (size < min || size > max) { setError(t('viz.invalidText', { min, max })); return }
        continue
      }
      const v = toNumber(next[name])
      if (!Number.isFinite(v) || (!decimal && !Number.isInteger(v)) || v < min || v > max) {
        setError(t('viz.invalidInput', { min, max: max.toLocaleString() }))
        return
      }
    }
    try { config.run(parse(config, next)) } catch { setError(t('viz.invalidText', { min: config.inputs[0][2], max: config.inputs[0][3] })); return }
    setError(null)
    player.reset()
    setInputs(next)
  }

  const shown = trace.steps.slice(0, player.step + 1)
  const rows = shown.filter(s => s.row)
  const current = trace.steps[player.step]
  const result = shown.find(s => s.result)?.result

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <form
          className="flex flex-wrap items-end gap-2 mb-5"
          onSubmit={e => { e.preventDefault(); apply(draft) }}
        >
          {config.inputs.map(([name, , , , decimal]) => (
            <label key={name} className={`flex flex-col gap-1 text-xs text-muted ${decimal === 'text' ? 'flex-1 min-w-[200px]' : ''}`}>
              <span className="font-mono">{name}</span>
              {decimal === 'text' ? (
                <input value={draft[name]} onChange={e => setDraft(d => ({ ...d, [name]: e.target.value }))} className="w-full h-9 px-3 rounded-full border border-line bg-surface font-mono text-sm text-ink focus:outline-none focus:ring-4 focus:ring-accent/10" />
              ) : (
              <input
                inputMode={decimal ? 'decimal' : 'numeric'}
                value={draft[name]}
                onChange={e => setDraft(d => ({ ...d, [name]: e.target.value.replace(decimal ? /[^\d.,-]/g : /[^\d]/g, '') }))}
                className="w-28 sm:w-36 h-9 px-3 rounded-full border border-line bg-surface font-mono text-sm text-ink focus:outline-none focus:ring-4 focus:ring-accent/10"
              />
              )}
            </label>
          ))}
          <button type="submit" className="btn-ghost !h-9">{t('viz.apply')}</button>
          <button type="button" onClick={() => { setDraft(defaults(config)); apply(defaults(config)) }} className="btn-ghost !h-9">{t('viz.example')}</button>
          {result && (
            <span className="ml-auto self-center text-sm break-all">
              <span className="text-muted">{t('viz.result')}: </span>
              <span className="font-mono font-medium text-ink">{result}</span>
            </span>
          )}
        </form>
        {error && <p className="mb-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

        <div className="max-h-[340px] overflow-auto rounded-xl border border-line">
          <table className="w-full text-[13px] font-mono">
            <thead className="sticky top-0 bg-subtle text-muted text-xs">
              <tr>{trace.columns.map(c => <th key={c} className="px-3 py-2 text-left font-medium whitespace-nowrap">{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((s, i) => (
                <tr key={i} className={`border-t border-line transition-colors ${s === current ? 'bg-amber-100/80 dark:bg-amber-400/15' : ''}`}>
                  {s.row.map((cell, j) => <td key={j} className="px-3 py-1.5 whitespace-pre text-ink/90">{String(cell)}</td>)}
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan={trace.columns.length} className="px-3 py-6 text-center text-faint">—</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StepNote>{current?.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={[['bg-amber-200', t('viz.analyzing')]]} status={t('player.step', { s: player.step, t: player.last })} />
    </figure>
  )
}
