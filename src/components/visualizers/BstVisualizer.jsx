import { useMemo, useState } from 'react'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const BALANCED = [50, 30, 72, 18, 41, 63, 88, 9, 25, 36, 47, 58, 69, 80, 95]

function buildTree(values) {
  let root = null
  const insert = v => {
    const node = { v, left: null, right: null }
    if (!root) { root = node; return }
    for (let cur = root; ;) {
      const side = v < cur.v ? 'left' : 'right'
      if (!cur[side]) { cur[side] = node; return }
      cur = cur[side]
    }
  }
  values.forEach(insert)

  // posição: x pela ordem em-ordem, y pela profundidade
  const nodes = []
  const edges = []
  let x = 0
  const walk = (n, depth, parent) => {
    if (!n) return
    walk(n.left, depth + 1, n)
    n.x = x++
    n.depth = depth
    nodes.push(n)
    walk(n.right, depth + 1, n)
    if (parent) edges.push([parent, n])
  }
  walk(root, 0, null)
  return { root, nodes, edges, depth: Math.max(...nodes.map(n => n.depth)) }
}

function searchFrames(root, t) {
  const frames = [{ path: [], current: null, found: null, note: `Procurar ${t} começando pela raiz.` }]
  const path = []
  for (let cur = root; cur;) {
    path.push(cur.v)
    if (t === cur.v) {
      frames.push({ path: [...path], current: cur.v, found: cur.v, note: `${t} = ${cur.v} — encontrado em ${path.length} ${path.length === 1 ? 'comparação' : 'comparações'}.` })
      return frames
    }
    const goLeft = t < cur.v
    frames.push({
      path: [...path], current: cur.v, found: null,
      note: `${t} ${goLeft ? '<' : '>'} ${cur.v} → desce para a ${goLeft ? 'esquerda' : 'direita'}${(goLeft ? cur.left : cur.right) ? '' : ' (vazio)'}.`,
    })
    cur = goLeft ? cur.left : cur.right
  }
  frames.push({ path: [...path], current: null, found: null, note: `Chegou a um ponteiro vazio: ${t} não está na árvore (${path.length} comparações).` })
  return frames
}

const randomValues = () => {
  const set = new Set()
  while (set.size < 12) set.add(1 + Math.floor(Math.random() * 99))
  return [...set]
}

export default function BstVisualizer() {
  const [values, setValues] = useState(BALANCED)
  const tree = useMemo(() => buildTree(values), [values])
  const [target, setTarget] = useState(63)
  const frames = useMemo(() => searchFrames(tree.root, target), [tree, target])
  const player = usePlayer(frames.length)
  const frame = frames[player.step]

  const W = 60, H = 64, R = 17
  const width = tree.nodes.length * W
  const height = (tree.depth + 1) * H
  const px = n => n.x * W + W / 2
  const py = n => n.depth * H + H / 2

  const choose = v => { player.reset(); setTarget(v) }
  const missing = () => {
    const set = new Set(values)
    let v
    do { v = 1 + Math.floor(Math.random() * 99) } while (set.has(v))
    choose(v)
  }
  const reshape = vals => { player.reset(); setValues(vals); setTarget(vals[Math.floor(Math.random() * vals.length)]) }

  const nodeStyle = n => {
    if (frame.found === n.v) return { fill: 'rgb(var(--ink))', text: 'rgb(var(--paper))', stroke: 'rgb(var(--ink))' }
    if (frame.current === n.v) return { fill: '#fbbf24', text: '#111', stroke: '#f59e0b' }
    if (frame.path.includes(n.v)) return { fill: 'rgb(var(--accent) / 0.18)', text: 'rgb(var(--ink))', stroke: 'rgb(var(--accent) / 0.5)' }
    return { fill: 'rgb(var(--surface))', text: 'rgb(var(--ink))', stroke: 'rgb(var(--line))' }
  }
  const onPath = (a, b) => frame.path.includes(a.v) && frame.path.includes(b.v)

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-line">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Procurando</span>
          <span className="inline-flex h-8 min-w-[2.5rem] px-2.5 items-center justify-center rounded-full bg-ink text-paper font-mono text-[13px]">{target}</span>
          <span className="text-faint text-xs ml-1">Clique em um nó para mudar o alvo.</span>
        </div>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[520px]" style={{ maxHeight: 340 }} role="img" aria-label="Árvore binária de busca">
            {tree.edges.map(([a, b]) => (
              <line key={`${a.v}-${b.v}`} x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)}
                stroke={onPath(a, b) ? 'rgb(var(--accent))' : 'rgb(var(--line))'} strokeWidth={onPath(a, b) ? 2.5 : 1.5} />
            ))}
            {tree.nodes.map(n => {
              const s = nodeStyle(n)
              return (
                <g key={n.v} onClick={() => choose(n.v)} className="cursor-pointer">
                  <circle cx={px(n)} cy={py(n)} r={R} fill={s.fill} stroke={s.stroke} strokeWidth="1.5" style={{ transition: 'fill .2s, stroke .2s' }} />
                  <text x={px(n)} y={py(n)} dy="0.35em" textAnchor="middle" fontSize="13" fontFamily="Geist Mono, monospace" fill={s.text}>{n.v}</text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      <StepNote>{frame.note}</StepNote>

      <PlayerControls player={player}>
        <button onClick={missing} className="btn-ghost !h-9">Alvo ausente</button>
        <button onClick={() => reshape(BALANCED)} className="btn-ghost !h-9">Balanceada</button>
        <button onClick={() => reshape(randomValues())} className="btn-ghost !h-9">Aleatória</button>
      </PlayerControls>

      <Legend
        items={[['bg-amber-400', 'Comparando'], ['bg-accent/20', 'Caminho percorrido'], ['bg-ink', 'Encontrado']]}
        status={`profundidade da árvore: ${tree.depth + 1} níveis`}
      />
    </figure>
  )
}
