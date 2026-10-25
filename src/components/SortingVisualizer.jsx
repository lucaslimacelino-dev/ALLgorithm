import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildFrames, visualizerSize } from '../lib/sortingFrames'

const speeds = [
  { label: '0,5×', ms: 240 },
  { label: '1×', ms: 120 },
  { label: '2×', ms: 50 },
  { label: '4×', ms: 15 },
]

const randomArray = n => Array.from({ length: n }, () => 5 + Math.floor(Math.random() * 96))

export default function SortingVisualizer({ algorithmId, name }) {
  const size = visualizerSize(algorithmId)
  const [input, setInput] = useState(() => randomArray(size))
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const frames = useMemo(() => buildFrames(algorithmId, input), [algorithmId, input])
  const frame = frames[step]
  const finished = step === frames.length - 1
  const comparisons = useMemo(
    () => frames.slice(0, step + 1).filter(f => f.kind === 'compare').length,
    [frames, step],
  )

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
    if (frame.active.includes(i)) return frame.kind === 'swap' ? 'bg-rose-500' : 'bg-amber-500'
    if (frame.sorted.includes(i)) return 'bg-ink'
    return 'bg-ink/15'
  }

  const btn = 'disabled:opacity-40 disabled:pointer-events-none'
  const btnGhost = `btn-ghost !h-9 ${btn}`

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-line">
        <div className="flex items-end gap-[3px] h-60" role="img" aria-label={`Animação do ${name}`}>
          {frame.arr.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
              {size <= 8 && <span className="text-xs font-mono text-muted mb-1.5">{v}</span>}
              <div className={`w-full rounded-[3px] transition-[height,background-color] duration-75 ${barColor(i)}`} style={{ height: `${v}%` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center gap-2">
        <button onClick={togglePlay} className={`btn-primary !h-9 min-w-[112px] ${btn}`}>
          {playing ? '❚❚  Pausar' : finished ? '↺  Repetir' : '▶  Executar'}
        </button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={playing || step === 0} className={btnGhost} aria-label="Passo anterior">
          ←
        </button>
        <button onClick={() => setStep(s => Math.min(frames.length - 1, s + 1))} disabled={playing || finished} className={btnGhost} aria-label="Próximo passo">
          →
        </button>
        <button onClick={shuffle} className={btnGhost}>Novos dados</button>

        <div className="ml-auto inline-flex p-1 rounded-full border border-line" role="group" aria-label="Velocidade">
          {speeds.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSpeed(i)}
              className={`h-7 px-3 rounded-full text-xs font-mono
                ${speed === i ? 'bg-subtle text-ink font-medium' : 'text-muted hover:text-ink'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <figcaption className="px-4 sm:px-6 pb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Comparando</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Movendo</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-ink" /> Na posição final</span>
        </div>
        <span className="font-mono tabular-nums">
          passo {step}/{frames.length - 1} · {comparisons} comparações
        </span>
      </figcaption>
    </figure>
  )
}
