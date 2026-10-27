import { useMemo, useState } from 'react'
import { DJ_ORACLES, djFrames, groverFrames, shorFrames } from '../../lib/quantumFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const W = 640, H = 220, PAD = 14
const bin = (x, n) => x.toString(2).padStart(n, '0')

// Barras de amplitude com sinal: acima da linha do zero (positivas) ou abaixo (negativas).
function AmplitudeBars({ amps, n, highlight, mean }) {
  const N = amps.length, bw = (W - 2 * PAD) / N, mid = H / 2, scale = (H / 2 - 22) / Math.max(1e-9, ...amps.map(Math.abs), mean ? Math.abs(mean) : 0)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={PAD} x2={W - PAD} y1={mid} y2={mid} stroke="rgb(var(--line))" />
      {amps.map((a, x) => {
        const h = Math.abs(a) * scale
        return (
          <g key={x}>
            <rect x={PAD + x * bw + bw * 0.12} width={bw * 0.76} y={a >= 0 ? mid - h : mid} height={Math.max(h, 0.5)} rx="2"
              fill={x === highlight ? '#f59e0b' : a < 0 ? '#f43f5e' : 'rgb(var(--accent))'} style={{ transition: 'all .3s' }} />
            {N <= 16 && <text x={PAD + (x + 0.5) * bw} y={H - 4} textAnchor="middle" fontSize="10" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">{bin(x, n)}</text>}
          </g>
        )
      })}
      {mean !== undefined && <line x1={PAD} x2={W - PAD} y1={mid - mean * scale} y2={mid - mean * scale} stroke="rgb(var(--ink))" strokeDasharray="5 4" strokeWidth="1.2" />}
    </svg>
  )
}

