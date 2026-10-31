import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DifficultyBadge from '../components/DifficultyBadge'
import AlgorithmThumb from '../components/AlgorithmThumb'
import CategoryIcon from '../components/CategoryIcon'
import { algorithms, categories, difficulties, mainComplexity, preloadAlgorithm } from '../data'
import { matchScore } from '../lib/search'
import { usePageTitle } from '../lib/usePageTitle'
import { useI18n } from '../i18n'

const VIEW_KEY = 'allgorithm:libraryView'
const readView = () => { try { return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'cards' } catch { return 'cards' } }

function AlgorithmCard({ algorithm }) {
  const { loc } = useI18n()
  return (
    <Link to={`/algoritmos/${algorithm.id}`} onMouseEnter={() => preloadAlgorithm(algorithm.id)} className="group card card-hover overflow-hidden flex flex-col">
      <div className="bg-subtle/60 border-b border-line px-2.5 py-2 sm:px-4 sm:py-3">
        <AlgorithmThumb algorithm={algorithm} className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.04]" />
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="text-[14px] sm:text-[15px] font-medium text-ink leading-snug group-hover:text-accent">{loc(algorithm).name}</h3>
        <p className="hidden sm:block mt-1 text-[13px] leading-relaxed text-muted line-clamp-2">{loc(algorithm).summary}</p>
        <div className="mt-auto pt-3 flex items-center justify-between gap-3">
          <DifficultyBadge level={algorithm.difficulty} className="hidden sm:inline-flex" />
          <span className="font-mono text-[11.5px] text-muted truncate">{mainComplexity(algorithm)}</span>
        </div>
      </div>
    </Link>
  )
}

