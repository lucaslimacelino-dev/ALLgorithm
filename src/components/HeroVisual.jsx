import { useEffect, useMemo, useState } from 'react'
import { buildFrames } from '../lib/sortingFrames'

const SIZE = 28
const randomArray = () => Array.from({ length: SIZE }, () => 8 + Math.floor(Math.random() * 92))
const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

// Animação decorativa da página inicial: um quick sort em loop.
export default function HeroVisual() {
  const [input, setInput] = useState(randomArray)
  const frames = useMemo(() => buildFrames('quick-sort', input), [input])
  const [step, setStep] = useState(() => (reducedMotion() ? frames.length - 1 : 0))
  const frame = frames[Math.min(step, frames.length - 1)]
  const finished = step >= frames.length - 1

  useEffect(() => {
    if (reducedMotion()) return
    if (finished) {
      const t = setTimeout(() => { setInput(randomArray()); setStep(0) }, 1800)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStep(s => s + 1), 55)
    return () => clearTimeout(t)
  }, [step, finished])

  const color = i => {
    if (frame.active.includes(i)) return frame.kind === 'swap' ? 'bg-rose-500' : 'bg-amber-400'
    if (frame.sorted.includes(i)) return 'bg-ink'
    return 'bg-ink/15'
  }

  return (
    <div className="card p-5 sm:p-6" aria-hidden>
      <div className="flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-2 font-mono text-muted">
          <span className={`w-1.5 h-1.5 rounded-full ${finished ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
          quick_sort(arr)
        </span>
        <span className="font-mono text-faint tabular-nums">{finished ? 'ordenado' : `passo ${step}`}</span>
      </div>
      <div className="mt-5 flex items-end gap-[3px] h-48 sm:h-56">
        {frame.arr.map((v, i) => (
          <div key={i} className={`flex-1 rounded-[3px] transition-[height,background-color] duration-100 ${color(i)}`} style={{ height: `${v}%` }} />
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-line grid grid-cols-3 text-xs">
        <div><p className="text-faint">Melhor</p><p className="mt-0.5 font-mono text-ink">O(n log n)</p></div>
        <div><p className="text-faint">Médio</p><p className="mt-0.5 font-mono text-ink">O(n log n)</p></div>
        <div><p className="text-faint">Pior</p><p className="mt-0.5 font-mono text-ink">O(n²)</p></div>
      </div>
    </div>
  )
}
