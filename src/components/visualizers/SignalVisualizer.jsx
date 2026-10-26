import { useMemo, useState } from 'react'
import { OSEM_SIZE, cordicFrames, dftFrames, fftFrames, movingAverageFrames, osemFrames, rainflowFrames } from '../../lib/signalFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const W = 640, H = 200
const line = (vals, lo, hi, w = W, h = H, pad = 10) =>
  vals.map((v, i) => (v === null ? null : `${pad + (i / (vals.length - 1)) * (w - 2 * pad)},${h - pad - ((v - lo) / (hi - lo || 1)) * (h - 2 * pad)}`)).filter(Boolean).join(' ')
const cfmt = ([re, im]) => {
  const a = Number(re.toFixed(2)), b = Number(im.toFixed(2))
  return b === 0 ? `${a}` : `${a}${b < 0 ? '−' : '+'}${Math.abs(b)}i`
}

const CONFIG = {
  'moving-average': { fields: [['janela', '9', 2]], build: v => movingAverageFrames(Number(v.janela), 1) },
  'dft': { fields: [['componentes', '3:1 7:0.5', 30]], build: v => dftFrames(v.componentes) },
  'fft': { fields: [['amostras', '1 1 1 1 0 0 0 0', 60]], build: v => fftFrames(v.amostras) },
  'cordic': { fields: [['ângulo', '30', 6]], build: v => cordicFrames(Number(v['ângulo'].replace(',', '.'))) },
  'rainflow': { fields: [['tensões', '-2 1 -3 5 -1 3 -4 4 -2', 120]], build: v => rainflowFrames(v['tensões']) },
  'osem': { fields: [['iterações', '8', 2]], build: v => osemFrames(Number(v['iterações'])) },
}

function MovingAverage({ f }) {
  const lo = -1.6, hi = 1.6, n = f.signal.length
  const x = i => 10 + (i / (n - 1)) * (W - 20)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {f.i >= 0 && <rect x={x(Math.max(0, f.i - f.w + 1))} y={4} width={Math.max(2, x(f.i) - x(Math.max(0, f.i - f.w + 1)))} height={H - 8} fill="#f59e0b" opacity="0.15" />}
      <polyline points={line(f.signal, lo, hi)} fill="none" stroke="rgb(var(--faint))" strokeWidth="1.5" />
      <polyline points={line(f.out, lo, hi)} fill="none" stroke="rgb(var(--accent))" strokeWidth="2.5" />
    </svg>
  )
}

function Dft({ f }) {
  const N = f.x.length
  const wave = f.k >= 0 ? f.x.map((_, n) => Math.cos((2 * Math.PI * f.k * n) / N)) : null
  const lo = -2.5, hi = 2.5
  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${W} 140`} className="w-full">
        {wave && <polyline points={line(wave, lo, hi, W, 140)} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />}
        <polyline points={line(f.x, lo, hi, W, 140)} fill="none" stroke="rgb(var(--ink))" strokeWidth="2" />
        {f.x.map((v, i) => <circle key={i} cx={10 + (i / (N - 1)) * (W - 20)} cy={130 - ((v - lo) / (hi - lo)) * 120} r="2.5" fill="rgb(var(--ink))" />)}
      </svg>
      <svg viewBox={`0 0 ${W} 110`} className="w-full">
        {f.mags.map((m, k) => {
          const bw = (W - 20) / f.mags.length
          const h = m === null ? 0 : Math.min(1.5, m) / 1.5 * 90
          return (
            <g key={k}>
              <rect x={10 + k * bw + 2} y={95 - h} width={bw - 4} height={h} rx="2" fill={k === f.k ? '#f59e0b' : 'rgb(var(--accent))'} opacity={m === null ? 0.15 : 1} />
              <text x={10 + k * bw + bw / 2} y={107} textAnchor="middle" fontSize="9" fill="rgb(var(--muted))" fontFamily="Geist Mono, monospace">{k}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function Fft({ f, t }) {
  return (
    <div className="overflow-x-auto">
      <table className="mx-auto font-mono text-[12px] border-separate border-spacing-x-3 border-spacing-y-1">
        <thead>
          <tr>{f.cols.map((_, c) => <th key={c} className="text-[11px] text-muted font-medium">{c === 0 ? 'x[n]' : c === 1 ? 'bit-rev' : `${t('viz.stage')} ${c - 1}`}</th>)}</tr>
        </thead>
        <tbody>
          {f.cols[0].map((_, r) => (
            <tr key={r}>
              {f.cols.map((col, c) => {
                const active = f.pair && c === f.cols.length - 1 && f.pair.includes(r)
                return <td key={c} className={`px-2 py-1 rounded text-center whitespace-nowrap ${active ? 'bg-amber-400 text-ink font-semibold' : f.done && c === f.cols.length - 1 ? 'bg-accent/15 text-ink' : 'bg-subtle text-ink/80'}`}>{cfmt(col[r])}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Cordic({ f }) {
  const S = 130, cx = 160, cy = 160
  const P = (x, y) => [cx + x * S, cy - y * S]
  const [tx, ty] = P(Math.cos(f.target), Math.sin(f.target))
  const [vx, vy] = P(f.x, f.y)
  return (
    <svg viewBox="0 0 320 320" className="mx-auto w-full max-w-[320px]">
      <circle cx={cx} cy={cy} r={S} fill="none" stroke="rgb(var(--line))" />
      <line x1={cx - S - 10} x2={cx + S + 10} y1={cy} y2={cy} stroke="rgb(var(--faint))" />
      <line y1={cy - S - 10} y2={cy + S + 10} x1={cx} x2={cx} stroke="rgb(var(--faint))" />
      <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="#10b981" strokeWidth="2" strokeDasharray="5 4" />
      <line x1={cx} y1={cy} x2={vx} y2={vy} stroke="#f59e0b" strokeWidth="3" />
      <circle cx={vx} cy={vy} r="5" fill="#f59e0b" />
      <text x={12} y={20} fontSize="12" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">x = {f.x.toFixed(5)}</text>
      <text x={12} y={36} fontSize="12" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">y = {f.y.toFixed(5)}</text>
    </svg>
  )
}

function Rainflow({ f, t }) {
  const s = f.series, lo = Math.min(...s), hi = Math.max(...s)
  const X = i => 20 + (i / (s.length - 1)) * (W - 40), Y = v => H - 28 - ((v - lo) / (hi - lo || 1)) * (H - 56)
  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <polyline points={s.map((v, i) => `${X(i)},${Y(v)}`).join(' ')} fill="none" stroke="rgb(var(--ink))" strokeWidth="2" />
        {f.highlight && <line x1={X(f.highlight[0])} y1={Y(s[f.highlight[0]])} x2={X(f.highlight[1])} y2={Y(s[f.highlight[1]])} stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" opacity="0.8" />}
        {s.map((v, i) => (
          <g key={i}>
            <circle cx={X(i)} cy={Y(v)} r="5" fill={f.stack.includes(i) ? '#f59e0b' : 'rgb(var(--surface))'} stroke="rgb(var(--ink))" strokeWidth="1.5" />
            <text x={X(i)} y={Y(v) + (v >= (lo + hi) / 2 ? -9 : 17)} textAnchor="middle" fontSize="11" fontFamily="Geist Mono, monospace" fill="rgb(var(--muted))">{v}</text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-1.5 text-xs font-mono">
        <span className="text-muted font-sans">{t('viz.cyclesFound')}:</span>
        {f.cycles.map(([r, m, c], i) => <span key={i} className={`px-2 py-0.5 rounded-full border ${c === 1 ? 'border-rose-400 text-ink' : 'border-line text-muted'}`}>{c === 1 ? '1×' : '½×'} {r}</span>)}
      </div>
    </div>
  )
}

function Heat({ img, max }) {
  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${OSEM_SIZE}, 1fr)` }}>
      {img.map((v, i) => <span key={i} className="aspect-square rounded-[2px]" style={{ background: `rgb(var(--accent) / ${Math.min(1, Math.max(0, v / max))})` }} />)}
    </div>
  )
}

