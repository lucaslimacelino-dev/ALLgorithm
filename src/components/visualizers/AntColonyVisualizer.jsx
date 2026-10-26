import { useMemo, useState } from 'react'
import { antFrames } from '../../lib/optimizationFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const S = 4 // cidades em coordenadas 0..100 → viewBox 400 × 400

// Colônia de formigas no caixeiro-viajante: a feromônio vai marcando as boas arestas.
export default function AntColonyVisualizer() {
  const { t } = useI18n()
  const [n, setN] = useState(12)
  const [seed, setSeed] = useState(3)
  const frames = useMemo(() => antFrames(n, seed), [n, seed])
  const player = usePlayer(frames.length, { speedScale: 1.2 })
  const f = frames[player.step]
  const { cities } = f
  const edges = []
  for (let i = 0; i < cities.length; i++) for (let j = i + 1; j < cities.length; j++) edges.push([i, j, f.pher[i][j]])
  const tourPts = tour => tour.map(c => `${cities[c][0] * S},${cities[c][1] * S}`).join(' ')

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-line">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <label className="flex items-center gap-2 text-sm text-muted">
            {t('viz.cities')}
            <input type="range" min="6" max="20" value={n} onChange={e => { player.reset(); setN(Number(e.target.value)) }} className="w-32 accent-[rgb(var(--accent))]" />
            <span className="font-mono text-ink w-6">{n}</span>
          </label>
          <button onClick={() => { player.reset(); setSeed(s => s + 1) }} className="btn-ghost !h-8 text-xs">{t('viz.newCities')}</button>
          {f.bestLen && <span className="ml-auto text-sm text-muted">{t('viz.bestTour')}: <span className="font-mono text-ink">{f.bestLen.toFixed(1)}</span> · {t('viz.nearestNeighbor')}: <span className="font-mono">{f.nnLen.toFixed(1)}</span></span>}
        </div>
        <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[420px]">
          {edges.map(([i, j, p]) => p > 0.02 && (
            <line key={`${i}-${j}`} x1={cities[i][0] * S} y1={cities[i][1] * S} x2={cities[j][0] * S} y2={cities[j][1] * S} stroke="#f59e0b" strokeOpacity={0.15 + 0.7 * p} strokeWidth={0.5 + 6 * p} strokeLinecap="round" />
          ))}
          {f.best && <polygon points={tourPts(f.best)} fill="none" stroke="rgb(var(--accent))" strokeWidth="2.5" strokeLinejoin="round" />}
          {cities.map(([x, y], i) => <circle key={i} cx={x * S} cy={y * S} r="7" fill="rgb(var(--surface))" stroke="rgb(var(--ink))" strokeWidth="2" />)}
        </svg>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={[['bg-amber-400', t('viz.pheromone')], ['bg-accent', t('viz.bestTour')]]} status={t('viz.iteration', { i: f.it })} />
    </figure>
  )
}
