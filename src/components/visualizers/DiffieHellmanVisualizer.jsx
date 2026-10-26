import { useMemo, useState } from 'react'
import { dhFrames } from '../../lib/publicKeyFrames'
import { useI18n } from '../../i18n'
import { Legend, PlayerControls, StepNote, usePlayer } from './Player'
import FieldsForm from './FieldsForm'

const EXAMPLE = { p: '23', g: '5', a: '6', b: '15' }
// Cada número ganha uma cor: o segredo compartilhado aparece com a mesma cor dos dois lados.
const swatch = v => (/^\d+$/.test(v) ? `hsl(${(Number(BigInt(v) % 360n) * 137) % 360} 70% 55%)` : 'transparent')

function Column({ title, items, fresh, tone }) {
  return (
    <div className={`flex-1 min-w-[180px] rounded-xl border p-4 ${tone}`}>
      <p className="text-sm font-medium text-ink">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map(([label, value, secret], i) => (
          <li key={label} className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-300 ${fresh && i === items.length - 1 ? 'bg-amber-400/20 ring-1 ring-amber-400' : 'bg-surface'}`}>
            <span className="font-mono text-muted text-xs">{label}{secret ? ' 🔒' : ''}</span>
            <span className="flex items-center gap-2 font-mono text-ink">
              <span className="w-3 h-3 rounded-full" style={{ background: swatch(value) }} />
              {value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Troca de chaves Diffie-Hellman: o que Alice, Bob e a espiã Eva conhecem a cada passo.
export default function DiffieHellmanVisualizer() {
  const { t } = useI18n()
  const [input, setInput] = useState(EXAMPLE)
  const frames = useMemo(() => dhFrames(...['p', 'g', 'a', 'b'].map(k => Number(input[k]))), [input])
  const player = usePlayer(frames.length, { speedScale: 2 })
  const f = frames[player.step]
  const numField = name => ({ name, label: name, max: 7, width: 'w-24' })

  return (
    <figure className="card overflow-hidden">
      <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-line">
        <FieldsForm
          fields={['p', 'g', 'a', 'b'].map(numField)}
          values={input}
          example={EXAMPLE}
          valid={v => Object.values(v).every(x => /^\d{1,7}$/.test(x)) && dhFrames(...['p', 'g', 'a', 'b'].map(k => Number(v[k]))).length > 0}
          onApply={v => { player.reset(); setInput(v) }}
        />
        <div className="flex flex-wrap gap-3">
          <Column title={t('viz.alice')} items={f.alice} fresh={f.novo === 'alice'} tone="border-sky-500/30 bg-sky-500/5" />
          <Column title={t('viz.publicChannel')} items={f.canal} fresh={f.novo === 'canal'} tone="border-rose-500/30 bg-rose-500/5" />
          <Column title={t('viz.bob')} items={f.bob} fresh={f.novo === 'bob'} tone="border-emerald-500/30 bg-emerald-500/5" />
        </div>
      </div>
      <StepNote>{f.note}</StepNote>
      <PlayerControls player={player} />
      <Legend
        items={[['bg-amber-400', t('viz.newInfo')], ['bg-rose-500/40', t('viz.eveSees')]]}
        status={f.done ? t('viz.sharedSecret', { s: f.shared }) : t('player.step', { s: player.step, t: player.last })}
      />
    </figure>
  )
}
