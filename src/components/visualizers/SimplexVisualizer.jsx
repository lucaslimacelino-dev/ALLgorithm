import { useMemo, useState } from 'react'
import { VAR_NAME, simplexFrames } from '../../lib/optimizationFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const EXAMPLE = { objetivo: '3x + 5y', restricoes: 'x <= 4; 2y <= 12; 3x + 2y <= 18' }
const W = 340, PAD = 30

// Recorta o quadrado [0, M]² por cada restrição ax + by ≤ r (Sutherland-Hodgman): a região viável.
function feasible(rows, M) {
  let poly = [[0, 0], [M, 0], [M, M], [0, M]]
  for (const [a, b, r] of rows) {
    const inside = ([x, y]) => a * x + b * y <= r + 1e-9
    const out = []
    poly.forEach((p, i) => {
      const q = poly[(i + 1) % poly.length]
      if (inside(p)) out.push(p)
      if (inside(p) !== inside(q)) {
        const t = (r - a * p[0] - b * p[1]) / (a * (q[0] - p[0]) + b * (q[1] - p[1]))
        out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])])
      }
    })
    poly = out
  }
  return poly
}

// Simplex com duas variáveis: a região viável, os vértices visitados e o quadro (tableau).
export default function SimplexVisualizer() {
  const { t } = useI18n()
  const [input, setInput] = useState(EXAMPLE)
  const frames = useMemo(() => simplexFrames(input.objetivo, input.restricoes), [input])
  const player = usePlayer(frames.length, { speedScale: 2 })
  const f = frames[player.step]
  const { rows, c } = f
  const M = Math.max(4, ...rows.flatMap(([a, b, r]) => [a ? r / a : 0, b ? r / b : 0]).filter(v => v < 1e6)) * 1.1
  const poly = feasible(rows, M)
  const X = x => PAD + (x / M) * (W - 2 * PAD), Y = y => W - PAD - (y / M) * (W - 2 * PAD)
  const z = c[0] * f.vertex[0] + c[1] * f.vertex[1]
  // reta do objetivo passando pelo vértice atual: c0·x + c1·y = z
  const iso = c[1] ? [[0, z / c[1]], [M, (z - c[0] * M) / c[1]]] : [[z / c[0], 0], [z / c[0], M]]
  const m = rows.length

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={[{ name: 'objetivo', label: t('viz.maximize'), max: 30, width: 'w-40' }, { name: 'restricoes', label: t('viz.constraints'), max: 120 }]}
          values={input}
          example={EXAMPLE}
          valid={v => simplexFrames(v.objetivo, v.restricoes).length > 0}
          onApply={v => { player.reset(); setInput(v) }}
        />
        <div className="flex flex-wrap gap-6 items-start justify-center">
          <svg viewBox={`0 0 ${W} ${W}`} className="w-full max-w-[340px]">
            <line x1={PAD} y1={W - PAD} x2={W - PAD / 2} y2={W - PAD} stroke="rgb(var(--faint))" />
            <line x1={PAD} y1={W - PAD} x2={PAD} y2={PAD / 2} stroke="rgb(var(--faint))" />
            <text x={W - PAD / 2} y={W - PAD + 16} fontSize="12" fill="rgb(var(--muted))" fontFamily="Geist Mono, monospace">x</text>
            <text x={PAD - 16} y={PAD / 2 + 4} fontSize="12" fill="rgb(var(--muted))" fontFamily="Geist Mono, monospace">y</text>
            <polygon points={poly.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')} fill="rgb(var(--accent) / 0.12)" stroke="rgb(var(--accent) / 0.6)" strokeWidth="1.5" />
            <line x1={X(iso[0][0])} y1={Y(iso[0][1])} x2={X(iso[1][0])} y2={Y(iso[1][1])} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 4" />
            <polyline points={f.path.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')} fill="none" stroke="rgb(var(--ink))" strokeWidth="2" />
            {poly.map(([x, y], i) => <circle key={i} cx={X(x)} cy={Y(y)} r="3" fill="rgb(var(--accent) / 0.6)" />)}
            <circle cx={X(f.vertex[0])} cy={Y(f.vertex[1])} r="7" fill={f.done ? '#10b981' : '#f59e0b'} stroke="rgb(var(--surface))" strokeWidth="2" />
          </svg>
          <div className="overflow-x-auto">
            <table className="font-mono text-xs border-separate border-spacing-[2px]">
              <thead>
                <tr><th className="px-2 text-muted font-normal">{t('viz.basis')}</th>{Array.from({ length: 2 + m }, (_, j) => <th key={j} className={`px-2 font-medium ${j === f.enter ? 'text-amber-600' : 'text-muted'}`}>{VAR_NAME(j)}</th>)}<th className="px-2 text-muted font-medium">b</th></tr>
              </thead>
              <tbody>
                {f.tableau.map((row, i) => (
                  <tr key={i} className={i === f.leave ? 'bg-rose-500/10' : ''}>
                    <td className="px-2 text-muted">{i < m ? VAR_NAME(f.basis[i]) : 'z'}</td>
                    {row.map((v, j) => <td key={j} className={`px-2 py-1 text-right rounded ${j === f.enter && i === f.leave ? 'bg-amber-400 text-ink font-semibold' : j === f.enter ? 'bg-amber-400/15' : 'bg-subtle/60'} ${i === m ? 'font-semibold' : ''}`}>{Number(v.toFixed(2))}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-muted">z = <span className="font-mono text-ink">{Number(z.toFixed(3))}</span> · ({Number(f.vertex[0].toFixed(3))}, {Number(f.vertex[1].toFixed(3))})</p>
          </div>
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={[['bg-accent/30', t('viz.feasibleRegion')], ['bg-amber-400', t('viz.pivotCell')], ['bg-emerald-500', t('viz.optimum')]]} status={t('player.step', { s: player.step, t: player.last })} />
    </figure>
  )
}
