import { useMemo } from 'react'
import { graphAlgorithms, graphs, savingsData } from '../../lib/graphFrames'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const nodeTone = {
  idle: { fill: 'rgb(var(--surface))', stroke: 'rgb(var(--line))', text: 'rgb(var(--ink))' },
  active: { fill: '#fbbf24', stroke: '#f59e0b', text: '#111' },
  frontier: { fill: '#fef3c7', stroke: '#fbbf24', text: '#111' },
  done: { fill: 'rgb(var(--ink))', stroke: 'rgb(var(--ink))', text: 'rgb(var(--paper))' },
  new: { fill: '#10b981', stroke: '#059669', text: '#fff' },
}

const edgeTone = {
  idle: { stroke: 'rgb(var(--faint) / 0.55)', width: 1.6 },
  active: { stroke: '#f59e0b', width: 3.2 },
  frontier: { stroke: '#fcd34d', width: 2.4 },
  path: { stroke: 'rgb(var(--accent))', width: 3.2 },
  new: { stroke: '#10b981', width: 3.2 },
  remove: { stroke: '#f43f5e', width: 3 },
  muted: { stroke: 'rgb(var(--line))', width: 1.4, dash: '4 4' },
}

const R = 18

function edgeGeometry(a, b, curved, offsetEnd) {
  const dx = b.x - a.x, dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  const ux = dx / len, uy = dy / len
  const bend = curved ? 22 : 0
  const mx = (a.x + b.x) / 2 - uy * bend, my = (a.y + b.y) / 2 + ux * bend
  // encurta o fim para a seta não ficar escondida atrás do nó
  const ex = b.x - ux * (offsetEnd ? R + 4 : 0), ey = b.y - uy * (offsetEnd ? R + 4 : 0)
  const sx = a.x + ux * (offsetEnd ? R : 0), sy = a.y + uy * (offsetEnd ? R : 0)
  const d = curved ? `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}` : `M ${sx} ${sy} L ${ex} ${ey}`
  const lx = curved ? (a.x + b.x) / 2 - uy * (bend / 2 + 4) : mx - uy * 11
  const ly = curved ? (a.y + b.y) / 2 + ux * (bend / 2 + 4) : my + ux * 11
  return { d, lx, ly }
}