function DeutschJozsa() {
  const { t, locale } = useI18n()
  const [oracle, setOracle] = useState('bit0')
  const frames = useMemo(() => djFrames(oracle, 3), [oracle])
  const player = usePlayer(frames.length, { speedScale: 0.6 })
  const f = frames[player.step]
  return (
    <>
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="self-center text-xs text-muted font-mono mr-1">{t('viz.oracle')}:</span>
          {Object.entries(DJ_ORACLES).map(([id, o]) => (
            <button key={id} type="button" onClick={() => { player.reset(); setOracle(id) }}
              className={`px-3 h-8 rounded-full text-[13px] font-mono border ${id === oracle ? 'bg-accent text-white border-accent' : 'border-line text-muted hover:text-ink'}`}>
              {locale === 'en' ? o.en : o.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 justify-center mb-3 font-mono text-xs">
          {f.values.map((v, x) => (
            <span key={x} className={`px-2 py-1 rounded-md border ${v ? 'border-rose-400/50 bg-rose-500/10 text-ink' : 'border-line text-muted'}`}>f({bin(x, 3)}) = {v}</span>
          ))}
        </div>
        <AmplitudeBars amps={f.amps} n={f.n} highlight={f.step >= 3 ? 0 : -1} />
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={[['bg-accent', t('viz.amplitude')], ['bg-rose-500', t('viz.negativeAmplitude')], ['bg-amber-400', '|000⟩']]} status={t('player.step', { s: player.step, t: player.last })} />
    </>
  )
}

const GROVER_EXAMPLE = { n: '4', marked: '11' }

function Grover() {
  const { t } = useI18n()
  const [input, setInput] = useState(GROVER_EXAMPLE)
  const frames = useMemo(() => groverFrames(Number(input.n), Number(input.marked)), [input])
  const player = usePlayer(frames.length, { speedScale: 0.6 })
  const f = frames[player.step]
  return (
    <>
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={[{ name: 'n', label: 'qubits (2 – 7)', max: 1, width: 'w-32' }, { name: 'marked', label: t('viz.markedItem'), max: 3, width: 'w-36' }]}
          values={input}
          example={GROVER_EXAMPLE}
          valid={v => /^\d+$/.test(v.n) && /^\d+$/.test(v.marked) && groverFrames(Number(v.n), Number(v.marked)).length > 0}
          onApply={v => { player.reset(); setInput(v) }}
        />
        <AmplitudeBars amps={f.amps} n={f.n} highlight={f.marked} mean={f.mean} />
        <p className="mt-2 text-sm text-muted text-center">
          P(|{bin(f.marked, f.n)}⟩) = <span className="font-mono text-ink">{(f.amps[f.marked] ** 2 * 100).toFixed(1)}%</span>
        </p>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={[['bg-accent', t('viz.amplitude')], ['bg-amber-400', t('viz.markedItem')], ['bg-rose-500', t('viz.negativeAmplitude')], ['bg-ink', t('viz.meanAmplitude')]]} status={t('player.step', { s: player.step, t: player.last })} />
    </>
  )
}

const SHOR_EXAMPLE = { N: '15', a: '7', seed: '1' }
const SHOWN = 64

function Shor() {
  const { t } = useI18n()
  const [input, setInput] = useState(SHOR_EXAMPLE)
  const frames = useMemo(() => shorFrames(Number(input.N), Number(input.a), Number(input.seed)), [input])
  const player = usePlayer(frames.length, { speedScale: 0.5 })
  const f = frames[player.step]
  const valuesShown = f.values && f.values.slice(0, Math.min(SHOWN, f.Q))
  const comb = f.comb && new Set(f.comb)

  let chart = null
  if (valuesShown) {
    const bw = (W - 2 * PAD) / valuesShown.length, top = Math.max(...valuesShown)
    chart = (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {valuesShown.map((v, x) => {
          const h = (v / top) * (H - 40)
          const on = !comb || comb.has(x)
          return <rect key={x} x={PAD + x * bw + bw * 0.12} width={bw * 0.76} y={H - 22 - h} height={h} rx="1.5" fill={comb && on ? '#f59e0b' : 'rgb(var(--accent))'} opacity={on ? 1 : 0.18} style={{ transition: 'all .3s' }} />
        })}
        <text x={PAD} y={H - 6} fontSize="10" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">x = 0</text>
        <text x={W - PAD} y={H - 6} textAnchor="end" fontSize="10" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">x = {valuesShown.length - 1}{f.Q > SHOWN ? ` (${t('viz.firstValues', { n: SHOWN, q: f.Q })})` : ''}</text>
      </svg>
    )
  } else if (f.probs) {
    const top = Math.max(...f.probs), X = k => PAD + ((k + 0.5) / f.Q) * (W - 2 * PAD), Y = p => H - 22 - (p / top) * (H - 40)
    const path = f.probs.map((p, k) => (p > top * 0.002 ? `M${X(k).toFixed(1)},${H - 22}V${Y(p).toFixed(1)}` : '')).join('')
    chart = (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={PAD} x2={W - PAD} y1={H - 22} y2={H - 22} stroke="rgb(var(--line))" />
        <path d={path} stroke="rgb(var(--accent))" strokeWidth={Math.max(1.2, (W - 2 * PAD) / f.Q * 0.8)} />
        {f.k !== undefined && <><line x1={X(f.k)} x2={X(f.k)} y1={H - 22} y2={Math.min(Y(f.probs[f.k]), H - 30)} stroke="#f59e0b" strokeWidth="3" /><circle cx={X(f.k)} cy={Math.min(Y(f.probs[f.k]), H - 30)} r="5" fill="#f59e0b" /></>}
        <text x={PAD} y={H - 6} fontSize="10" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">k = 0</text>
        <text x={W - PAD} y={H - 6} textAnchor="end" fontSize="10" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">k = {f.Q - 1}</text>
      </svg>
    )
  }

  return (
    <>
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={[{ name: 'N', label: 'N (15 – 63)', max: 2, width: 'w-32' }, { name: 'a', label: t('viz.randomA'), max: 2, width: 'w-36' }, { name: 'seed', label: 'seed', max: 4, width: 'w-28' }]}
          values={input}
          example={SHOR_EXAMPLE}
          valid={v => [v.N, v.a, v.seed].every(x => /^\d+$/.test(x)) && shorFrames(Number(v.N), Number(v.a), Number(v.seed)).length > 0}
          onApply={v => { player.reset(); setInput(v) }}
        />
        <div className="flex flex-wrap gap-2 justify-center mb-3 font-mono text-[13px]">
          <span className="px-3 py-1 rounded-full bg-subtle text-ink">N = {f.N}</span>
          <span className="px-3 py-1 rounded-full bg-subtle text-ink">a = {f.a}</span>
          <span className="px-3 py-1 rounded-full bg-subtle text-ink">Q = {f.Q}</span>
          {f.k !== undefined && <span className="px-3 py-1 rounded-full bg-amber-400/25 text-ink">k = {f.k}</span>}
          {f.factors && <span className="px-3 py-1 rounded-full bg-accent text-white font-semibold">{f.N} = {f.factors[0]} × {f.factors[1]}</span>}
        </div>
        {chart ?? <div className="h-[140px] grid place-items-center text-4xl font-mono text-ink/80">{f.factors ? `${f.factors[0]} × ${f.factors[1]}` : `|x⟩ ⊗ |${f.a}ˣ mod ${f.N}⟩`}</div>}
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={f.probs ? [['bg-accent', t('viz.probability')], ['bg-amber-400', t('viz.measuredValue')]] : [['bg-accent', `f(x) = ${f.a}ˣ mod ${f.N}`], ['bg-amber-400', t('viz.combTeeth')]]} status={t('player.step', { s: player.step, t: player.last })} />
    </>
  )
}

const modes = { 'deutsch-jozsa': DeutschJozsa, 'grover': Grover, 'shor': Shor }

// Simulador de vetor de estado: amplitudes de cada estado da base, passo a passo.
export default function QuantumVisualizer({ algorithm }) {
  const Mode = modes[algorithm.id]
  return <figure className="card overflow-hidden"><Mode /></figure>
}
