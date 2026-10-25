import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n'

export const speeds = [
  { label: '0,5×', ms: 900 },
  { label: '1×', ms: 450 },
  { label: '2×', ms: 180 },
  { label: '4×', ms: 50 },
]

// Controla a reprodução de uma sequência de quadros (passo atual, play/pause, velocidade).
// "speedScale" ajusta o ritmo para animações com muitos quadros (ex.: ordenação).
export function usePlayer(total, { speedScale = 1, initialSpeed = 1 } = {}) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(initialSpeed)
  const last = Math.max(0, total - 1)
  const finished = step >= last

  useEffect(() => {
    if (!playing) return
    if (finished) { setPlaying(false); return }
    const t = setTimeout(() => setStep(s => s + 1), speeds[speed].ms * speedScale)
    return () => clearTimeout(t)
  }, [playing, step, finished, speed, speedScale])

  return {
    step: Math.min(step, last),
    last,
    playing,
    finished,
    speed,
    setSpeed,
    toggle: () => {
      if (finished) setStep(0)
      setPlaying(p => !p)
    },
    prev: () => setStep(s => Math.max(0, s - 1)),
    next: () => setStep(s => Math.min(last, s + 1)),
    reset: () => { setPlaying(false); setStep(0) },
    jumpToEnd: () => { setPlaying(false); setStep(last) },
  }
}

const disabled = 'disabled:opacity-40 disabled:pointer-events-none'

export function PlayerControls({ player, children }) {
  const { t } = useI18n()
  return (
    <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center gap-2">
      <button onClick={player.toggle} className={`btn-primary !h-9 min-w-[112px] ${disabled}`}>
        {player.playing ? t('player.pause') : player.finished && player.last > 0 ? t('player.replay') : t('player.run')}
      </button>
      <button onClick={player.prev} disabled={player.playing || player.step === 0} className={`btn-ghost !h-9 ${disabled}`} aria-label={t('player.prev')}>←</button>
      <button onClick={player.next} disabled={player.playing || player.finished} className={`btn-ghost !h-9 ${disabled}`} aria-label={t('player.next')}>→</button>
      {children}

      <div className="ml-auto inline-flex p-1 rounded-full border border-line" role="group" aria-label={t('player.speed')}>
        {speeds.map((s, i) => (
          <button
            key={s.label}
            onClick={() => player.setSpeed(i)}
            className={`h-7 px-3 rounded-full text-xs font-mono ${player.speed === i ? 'bg-subtle text-ink font-medium' : 'text-muted hover:text-ink'}`}
          >
            {i === 0 ? t('player.half') : s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Legend({ items, status }) {
  return (
    <figcaption className="px-4 sm:px-6 pb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {items.map(([color, label]) => (
          <span key={label} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-sm ${color}`} /> {label}</span>
        ))}
      </div>
      {status && <span className="font-mono tabular-nums">{status}</span>}
    </figcaption>
  )
}

// Linha com a explicação do passo atual.
export function StepNote({ children }) {
  return (
    <div className="min-h-[52px] px-4 sm:px-6 py-3 border-t border-line bg-subtle/50 text-sm text-ink/85 flex items-center">
      <span>{children}</span>
    </div>
  )
}
