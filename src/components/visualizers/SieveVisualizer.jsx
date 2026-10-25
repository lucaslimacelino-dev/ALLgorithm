import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

// Quadros do crivo: para cada primo p, risca p², p² + p, … até o limite.
function sieveFrames(max) {
  const crossed = new Array(max + 1).fill(-1) // passo em que cada número foi riscado
  const primeAt = new Array(max + 1).fill(-1) // passo em que cada primo foi confirmado
  const frames = [{ note: `Lista os números de 2 a ${max}. Todos começam como candidatos a primo.` }]
  for (let p = 2; p * p <= max; p++) {
    if (crossed[p] !== -1) continue
    primeAt[p] = frames.length
    frames.push({ current: p, note: `${p} não foi riscado: é primo. Risca os múltiplos de ${p}, começando em ${p}² = ${p * p}.` })
    for (let m = p * p; m <= max; m += p) {
      if (crossed[m] !== -1) continue
      crossed[m] = frames.length
      frames.push({ current: p, mark: m, note: `${m} = ${p} × ${m / p}: riscado.` })
    }
  }
  const last = frames.length
  let count = 0
  for (let k = 2; k <= max; k++) if (crossed[k] === -1) { count++; if (primeAt[k] === -1) primeAt[k] = last }
  frames.push({ note: `Como ${Math.floor(Math.sqrt(max)) + 1}² > ${max}, nenhum número restante pode ser riscado: os ${count} que sobraram são todos primos.` })
  return { frames, crossed, primeAt, count }
}

const LIMITS = [60, 100, 150, 240]

export default function SieveVisualizer() {
  const { t } = useI18n()
  const [max, setMax] = useState(100)
  const { frames, crossed, primeAt, count } = useMemo(() => sieveFrames(max), [max])
  const player = usePlayer(frames.length, { speedScale: 0.25 })
  const frame = frames[player.step]

  const cellClass = k => {
    if (frame.mark === k) return 'bg-rose-500 text-white border-rose-600 scale-110'
    if (frame.current === k) return 'bg-amber-400 text-ink border-amber-500'
    if (crossed[k] !== -1 && crossed[k] <= player.step) return 'bg-subtle text-faint/60 border-transparent line-through'
    if (primeAt[k] !== -1 && primeAt[k] <= player.step) return 'bg-ink text-paper border-ink'
    return 'bg-surface text-ink border-line'
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
          <span className="text-muted mr-1">{t('viz.sieveLimit')}</span>
          {LIMITS.map(l => (
            <button key={l} onClick={() => { player.reset(); setMax(l) }} className={`h-8 px-3 rounded-full text-[13px] border ${l === max ? 'bg-ink text-paper border-ink' : 'border-line text-muted hover:text-ink'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-10 sm:grid-cols-[repeat(15,minmax(0,1fr))] gap-1">
          {Array.from({ length: max - 1 }, (_, i) => i + 2).map(k => (
            <div key={k} className={`h-8 rounded-md border flex items-center justify-center font-mono text-[12px] transition-all duration-200 ${cellClass(k)}`}>{k}</div>
          ))}
        </div>
      </div>
      <StepNote>{frame.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-amber-400', t('viz.currentPrime')], ['bg-rose-500', t('viz.crossed')], ['bg-ink', t('viz.prime')]]}
        status={player.finished ? t('viz.primesUpTo', { n: count, max }) : t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
