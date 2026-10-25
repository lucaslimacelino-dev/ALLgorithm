import { difficultyColor } from '../data'

export default function DifficultyBadge({ level, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-muted ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${difficultyColor[level]}`} />
      {level}
    </span>
  )
}