function Osem({ f, t }) {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      <div className="w-40 text-center"><Heat img={f.truth} max={1.6} /><p className="mt-2 text-xs text-muted">{t('viz.trueObject')}</p></div>
      <div className="w-40 text-center"><Heat img={f.img} max={1.6} /><p className="mt-2 text-xs text-muted">{t('viz.reconstruction')} · {t('viz.error')} {f.err.toFixed(3)}</p></div>
    </div>
  )
}

// Processamento de sinais: um visualizador por algoritmo, com os mesmos controles.
export default function SignalVisualizer({ algorithm }) {
  const { t } = useI18n()
  const cfg = CONFIG[algorithm.id]
  const example = Object.fromEntries(cfg.fields.map(([k, v]) => [k, v]))
  const [input, setInput] = useState(example)
  const frames = useMemo(() => cfg.build(input), [cfg, input])
  const player = usePlayer(frames.length, { speedScale: algorithm.id === 'moving-average' ? 0.3 : 1 })
  const f = frames[player.step]
  const body = { 'moving-average': <MovingAverage f={f} />, dft: <Dft f={f} />, fft: <Fft f={f} t={t} />, cordic: <Cordic f={f} />, rainflow: <Rainflow f={f} t={t} />, osem: <Osem f={f} t={t} /> }[algorithm.id]
  const legends = {
    'moving-average': [['bg-faint', t('viz.rawSignal')], ['bg-accent', t('viz.filtered')], ['bg-amber-400/40', t('viz.window')]],
    dft: [['bg-ink', t('viz.signal')], ['bg-amber-400', t('viz.testWave')], ['bg-accent', t('viz.spectrum')]],
    fft: [['bg-amber-400', t('viz.butterfly')], ['bg-accent/30', t('viz.result')]],
    cordic: [['bg-amber-400', t('viz.rotatingVector')], ['bg-emerald-500', t('viz.targetAngle')]],
    rainflow: [['bg-amber-400', t('viz.stack')], ['bg-rose-500', t('viz.cycleCounted')]],
    osem: [['bg-accent', t('viz.intensity')]],
  }[algorithm.id]

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={cfg.fields.map(([name, , max]) => ({ name, label: name, max, width: max > 10 ? 'flex-1 min-w-[180px]' : 'w-28' }))}
          values={input}
          example={example}
          valid={v => cfg.build(v).length > 0}
          onApply={v => { player.reset(); setInput(v) }}
        />
        {body}
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend items={legends} status={t('player.step', { s: player.step, t: player.last })} />
    </figure>
  )
}
