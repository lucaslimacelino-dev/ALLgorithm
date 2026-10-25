import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n'

const W = 640, H = 345, PAD = 30

const range = n => Array.from({ length: n }, (_, i) => i)
const presets = {
  'Cubo': { n: 8, edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]] },
  'Grade 4×4': { n: 16, edges: range(16).flatMap(i => [...(i % 4 < 3 ? [[i, i + 1]] : []), ...(i < 12 ? [[i, i + 4]] : [])]) },
  'Árvore': { n: 15, edges: range(14).map(i => [Math.floor(i / 2), i + 1]) },
  'Duas comunidades': { n: 10, edges: [...range(5).flatMap(i => range(5).filter(j => j > i).map(j => [i, j])), ...range(5).flatMap(i => range(5).filter(j => j > i).map(j => [i + 5, j + 5])), [4, 5]] },
}

const presetLabel = { 'Cubo': 'viz.force.cube', 'Grade 4×4': 'viz.force.grid', 'Árvore': 'viz.force.tree', 'Duas comunidades': 'viz.force.communities' }

const scatter = n => range(n).map(() => ({ x: PAD + Math.random() * (W - 2 * PAD), y: PAD + Math.random() * (H - 2 * PAD) }))

// Um passo do algoritmo de Fruchterman-Reingold: repulsão entre todos os pares, atração nas arestas.
function step(pos, edges, temp, fixed) {
  const n = pos.length
  // durante a troca de grafo, arestas e posições podem estar dessincronizadas por um quadro
  if (edges.some(([a, b]) => a >= n || b >= n)) return { next: pos, energy: 0 }
  const k = 0.75 * Math.sqrt((W * H) / n)
  const disp = pos.map(() => ({ x: 0, y: 0 }))
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    let dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y
    const d = Math.max(Math.hypot(dx, dy), 0.01)
    const f = (k * k) / d
    dx /= d; dy /= d
    disp[i].x += dx * f; disp[i].y += dy * f
    disp[j].x -= dx * f; disp[j].y -= dy * f
  }
  for (const [a, b] of edges) {
    let dx = pos[a].x - pos[b].x, dy = pos[a].y - pos[b].y
    const d = Math.max(Math.hypot(dx, dy), 0.01)
    const f = (d * d) / k
    dx /= d; dy /= d
    disp[a].x -= dx * f; disp[a].y -= dy * f
    disp[b].x += dx * f; disp[b].y += dy * f
  }
  let energy = 0
  const next = pos.map((p, i) => {
    if (i === fixed) return p
    const d = Math.max(Math.hypot(disp[i].x, disp[i].y), 0.01)
    const move = Math.min(d, temp)
    energy += move
    return {
      x: Math.min(W - PAD, Math.max(PAD, p.x + (disp[i].x / d) * move)),
      y: Math.min(H - PAD, Math.max(PAD, p.y + (disp[i].y / d) * move)),
    }
  })
  return { next, energy }
}

export default function ForceLayoutVisualizer() {
  const { t } = useI18n()
  const [preset, setPreset] = useState('Cubo')
  const { n, edges } = presets[preset]
  const [pos, setPos] = useState(() => scatter(n))
  const [running, setRunning] = useState(true)
  const [energy, setEnergy] = useState(0)
  const temp = useRef(60)
  const dragged = useRef(null)
  const svg = useRef(null)
  const posRef = useRef(pos)
  posRef.current = pos

  const restart = useCallback(count => {
    temp.current = 60
    setPos(scatter(count))
    setRunning(true)
  }, [])

  useEffect(() => { restart(presets[preset].n) }, [preset, restart])

  useEffect(() => {
    if (!running) return
    let raf
    const tick = () => {
      const { next, energy: e } = step(posRef.current, edges, temp.current, dragged.current)
      temp.current = Math.max(temp.current * 0.975, dragged.current !== null ? 6 : 0)
      setPos(next)
      setEnergy(e)
      if (temp.current < 0.3 && dragged.current === null) { setRunning(false); return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, edges])

  const toSvg = e => {
    const pt = svg.current.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    return pt.matrixTransform(svg.current.getScreenCTM().inverse())
  }
  const onMove = e => {
    if (dragged.current === null) return
    const p = toSvg(e)
    setPos(prev => prev.map((q, i) => (i === dragged.current ? { x: p.x, y: p.y } : q)))
  }
  const onDown = i => e => {
    e.preventDefault()
    dragged.current = i
    temp.current = Math.max(temp.current, 20)
    setRunning(true)
  }
  const onUp = () => { dragged.current = null }

  return (
    <figure className="card overflow-hidden">
      <div className="px-2 sm:px-4 pt-4 pb-2 border-b border-line">
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="w-full touch-none select-none" onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp} role="img" aria-label={t('viz.force.running')}>
          {edges.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={pos[a]?.x} y1={pos[a]?.y} x2={pos[b]?.x} y2={pos[b]?.y} stroke="rgb(var(--faint) / 0.7)" strokeWidth="1.6" />
          ))}
          {pos.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="11" onPointerDown={onDown(i)} className="cursor-grab active:cursor-grabbing"
              fill={dragged.current === i ? '#fbbf24' : 'rgb(var(--ink))'} stroke="rgb(var(--surface))" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div className="min-h-[52px] px-4 sm:px-6 py-3 border-b border-line bg-subtle/50 text-sm text-ink/85 flex items-center">
        {running
          ? t('viz.force.running')
          : t('viz.force.stable')}
      </div>
      <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center gap-2">
        {Object.keys(presets).map(name => (
          <button key={name} onClick={() => setPreset(name)} className={`${preset === name ? 'btn-primary' : 'btn-ghost'} !h-9 !px-4`}>{t(presetLabel[name])}</button>
        ))}
        <button onClick={() => restart(n)} className="btn-ghost !h-9 !px-4">{t('viz.force.shuffle')}</button>
      </div>
      <figcaption className="px-4 sm:px-6 pb-4 flex justify-between text-xs text-muted">
        <span>{t('viz.force.drag')}</span>
        <span className="font-mono tabular-nums">{running ? t('viz.force.status', { t: temp.current.toFixed(1), e: energy.toFixed(0) }) : t('viz.force.stableShort')}</span>
      </figcaption>
    </figure>
  )
}
