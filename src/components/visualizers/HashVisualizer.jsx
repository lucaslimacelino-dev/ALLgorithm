import { useMemo, useState } from 'react'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import { useI18n } from '../../i18n'

const BUCKETS = 7
const KEYS = ['Ana', 'Bruno', 'Carla', 'Davi', 'Eva', 'Felipe', 'Gabi', 'Hugo', 'Iris', 'João', 'Lia']
const ABSENT = ['Zeca', 'Rui', 'Téo']

// Mesmo hash polinomial usado nas implementações do artigo.
const hashOf = key => [...key].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % BUCKETS, 0)

const table = Array.from({ length: BUCKETS }, () => [])
KEYS.forEach(k => table[hashOf(k)].push(k))

function searchFrames(key) {
  const b = hashOf(key)
  const frames = [
    { bucket: null, scan: -1, found: false, note: `Procurar "${key}".` },
    { bucket: b, scan: -1, found: false, note: `Calcula o hash: h("${key}") = ${b}. Só o balde ${b} precisa ser examinado.` },
  ]
  const chain = table[b]
  for (let i = 0; i < chain.length; i++) {
    if (chain[i] === key) {
      frames.push({ bucket: b, scan: i, found: true, note: `"${chain[i]}" = "${key}" — encontrado com ${i + 1} ${i ? 'comparações' : 'comparação'}, sem olhar os outros baldes.` })
      return frames
    }
    frames.push({ bucket: b, scan: i, found: false, note: `"${chain[i]}" ≠ "${key}" → próximo item do balde.` })
  }
  frames.push({ bucket: b, scan: chain.length, found: false, note: chain.length ? `Fim do balde ${b}: "${key}" não está na tabela.` : `O balde ${b} está vazio: "${key}" não está na tabela.` })
  return frames
}

export default function HashVisualizer() {
  const { t } = useI18n()
  const [key, setKey] = useState('Felipe')
  const frames = useMemo(() => searchFrames(key), [key])
  const player = usePlayer(frames.length)
  const frame = frames[player.step]

  const choose = k => { player.reset(); setKey(k) }

  const itemClass = (b, i) => {
    if (frame.bucket !== b) return 'bg-surface border-line text-ink/70'
    if (i === frame.scan) return frame.found ? 'bg-ink text-paper border-ink' : 'bg-amber-400 text-ink border-amber-500'
    if (i < frame.scan) return 'bg-subtle border-line text-faint'
    return 'bg-surface border-line text-ink'
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-6 pb-5 border-b border-line">
        <div className="mb-5 flex flex-wrap items-center gap-1.5 text-sm">
          <span className="text-muted mr-1">{t('viz.searchFor')}</span>
          {[...KEYS, ...ABSENT].map(k => (
            <button
              key={k}
              onClick={() => choose(k)}
              className={`h-7 px-2.5 rounded-full text-[13px] border ${k === key ? 'bg-ink text-paper border-ink' : 'border-line text-muted hover:text-ink'} ${ABSENT.includes(k) ? 'border-dashed' : ''}`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          {table.map((chain, b) => (
            <div key={b} className={`flex items-center gap-2 rounded-lg p-1.5 transition-colors ${frame.bucket === b ? 'bg-accent/10' : ''}`}>
              <span className={`w-9 h-9 shrink-0 rounded-md flex items-center justify-center font-mono text-xs border ${frame.bucket === b ? 'bg-accent text-paper border-accent' : 'bg-subtle text-muted border-line'}`}>
                {b}
              </span>
              <span className="text-faint text-xs">→</span>
              <div className="flex flex-wrap gap-1.5">
                {chain.length === 0 && <span className="text-xs text-faint italic">{t('common.empty')}</span>}
                {chain.map((k, i) => (
                  <span key={k} className={`h-9 px-3 inline-flex items-center rounded-md border text-[13px] transition-colors duration-200 ${itemClass(b, i)}`}>{k}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <StepNote>{frame.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-accent', t('viz.bucketByHash')], ['bg-amber-400', t('viz.comparing')], ['bg-ink', t('viz.found')]]}
        status={t('viz.keysInBuckets', { k: KEYS.length, b: BUCKETS })}
      />
    </figure>
  )
}
