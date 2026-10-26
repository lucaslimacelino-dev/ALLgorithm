import { useEffect, useMemo, useRef, useState } from 'react'
import { annealingFrames, gradientFrames, hillFrames, landscapes } from '../../lib/optimizationFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const RES = 160
const STOPS = [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]] // viridis
const color = t => {
  const x = Math.min(0.999, Math.max(0, t)) * (STOPS.length - 1), i = Math.floor(x), f = x - i
  return STOPS[i].map((c, k) => Math.round(c + (STOPS[i + 1][k] - c) * f))
}

const CONFIG = {
  'gradient-descent': { fns: ['bowl', 'rosenbrock', 'himmelblau'], param: 'η', defaults: { bowl: 0.04, rosenbrock: 0.001, himmelblau: 0.01 }, start: { bowl: [-4, 4], rosenbrock: [-1.5, 2], himmelblau: [0, 0] }, run: (fn, s, v) => gradientFrames(fn, s, v) },
  'hill-climbing': { fns: ['rastrigin', 'himmelblau'], param: 'passo', defaults: { rastrigin: 0.6, himmelblau: 0.6 }, start: { rastrigin: [3.7, -3.1], himmelblau: [-1, -1] }, seeded: true, run: (fn, s, v, seed) => hillFrames(fn, s, v, seed) },
  'simulated-annealing': { fns: ['rastrigin', 'himmelblau'], param: 'T₀', defaults: { rastrigin: 5, himmelblau: 50 }, start: { rastrigin: [3.7, -3.1], himmelblau: [-1, -1] }, seeded: true, run: (fn, s, v, seed) => annealingFrames(fn, s, v, seed) },
}

// Paisagens 2D (mapa de calor: escuro = valores baixos) com o caminho do otimizador.
export default function LandscapeVisualizer({ algorithm }) {
  const { t } = useI18n()
  const cfg = CONFIG[algorithm.id]
  const [fn, setFn] = useState(cfg.fns[0])
  const [start, setStart] = useState(cfg.start[cfg.fns[0]])
  const [param, setParam] = useState(String(cfg.defaults[cfg.fns[0]]))
  const [seed, setSeed] = useState(5)
  const [error, setError] = useState(false)
  const L = landscapes[fn]
  const frames = useMemo(() => {
    try { return cfg.run(fn, start, Number(param), seed) } catch { return null }
  }, [cfg, fn, start, param, seed])
  const player = usePlayer(frames?.length ?? 1, { speedScale: 0.5 })
  const f = frames?.[player.step]
  const canvas = useRef(null)
  const [x0, x1, y0, y1] = L.range
  const toU = ([x, y]) => [(x - x0) / (x1 - x0), 1 - (y - y0) / (y1 - y0)]

  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    const img = ctx.createImageData(RES, RES)
    const vals = []
    for (let j = 0; j < RES; j++) for (let i = 0; i < RES; i++) vals.push(Math.log1p(L.f(x0 + ((i + 0.5) / RES) * (x1 - x0), y1 - ((j + 0.5) / RES) * (y1 - y0))))
    const lo = Math.min(...vals), hi = Math.max(...vals)
    vals.forEach((v, k) => { const [r, g, b] = color((v - lo) / (hi - lo)); img.data.set([r, g, b, 255], k * 4) })
    ctx.putImageData(img, 0, 0)
  }, [L, x0, x1, y0, y1])

  const choose = name => { setFn(name); setStart(cfg.start[name]); setParam(String(cfg.defaults[name])); player.reset() }
  const onClick = e => {
    const r = e.currentTarget.getBoundingClientRect()
    const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height
    setStart([x0 + u * (x1 - x0), y1 - v * (y1 - y0)])
    player.reset()
  }
  const pts = f ? f.path.map(toU) : []

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-line">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex p-1 rounded-full border border-line" role="group">
            {cfg.fns.map(name => (
              <button key={name} onClick={() => choose(name)} className={`h-7 px-3 rounded-full text-xs ${fn === name ? 'bg-subtle text-ink font-medium' : 'text-muted hover:text-ink'}`}>{landscapes[name].label}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <span className="font-mono">{cfg.param}</span>
            <input value={param} onChange={e => { setParam(e.target.value.replace(',', '.')); setError(false); player.reset() }} onBlur={() => setError(!frames)} className="w-24 h-8 px-3 rounded-full border border-line bg-surface font-mono text-sm text-ink" />
          </label>
          {cfg.seeded && <button onClick={() => { setSeed(s => s + 1); player.reset() }} className="btn-ghost !h-8 text-xs">{t('viz.newSeed')}</button>}
          {error && <span className="text-sm text-rose-600">{t('viz.invalidFields')}</span>}
        </div>
        <div className="relative mx-auto max-w-[420px] aspect-square cursor-crosshair" onClick={onClick}>
          <canvas ref={canvas} width={RES} height={RES} className="absolute inset-0 w-full h-full rounded-lg" />
          <svg viewBox="0 0 1 1" className="absolute inset-0 w-full h-full">
            {f?.cands?.map((c, i) => { const [u, v] = toU(c); return <circle key={i} cx={u} cy={v} r="0.008" fill="white" opacity="0.8" /> })}
            <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke="white" strokeWidth="0.006" strokeLinejoin="round" opacity="0.9" />
            {f?.cand && (() => { const [u, v] = toU(f.cand); return <circle cx={u} cy={v} r="0.014" fill="none" stroke={f.accepted ? '#10b981' : '#f43f5e'} strokeWidth="0.005" /> })()}
            {f?.best && (() => { const [u, v] = toU(f.best); return <circle cx={u} cy={v} r="0.014" fill="#10b981" stroke="white" strokeWidth="0.004" /> })()}
            {pts[0] && <circle cx={pts[0][0]} cy={pts[0][1]} r="0.014" fill="white" />}
            {f && (() => { const [u, v] = toU(f.cur); return <circle cx={u} cy={v} r="0.018" fill="#f59e0b" stroke="white" strokeWidth="0.005" /> })()}
          </svg>
        </div>
      </div>
      <StepNote>{f?.note ?? t('viz.invalidFields')}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-amber-400', t('viz.currentPosition')], ['bg-white border border-line', t('viz.startPoint')], ...(cfg.seeded && algorithm.id === 'simulated-annealing' ? [['bg-emerald-500', t('viz.bestSoFar')]] : [])]}
        status={t('viz.clickToStart')}
      />
    </figure>
  )
}
