import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n'

const W = 256, H = 144, ROWS_PER_FRAME = 4

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const norm = a => mul(a, 1 / Math.sqrt(dot(a, a)))

const SPHERES = [
  { c: [0, 1, 3], r: 1, color: [0.9, 0.25, 0.3], refl: 0.15 },
  { c: [-2.3, 0.7, 4.2], r: 0.7, color: [0.2, 0.45, 0.95], refl: 0.1 },
  { c: [2.1, 0.85, 4.4], r: 0.85, color: [0.85, 0.85, 0.9], refl: 0.75 },
]
const EYE = [0, 1.3, -3.2]

// Interseção mais próxima do raio com as esferas e o chão (plano y = 0).
function hit(o, d) {
  let best = null
  for (const s of SPHERES) {
    const oc = sub(o, s.c)
    const b = dot(oc, d), c = dot(oc, oc) - s.r * s.r, disc = b * b - c
    if (disc < 0) continue
    const sq = Math.sqrt(disc)
    let t = -b - sq
    if (t < 1e-4) t = -b + sq
    if (t > 1e-4 && (!best || t < best.t)) {
      const p = add(o, mul(d, t))
      best = { t, p, n: norm(sub(p, s.c)), color: s.color, refl: s.refl }
    }
  }
  if (d[1] < -1e-6) {
    const t = -o[1] / d[1]
    if (t > 1e-4 && (!best || t < best.t)) {
      const p = add(o, mul(d, t))
      const check = (Math.floor(p[0]) + Math.floor(p[2])) & 1
      best = { t, p, n: [0, 1, 0], color: check ? [0.82, 0.82, 0.8] : [0.35, 0.36, 0.38], refl: 0.2 }
    }
  }
  return best
}

function trace(o, d, depth, opts) {
  opts.rays++
  const h = hit(o, d)
  if (!h) { const k = 0.5 + 0.5 * d[1]; return [0.55 + 0.35 * k, 0.7 + 0.25 * k, 0.95] } // céu
  const toLight = sub(opts.light, h.p)
  const distLight = Math.sqrt(dot(toLight, toLight))
  const l = mul(toLight, 1 / distLight)
  let lit = 1
  if (opts.shadows) {
    opts.rays++
    const s = hit(add(h.p, mul(h.n, 1e-3)), l)
    if (s && s.t < distLight) lit = 0 // algo bloqueia a luz: sombra
  }
  const diffuse = Math.max(0, dot(h.n, l)) * lit
  const r = sub(l, mul(h.n, 2 * dot(l, h.n)))
  const spec = lit ? Math.max(0, dot(r, d)) ** 40 : 0
  let color = add(mul(h.color, 0.12 + 0.88 * diffuse), [spec * 0.7, spec * 0.7, spec * 0.7])
  if (depth > 0 && h.refl > 0) {
    const rd = sub(d, mul(h.n, 2 * dot(d, h.n)))
    color = add(mul(color, 1 - h.refl), mul(trace(add(h.p, mul(h.n, 1e-3)), rd, depth - 1, opts), h.refl))
  }
  return color
}

// Traçado de raios progressivo: um raio por pixel, linha a linha, com sombras e reflexos.
export default function RayTracerVisualizer() {
  const { t } = useI18n()
  const canvas = useRef(null)
  const [angle, setAngle] = useState(35)
  const [shadows, setShadows] = useState(true)
  const [depth, setDepth] = useState(2)
  const [run, setRun] = useState(0)
  const [progress, setProgress] = useState({ row: 0, rays: 0 })

  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    const img = ctx.createImageData(W, H)
    const a = (angle * Math.PI) / 180
    const opts = { light: [6 * Math.cos(a), 6, 3 - 6 * Math.sin(a)], shadows, rays: 0 }
    let row = 0, raf
    ctx.fillStyle = '#000'
    const step = () => {
      for (let k = 0; k < ROWS_PER_FRAME && row < H; k++, row++) {
        for (let x = 0; x < W; x++) {
          const d = norm([((x + 0.5 - W / 2) / H) * 1.25, (-(row + 0.5 - H / 2) / H) * 1.25, 1])
          const c = trace(EYE, d, depth, opts)
          const i = (row * W + x) * 4
          img.data[i] = Math.min(255, c[0] * 255)
          img.data[i + 1] = Math.min(255, c[1] * 255)
          img.data[i + 2] = Math.min(255, c[2] * 255)
          img.data[i + 3] = 255
        }
      }
      ctx.putImageData(img, 0, 0)
      if (row < H) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.9)'
        ctx.fillRect(0, row, W, 1) // linha sendo traçada
      }
      setProgress({ row, rays: opts.rays })
      if (row < H) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [angle, shadows, depth, run])

  const done = progress.row >= H
  const note = done
    ? `Pronto: ${W * H} pixels, ${progress.rays.toLocaleString()} raios no total. Para cada pixel, um raio sai da câmera; ao atingir um objeto, um raio de sombra vai até a luz e, se o material reflete, um novo raio continua refletido.`
    : `Traçando a linha ${progress.row} de ${H}: um raio primário por pixel, mais raios de sombra e de reflexo a cada objeto atingido.`

  return (
    <figure className="card overflow-hidden">
      <div className="px-2 sm:px-4 pt-4 pb-4 border-b border-line">
        <canvas ref={canvas} width={W} height={H} className="w-full rounded-lg" style={{ imageRendering: 'pixelated' }} aria-label={t('viz.raytrace')} />
      </div>
      <div className="min-h-[52px] px-4 sm:px-6 py-3 border-b border-line bg-subtle/50 text-sm text-ink/85 flex items-center">{note}</div>
      <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setRun(v => v + 1)} className="btn-primary !h-9 min-w-[112px]">{t('viz.render')}</button>
        <label className="flex items-center gap-2 text-sm text-muted">
          {t('viz.lightPosition')}
          <input type="range" min="-60" max="240" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-36 accent-[rgb(var(--accent))]" />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={shadows} onChange={e => setShadows(e.target.checked)} className="accent-[rgb(var(--accent))]" />
          {t('viz.shadows')}
        </label>
        <div className="inline-flex p-1 rounded-full border border-line ml-auto" role="group" aria-label={t('viz.reflections')}>
          {[0, 1, 3].map(d => (
            <button key={d} onClick={() => setDepth(d)} className={`h-7 px-3 rounded-full text-xs ${depth === d ? 'bg-subtle text-ink font-medium' : 'text-muted hover:text-ink'}`}>
              {t('viz.reflections')}: {d}
            </button>
          ))}
        </div>
      </div>
      <figcaption className="px-4 sm:px-6 pb-4 flex flex-wrap justify-between gap-3 text-xs text-muted">
        <span>{t('viz.raytraceHint')}</span>
        <span className="font-mono">{t('viz.raysTraced', { n: progress.rays.toLocaleString() })}</span>
      </figcaption>
    </figure>
  )
}
