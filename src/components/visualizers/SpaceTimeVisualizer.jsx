import { useMemo, useState } from 'react'
import { PROCS, lamportFrames, snapshotFrames, vectorFrames } from '../../lib/distributedFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'

const LANE = 90, TOP = 40, LEFT = 50, STEP = 34
const BUILD = { 'lamport-clocks': lamportFrames, 'vector-clocks': vectorFrames, 'chandy-lamport': snapshotFrames }
const SEEDS = { 'lamport-clocks': 3, 'vector-clocks': 3, 'chandy-lamport': 1 }

// Diagrama espaço-tempo: uma linha por processo, eventos como pontos e mensagens como setas.
export default function SpaceTimeVisualizer({ algorithm }) {
  const { t } = useI18n()
  const [seed, setSeed] = useState(SEEDS[algorithm.id])
  const frames = useMemo(() => BUILD[algorithm.id](seed), [algorithm.id, seed])
  const player = usePlayer(frames.length, { speedScale: 1.4 })
  const f = frames[player.step]
  const all = frames.at(-1).events
  const shown = all.filter(e => e.id <= f.upto)
  const step = algorithm.id === 'vector-clocks' ? 62 : STEP // vetores precisam de mais espaço para os rótulos
  const W = LEFT + Math.max(all.length, 8) * step + 30, H = TOP + (PROCS - 1) * LANE + 50
  const X = e => LEFT + e.t * step + step / 2, Y = p => TOP + p * LANE
  const isSnapshot = algorithm.id === 'chandy-lamport'

  // mensagens: envio → recebimento (só as já recebidas no quadro atual)
  const sends = Object.fromEntries(shown.filter(e => e.type === 'send').map(e => [e.msg, e]))
  const recordAt = {}
  for (const e of shown) if ((e.type === 'record' || e.type === 'marker-recv') && recordAt[e.p] === undefined) recordAt[e.p] = e
  const color = e => (e.type === 'send' ? 'rgb(var(--accent))' : e.type === 'recv' ? '#10b981' : e.type === 'record' || e.type === 'marker-recv' ? '#f59e0b' : 'rgb(var(--muted))')

  return (
    <figure className="card overflow-hidden">
      <div className="px-2 sm:px-4 pt-4 pb-3 border-b border-line overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px]">
          {Array.from({ length: PROCS }, (_, p) => (
            <g key={p}>
              <text x={10} y={Y(p) + 4} fontSize="13" fontWeight="600" fontFamily="Geist Mono, monospace" fill="rgb(var(--ink))">P{p + 1}</text>
              <line x1={LEFT} x2={W - 10} y1={Y(p)} y2={Y(p)} stroke="rgb(var(--line))" strokeWidth="2" />
              {isSnapshot && <text x={W - 12} y={Y(p) - 8} textAnchor="end" fontSize="11" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">R$ {f.balances[p]}{f.recorded[p] !== null ? ` · 📷 ${f.recorded[p]}` : ''}</text>}
            </g>
          ))}
          {isSnapshot && Object.keys(recordAt).length === PROCS && (
            <polyline points={[0, 1, 2].map(p => `${X(recordAt[p])},${Y(p)}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 4" opacity="0.8" />
          )}
          {shown.filter(e => e.type === 'recv' && sends[e.msg]).map(e => (
            <line key={`m${e.msg}`} x1={X(sends[e.msg])} y1={Y(sends[e.msg].p)} x2={X(e)} y2={Y(e.p)} stroke="rgb(var(--accent) / 0.55)" strokeWidth="1.5" markerEnd="url(#seta)" />
          ))}
          {isSnapshot && shown.filter(e => e.type === 'marker-recv' && recordAt[e.from]).map(e => (
            <line key={`k${e.id}`} x1={X(recordAt[e.from])} y1={Y(e.from)} x2={X(e)} y2={Y(e.p)} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#setaM)" />
          ))}
          <defs>
            <marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="rgb(var(--accent))" /></marker>
            <marker id="setaM" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" /></marker>
          </defs>
          {shown.map(e => {
            const cur = e.id === f.cur, conc = f.concurrent?.includes(e.id)
            return (
              <g key={e.id}>
                {conc && <circle cx={X(e)} cy={Y(e.p)} r="13" fill="none" stroke="#f43f5e" strokeWidth="2" />}
                <circle cx={X(e)} cy={Y(e.p)} r={cur ? 8 : 6} fill={color(e)} stroke="rgb(var(--surface))" strokeWidth="2" />
                {f.labels?.[e.id] && <text x={X(e)} y={Y(e.p) + (e.p === PROCS - 1 ? 24 : -12)} textAnchor="middle" fontSize="10.5" fontFamily="Geist Mono, monospace" fill="rgb(var(--ink))">{f.labels[e.id]}</text>}
                {isSnapshot && e.amount && <text x={X(e)} y={Y(e.p) + 22} textAnchor="middle" fontSize="10" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">{e.type === 'send' ? '−' : '+'}{e.amount}</text>}
              </g>
            )
          })}
        </svg>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player}>
        <button onClick={() => { player.reset(); setSeed(s => s + 1) }} className="btn-ghost !h-9">{t('viz.newScenario')}</button>
      </PlayerControls>
      <Legend
        items={isSnapshot
          ? [['bg-accent', t('viz.sendEvent')], ['bg-emerald-500', t('viz.recvEvent')], ['bg-amber-400', t('viz.markerRecord')]]
          : [['bg-accent', t('viz.sendEvent')], ['bg-emerald-500', t('viz.recvEvent')], ['bg-muted', t('viz.localEvent')], ...(algorithm.id === 'vector-clocks' ? [['bg-rose-500', t('viz.concurrentEvents')]] : [])]}
        status={t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
