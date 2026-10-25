import { useMemo, useState } from 'react'
import { languages } from '../data'
import { useLanguage } from '../context/LanguageContext'
import { dedent, tokenize } from '../lib/highlight'

const tokenColor = {
  keyword: 'text-violet-400',
  string:  'text-amber-300',
  number:  'text-orange-300',
  comment: 'text-zinc-500 italic',
  fn:      'text-sky-300',
  type:    'text-teal-300',
  plain:   'text-zinc-200',
}

export default function CodeBlock({ code }) {
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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      {/* Abas de linguagem */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-2 py-2">
        <div className="flex gap-1 overflow-x-auto">
          {languages.map(l => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-colors
                ${language === l.id
                  ? 'bg-brand-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-body text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          {copied ? 'Copiado ✓' : 'Copiar'}
        </button>
      </div>

      {/* Código */}
      <div className="flex overflow-x-auto text-[13px] leading-6 font-mono">
        <div aria-hidden className="select-none shrink-0 py-4 pl-4 pr-3 text-right text-zinc-600">
          {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre className="py-4 pr-6 pl-1">
          <code>
            {tokens.map((t, i) => <span key={i} className={tokenColor[t.type]}>{t.text}</span>)}
          </code>
        </pre>
      </div>
    </div>
  )
}
