import { useMemo, useState } from 'react'
import { languages } from '../data'
import { useLanguage } from '../context/LanguageContext'
import { dedent, tokenize } from '../lib/highlight'
import { useI18n } from '../i18n'
import LanguageIcon from './LanguageIcon'

export default function CodeBlock({ code }) {
  const { t } = useI18n()
  const { language, setLanguage } = useLanguage()
  const [copied, setCopied] = useState(false)

  const source = useMemo(() => dedent(code[language] ?? ''), [code, language])
  const tokens = useMemo(() => tokenize(source, language), [source, language])
  const lineCount = source.split('\n').length

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* área de transferência indisponível */ }
  }

  return (
    <div className="card overflow-hidden">
      {/* Abas de linguagem */}
      <div className="flex items-center justify-between gap-2 border-b border-line pl-2 pr-2">
        <div role="tablist" className="flex overflow-x-auto">
          {languages.map(l => (
            <button
              key={l.id}
              role="tab"
              aria-selected={language === l.id}
              onClick={() => setLanguage(l.id)}
              className={`shrink-0 my-2 mr-1 h-8 pl-2.5 pr-3.5 rounded-full text-[13px] inline-flex items-center gap-2
                ${language === l.id
                  ? 'bg-ink text-paper font-medium'
                  : 'text-muted hover:text-ink hover:bg-subtle'}`}
            >
              <LanguageIcon id={l.id} />
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs text-muted hover:text-ink hover:bg-subtle"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {copied
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />}
          </svg>
          {copied ? t('code.copied') : t('common.copy')}
        </button>
      </div>

      {/* Código */}
      <div className="flex overflow-x-auto text-[13px] leading-6 font-mono bg-[rgb(var(--code-bg))]">
        <div aria-hidden className="select-none shrink-0 py-4 pl-4 pr-4 text-right text-faint/60">
          {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre className="py-4 pr-6 pl-4">
          <code>
            {tokens.map((t, i) => <span key={i} className={`tok-${t.type}`}>{t.text}</span>)}
          </code>
        </pre>
      </div>
    </div>
  )
}
