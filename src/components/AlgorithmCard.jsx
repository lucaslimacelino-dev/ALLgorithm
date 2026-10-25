import { Link } from 'react-router-dom'
import { difficultyColor } from '../data'

export default function AlgorithmCard({ algorithm }) {
  return (
    <Link
      to={`/algoritmos/${algorithm.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-sm font-bold text-zinc-100 group-hover:text-brand-400 transition-colors">
          {algorithm.name}
        </h3>
        <span className={`shrink-0 text-[11px] font-semibold font-body px-2 py-0.5 rounded-full border ${difficultyColor[algorithm.difficulty]}`}>
          {algorithm.difficulty}
        </span>
      </div>
      <p className="text-xs text-zinc-400 font-body leading-relaxed line-clamp-2">{algorithm.summary}</p>
      <div className="mt-auto flex items-center justify-between text-[11px] font-body text-zinc-500">
        <span>Médio: <span className="font-mono text-zinc-300">{algorithm.complexity.average}</span></span>
        <span className="text-zinc-600 group-hover:text-brand-400 transition-colors">Ver →</span>
      </div>
    </Link>
  )
}
