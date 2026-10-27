import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CategoryIcon from '../components/CategoryIcon'
import DifficultyBadge from '../components/DifficultyBadge'
import { getVisualizer } from '../components/visualizers'
import { categories, difficulties, getCategory, mainComplexity, preloadAlgorithm } from '../data'
import { matchScore } from '../lib/search'
import { usePageTitle } from '../lib/usePageTitle'
import { useI18n } from '../i18n'

function AlgorithmCard({ algorithm, index }) {
  const { t, loc } = useI18n()
  return (
    <Link
      to={`/algoritmos/${algorithm.id}`}
      onMouseEnter={() => preloadAlgorithm(algorithm.id)}
      className="group card card-hover p-5 flex flex-col"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-faint tabular-nums">{String(index + 1).padStart(2, '0')}</span>
        {getVisualizer(algorithm.id) && (
          <span className="inline-flex items-center gap-1 px-2 h-6 rounded-full bg-accent/10 text-accent text-[11px] font-medium">
            <span aria-hidden="true">▶</span> {t('category.interactive')}
          </span>
        )}
      </div>
      <h3 className="mt-3 title text-[17px] leading-snug group-hover:text-accent">{loc(algorithm).name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-3">{loc(algorithm).summary}</p>
      <div className="mt-auto pt-4 flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted truncate">{mainComplexity(algorithm)}</span>
        <span className="text-faint group-hover:text-ink group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
      </div>
    </Link>
  )
}

// Página de uma categoria: apresenta a categoria e organiza os algoritmos em trilha, do iniciante ao avançado.
export default function CategoryPage() {
  const { id } = useParams()
  const { t, loc, locale } = useI18n()
  const category = getCategory(id)
  usePageTitle(category ? loc(category).title : null)
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('')
  const pills = useRef(null)
  const articles = n => (n === 1 ? t('category.oneArticle') : t('library.articles', { n }))

  // Mantém a categoria atual visível na barra de troca rápida (rolagem horizontal).
  useEffect(() => {
    const el = pills.current?.querySelector('[aria-current="page"]')
    if (el) pills.current.scrollLeft = el.offsetLeft - pills.current.clientWidth / 2 + el.offsetWidth / 2
    setQuery(''); setLevel('')
  }, [id])

  const items = useMemo(() => (
    category ? category.items.filter(a => (!level || a.difficulty === level) && matchScore(a, query, locale) >= 0) : []
  ), [category, query, level, locale])

  if (!category) return <Navigate to="/#categorias" replace />

  const position = categories.indexOf(category)
  const prev = categories[(position - 1 + categories.length) % categories.length]
  const next = categories[(position + 1) % categories.length]
  const counts = Object.fromEntries(difficulties.map(d => [d, category.items.filter(a => a.difficulty === d).length]))
  // Ponto de partida: o indicado na categoria, ou o primeiro artigo de nível iniciante.
  const start = category.items.find(a => a.id === category.start) ?? category.items.find(a => a.difficulty === 'Iniciante') ?? category.items[0]
  const numbered = new Map(category.items.map((a, i) => [a.id, i]))
  const groups = difficulties.map(d => [d, items.filter(a => a.difficulty === d)]).filter(([, list]) => list.length)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 animate-page-in">
        {/* Cabeçalho */}
        <div className="relative overflow-hidden border-b border-line">
          <div className="absolute inset-0 bg-glow pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-10">
            <nav className="text-[13px] text-faint" aria-label="Trilha">
              <Link to="/" className="hover:text-ink">{t('crumb.home')}</Link>
              <span className="mx-2">/</span>
              <Link to="/#categorias" className="hover:text-ink">{t('nav.categories')}</Link>
              <span className="mx-2">/</span>
              <span className="text-muted">{loc(category).title}</span>
            </nav>

            {/* Troca rápida de categoria */}
            <div ref={pills} className="relative mt-5 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {categories.map(c => (
                <Link
                  key={c.id}
                  to={`/categorias/${c.id}`}
                  aria-current={c.id === category.id ? 'page' : undefined}
                  className={`shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-[13px] transition-colors ${c.id === category.id ? 'bg-ink text-paper border-ink' : 'border-line bg-surface text-muted hover:text-ink hover:border-ink/20'}`}
                >
                  <CategoryIcon id={c.id} className="w-3.5 h-3.5" />
                  {loc(c).title}
                </Link>
              ))}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
              <div>
                <span className="w-14 h-14 grid place-items-center rounded-2xl bg-accent text-white shadow-soft">
                  <CategoryIcon id={category.id} className="w-7 h-7" />
                </span>
                <h1 className="mt-5 title text-4xl sm:text-5xl tracking-[-0.035em]">{loc(category).title}</h1>
                <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">{loc(category).description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span className="text-muted">{articles(category.items.length)}</span>
                  {difficulties.filter(d => counts[d]).map(d => (
                    <span key={d} className="inline-flex items-center gap-1.5">
                      <span className="font-medium text-ink tabular-nums">{counts[d]}</span>
                      <DifficultyBadge level={d} className="!text-sm" />
                    </span>
                  ))}
                </div>
              </div>

              {start && (
                <Link to={`/algoritmos/${start.id}`} onMouseEnter={() => preloadAlgorithm(start.id)} className="group card card-hover p-6 bg-ink text-paper border-ink">
                  <p className="text-[13px] font-medium text-paper/60">{t('category.start')}</p>
                  <p className="mt-2 title !text-paper text-xl">{loc(start).name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70 line-clamp-2">{loc(start).summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">{t('landing.read')} <span className="group-hover:translate-x-1 transition-transform">→</span></span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Filtros + trilha */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('category.filter')}
                className="w-full h-11 pl-11 pr-4 rounded-full bg-surface border border-line shadow-soft text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-4 focus:ring-accent/10"
              />
            </div>
            <div className="inline-flex p-1 rounded-full border border-line bg-surface shadow-soft self-start overflow-x-auto max-w-full" role="group" aria-label={t('library.level')}>
              {['', ...difficulties].filter(d => !d || counts[d]).map(d => (
                <button
                  key={d || 'todos'}
                  type="button"
                  onClick={() => setLevel(d)}
                  aria-pressed={level === d}
                  className={`shrink-0 h-9 px-4 rounded-full text-[13px] inline-flex items-center gap-2 ${level === d ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
                >
                  {d ? <DifficultyBadge level={d} className="!text-inherit !text-[13px]" /> : t('library.all')}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-12">
            {groups.map(([d, list]) => (
              <section key={d}>
                <div className="flex items-center gap-3 mb-5">
                  <DifficultyBadge level={d} className="!text-[15px] !text-ink font-semibold" />
                  <span className="h-px flex-1 bg-line" />
                  <span className="text-[13px] text-faint">{articles(list.length)}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map(a => <AlgorithmCard key={a.id} algorithm={a} index={numbered.get(a.id)} />)}
                </div>
              </section>
            ))}

            {!groups.length && (
              <div className="card py-16 text-center">
                <p className="title text-xl">{t('library.noneTitle')}</p>
                <p className="mt-2 text-sm text-muted">{t('library.noneText')}</p>
              </div>
            )}
          </div>

          {/* Categoria anterior / próxima */}
          <nav className="mt-16 pt-8 border-t border-line grid gap-4 sm:grid-cols-2">
            {[[prev, t('category.prev'), '←'], [next, t('category.next'), '→']].map(([c, label, arrow], i) => (
              <Link key={c.id} to={`/categorias/${c.id}`} className={`group card card-hover p-5 flex items-center gap-4 ${i ? 'sm:flex-row-reverse sm:text-right' : ''}`}>
                <span className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <CategoryIcon id={c.id} className="w-5 h-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-faint">{arrow} {label}</span>
                  <span className="block mt-0.5 font-medium text-ink group-hover:text-accent truncate">{loc(c).title}</span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  )
}
