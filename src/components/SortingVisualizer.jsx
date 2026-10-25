import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildFrames, visualizerSize } from '../lib/sortingFrames'

const speeds = [
  { label: '0.5×', ms: 240 },
  { label: '1×', ms: 120 },
  { label: '2×', ms: 50 },
  { label: '4×', ms: 15 },
]

const randomArray = n => Array.from({ length: n }, () => 5 + Math.floor(Math.random() * 96))

export default function SortingVisualizer({ algorithmId }) {
  const size = visualizerSize(algorithmId)
  const [input, setInput] = useState(() => randomArray(size))
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const frames = useMemo(() => buildFrames(algorithmId, input), [algorithmId, input])
  const frame = frames[step]
  const finished = step === frames.length - 1

  const shuffle = useCallback(() => {
    setPlaying(false)
    setStep(0)
    setInput(randomArray(size))
  }, [size])

  // Novo algoritmo (navegação entre páginas) → novo array.
  useEffect(() => { shuffle() }, [algorithmId, shuffle])

  useEffect(() => {
    if (!playing) return
    if (finished) { setPlaying(false); return }
    const t = setTimeout(() => setStep(s => s + 1), speeds[speed].ms)
    return () => clearTimeout(t)
  }, [playing, step, finished, speed])

  const togglePlay = () => {
    if (finished) setStep(0)
    setPlaying(p => !p)
  }

  const barColor = i => {
    if (frame.active.includes(i)) return frame.kind === 'swap' ? 'bg-rose-500' : 'bg-amber-400'
    if (frame.sorted.includes(i)) return 'bg-brand-500'
    return 'bg-zinc-600'
  }

  const btn = 'px-3 py-1.5 rounded-lg text-xs font-semibold font-body border transition-colors disabled:opacity-40'
  const btnGhost = `${btn} bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700`

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
      <div className="flex items-end gap-[2px] h-56" role="img" aria-label="Visualização da ordenação">
        {frame.arr.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
            {size <= 8 && <span className="text-[11px] font-mono text-zinc-400 mb-1">{v}</span>}
            <div
              className={`w-full rounded-t-sm transition-[height] duration-75 ${barColor(i)}`}
              style={{ height: `${v}%` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={togglePlay} className={`${btn} bg-brand-500 border-brand-500 text-zinc-950 hover:bg-brand-400 min-w-[84px]`}>
          {playing ? '❚❚ Pausar' : finished ? '↺ Repetir' : '▶ Iniciar'}
        </button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={playing || step === 0} className={btnGhost}>
          ← Passo
        </button>
        <button onClick={() => setStep(s => Math.min(frames.length - 1, s + 1))} disabled={playing || finished} className={btnGhost}>
          Passo →
        </button>
        <button onClick={shuffle} className={btnGhost}>Embaralhar</button>

        <div className="flex gap-1 ml-auto">
          {speeds.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSpeed(i)}
              className={`${btn} ${speed === i ? 'bg-zinc-700 border-zinc-600 text-zinc-100' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-body text-zinc-500">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Comparando</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Movendo</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-500" /> Ordenado</span>
        </div>
        <span className="font-mono">Passo {step} / {frames.length - 1}</span>
      </div>
    </div>
  )
}
