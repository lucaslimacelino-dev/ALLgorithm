import { useMemo, useState } from 'react'
import { classicFrames } from '../../lib/cipherFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const EXAMPLES = {
  'caesar-cipher': { texto: 'Veni, vidi, vici', chave: '3' },
  'vigenere-cipher': { texto: 'ATTACK AT DAWN', chave: 'LEMON' },
}

// César e Vigenère: o alfabeto deslocado e a troca letra a letra.
export default function ClassicCipherVisualizer({ algorithm }) {
  const { t } = useI18n()
  const kind = algorithm.id === 'caesar-cipher' ? 'caesar' : 'vigenere'
  const example = EXAMPLES[algorithm.id]
  const [input, setInput] = useState(example)
  const frames = useMemo(() => classicFrames(kind, input.texto, input.chave), [kind, input])
  const player = usePlayer(frames.length, { speedScale: 1.2 })
  const f = frames[player.step]
  const shift = f.shift ?? (kind === 'caesar' ? Number(input.chave) : null)
  const currentLetter = f.i >= 0 ? ALPHABET.indexOf(f.plain[f.i]) : -1

  const cell = 'w-6 sm:w-7 h-8 grid place-items-center rounded font-mono text-[13px]'
  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={[{ name: 'texto', label: t('viz.text'), max: 60 }, { name: 'chave', label: kind === 'caesar' ? t('viz.shiftKey') : t('viz.keyword'), max: 20, width: 'w-32' }]}
          values={input}
          example={example}
          valid={v => { classicFrames(kind, v.texto, v.chave); return v.texto.trim().length > 0 }}
          onApply={v => { player.reset(); setInput(v) }}
        />

        <div className="overflow-x-auto">
          <div className="inline-flex flex-col gap-1 min-w-full items-center">
            {[0, 1].map(row => (
              <div key={row} className="flex gap-0.5">
                {[...ALPHABET].map((c, k) => {
                  const shown = row === 0 ? c : shift === null ? '·' : ALPHABET[(k + shift) % 26]
                  const hl = k === currentLetter
                  return <span key={k} className={`${cell} ${hl ? (row ? 'bg-accent text-white font-semibold' : 'bg-amber-400 text-ink font-semibold') : row ? 'bg-subtle text-ink' : 'text-muted'}`}>{shown}</span>
                })}
              </div>
            ))}
            <p className="mt-1 text-xs text-muted">{shift === null ? '—' : t('viz.shiftBy', { k: shift })}</p>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="mx-auto font-mono text-[13px] border-separate border-spacing-0.5">
            <tbody>
              {[['viz.plaintext', f.plain], ['viz.shift', f.plain.map((_, i) => f.keyRow[i])], ['viz.ciphertext', f.plain.map((_, i) => f.out[i])]].map(([label, values], r) => (
                <tr key={label}>
                  <td className="pr-3 text-xs text-muted font-sans whitespace-nowrap">{t(label)}</td>
                  {values.map((v, i) => (
                    <td key={i} className={`w-6 h-7 text-center rounded ${i === f.i ? 'ring-2 ring-amber-400' : ''} ${r === 2 && v !== undefined ? 'bg-accent/15 text-ink font-semibold' : r === 1 ? 'text-muted text-[11px]' : 'text-ink'}`}>
                      {v === undefined || v === null ? (r === 1 && v === null ? '·' : '') : r === 1 ? `+${v}` : v === ' ' ? '␣' : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={[['bg-amber-400', t('viz.plainLetter')], ['bg-accent', t('viz.cipherLetter')]]} status={t('player.step', { s: player.step, t: player.last })} />
    </figure>
  )
}
