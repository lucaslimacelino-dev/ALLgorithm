import { useMemo, useState } from 'react'
import { descentFrames } from '../../lib/languageFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import TextForm from './TextForm'

const EXAMPLE = '2 * (3 + 4) - 5'
const SLOT = 46, LEVEL = 56

function layout(tree) {
  const nodes = [], edges = []
  let slot = 0, depth = 0
  const place = (n, d) => {
    depth = Math.max(depth, d)
    let x
    if (n.kids) {
      const xs = n.kids.map(k => place(k, d + 1))
      x = xs.reduce((a, b) => a + b, 0) / xs.length
      xs.forEach((cx, i) => edges.push([x, d, cx, d + 1, `${n.id}-${i}`]))
    } else x = slot++
    nodes.push([n, x, d])
    return x
  }
  place(tree, 0)
  return { nodes, edges, width: Math.max(slot, 3) * SLOT + 20, height: depth * LEVEL + 74 }
}

// Descida recursiva: tokens, pilha de chamadas e a árvore sintática resultante.
export default function ParseTreeVisualizer() {
  const { t } = useI18n()
  const [text, setText] = useState(EXAMPLE)
  const frames = useMemo(() => descentFrames(text), [text])
  const player = usePlayer(frames.length, { speedScale: 1.2 })
  const f = frames[player.step]
  const tree = f.tree && layout(f.tree)
  const X = x => 10 + x * SLOT + SLOT / 2, Y = d => 40 + d * LEVEL

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <TextForm value={text} example={EXAMPLE} max={40} valid={v => descentFrames(v).length > 0} onApply={v => { player.reset(); setText(v) }} />
        <div className="flex flex-wrap gap-1.5 justify-center">
          {f.tokens.map((tok, i) => (
            <span key={i} className={`min-w-[2rem] h-9 px-2 grid place-items-center rounded-md font-mono text-sm border ${i < f.pos ? 'bg-accent/15 border-accent/30 text-ink' : i === f.pos ? 'border-amber-400 bg-amber-400/20 text-ink font-semibold' : 'border-line text-muted'}`}>{tok}</span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-6 justify-center items-start">
          <div className="min-w-[140px]">
            <p className="text-xs text-muted mb-2">{t('viz.callStack')}</p>
            <div className="flex flex-col-reverse gap-1">
              {f.stack.map((s, i) => <span key={i} className={`px-3 py-1.5 rounded-md font-mono text-sm ${i === f.stack.length - 1 ? 'bg-amber-400 text-ink' : 'bg-subtle text-ink/80'}`}>{s}()</span>)}
              {!f.stack.length && <span className="text-sm text-faint">—</span>}
            </div>
          </div>
          {tree && (
            <svg viewBox={`0 0 ${tree.width} ${tree.height}`} className="w-full max-w-[440px]">
              {tree.edges.map(([x1, d1, x2, d2, k]) => <line key={k} x1={X(x1)} y1={Y(d1)} x2={X(x2)} y2={Y(d2)} stroke="rgb(var(--faint))" strokeWidth="1.5" />)}
              {tree.nodes.map(([n, x, d]) => (
                <g key={n.id}>
                  <circle cx={X(x)} cy={Y(d)} r="16" fill={n.kids ? 'rgb(var(--accent))' : 'rgb(var(--surface))'} stroke="rgb(var(--accent))" strokeWidth="1.5" />
                  <text x={X(x)} y={Y(d) + 5} textAnchor="middle" fontSize="13" fontWeight="600" fontFamily="Geist Mono, monospace" fill={n.kids ? 'white' : 'rgb(var(--ink))'}>{n.label}</text>
                  {n.kids && <text x={X(x)} y={Y(d) - 21} textAnchor="middle" fontSize="10" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">{+n.value.toFixed(4)}</text>}
                </g>
              ))}
            </svg>
          )}
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={[['bg-accent/30', t('viz.consumed')], ['bg-amber-400', t('viz.currentToken')], ['bg-accent', t('viz.operatorNode')]]} status={t('player.step', { s: player.step, t: player.last })} />
    </figure>
  )
}
