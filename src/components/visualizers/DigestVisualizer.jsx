import { useMemo, useState } from 'react'
import { hashFrames, hashes, hex32, utf8 } from '../../lib/hashFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import TextForm from './TextForm'

const EXAMPLE = 'abc'
const MAX = 55 // cabe em um único bloco de 64 bytes

function Registers({ names, values, changed, label }) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      {label && <span className="text-xs text-muted w-full text-center sm:w-auto">{label}</span>}
      {names.map((n, i) => (
        <div key={n} className={`px-3 py-2 rounded-lg border text-center transition-colors duration-300 ${i === changed ? 'border-amber-400 bg-amber-400/15' : 'border-line bg-subtle'}`}>
          <div className="text-[10px] text-muted font-mono">{n}</div>
          <div className="font-mono text-sm text-ink">{hex32(values[i])}</div>
        </div>
      ))}
    </div>
  )
}

// MD4, MD5, SHA-1 e RIPEMD-160: preenchimento do bloco, passos da compressão e efeito avalanche.
export default function DigestVisualizer({ algorithm }) {
  const { t } = useI18n()
  const spec = hashes[algorithm.id]
  const [text, setText] = useState(EXAMPLE)
  const frames = useMemo(() => hashFrames(algorithm.id, text), [algorithm.id, text])
  const player = usePlayer(frames.length, { speedScale: 0.5 })
  const f = frames[player.step]
  const s = f.step
  const word = f.phase === 'step' ? s.word : -1

  const byteClass = i => {
    const w = Math.floor(i / 4)
    const base = i < f.len ? 'bg-accent/15 text-ink' : i === f.len ? 'bg-amber-400/80 text-ink' : i >= 56 ? 'bg-violet-500/25 text-ink' : 'text-faint'
    return w === word ? 'bg-rose-500 text-white' : base
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <TextForm value={text} example={EXAMPLE} max={MAX} valid={v => utf8(v).length <= MAX} onApply={v => { player.reset(); setText(v) }} />

        <div className="grid gap-0.5 font-mono text-[11px] max-w-xl mx-auto" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
          {[...f.block].map((b, i) => (
            <span key={i} className={`h-6 grid place-items-center rounded-sm transition-colors duration-200 ${byteClass(i)}`}>{b.toString(16).padStart(2, '0')}</span>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {f.phase === 'pad' ? (
            <p className="text-center text-sm text-muted">{t('viz.hashInit')}</p>
          ) : (
            <>
              <p className="text-center text-xs text-muted font-mono">{t('viz.hashStep', { r: s.round + 1, rs: spec.rounds, p: s.step + 1, ps: spec.rounds * spec.perRound })}</p>
              <Registers names={spec.regs} values={s.regs} changed={f.phase === 'step' ? s.changed : -1} label={spec.parallel ? t('viz.leftLine') : null} />
              {spec.parallel && <Registers names={spec.regs.map(n => n + "'")} values={s.right} changed={f.phase === 'step' ? s.changed : -1} label={t('viz.rightLine')} />}
            </>
          )}
          {f.phase === 'done' && (
            <div className="mt-2 text-center space-y-1">
              <p className="font-mono text-sm sm:text-base text-ink break-all"><span className="text-muted text-xs mr-2">{algorithm.name}</span>{f.digest}</p>
              <p className="font-mono text-sm sm:text-base break-all">
                <span className="text-muted text-xs mr-2">{t('viz.oneBitFlipped')}</span>
                {[...f.other].map((c, i) => <span key={i} className={c !== f.digest[i] ? 'text-rose-500' : 'text-faint'}>{c}</span>)}
              </p>
            </div>
          )}
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-accent/30', t('viz.messageBytes')], ['bg-amber-400', '0x80'], ['bg-violet-500/40', t('viz.lengthBits')], ['bg-rose-500', t('viz.wordInUse')]]}
        status={f.phase === 'done' ? t('viz.bitsChanged', { n: f.diff, t: f.digest.length * 4 }) : t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