function Aux({ aux }) {
  if (!aux) return null
  if (aux.kind === 'matrix') {
    return (
      <table className="font-mono text-xs border-separate border-spacing-1">
        <thead>
          <tr><th />{aux.ids.map((id, j) => <th key={id} className={`w-10 font-medium ${aux.k === j ? 'text-amber-600 dark:text-amber-400' : 'text-muted'}`}>{id}</th>)}</tr>
        </thead>
        <tbody>
          {aux.m.map((row, i) => (
            <tr key={i}>
              <th className={`pr-1 font-medium ${aux.k === i ? 'text-amber-600 dark:text-amber-400' : 'text-muted'}`}>{aux.ids[i]}</th>
              {row.map((v, j) => {
                const cur = aux.i === i && aux.j === j
                const viaK = (aux.i === i && aux.k === j) || (aux.k === i && aux.j === j)
                return (
                  <td key={j} className={`w-10 h-8 text-center rounded-md transition-colors ${cur ? (aux.better ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white') : viaK ? 'bg-amber-300 text-ink' : 'bg-subtle text-ink'}`}>
                    {v === Infinity ? '∞' : v}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  if (aux.kind === 'edgeList') {
    const cls = { cur: 'bg-amber-400 text-ink border-amber-500', ok: 'bg-accent/15 text-ink border-accent/40', no: 'bg-subtle text-faint border-line line-through' }
    return (
      <div className="text-xs">
        <p className="text-muted mb-2">{aux.title}</p>
        <div className="flex flex-wrap gap-1.5 font-mono">
          {aux.items.map(it => <span key={it.key} className={`h-7 px-2.5 inline-flex items-center rounded-md border whitespace-pre ${cls[it.status] ?? 'bg-surface text-ink border-line'}`}>{it.text}</span>)}
        </div>
      </div>
    )
  }
  if (aux.kind === 'lists') {
    return (
      <div className="flex flex-wrap gap-x-10 gap-y-3 text-xs">
        {aux.lists.map(([title, items]) => (
          <div key={title}>
            <p className="text-muted mb-2">{title}</p>
            <div className="flex gap-1.5 font-mono min-h-[28px]">
              {items.length ? items.map(x => <span key={x} className="w-7 h-7 rounded-md bg-subtle flex items-center justify-center text-ink">{x}</span>) : <span className="text-faint italic">vazia</span>}
            </div>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const legends = {
  default: [['bg-amber-400', 'Em análise'], ['bg-ink', 'Concluído'], ['bg-accent', 'Árvore / caminho'], ['bg-emerald-500', 'Melhorou'], ['bg-rose-500', 'Descartado']],
  flow: [['bg-amber-400', 'Caminho aumentante'], ['bg-emerald-500', 'Fluxo enviado'], ['bg-rose-500', 'Aresta reversa / corte mínimo']],
  savings: [['bg-accent', 'Rotas'], ['bg-amber-400', 'Par avaliado']],
}

export default function GraphVisualizer({ algorithm }) {
  const config = graphAlgorithms[algorithm.id]
  const frames = useMemo(() => config.run(), [config])
  const player = usePlayer(frames.length, { speedScale: 1.6 })
  const frame = frames[player.step]
  const isSavings = config.graph === 'savings'

  const graph = isSavings
    ? { directed: false, nodes: [savingsData.depot, ...savingsData.customers], edges: [] }
    : graphs[config.graph]
  const pos = Object.fromEntries(graph.nodes.map(n => [n.id, n]))
  const keys = new Set(graph.edges.map(e => e.key))

  const edges = isSavings
    ? (frame.edges ?? []).map(([u, v], i) => ({ u, v, key: `r${i}`, tone: 'path' }))
    : graph.edges.map(e => ({ ...e, tone: frame.edge[e.key] ?? 'idle' }))

  return (
    <figure className="card overflow-hidden">
      <div className="px-2 sm:px-4 pt-4 pb-2 border-b border-line">
        <svg viewBox="0 0 640 345" className="w-full" role="img" aria-label={`Grafo de exemplo do ${algorithm.name}`}>
          <defs>
            {Object.entries(edgeTone).map(([t, s]) => (
              <marker key={t} id={`arrow-${t}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={s.stroke} />
              </marker>
            ))}
          </defs>
          {edges.map(e => {
            const a = pos[e.u], b = pos[e.v]
            const curved = graph.directed && keys.has(`${e.v}-${e.u}`)
            const { d, lx, ly } = edgeGeometry(a, b, curved, graph.directed)
            const s = edgeTone[e.tone]
            const label = frame.label[e.key] ?? e.w
            return (
              <g key={e.key}>
                <path d={d} fill="none" stroke={s.stroke} strokeWidth={s.width} strokeDasharray={s.dash} markerEnd={graph.directed ? `url(#arrow-${e.tone})` : undefined} style={{ transition: 'stroke .25s, stroke-width .25s' }} />
                {label !== undefined && (
                  <text x={lx} y={ly} dy="0.35em" textAnchor="middle" fontSize="12" fontFamily="Geist Mono, monospace" fill={e.tone === 'idle' || e.tone === 'muted' ? 'rgb(var(--muted))' : 'rgb(var(--ink))'} paintOrder="stroke" stroke="rgb(var(--surface))" strokeWidth="4">{label}</text>
                )}
              </g>
            )
          })}
          {graph.nodes.map(n => {
            const toneKey = isSavings
              ? (frame.highlight?.includes(n.id) ? 'active' : n.id === '0' ? 'done' : 'idle')
              : frame.node[n.id] ?? 'idle'
            const t = nodeTone[toneKey]
            const sub = frame.sub[n.id]
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={R} fill={t.fill} stroke={t.stroke} strokeWidth="1.6" style={{ transition: 'fill .25s, stroke .25s' }} />
                <text x={n.x} y={n.y} dy="0.35em" textAnchor="middle" fontSize="13" fontWeight="600" fontFamily="Geist, sans-serif" fill={t.text}>{n.id}</text>
                {sub !== undefined && (
                  <text x={n.x} y={n.y - R - 8} textAnchor="middle" fontSize="11.5" fontFamily="Geist Mono, monospace" fill="rgb(var(--accent))" paintOrder="stroke" stroke="rgb(var(--surface))" strokeWidth="4">{sub}</text>
                )}
                {(n.caption || n.demand) && (
                  <text x={n.x} y={n.y + R + 14} textAnchor="middle" fontSize="11" fontFamily="Geist, sans-serif" fill="rgb(var(--muted))">{n.caption ?? `carga ${n.demand}`}</text>
                )}
              </g>
            )
          })}
        </svg>
        {frame.aux && <div className="px-2 sm:px-2 pt-3 pb-3 border-t border-line overflow-x-auto"><Aux aux={frame.aux} /></div>}
      </div>

      <StepNote>{frame.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={legends[config.graph === 'flow' ? 'flow' : isSavings ? 'savings' : 'default']} status={`passo ${player.step}/${player.last}`} />
    </figure>
  )
}
