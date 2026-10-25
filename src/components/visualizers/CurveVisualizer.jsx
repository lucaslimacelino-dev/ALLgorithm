import { useEffect, useMemo, useRef, useState } from 'react'
import { bezierCurve, bsplineCurve, clampedKnots, deBoorLevels, deCasteljauLevels } from '../../lib/numericFrames'
import { useI18n } from '../../i18n'

const W = 640, H = 340
const BEZIER_START = [[70, 280], [170, 60], [430, 50], [570, 270]]
const SPLINE_START = [[50, 260], [130, 80], [240, 230], [330, 70], [430, 250], [520, 90], [600, 230]]
const LEVEL_COLORS = ['rgb(var(--faint))', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6', '#0ea5e9']

// De Casteljau (Bézier) e De Boor (B-spline): pontos arrastáveis e a construção para um t.
export default function CurveVisualizer({ algorithm }) {
  const { t: tr } = useI18n()
  const isSpline = algorithm.id === 'de-boor'
  const [points, setPoints] = useState(isSpline ? SPLINE_START : BEZIER_START)
  const [degree, setDegree] = useState(3)
  const [t, setT] = useState(0.4)
  const [playing, setPlaying] = useState(false)
  const svg = useRef(null)
  const drag = useRef(null)

  const p = Math.min(degree, points.length - 1)
  const curve = useMemo(() => (isSpline ? bsplineCurve(points, p) : bezierCurve(points)), [isSpline, points, p])
  const tt = Math.min(t, 1 - 1e-9)
  const levels = isSpline ? deBoorLevels(points, p, clampedKnots(points.length, p), tt).levels : deCasteljauLevels(points, t)
  const point = levels.at(-1)[0]

  useEffect(() => {
    if (!playing) return
    let raf, last = performance.now()
    const tick = now => {
      setT(v => { const nv = v + (now - last) / 3000; return nv > 1 ? 0 : nv })
      last = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const toSvg = e => {
    const pt = svg.current.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const q = pt.matrixTransform(svg.current.getScreenCTM().inverse())
    return [Math.max(10, Math.min(W - 10, q.x)), Math.max(10, Math.min(H - 10, q.y))]
  }
  const onMove = e => {
    if (drag.current === null) return
    const q = toSvg(e)
    setPoints(prev => prev.map((pt, i) => (i === drag.current ? q : pt)))
  }

  const addPoint = () => setPoints(prev => (prev.length >= 9 ? prev : [...prev, [W / 2 + (Math.random() - 0.5) * 300, H / 2 + (Math.random() - 0.5) * 160]]))
  const removePoint = () => setPoints(prev => (prev.length <= (isSpline ? p + 2 : 2) ? prev : prev.slice(0, -1)))

  const polyline = pts => pts.map(q => q.join(',')).join(' ')
  const note = isSpline
    ? `t = ${t.toFixed(2)}: o algoritmo de De Boor usa só ${p + 1} pontos de controle vizinhos (controle local) e faz ${p} rodadas de interpolações para chegar ao ponto da curva.`
    : `t = ${t.toFixed(2)}: cada segmento é dividido na proporção t; repetindo com os novos pontos, ${points.length - 1} rodadas depois sobra um único ponto — que está na curva.`

  return (
    <figure className="card overflow-hidden">
      <div className="px-2 sm:px-4 pt-4 pb-2 border-b border-line">
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="w-full touch-none select-none" onPointerMove={onMove} onPointerUp={() => { drag.current = null }} onPointerLeave={() => { drag.current = null }} role="img" aria-label={algorithm.name}>
          <polyline points={polyline(points)} fill="none" stroke="rgb(var(--faint) / 0.6)" strokeWidth="1.5" strokeDasharray="5 4" />
          <polyline points={polyline(curve)} fill="none" stroke="rgb(var(--ink))" strokeWidth="3" strokeLinejoin="round" />
          {levels.slice(1, -1).map((lvl, i) => (
            <g key={i}>
              <polyline points={polyline(lvl)} fill="none" stroke={LEVEL_COLORS[(i + 1) % LEVEL_COLORS.length]} strokeWidth="1.6" />
              {lvl.map((q, j) => <circle key={j} cx={q[0]} cy={q[1]} r="3.5" fill={LEVEL_COLORS[(i + 1) % LEVEL_COLORS.length]} />)}
            </g>
          ))}
          {points.map((q, i) => (
            <g key={i} onPointerDown={e => { e.preventDefault(); drag.current = i }} className="cursor-grab active:cursor-grabbing">
              <circle cx={q[0]} cy={q[1]} r="14" fill="transparent" />
              <circle cx={q[0]} cy={q[1]} r="7" fill="rgb(var(--surface))" stroke="rgb(var(--ink))" strokeWidth="2" />
              <text x={q[0] + 11} y={q[1] - 9} fontSize="11" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">P{i}</text>
            </g>
          ))}
          <circle cx={point[0]} cy={point[1]} r="7" fill="rgb(var(--accent))" stroke="rgb(var(--surface))" strokeWidth="2" />
        </svg>
      </div>
      <div className="min-h-[52px] px-4 sm:px-6 py-3 border-b border-line bg-subtle/50 text-sm text-ink/85 flex items-center">{note}</div>
      <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setPlaying(v => !v)} className="btn-primary !h-9 min-w-[112px]">{playing ? tr('viz.stop') : tr('viz.animate')}</button>
        <label className="flex items-center gap-2 text-sm text-muted">
          <span className="font-mono">t</span>
          <input type="range" min="0" max="1" step="0.01" value={t} onChange={e => { setPlaying(false); setT(Number(e.target.value)) }} className="w-40 accent-[rgb(var(--accent))]" />
          <span className="font-mono text-ink w-10">{t.toFixed(2)}</span>
        </label>
        <button onClick={addPoint} className="btn-ghost !h-9">{tr('viz.addPoint')}</button>
        <button onClick={removePoint} className="btn-ghost !h-9">{tr('viz.removePoint')}</button>
        {isSpline && (
          <div className="inline-flex p-1 rounded-full border border-line ml-auto" role="group" aria-label={tr('viz.degree')}>
            {[1, 2, 3].map(d => (
              <button key={d} onClick={() => setDegree(d)} className={`h-7 px-3 rounded-full text-xs ${degree === d ? 'bg-subtle text-ink font-medium' : 'text-muted hover:text-ink'}`}>
                {tr('viz.degree')} {d}
              </button>
            ))}
          </div>
        )}
      </div>
      <figcaption className="px-4 sm:px-6 pb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border-2 border-ink" /> {tr('viz.controlPolygon')}</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> {tr('viz.construction')}</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-ink" /> {tr('viz.curve')}</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-accent" /> {tr('viz.curvePoint')}</span>
        <span className="ml-auto">{tr('viz.dragPoints')}</span>
      </figcaption>
    </figure>
  )
}