export default function Library() {
  const { t, loc, locale } = useI18n()
  usePageTitle(t('library.pageTitle'))
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const level = params.get('nivel') ?? ''
  const [view, setView] = useState(readView)
  useEffect(() => { try { localStorage.setItem(VIEW_KEY, view) } catch { /* armazenamento indisponível */ } }, [view])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const groups = useMemo(() => (
    categories
      .map(cat => ({
        ...cat,
        items: cat.items.filter(a => (!level || a.difficulty === level) && matchScore(a, query, locale) >= 0),
      }))
      .filter(cat => cat.items.length > 0)
  ), [query, level, locale])

  const resultCount = groups.reduce((acc, g) => acc + g.items.length, 0)
  const filtering = query || level

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 animate-page-in">
        {/* Cabeçalho */}
        <div className="relative overflow-hidden border-b border-line">
          <div className="absolute inset-0 bg-glow pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-10">
            <nav className="text-[13px] text-faint" aria-label="Trilha">
              <Link to="/" className="hover:text-ink">{t('crumb.home')}</Link>
              <span className="mx-2">/</span>
              <span className="text-muted">{t('crumb.library')}</span>
            </nav>
            <h1 className="mt-5 title text-4xl sm:text-5xl tracking-[-0.035em]">
              {t('library.title')} <span className="font-display italic font-normal tracking-normal">{t('library.titleEm')}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] text-muted">
              {t('library.subtitle')}
            </p>

            {/* Filtros */}
            <div className="mt-8 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 max-w-xl">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={e => updateParam('q', e.target.value)}
                  placeholder={t('library.filter')}
                  className="w-full h-11 pl-11 pr-4 rounded-full bg-surface border border-line shadow-soft text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-4 focus:ring-accent/10"
                />
              </div>
              <div className="inline-flex p-1 rounded-full border border-line bg-surface shadow-soft self-start overflow-x-auto max-w-full" role="group" aria-label={t('library.level')}>
                {['', ...difficulties].map(d => (
                  <button
                    key={d || 'todos'}
                    onClick={() => updateParam('nivel', d)}
                    aria-pressed={level === d}
                    className={`shrink-0 h-9 px-4 rounded-full text-[13px] inline-flex items-center gap-2
                      ${level === d ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
                  >
                    {d ? <DifficultyBadge level={d} className="!text-inherit !text-[13px]" /> : t('library.all')}
                  </button>
                ))}
              </div>
              <div className="inline-flex p-1 rounded-full border border-line bg-surface shadow-soft self-start md:ml-auto" role="group" aria-label={t('library.view')}>
                {[['cards', t('library.cards'), 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'], ['list', t('library.list'), 'M4 6h16M4 12h16M4 18h16']].map(([v, label, d]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    title={label}
                    className={`h-9 px-3.5 rounded-full text-[13px] inline-flex items-center gap-2 ${view === v ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"><path d={d} /></svg>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-4 text-[13px] text-faint">
              {filtering
                ? <>{t('library.filtered', { r: resultCount, t: algorithms.length })} · <button onClick={() => setParams({}, { replace: true })} className="link">{t('library.clear')}</button></>
                : <>{t('library.count', { n: algorithms.length, c: categories.length })}</>}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 grid-cols-[minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)]">
          {/* Categorias */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <h2 className="kicker mb-3">{t('library.categories')}</h2>
            <ul className="space-y-0.5">
              {categories.map(cat => (
                <li key={cat.id}>
                  <a href={`#${cat.id}`} className="flex justify-between items-center gap-2 px-3 h-9 rounded-lg text-sm text-muted hover:text-ink hover:bg-subtle">
                    <span className="inline-flex items-center gap-2 min-w-0"><CategoryIcon id={cat.id} className="w-3.5 h-3.5 shrink-0 text-faint" /><span className="truncate">{loc(cat).title}</span></span>
                    <span className="font-mono text-xs text-faint">{cat.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="min-w-0 space-y-16">
            {groups.map(cat => (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="flex items-end justify-between gap-4 mb-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 w-9 h-9 shrink-0 grid place-items-center rounded-xl bg-accent/10 text-accent"><CategoryIcon id={cat.id} className="w-[18px] h-[18px]" /></span>
                    <div>
                    <h2 className="title text-2xl"><Link to={`/categorias/${cat.id}`} className="hover:text-accent">{loc(cat).title}</Link></h2>
                    <p className="mt-1 text-sm text-muted">{loc(cat).description}</p>
                    </div>
                  </div>
                  <span className="hidden sm:block shrink-0 text-[13px] text-faint">{t('library.articles', { n: cat.items.length })}</span>
                </div>

                {view === 'cards' ? (
                  <div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-3">
                    {cat.items.map(a => <AlgorithmCard key={a.id} algorithm={a} />)}
                  </div>
                ) : (
                <ul className="card divide-y divide-line overflow-hidden">
                  {cat.items.map((a, i) => (
                    <li key={a.id}>
                      <Link
                        onMouseEnter={() => preloadAlgorithm(a.id)} to={`/algoritmos/${a.id}`}
                        className="group grid grid-cols-[28px_minmax(0,1fr)] sm:grid-cols-[28px_minmax(0,1fr)_120px_110px_16px] gap-x-4 gap-y-1.5 items-center px-5 py-4 hover:bg-subtle/60"
                      >
                        <span className="font-mono text-xs text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                        <span className="min-w-0">
                          <span className="block text-[15px] font-medium text-ink">{loc(a).name}</span>
                          <span className="block mt-0.5 text-[13.5px] text-muted sm:truncate">{loc(a).summary}</span>
                        </span>
                        <DifficultyBadge level={a.difficulty} className="col-start-2 sm:col-start-auto" />
                        <span className="hidden sm:block font-mono text-xs text-muted text-right">{mainComplexity(a)}</span>
                        <span className="hidden sm:block text-faint group-hover:text-ink group-hover:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                )}
              </section>
            ))}

            {groups.length === 0 && (
              <div className="card py-20 text-center">
                <p className="title text-xl">{t('library.noneTitle')}</p>
                <p className="mt-2 text-sm text-muted">{t('library.noneText')}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
