import { useEffect, useRef } from 'react'
import { rng } from '../../lib/showcaseScenes'

const readColors = () => {
  const cs = getComputedStyle(document.documentElement)
  const get = name => cs.getPropertyValue(`--${name}`).trim().split(/[\s,]+/).map(Number)
  const C = Object.fromEntries(['ink', 'accent', 'muted', 'faint', 'line', 'surface'].map(n => [n, get(n)]))
  C.key = JSON.stringify(C)
  return C
}

// Roda uma cena de showcaseScenes em um <canvas> que ocupa o elemento pai.
// Só anima enquanto está visível na tela; com movimento reduzido, mostra o quadro final.
export default function SceneCanvas({ scene, active = true, loop = true, onDone }) {
  const ref = useRef(null)
  const activeRef = useRef(active), doneRef = useRef(onDone)
  activeRef.current = active
  doneRef.current = onDone

  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext('2d')
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, state = null, C = null, raf = 0, frame = 0, hold = 0, finished = false, visible = true
    let seed = (Math.random() * 1e9) | 0

    const setup = () => {
      const r = canvas.getBoundingClientRect()
      if (r.width < 10 || r.height < 10) return false
      w = r.width; h = r.height
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      C = readColors()
      state = scene.init(w, h, rng(seed))
      finished = false; hold = 0
      ctx.clearRect(0, 0, w, h)
      if (reduce) {
        for (let i = 0; i < 20000 && !scene.tick(state); i++);
        scene.draw(ctx, state, w, h, C)
        finished = true
      }
      return true
    }

    const step = () => {
      raf = requestAnimationFrame(step)
      if (!visible || !activeRef.current || reduce) return
      if (!state && !setup()) return
      frame++
      if (frame % 30 === 0) {
        const next = readColors()
        if (next.key !== C.key) { C = next; if (scene.incremental) { setup(); return } }
      }
      if (!finished) {
        if (frame % (scene.every ?? 1) === 0) {
          for (let i = 0; i < (scene.speed ?? 1); i++) if (scene.tick(state)) { finished = true; break }
        }
        if (!scene.incremental) ctx.clearRect(0, 0, w, h)
        scene.draw(ctx, state, w, h, C)
      } else if (hold >= 0 && ++hold > (scene.hold ?? 120)) {
        if (loop) { seed++; setup() } else hold = -1
        doneRef.current?.()
      }
    }

    const ro = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect()
      if (Math.abs(r.width - w) > 2 || Math.abs(r.height - h) > 2) setup()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(canvas)
    setup()
    raf = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [scene, loop])

  return <canvas ref={ref} className="block w-full h-full" aria-hidden="true" />
}
