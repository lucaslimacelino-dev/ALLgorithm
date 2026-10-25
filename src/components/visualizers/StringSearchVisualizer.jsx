import { useMemo, useState } from 'react'
import { stringSearches } from '../../lib/stringFrames'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import { useI18n } from '../../i18n'

const MAX_TEXT = 32
const MAX_PATTERN = 10
const show = c => (c === ' ' ? '␣' : c)

function Cell({ ch, className = '', index }) {
  return (
    <div className={`w-8 shrink-0 flex flex-col items-center`}>
      <div className={`w-full h-9 rounded-md border flex items-center justify-center font-mono text-sm transition-colors duration-200 ${className}`}>{show(ch)}</div>
      {index !== undefined && <span className="text-[9px] font-mono text-faint mt-0.5">{index}</span>}
    </div>
  )
}

function Aux({ aux }) {
  const { t } = useI18n()
  if (!aux) return null
  if (aux.kind === 'lps') {
    return (
      <div className="text-xs">
        <p className="text-muted mb-1.5">{t('viz.lps')}</p>
        <div className="flex gap-1 font-mono">{aux.values.map((v, i) => <span key={i} className="w-8 h-7 rounded-md bg-subtle flex items-center justify-center">{v}</span>)}</div>
      </div>
    )
  }
  if (aux.kind === 'hash') {
    const eq = aux.pattern === aux.window
    return (
      <div className="flex gap-6 text-xs">
        <div><p className="text-muted">{t('viz.hashPattern')}</p><p className="font-mono text-base text-ink">{aux.pattern}</p></div>
        <div><p className="text-muted">{t('viz.hashWindow')}</p><p className={`font-mono text-base ${eq ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink'}`}>{aux.window}</p></div>
      </div>
    )
  }
  const table = aux.kind === 'bits' ? aux.masks : aux.entries
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs">
      {aux.kind === 'bits' && (
        <div>
          <p className="text-muted mb-1.5">{t('viz.stateD')}</p>
          <div className="flex gap-1 font-mono">
            {aux.bits.map((b, j) => (
              <span key={j} className={`w-8 h-7 rounded-md flex items-center justify-center ${b === '0' ? 'bg-emerald-500 text-white' : 'bg-subtle text-muted'}`}>{b}</span>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="text-muted mb-1.5">{aux.kind === 'bits' ? t('viz.masks') : aux.title}</p>
        <div className="flex flex-wrap gap-1 font-mono">
          {table.map(([c, v]) => (
            <span key={c} className="h-7 px-2 rounded-md bg-subtle inline-flex items-center gap-1.5"><span className="text-ink">{c}</span><span className="text-muted">{v}</span></span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function StringSearchVisualizer({ algorithm }) {
  const { t } = useI18n()
  const config = stringSearches[algorithm.id]
  const [text, setText] = useState(config.preset[0])
  const [pattern, setPattern] = useState(config.preset[1])
  const valid = pattern.length > 0 && pattern.length <= text.length
  const frames = useMemo(() => (valid ? config.run(text, pattern) : []), [config, text, pattern, valid])
  const player = usePlayer(frames.length)
  const frame = frames[player.step]

  const edit = setter => e => { player.reset(); setter(e.target.value.toUpperCase()) }

  const textClass = i => {
    if (frame?.cmp?.t === i) return frame.cmp.ok ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-rose-500 border-rose-600 text-white'
    if (frame?.cursor === i) return 'bg-amber-400 border-amber-500 text-ink'
    if (frame?.found.some(s => i >= s && i < s + pattern.length)) return 'bg-accent/15 border-accent/40 text-ink'
    if (frame?.window && i >= frame.window[0] && i <= frame.window[1]) return 'bg-amber-100 border-amber-300 text-ink dark:bg-amber-400/20 dark:border-amber-400/40'
    return 'bg-surface border-line text-ink'
  }
  const patternClass = j => {
    if (frame?.cmp?.p === j) return frame.cmp.ok ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-rose-500 border-rose-600 text-white'
    return 'bg-subtle border-line text-ink'
  }

  const isBits = algorithm.id === 'shift-or'

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <div className="flex flex-wrap gap-2 mb-5">
          <label className="flex items-center gap-2 text-xs text-muted">
            {t('viz.text')}
            <input value={text} maxLength={MAX_TEXT} onChange={edit(setText)} className="w-56 sm:w-72 h-9 px-3 rounded-full border border-line bg-surface font-mono text-sm text-ink focus:outline-none focus:ring-4 focus:ring-accent/10" />
          </label>
          <label className="flex items-center gap-2 text-xs text-muted">
            {t('viz.pattern')}
            <input value={pattern} maxLength={MAX_PATTERN} onChange={edit(setPattern)} className="w-36 h-9 px-3 rounded-full border border-line bg-surface font-mono text-sm text-ink focus:outline-none focus:ring-4 focus:ring-accent/10" />
          </label>
        </div>

        {valid ? (
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-1">{[...text].map((c, i) => <Cell key={i} ch={c} index={i} className={textClass(i)} />)}</div>
            <div className="flex gap-1 mt-2 transition-[padding-left] duration-300 ease-out" style={{ paddingLeft: `${(frame?.shift ?? 0) * 2.25}rem` }}>
              {[...pattern].map((c, j) => <Cell key={j} ch={c} className={patternClass(j)} />)}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">{t('viz.patternInvalid')}</p>
        )}

        {valid && frame?.aux && <div className="mt-5 pt-4 border-t border-line"><Aux aux={frame.aux} /></div>}
      </div>

      <StepNote>{frame?.note ?? '—'}</StepNote>

      <PlayerControls player={player}>
        <button onClick={() => { player.reset(); setText(config.preset[0]); setPattern(config.preset[1]) }} className="btn-ghost !h-9">{t('viz.example')}</button>
      </PlayerControls>

      <Legend
        items={isBits
          ? [['bg-amber-400', t('viz.letterRead')], ['bg-emerald-500', t('viz.bitZero')], ['bg-accent/20', t('viz.match')]]
          : [['bg-emerald-500', t('viz.charsEqual')], ['bg-rose-500', t('viz.charsDiffer')], ['bg-accent/20', t('viz.matchFound')]]}
        status={frame ? `${t('player.step', { s: player.step, t: player.last })} · ${isBits ? t('viz.matches', { n: frame.found.length }) : t('viz.comparisons', { c: frame.comparisons })}` : ''}
      />
    </figure>
  )
}
