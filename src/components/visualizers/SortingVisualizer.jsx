import { useMemo, useState } from 'react'
import { buildFrames, visualizerSize } from '../../lib/sortingFrames'
import { Legend, PlayerControls, usePlayer } from './Player'

const randomArray = n => Array.from({ length: n }, () => 5 + Math.floor(Math.random() * 96))

export default function SortingVisualizer({ algorithm }) {
  const size = visualizerSize(algorithm.id)
  const [input, setInput] = useState(() => randomArray(size))
  const frames = useMemo(() => buildFrames(algorithm.id, input), [algorithm.id, input])
  const player = usePlayer(frames.length, { speedScale: 0.27 })
  const frame = frames[player.step]

  const comparisons = useMemo(
    () => frames.slice(0, player.step + 1).filter(f => f.kind === 'compare').length,
    [frames, player.step],
  )

  const shuffle = () => {
    player.reset()
    setInput(randomArray(size))
  }

  const barColor = i => {
    if (frame.active.includes(i)) return frame.kind === 'swap' ? 'bg-rose-500' : 'bg-amber-500'
    if (frame.sorted.includes(i)) return 'bg-ink'
    return 'bg-ink/15'
  }

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-line">
        <div className="flex items-end gap-[3px] h-60" role="img" aria-label={`Animação do ${algorithm.name}`}>
          {frame.arr.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
              {size <= 8 && <span className="text-xs font-mono text-muted mb-1.5">{v}</span>}
              <div className={`w-full rounded-[3px] transition-[height,background-color] duration-75 ${barColor(i)}`} style={{ height: `${v}%` }} />
            </div>
          ))}
        </div>
      </div>

      <PlayerControls player={player}>
        <button onClick={shuffle} className="btn-ghost !h-9">Novos dados</button>
      </PlayerControls>

      <Legend
        items={[['bg-amber-500', 'Comparando'], ['bg-rose-500', 'Movendo'], ['bg-ink', 'Na posição final']]}
        status={`passo ${player.step}/${player.last} · ${comparisons} comparações`}
      />
    </figure>
  )
}
