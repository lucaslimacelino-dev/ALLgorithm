import { Link, Navigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CodeBlock from '../components/CodeBlock'
import SortingVisualizer from '../components/SortingVisualizer'
import { algorithms, getAlgorithm, getCategory, difficultyColor } from '../data'
import { hasSortingVisualizer } from '../lib/sortingFrames'

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-lg font-bold text-zinc-100 mb-4">{title}</h2>
      {children}
    </section>
  )
}

const complexityLabels = [
  ['best', 'Melhor caso'],
  ['average', 'Caso médio'],
  ['worst', 'Pior caso'],
  ['space', 'Espaço'],
]

export default function AlgorithmPage() {
  const { id } = useParams()
  const algorithm = getAlgorithm(id)
  if (!algorithm) return <Navigate to="/algoritmos" replace />

  const category = getCategory(algorithm.category)
  const index = algorithms.findIndex(a => a.id === id)
  const prev = algorithms[index - 1]
  const next = algorithms[index + 1]

  const hasVisualizer = hasSortingVisualizer(algorithm.id)

  const sections = [
    ...(hasVisualizer ? [['visualizacao', 'Visualização']] : []),
    ['como-funciona', 'Como funciona'],
    ['implementacao', 'Implementação'],
    ['onde-e-usado', 'Onde é usado'],
    ['mundo-real', 'Mundo real'],
    ['curiosidades', 'Curiosidades'],
  ]

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-5 py-10 space-y-12">
          {/* Cabeçalho */}
          <header>
            <nav className="text-xs font-body text-zinc-500 mb-4">
              <Link to="/algoritmos" className="hover:text-zinc-300">Biblioteca</Link>
              <span className="mx-2">/</span>
              <Link to={`/algoritmos#${category.id}`} className="hover:text-zinc-300">{category.title}</Link>
            </nav>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100">{algorithm.name}</h1>
              <span className={`text-xs font-semibold font-body px-2.5 py-0.5 rounded-full border ${difficultyColor[algorithm.difficulty]}`}>
                {algorithm.difficulty}
              </span>
            </div>
            <p className="text-zinc-400 font-body leading-relaxed">{algorithm.description}</p>

            <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {complexityLabels.map(([key, label]) => (
                <div key={key} className="rounded-xl bg-zinc-900/60 border border-zinc-800 px-3 py-2.5">
                  <dt className="text-[11px] text-zinc-500 font-body">{label}</dt>
                  <dd className="font-mono text-sm text-zinc-100 mt-0.5">{algorithm.complexity[key]}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex gap-1.5 overflow-x-auto">
              {sections.map(([sid, label]) => (
                <a
                  key={sid}
                  href={`#${sid}`}
                  className="shrink-0 px-3 py-1 rounded-full text-[11px] font-body text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-zinc-100"
                >
                  {label}
                </a>
              ))}
            </div>
          </header>

          {hasVisualizer && (
            <Section id="visualizacao" title="Visualização">
              <SortingVisualizer algorithmId={algorithm.id} />
            </Section>
          )}

          <Section id="como-funciona" title="Como funciona">
            <ol className="space-y-3">
              {algorithm.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[11px] font-bold font-display">
                    {i + 1}
                  </span>
                  <p className="text-sm text-zinc-300 font-body leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="implementacao" title="Implementação">
            <CodeBlock code={algorithm.code} />
          </Section>

          <Section id="onde-e-usado" title="Onde é usado">
            <div className="flex flex-wrap gap-2">
              {algorithm.usedIn.map(item => (
                <span key={item} className="px-3 py-1.5 rounded-lg text-xs font-body text-brand-300 bg-brand-500/10 border border-brand-500/20">
                  {item}
                </span>
              ))}
            </div>
          </Section>

          <Section id="mundo-real" title="Aplicações no mundo real">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {algorithm.realWorld.map(({ title, text }) => (
                <div key={title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <h3 className="font-display text-sm font-bold text-zinc-100 mb-1.5">{title}</h3>
                  <p className="text-sm text-zinc-400 font-body leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="curiosidades" title="Curiosidades">
            <ul className="space-y-3">
              {algorithm.curiosities.map((c, i) => (
                <li key={i} className="flex gap-3 rounded-xl border border-amber-500/15 bg-amber-500/5 p-4">
                  <span className="shrink-0 text-amber-400">✦</span>
                  <p className="text-sm text-zinc-300 font-body leading-relaxed">{c}</p>
                </li>
              ))}
            </ul>
          </Section>

          {/* Navegação entre algoritmos */}
          <nav className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800/60">
            {prev ? (
              <Link to={`/algoritmos/${prev.id}`} className="rounded-xl border border-zinc-800 p-4 hover:border-zinc-700">
                <span className="text-[11px] text-zinc-500 font-body">← Anterior</span>
                <p className="font-display text-sm font-bold text-zinc-200">{prev.name}</p>
              </Link>
            ) : <span />}
            {next && (
              <Link to={`/algoritmos/${next.id}`} className="rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 text-right">
                <span className="text-[11px] text-zinc-500 font-body">Próximo →</span>
                <p className="font-display text-sm font-bold text-zinc-200">{next.name}</p>
              </Link>
            )}
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  )
}
