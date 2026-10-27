import { useState } from 'react'
import { Link } from 'react-router-dom'
import SceneCanvas from './SceneCanvas'
import { heroScenes } from '../../lib/showcaseScenes'
import { getAlgorithm, preloadAlgorithm } from '../../data'
import { useI18n } from '../../i18n'

// Vitrine do topo da página inicial: alterna entre algoritmos animados; pausa com o mouse em cima.
export default function Showcase() {
  const { t, loc, locale } = useI18n()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const scene = heroScenes[index]
  const algorithm = getAlgorithm(scene.id)

  return (
    <div className="card p-5 sm:p-6" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="inline-flex items-center gap-2 min-w-0 font-mono text-muted">
          <span className={`w-1.5 h-1.5 shrink-0 rounded-full ${paused ? 'bg-faint' : 'bg-amber-400 animate-pulse'}`} />
          <span className="truncate">{loc(algorithm).name}</span>
        </span>
        <Link to={`/algoritmos/${scene.id}`} onMouseEnter={() => preloadAlgorithm(scene.id)} className="shrink-0 font-medium text-ink hover:text-accent">
          {t('landing.read')} →
        </Link>
      </div>
      <div className="mt-4 h-56 sm:h-64 rounded-xl bg-subtle/60 overflow-hidden">
        <SceneCanvas key={scene.id} scene={scene} loop={false} active={!paused} onDone={() => setIndex(i => (i + 1) % heroScenes.length)} />
      </div>
      <div className="mt-4 pt-4 border-t border-line flex items-center justify-between gap-4">
        <p className="text-[13px] leading-snug text-muted min-h-[2.6em]">{scene.caption[locale] ?? scene.caption.pt}</p>
        <div className="flex gap-1.5 shrink-0">
          {heroScenes.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={loc(getAlgorithm(s.id)).name}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-ink' : 'w-1.5 bg-ink/20 hover:bg-ink/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
