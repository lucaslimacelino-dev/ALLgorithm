import { useMemo, useState } from 'react'
import { geneticFrames } from '../../lib/optimizationFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const EXAMPLE = { alvo: 'ALGORITMO GENETICO', mutacao: '0.02' }

// Algoritmo genético: uma população de frases evolui até chegar à frase-alvo.
export default function GeneticVisualizer() {
  const { t } = useI18n()
  const [input, setInput] = useState(EXAMPLE)
  const [seed, setSeed] = useState(2)
  const frames = useMemo(() => geneticFrames(input.alvo, Number(input.mutacao), seed), [input, seed])
  const player = usePlayer(frames.length, { speedScale: 0.6 })
  const f = frames[player.step]
  const L = f.target.length
  const hist = f.history
  const W = 300, H = 60

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={[{ name: 'alvo', label: t('viz.targetPhrase'), max: 30 }, { name: 'mutacao', label: t('viz.mutationRate'), max: 5, width: 'w-40' }]}
          values={input}
          example={EXAMPLE}
          valid={v => geneticFrames(v.alvo, Number(v.mutacao.replace(',', '.')), 1).length > 0}
          onApply={v => { player.reset(); setInput({ ...v, mutacao: v.mutacao.replace(',', '.') }) }}
        />
        <div className="flex flex-wrap gap-6 items-start">
          <div className="flex-1 min-w-[260px] space-y-1">
            <p className="text-xs text-muted mb-2">{t('viz.generation')} {f.gen} · {t('viz.bestIndividuals')}</p>
            {f.pop.map(([s, fit], k) => (
              <div key={k} className="flex items-center gap-3">
                <span className={`font-mono text-sm tracking-wider ${k === 0 ? '' : 'opacity-70'}`}>
                  {[...s].map((ch, i) => <span key={i} className={ch === f.target[i] ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-faint'}>{ch === ' ' ? '·' : ch}</span>)}
                </span>
                <span className="h-2 rounded-full bg-accent/70" style={{ width: `${(fit / L) * 80}px` }} />
                <span className="text-xs text-muted font-mono">{fit}/{L}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-muted mb-2">{t('viz.bestFitness')}</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-[300px] max-w-full h-[60px] rounded bg-subtle/60">
              <polyline fill="none" stroke="rgb(var(--accent))" strokeWidth="2" points={hist.map((v, i) => `${(i / Math.max(1, hist.length - 1)) * W},${H - (v / L) * (H - 6) - 3}`).join(' ')} />
            </svg>
          </div>
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player}>
        <button onClick={() => { player.reset(); setSeed(s => s + 1) }} className="btn-ghost !h-9">{t('viz.newSeed')}</button>
      </PlayerControls>
      <Legend items={[['bg-emerald-500', t('viz.rightGene')], ['bg-accent/70', t('viz.fitness')]]} status={t('player.step', { s: player.step, t: player.last })} />
    </figure>
  )
}
