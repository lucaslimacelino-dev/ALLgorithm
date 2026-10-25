import { useState } from 'react'
import { useI18n } from '../../i18n'

// Campo de texto com "Aplicar" e "Exemplo", usado pelos visualizadores de compressão.
export default function TextForm({ value, example, max, onApply, valid = () => true }) {
  const { t } = useI18n()
  const [draft, setDraft] = useState(value)
  const [error, setError] = useState(false)

  const apply = next => {
    const size = [...next].length
    if (!size || size > max || !valid(next)) { setError(true); return }
    setError(false)
    onApply(next)
  }

  return (
    <form className="flex flex-wrap items-end gap-2 mb-5" onSubmit={e => { e.preventDefault(); apply(draft) }}>
      <label className="flex flex-col gap-1 text-xs text-muted flex-1 min-w-[200px] max-w-md">
        <span className="font-mono">{t('viz.text')}</span>
        <input
          value={draft}
          maxLength={max}
          onChange={e => setDraft(e.target.value)}
          className="w-full h-9 px-3 rounded-full border border-line bg-surface font-mono text-sm text-ink focus:outline-none focus:ring-4 focus:ring-accent/10"
        />
      </label>
      <button type="submit" className="btn-ghost !h-9">{t('viz.apply')}</button>
      <button type="button" onClick={() => { setDraft(example); apply(example) }} className="btn-ghost !h-9">{t('viz.example')}</button>
      {error && <p className="w-full text-sm text-rose-600 dark:text-rose-400">{t('viz.invalidText', { min: 1, max })}</p>}
    </form>
  )
}
