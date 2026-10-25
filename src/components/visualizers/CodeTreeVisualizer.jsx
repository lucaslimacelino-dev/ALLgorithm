import { useMemo, useState } from 'react'
import { huffmanFrames, shannonFanoFrames, visible } from '../../lib/compressionFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import TextForm from './TextForm'

const EXAMPLE = 'abracadabra'
const MAX = 40
const SLOT = 50, LEVEL = 62, PAD = 16, TOP = 26

// Posiciona as árvores lado a lado: folhas em colunas consecutivas, nós internos no meio dos filhos.
function layout(forest) {
  const nodes = [], edges = []
  let slot = 0, maxDepth = 0
  const place = (n, depth) => {
    maxDepth = Math.max(maxDepth, depth)
    let x
    if (n.kids) {
      const xs = n.kids.map(k => place(k, depth + 1))
      x = (xs[0] + xs[1]) / 2
      n.kids.forEach((k, i) => edges.push({ key: `${n.id}-${i}`, x1: x, d1: depth, x2: xs[i], d2: depth + 1, bit: i }))
    } else {
      x = slot++
    }
    nodes.push({ n, x, depth })
    return x
  }
  forest.forEach((tree, i) => { if (i) slot += 0.4; place(tree, 0) })
  return { nodes, edges, width: Math.max(slot, 4) * SLOT + PAD * 2, height: TOP * 2 + maxDepth * LEVEL + 22 }
}

const px = x => PAD + x * SLOT + SLOT / 2
const py = d => TOP + d * LEVEL
const short = s => (s.length > 6 ? s.slice(0, 5) + '…' : s)

// Huffman (de baixo para cima) e Shannon-Fano (de cima para baixo) com a tabela de códigos ao final.
export default function CodeTreeVisualizer({ algorithm }) {
  const { t } = useI18n()
  const [text, setText] = useState(EXAMPLE)
  const frames = useMemo(() => (algorithm.id === 'shannon-fano' ? shannonFanoFrames : huffmanFrames)(text), [algorithm.id, text])
  const player = usePlayer(frames.length, { speedScale: 1.6 })
  const frame = frames[player.step]
  const { nodes, edges, width, height } = useMemo(() => layout(frame.forest), [frame])
  const codeOf = new Map(frame.codes?.map(([s, , c]) => [s, c]))

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-line">
        <TextForm value={text} example={EXAMPLE} max={MAX} onApply={v => { player.reset(); setText(v) }} />
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full" style={{ maxWidth: width * 1.25, minWidth: Math.min(width, 560) }} role="img" aria-label={algorithm.name}>
            {edges.map(e => (
              <g key={e.key}>
                <line x1={px(e.x1)} y1={py(e.d1)} x2={px(e.x2)} y2={py(e.d2)} stroke="rgb(var(--faint))" strokeWidth="1.5" />
                <text x={(px(e.x1) + px(e.x2)) / 2 + (e.bit ? 7 : -7)} y={(py(e.d1) + py(e.d2)) / 2} textAnchor="middle" fontSize="11" fontFamily="Geist Mono, monospace" fill="rgb(var(--accent))">{e.bit}</text>
              </g>
            ))}
            {nodes.map(({ n, x, depth }) => {
              const hl = frame.hl.includes(n.id)
              const leaf = !n.kids
              const label = n.label !== undefined ? short(visible(n.label)) : null
              const w = label ? Math.max(34, label.length * 8 + 14) : 30
              const fill = hl ? '#fbbf24' : leaf ? 'rgb(var(--surface))' : 'rgb(var(--subtle))'
              return (
                <g key={n.id}>
                  <rect x={px(x) - w / 2} y={py(depth) - 17} width={w} height={34} rx={leaf ? 8 : 17} fill={fill} stroke={hl ? '#d97706' : 'rgb(var(--line))'} strokeWidth="1.5" className="transition-colors duration-300" />
                  {label && <text x={px(x)} y={py(depth) - 2} textAnchor="middle" fontSize="13" fontWeight="600" fontFamily="Geist Mono, monospace" fill="rgb(var(--ink))">{label}</text>}
                  <text x={px(x)} y={py(depth) + (label ? 12 : 4)} textAnchor="middle" fontSize={label ? 10 : 12} fontFamily="Geist Mono, monospace" fill={label ? 'rgb(var(--muted))' : 'rgb(var(--ink))'}>{n.w}</text>
                  {leaf && codeOf.has(n.label) && (
                    <text x={px(x)} y={py(depth) + 31} textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="Geist Mono, monospace" fill="rgb(var(--accent))">{codeOf.get(n.label)}</text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
        {frame.codes && (
          <div className="mt-4 max-h-[220px] overflow-auto rounded-xl border border-line">
            <table className="w-full text-[13px] font-mono">
              <thead className="sticky top-0 bg-subtle text-muted text-xs">
                <tr><th className="px-3 py-2 text-left font-medium">{t('viz.symbol')}</th><th className="px-3 py-2 text-left font-medium">{t('viz.frequency')}</th><th className="px-3 py-2 text-left font-medium">{t('viz.code')}</th></tr>
              </thead>
              <tbody>
                {frame.codes.map(([s, f, c]) => (
                  <tr key={s} className="border-t border-line"><td className="px-3 py-1.5">{visible(s)}</td><td className="px-3 py-1.5">{f}</td><td className="px-3 py-1.5 text-accent font-medium">{c}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <StepNote>{frame.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-amber-400', t('viz.selected')], ['bg-subtle border border-line', t('viz.internalNode')], ['bg-accent', t('viz.code')]]}
        status={frame.codes ? t('viz.bitsVs', { b: frame.bits, t: frame.total }) : t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
