import { useMemo, useState } from 'react'
import { arraySearches, makeData } from '../../lib/searchFrames'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const SIZE = 16

function pickTarget(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function missingValue(arr) {
  const set = new Set(arr)
  const sorted = [...arr].sort((x, y) => x - y)
  // valor ausente dentro do intervalo, para a busca ter trabalho de verdade
  for (let i = 0; i < 100; i++) {
    const v = sorted[0] + Math.floor(Math.random() * (sorted[sorted.length - 1] - sorted[0]))
    if (!set.has(v)) return v
  }
  return sorted[sorted.length - 1] + 1
}

export default function ArraySearchVisualizer({ algorithm }) {
  const config = arraySearches[algorithm.id]
  const [arr, setArr] = useState(() => makeData(config.data, SIZE))
  const [target, setTarget] = useState(() => pickTarget(arr))
  const frames = useMemo(() => config.run(arr, target), [config, arr, target])
  const player = usePlayer(frames.length)
  const frame = frames[player.step]

  const chooseTarget = v => { player.reset(); setTarget(v) }
  const newData = () => {
    const next = makeData(config.data, SIZE)
    player.reset()
    setArr(next)
    setTarget(pickTarget(next))
  }

  const cellClass = i => {
    if (frame.found === i) return 'bg-ink text-paper border-ink scale-105'
    if (frame.probe === i) return 'bg-amber-400/90 text-ink border-amber-500 scale-105'
    if (i < frame.lo || i > frame.hi) return 'bg-subtle/60 text-faint border-transparent opacity-50'
    return 'bg-surface text-ink border-line'
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-6 pb-5 border-b border-line">
        {!config.noTarget && (
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Procurando</span>
            <span className="inline-flex h-8 min-w-[2.5rem] px-2.5 items-center justify-center rounded-full bg-ink text-paper font-mono text-[13px]">{target}</span>
            <span className="text-faint text-xs ml-1">Clique em um número para mudar o alvo.</span>
          </div>
        )}
        <div className="grid grid-cols-8 sm:grid-cols-[repeat(16,minmax(0,1fr))] gap-1.5">
          {arr.map((v, i) => (
            <button
              key={i}
              onClick={() => !config.noTarget && chooseTarget(v)}
              disabled={config.noTarget}
              className={`flex flex-col items-center rounded-lg border py-2 font-mono transition-all duration-200 ${cellClass(i)} ${config.noTarget ? 'cursor-default' : 'hover:border-ink/40'}`}
              aria-label={`Posição ${i}, valor ${v}`}
            >
              <span className="text-[13px] sm:text-sm font-medium">{v}</span>
              <span className="text-[10px] opacity-60">{i}</span>
            </button>
          ))}
        </div>
      </div>

      <StepNote>{frame.note}</StepNote>

      <PlayerControls player={player}>
        {!config.noTarget && (
          <button onClick={() => chooseTarget(missingValue(arr))} className="btn-ghost !h-9">Alvo ausente</button>
        )}
        <button onClick={newData} className="btn-ghost !h-9">Novos dados</button>
      </PlayerControls>

      <Legend
        items={[
          ['bg-surface border border-line', 'Ainda considerado'],
          ['bg-amber-400', 'Sondando'],
          ['bg-ink', config.noTarget ? 'Menor elemento' : 'Encontrado'],
          ['bg-subtle border border-line opacity-50', 'Descartado'],
        ]}
        status={`passo ${player.step}/${player.last}`}
      />
    </figure>
  )
}
