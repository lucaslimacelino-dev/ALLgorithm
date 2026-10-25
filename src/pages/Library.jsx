import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DifficultyBadge from '../components/DifficultyBadge'
import { algorithms, categories, difficulties, mainComplexity } from '../data'
import { matchScore } from '../lib/search'
import { usePageTitle } from '../lib/usePageTitle'

export default function Library() {
  usePageTitle('Índice de algoritmos')
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const level = params.get('nivel') ?? ''

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
        items: cat.items.filter(a => (!level || a.difficulty === level) && matchScore(a, query) >= 0),
      }))
      .filter(cat => cat.items.length > 0)
  ), [query, level])

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
              <Link to="/" className="hover:text-ink">Início</Link>
              <span className="mx-2">/</span>
              <span className="text-muted">Biblioteca</span>
            </nav>
            <h1 className="mt-5 title text-4xl sm:text-5xl tracking-[-0.035em]">
              Índice de <span className="font-display italic font-normal tracking-normal">algoritmos</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] text-muted">
              Todos os artigos da enciclopédia, organizados por categoria e ordenados do mais simples ao mais avançado.
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
                  placeholder="Filtrar por nome, aplicação ou categoria…"
                  className="w-full h-11 pl-11 pr-4 rounded-full bg-surface border border-line shadow-soft text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-4 focus:ring-accent/10"
                />
              </div>
              <div className="inline-flex p-1 rounded-full border border-line bg-surface shadow-soft self-start overflow-x-auto max-w-full" role="group" aria-label="Nível">
                {['', ...difficulties].map(d => (
                  <button
                    key={d || 'todos'}
                    onClick={() => updateParam('nivel', d)}
                    aria-pressed={level === d}
                    className={`shrink-0 h-9 px-4 rounded-full text-[13px] inline-flex items-center gap-2
                      ${level === d ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
                  >
                    {d ? <DifficultyBadge level={d} className="!text-inherit !text-[13px]" /> : 'Todos'}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-4 text-[13px] text-faint">
              {filtering
                ? <>{resultCount} de {algorithms.length} artigos · <button onClick={() => setParams({}, { replace: true })} className="link">limpar filtros</button></>
                : <>{algorithms.length} artigos em {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}</>}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 grid-cols-[minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)]">
          {/* Categorias */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <h2 className="kicker mb-3">Categorias</h2>
            <ul className="space-y-0.5">
              {categories.map(cat => (
                <li key={cat.id}>
                  <a href={`#${cat.id}`} className="flex justify-between items-center px-3 h-9 rounded-lg text-sm text-muted hover:text-ink hover:bg-subtle">
                    {cat.title}
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
                  <div>
                    <h2 className="title text-2xl">{cat.title}</h2>
                    <p className="mt-1 text-sm text-muted">{cat.description}</p>
                  </div>
                  <span className="hidden sm:block shrink-0 text-[13px] text-faint">{cat.items.length} artigos</span>
                </div>

                <ul className="card divide-y divide-line overflow-hidden">
                  {cat.items.map((a, i) => (
                    <li key={a.id}>
                      <Link
                        to={`/algoritmos/${a.id}`}
                        className="group grid grid-cols-[28px_minmax(0,1fr)] sm:grid-cols-[28px_minmax(0,1fr)_120px_110px_16px] gap-x-4 gap-y-1.5 items-center px-5 py-4 hover:bg-subtle/60"
                      >
                        <span className="font-mono text-xs text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                        <span className="min-w-0">
                          <span className="block text-[15px] font-medium text-ink">{a.name}</span>
                          <span className="block mt-0.5 text-[13.5px] text-muted sm:truncate">{a.summary}</span>
                        </span>
                        <DifficultyBadge level={a.difficulty} className="col-start-2 sm:col-start-auto" />
                        <span className="hidden sm:block font-mono text-xs text-muted text-right">{mainComplexity(a)}</span>
                        <span className="hidden sm:block text-faint group-hover:text-ink group-hover:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {groups.length === 0 && (
              <div className="card py-20 text-center">
                <p className="title text-xl">Nenhum artigo encontrado</p>
                <p className="mt-2 text-sm text-muted">Tente outro termo ou remova o filtro de nível.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
