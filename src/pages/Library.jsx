import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AlgorithmCard from '../components/AlgorithmCard'
import { algorithms, categories, difficulties } from '../data'

const normalize = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Library() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const level = params.get('nivel') ?? ''

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const groups = useMemo(() => {
    const q = normalize(query.trim())
    return categories
      .map(cat => ({
        ...cat,
        items: cat.items.filter(a =>
          (!level || a.difficulty === level) &&
          (!q || normalize(`${a.name} ${a.summary} ${a.usedIn.join(' ')}`).includes(q)),
        ),
      }))
      .filter(cat => cat.items.length > 0)
  }, [query, level])

  const resultCount = groups.reduce((acc, g) => acc + g.items.length, 0)

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Cabeçalho e filtros */}
        <div className="border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-sm sticky top-16 z-30">
          <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h1 className="font-display text-xl font-bold text-zinc-100">Biblioteca de algoritmos</h1>
                <p className="text-xs text-zinc-500 font-body mt-0.5">
                  {resultCount} de {algorithms.length} algoritmos · {categories.length} categorias
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="search"
                value={query}
                onChange={e => updateParam('q', e.target.value)}
                placeholder="Buscar por nome ou aplicação (ex.: GPS, criptografia, ordenação)…"
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-brand-500 focus:outline-none text-sm font-body text-zinc-100 placeholder:text-zinc-600"
              />
              <div className="flex gap-1.5 overflow-x-auto">
                {['', ...difficulties].map(d => (
                  <button
                    key={d || 'todos'}
                    onClick={() => updateParam('nivel', d)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold font-body border transition-colors
                      ${level === d
                        ? 'bg-brand-500 border-brand-500 text-zinc-950'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100'}`}
                  >
                    {d || 'Todos'}
                  </button>
                ))}
              </div>
            </div>

            {/* Atalhos de categoria */}
            <div className="flex gap-1.5 overflow-x-auto -mb-1 pb-1">
              {groups.map(cat => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="shrink-0 px-3 py-1 rounded-full text-[11px] font-body text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-zinc-100 hover:border-zinc-700"
                >
                  {cat.icon} {cat.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Grupos */}
        <div className="max-w-6xl mx-auto px-5 py-8 space-y-12 pb-20">
          {groups.map(cat => (
            <section key={cat.id} id={cat.id} className="scroll-mt-64">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg">
                  {cat.icon}
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-zinc-100">{cat.title}</h2>
                  <p className="text-xs text-zinc-500 font-body">{cat.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.items.map(a => <AlgorithmCard key={a.id} algorithm={a} />)}
              </div>
            </section>
          ))}

          {groups.length === 0 && (
            <p className="text-center text-sm text-zinc-500 font-body py-20">
              Nenhum algoritmo encontrado para essa busca.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
