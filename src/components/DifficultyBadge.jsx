import { difficultyColor } from '../data'
import { useI18n } from '../i18n'

export default function DifficultyBadge({ level, className = '' }) {
  const { t } = useI18n()
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-muted ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${difficultyColor[level]}`} />
      {t(`difficulty.${level}`)}
    </span>
  )
}
