import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategory } from '../data'
import { searchAlgorithms } from '../lib/search'
import DifficultyBadge from './DifficultyBadge'

const sizes = {
  lg: { input: 'h-[52px] pl-12 pr-5 text-[15px] rounded-full shadow-soft', icon: 'left-[18px] w-[18px] h-[18px]' },
  sm: { input: 'h-9 pl-9 pr-9 text-[13.5px] rounded-full !bg-subtle/70 !border-transparent focus:!border-line focus:!bg-surface', icon: 'left-3.5 w-[15px] h-[15px]' },
}

export default function SearchBox({ size = 'lg', shortcut = false, placeholder = 'Buscar algoritmo ou aplicação…' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const listId = useId()

  const results = useMemo(() => searchAlgorithms(query).slice(0, 8), [query])
  const showList = open && query.trim().length > 0

  // Atalho "/" para focar a busca.
  useEffect(() => {
    if (!shortcut) return
    const onKey = e => {
      const tag = document.activeElement?.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shortcut])

  const go = path => {
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
    navigate(path)
  }

  const libraryPath = `/algoritmos?q=${encodeURIComponent(query.trim())}`

  const onKeyDown = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) go(`/algoritmos/${results[active].id}`)
      else if (query.trim()) go(libraryPath)
    }
    else if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
  }

  const s = sizes[size]

  return (
    <div className="relative w-full">
      <svg className={`absolute top-1/2 -translate-y-1/2 text-faint pointer-events-none ${s.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        value={query}
        onChange={e => { setQuery(e.target.value); setActive(0); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full bg-surface border border-line text-ink placeholder:text-faint focus:outline-none focus:ring-4 focus:ring-accent/10 transition ${s.input}`}
      />
      {shortcut && !query && (
        <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center w-5 h-5 rounded-md border bg-surface border-line text-[11px] text-faint font-mono">/</kbd>
      )}

      {showList && (
        <div
          id={listId}
          role="listbox"
          onMouseDown={e => e.preventDefault()}
          className="absolute z-50 left-0 right-0 mt-2 rounded-2xl border border-line bg-surface shadow-lift overflow-hidden animate-fade-in text-left"
        >
          {results.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted">Nenhum algoritmo encontrado para “{query}”.</p>
          ) : (
            <ul className="p-1.5 max-h-96 overflow-y-auto">
              {results.map((a, i) => (
                <li key={a.id} role="option" aria-selected={i === active}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(`/algoritmos/${a.id}`)}
                    className={`w-full flex items-center justify-between gap-4 px-4 py-2.5 text-left rounded-lg ${i === active ? 'bg-subtle' : ''}`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[14.5px] font-medium text-ink truncate">{a.name}</span>
                      <span className="block text-xs text-muted truncate">{getCategory(a.category).title} · {a.summary}</span>
                    </span>
                    <DifficultyBadge level={a.difficulty} className="shrink-0 hidden sm:inline-flex" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => go(libraryPath)} className="w-full px-4 py-2.5 text-xs text-accent text-left border-t border-line hover:bg-subtle">
            Ver todos os resultados na biblioteca →
          </button>
        </div>
      )}
    </div>
  )
}
