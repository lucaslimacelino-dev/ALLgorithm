import { useMemo, useState } from 'react'
import { lz77Frames, visible } from '../../lib/compressionFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import TextForm from './TextForm'

const EXAMPLE = 'aacaacabcabaaac'
const MAX = 40

// LZ77: janela de busca, área de leitura, trecho copiado e o token emitido em cada passo.
export default function Lz77Visualizer() {
  const { t } = useI18n()
  const [text, setText] = useState(EXAMPLE)
  const frames = useMemo(() => lz77Frames(text), [text])
  const player = usePlayer(frames.length, { speedScale: 1.8 })
  const f = frames[player.step]

  const cellClass = k => {
    const [j, len] = f.match ?? [-1, 0]
    if (!f.done && player.step > 0) {
      if (k >= f.i && k < f.i + len) return 'bg-emerald-400/30 border-emerald-500 text-ink'
      if (k === f.i + len) return 'bg-rose-500 border-rose-500 text-white'
      if (k >= j && k < j + len) return 'bg-emerald-400 border-emerald-500 text-ink'
    }
    if (f.done || k < f.start) return 'border-line text-muted'
    if (k < f.i) return 'bg-accent/10 border-accent/40 text-ink'
    if (k < f.ahead) return 'border-amber-400 border-dashed text-ink'
    return 'border-line text-faint'
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <TextForm value={text} example={EXAMPLE} max={MAX} onApply={v => { player.reset(); setText(v) }} />
        <div className="flex flex-wrap gap-1 justify-center">
          {f.s.map((c, k) => (
            <div key={k} className="flex flex-col items-center gap-1">
              <span className={`w-8 h-10 sm:w-9 grid place-items-center rounded-md border-2 font-mono text-[15px] transition-colors duration-300 ${cellClass(k)}`}>{visible(c)}</span>
              <span className="font-mono text-[10px] text-faint">{k}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-1.5 justify-center min-h-[30px]">
          {f.tokens.map(([d, l, c], k) => (
            <span key={k} className={`px-2.5 py-1 rounded-full font-mono text-xs border ${k === f.tokens.length - 1 && !f.done ? 'bg-ink text-paper border-ink' : 'border-line text-ink'}`}>
              ({d}, {l}, {visible(c)})
            </span>
          ))}
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-accent/30', t('viz.searchWindow')], ['border-2 border-dashed border-amber-400', t('viz.lookahead')], ['bg-emerald-400', t('viz.matchSource')], ['bg-rose-500', t('viz.nextChar')]]}
        status={t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
