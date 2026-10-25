import { useEffect, useRef, useState } from 'react'

// Estado animado: cada operação gera uma lista de quadros { state, hl, note } exibidos em sequência.
export function useAnimatedState(initialState, initialNote) {
  const [frame, setFrame] = useState({ state: initialState, hl: {}, note: initialNote })
  const [busy, setBusy] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const play = frames => {
    clearTimeout(timer.current)
    setBusy(frames.length > 1)
    let i = 0
    const tick = () => {
      setFrame(frames[i])
      i++
      if (i < frames.length) timer.current = setTimeout(tick, 650)
      else setBusy(false)
    }
    tick()
  }

  return { ...frame, busy, play }
}

export function Playground({ children, controls, note, legend }) {
  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 py-6 border-b border-line min-h-[220px] flex items-center justify-center overflow-x-auto">
        {children}
      </div>
      <div className="min-h-[52px] px-4 sm:px-6 py-3 border-b border-line bg-subtle/50 text-sm text-ink/85 flex items-center">
        <span>{note}</span>
      </div>
      <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center gap-2">{controls}</div>
      {legend && (
        <figcaption className="px-4 sm:px-6 pb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {legend.map(([color, label]) => (
            <span key={label} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-sm ${color}`} /> {label}</span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}

export function ValueInput({ value, onChange, onEnter, placeholder = 'valor', width = 'w-20', type = 'number' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onEnter?.()}
      placeholder={placeholder}
      className={`${width} h-9 px-3 rounded-full border border-line bg-surface text-sm font-mono text-ink placeholder:text-faint focus:outline-none focus:ring-4 focus:ring-accent/10`}
    />
  )
}

export function OpButton({ children, onClick, disabled, primary }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${primary ? 'btn-primary' : 'btn-ghost'} !h-9 !px-4 disabled:opacity-40 disabled:pointer-events-none`}
    >
      {children}
    </button>
  )
}

// Cores de destaque compartilhadas pelos playgrounds.
export const tone = {
  active: 'bg-amber-400 border-amber-500 text-ink',
  new: 'bg-emerald-500 border-emerald-600 text-white',
  remove: 'bg-rose-500 border-rose-600 text-white',
  found: 'bg-ink border-ink text-paper',
  path: 'bg-accent/15 border-accent/40 text-ink',
  idle: 'bg-surface border-line text-ink',
}

const svgTone = {
  active: { fill: '#fbbf24', stroke: '#f59e0b', text: '#111' },
  new: { fill: '#10b981', stroke: '#059669', text: '#fff' },
  remove: { fill: '#f43f5e', stroke: '#e11d48', text: '#fff' },
  found: { fill: 'rgb(var(--ink))', stroke: 'rgb(var(--ink))', text: 'rgb(var(--paper))' },
  path: { fill: 'rgb(var(--accent) / 0.15)', stroke: 'rgb(var(--accent) / 0.5)', text: 'rgb(var(--ink))' },
  idle: { fill: 'rgb(var(--surface))', stroke: 'rgb(var(--line))', text: 'rgb(var(--ink))' },
}

// Posições de uma árvore binária: x pela ordem em-ordem, y pela profundidade.
export function layoutBinary(root, idOf = n => n.key) {
  const nodes = [], edges = []
  let x = 0
  const walk = (n, depth, parent) => {
    if (!n) return
    walk(n.left, depth + 1, n)
    nodes.push({ id: idOf(n), x: x++, depth, node: n })
    walk(n.right, depth + 1, n)
    if (parent) edges.push([idOf(parent), idOf(n)])
  }
  walk(root, 0, null)
  return { nodes, edges, columns: x }
}

// Posições de uma floresta n-ária: folhas lado a lado, pais centralizados sobre os filhos.
export function layoutForest(roots, childrenOf, idOf) {
  const nodes = [], edges = []
  let next = 0
  const walk = (n, depth) => {
    const kids = childrenOf(n)
    const xs = kids.map(k => { edges.push([idOf(n), idOf(k)]); return walk(k, depth + 1) })
    const x = xs.length ? (xs[0] + xs[xs.length - 1]) / 2 : next++
    nodes.push({ id: idOf(n), x, depth, node: n })
    return x
  }
  roots.forEach(r => { walk(r, 0); next += 0.5 })
  return { nodes, edges, columns: Math.max(next - 0.5, 1) }
}

export function TreeSvg({ layout, label, sublabel, toneOf = () => 'idle', ringOf = () => false, colW = 56, rowH = 64, r = 17, minWidth = 360 }) {
  const { nodes, edges, columns } = layout
  const pos = new Map(nodes.map(n => [n.id, n]))
  const depth = Math.max(0, ...nodes.map(n => n.depth))
  const width = Math.max(columns, 1) * colW
  const height = (depth + 1) * rowH
  const px = n => n.x * colW + colW / 2
  const py = n => n.depth * rowH + rowH / 2

  if (!nodes.length) return <p className="text-sm text-faint italic">vazia</p>

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 360, minWidth: Math.min(minWidth, width) }} role="img">
      {edges.map(([a, b]) => {
        const A = pos.get(a), B = pos.get(b)
        const onPath = toneOf(A.node) !== 'idle' && toneOf(B.node) !== 'idle'
        return <line key={`${a}-${b}`} x1={px(A)} y1={py(A)} x2={px(B)} y2={py(B)} stroke={onPath ? 'rgb(var(--accent))' : 'rgb(var(--line))'} strokeWidth={onPath ? 2.2 : 1.5} />
      })}
      {nodes.map(n => {
        const s = svgTone[toneOf(n.node)]
        return (
          <g key={n.id}>
            {ringOf(n.node) && <circle cx={px(n)} cy={py(n)} r={r + 4} fill="none" stroke={s.stroke} strokeWidth="1.5" />}
            <circle cx={px(n)} cy={py(n)} r={r} fill={s.fill} stroke={s.stroke} strokeWidth="1.5" style={{ transition: 'fill .25s, stroke .25s' }} />
            <text x={px(n)} y={py(n)} dy="0.35em" textAnchor="middle" fontSize="13" fontFamily="Geist Mono, monospace" fill={s.text}>{label(n.node)}</text>
            {sublabel && (
              <text x={px(n)} y={py(n) - r - 6} textAnchor="middle" fontSize="10" fontFamily="Geist Mono, monospace" fill="rgb(var(--faint))">{sublabel(n.node)}</text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1))
