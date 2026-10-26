import { useState } from 'react'
import { useI18n } from '../../i18n'

// Formulário com vários campos de texto, "Aplicar" e "Exemplo".
// fields: [{ name, label, max, width? }]; valid(values) decide se os valores podem ser aplicados.
export default function FieldsForm({ fields, values, example, onApply, valid = () => true }) {
  const { t } = useI18n()
  const [draft, setDraft] = useState(values)
  const [error, setError] = useState(false)

  const apply = next => {
    let ok = false
    try { ok = valid(next) } catch { ok = false }
    if (!ok) { setError(true); return }
    setError(false)
    onApply(next)
  }

  return (
    <form className="flex flex-wrap items-end gap-2 mb-5" onSubmit={e => { e.preventDefault(); apply(draft) }}>
      {fields.map(f => (
        <label key={f.name} className={`flex flex-col gap-1 text-xs text-muted ${f.width ?? 'flex-1 min-w-[160px]'}`}>
          <span className="font-mono">{f.label}</span>
          <input
            value={draft[f.name]}
            maxLength={f.max}
            onChange={e => setDraft(d => ({ ...d, [f.name]: e.target.value }))}
            className="w-full h-9 px-3 rounded-full border border-line bg-surface font-mono text-sm text-ink focus:outline-none focus:ring-4 focus:ring-accent/10"
          />
        </label>
      ))}
      <button type="submit" className="btn-ghost !h-9">{t('viz.apply')}</button>
      <button type="button" onClick={() => { setDraft(example); apply(example) }} className="btn-ghost !h-9">{t('viz.example')}</button>
      {error && <p className="w-full text-sm text-rose-600 dark:text-rose-400">{t('viz.invalidFields')}</p>}
    </form>
  )
}
