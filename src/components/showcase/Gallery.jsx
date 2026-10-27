import { Link } from 'react-router-dom'
import SceneCanvas from './SceneCanvas'
import { galleryScenes } from '../../lib/showcaseScenes'
import { getAlgorithm, getCategory, preloadAlgorithm } from '../../data'
import { useI18n } from '../../i18n'

// Galeria "em movimento": cada cartão anima em loop enquanto está visível e abre o artigo.
export default function Gallery() {
  const { loc, locale } = useI18n()
  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {galleryScenes.map(scene => {
        const algorithm = getAlgorithm(scene.id)
        return (
          <Link key={scene.id} to={`/algoritmos/${scene.id}`} onMouseEnter={() => preloadAlgorithm(scene.id)} className="group card card-hover overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-subtle/60 border-b border-line">
              <SceneCanvas scene={scene} />
            </div>
            <div className="p-5">
              <p className="text-xs text-faint">{loc(getCategory(algorithm.category)).title}</p>
              <h3 className="mt-1 title text-lg group-hover:text-accent">{loc(algorithm).name}</h3>
              <p className="mt-1.5 text-sm leading-snug text-muted">{scene.caption[locale] ?? scene.caption.pt}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
