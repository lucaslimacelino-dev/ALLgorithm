import { useMemo, useState } from 'react'
import { aesFrames } from '../../lib/cipherFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const EXAMPLE = { texto: '00112233445566778899aabbccddeeff', chave: '000102030405060708090a0b0c0d0e0f' }
const OP_COLOR = { SubBytes: 'bg-emerald-500/25', ShiftRows: 'bg-sky-500/25', MixColumns: 'bg-violet-500/25', AddRoundKey: 'bg-amber-400/40' }
const byte = b => b.toString(16).padStart(2, '0')

function Grid({ bytes, tone }) {
  return (
    <div className="grid grid-cols-4 gap-1 font-mono text-sm">
      {[0, 1, 2, 3].flatMap(r => [0, 1, 2, 3].map(c => (
        <span key={`${r}${c}`} className={`w-11 h-10 sm:w-12 grid place-items-center rounded-md transition-colors duration-300 ${tone}`}>{byte(bytes[r + 4 * c])}</span>
      )))}
    </div>
  )
}

// AES-128: a matriz de estado 4 × 4 passando por SubBytes, ShiftRows, MixColumns e AddRoundKey.
export default function AesVisualizer() {
  const { t } = useI18n()
  const [input, setInput] = useState(EXAMPLE)
  const frames = useMemo(() => aesFrames(input.texto, input.chave), [input])
  const player = usePlayer(frames.length, { speedScale: 1.4 })
  const f = frames[player.step]

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={[{ name: 'texto', label: t('viz.blockHex'), max: 32 }, { name: 'chave', label: t('viz.keyHex'), max: 32 }]}
          values={input}
          example={EXAMPLE}
          valid={v => { aesFrames(v.texto, v.chave); return true }}
          onApply={v => { player.reset(); setInput(v) }}
        />
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <div className="text-center">
            <p className="mb-2 text-xs text-muted">{t('viz.state')} · {f.op}{f.round ? ` · ${t('viz.aesRound')} ${f.round}` : ''}</p>
            <Grid bytes={f.state} tone={OP_COLOR[f.op] ?? (f.op === 'output' ? 'bg-accent text-white' : 'bg-subtle')} />
          </div>
          {f.roundKey && (
            <div className="text-center">
              <p className="mb-2 text-xs text-muted">{t('viz.roundKey')} {f.round}</p>
              <Grid bytes={f.roundKey} tone="bg-amber-400/20 text-ink" />
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-center gap-1">
          {Array.from({ length: 11 }, (_, r) => (
            <span key={r} className={`w-6 h-1.5 rounded-full ${r <= f.round ? 'bg-accent' : 'bg-subtle'}`} />
          ))}
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-emerald-500/40', 'SubBytes'], ['bg-sky-500/40', 'ShiftRows'], ['bg-violet-500/40', 'MixColumns'], ['bg-amber-400/60', 'AddRoundKey']]}
        status={f.out ? f.out : t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
