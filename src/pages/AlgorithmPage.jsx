import { Suspense, useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CodeBlock from '../components/CodeBlock'
import DifficultyBadge from '../components/DifficultyBadge'
import { getVisualizer } from '../components/visualizers'
import { SITE } from '../config/site'
import { algorithms, getAlgorithm, getCategory, loadAlgorithmContent, preloadAlgorithm } from '../data'
import { usePageTitle } from '../lib/usePageTitle'

const complexityLabels = [
  ['best', 'Melhor caso'],
  ['average', 'Caso médio'],
  ['worst', 'Pior caso'],
  ['space', 'Espaço'],
]

const months = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']
const abntDate = d => `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex w-7 h-7 shrink-0 items-center justify-center rounded-full bg-subtle font-mono text-xs text-muted">{number}</span>
        <h2 className="title text-[22px]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Infobox({ algorithm, category }) {
  const row = 'flex items-baseline justify-between gap-4 py-2.5'
  return (
    <aside className="card p-5 text-[13.5px] self-start">
      <dl className="divide-y divide-line">
        <div className={row}>
          <dt className="text-muted">Categoria</dt>
          <dd><Link to={`/algoritmos#${category.id}`} className="text-ink hover:text-accent">{category.title}</Link></dd>
        </div>
        <div className={row}>
          <dt className="text-muted">Nível</dt>
          <dd><DifficultyBadge level={algorithm.difficulty} className="!text-[13.5px] !text-ink" /></dd>
        </div>
        {Object.entries(algorithm.facts ?? {}).map(([label, value]) => (
          <div key={label} className={row}>
            <dt className="text-muted shrink-0">{label}</dt>
            <dd className="text-ink text-right">{value}</dd>
          </div>
        ))}
      </dl>
      {algorithm.operations ? (
        <dl className="mt-4 rounded-xl bg-subtle px-3 py-1 divide-y divide-line">
          {algorithm.operations.map(([op, cost]) => (
            <div key={op} className="flex items-baseline justify-between gap-3 py-2">
              <dt className="text-[12.5px] text-muted">{op}</dt>
              <dd className="font-mono text-[13px] text-ink whitespace-nowrap">{cost}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <dl className="mt-4 grid grid-cols-2 gap-2">
          {complexityLabels.map(([key, label]) => (
            <div key={key} className="rounded-xl bg-subtle px-3 py-2.5">
              <dt className="text-[11.5px] text-muted">{label}</dt>
              <dd className="mt-0.5 font-mono text-[13px] text-ink">{algorithm.complexity[key]}</dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  )
}

function Citation({ algorithm }) {
  const { pathname } = useLocation()
  const [copied, setCopied] = useState(false)
  const text = `${SITE.name.toUpperCase()}. ${algorithm.name}. ${SITE.name}: ${SITE.tagline.toLowerCase()}, ${new Date().getFullYear()}. Disponível em: ${window.location.origin}${pathname}. Acesso em: ${abntDate(new Date())}.`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* área de transferência indisponível */ }
  }

  return (
    <div className="rounded-2xl border border-line p-6">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h2 className="text-sm font-medium text-ink">Como citar este artigo <span className="text-faint font-normal">· ABNT</span></h2>
        <button onClick={copy} className="btn-ghost !h-8 !px-3 text-xs">{copied ? 'Copiado ✓' : 'Copiar'}</button>
      </div>
      <p className="font-mono text-[12.5px] leading-relaxed text-muted break-words">{text}</p>
    </div>
  )
}

function Article({ algorithm }) {
  usePageTitle(algorithm.name)
  const category = getCategory(algorithm.category)
  const index = algorithms.findIndex(a => a.id === algorithm.id)
  const prev = algorithms[index - 1]
  const next = algorithms[index + 1]
  const Visualizer = getVisualizer(algorithm.id)

  const sections = [
    ...(Visualizer ? [['visualizacao', 'Visualização']] : []),
    ['como-funciona', 'Como funciona'],
    ['implementacao', 'Implementação'],
    ['onde-e-usado', 'Onde é usado'],
    ['mundo-real', 'Aplicações no mundo real'],
    ['curiosidades', 'Notas e curiosidades'],
  ]
  const number = id => sections.findIndex(([sid]) => sid === id) + 1

  // Destaca no sumário a seção que está sendo lida.
  const [activeId, setActiveId] = useState(sections[0][0])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActiveId(visible[0].target.id)
    }, { rootMargin: '-80px 0px -65% 0px' })
    sections.forEach(([sid]) => {
      const el = document.getElementById(sid)
      if (el) observer.observe(el)
    })
    // Links com âncora (ex.: #visualizacao) chegam antes do conteúdo: rola de novo quando ele aparece.
    const target = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
    if (target) target.scrollIntoView()
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)] animate-page-in">
      {/* Sumário */}
      <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start space-y-10 text-[13.5px]">
        <nav aria-label="Nesta página">
          <h2 className="kicker mb-3">Nesta página</h2>
          <ol className="space-y-0.5">
            {sections.map(([sid, label]) => (
              <li key={sid}>
                <a
                  href={`#${sid}`}
                  className={`block px-3 py-1.5 rounded-lg ${activeId === sid ? 'bg-subtle text-ink font-medium' : 'text-muted hover:text-ink'}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <nav aria-label={`Outros artigos de ${category.title}`}>
          <h2 className="kicker mb-3">{category.title}</h2>
          <ul className="space-y-0.5 max-h-[45vh] overflow-y-auto pr-1">
            {category.items.map(a => (
              <li key={a.id}>
                <Link
                  onMouseEnter={() => preloadAlgorithm(a.id)} to={`/algoritmos/${a.id}`}
                  aria-current={a.id === algorithm.id ? 'page' : undefined}
                  className={`block px-3 py-1.5 rounded-lg ${a.id === algorithm.id ? 'text-accent font-medium' : 'text-muted hover:text-ink'}`}
                >
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <article className="min-w-0">
        <nav className="text-[13px] text-faint mb-8" aria-label="Trilha">
          <Link to="/" className="hover:text-ink">Início</Link>
          <span className="mx-2">/</span>
          <Link to="/algoritmos" className="hover:text-ink">Biblioteca</Link>
          <span className="mx-2">/</span>
          <Link to={`/algoritmos#${category.id}`} className="text-muted hover:text-ink">{category.title}</Link>
        </nav>

        {/* Introdução + quadro-resumo */}
        <header className="grid gap-10 grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <h1 className="title text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.04em]">{algorithm.name}</h1>
            <p className="mt-4 font-display italic text-2xl leading-snug text-muted">{algorithm.summary}</p>
            <p className="mt-7 prose-body">{algorithm.description}</p>

            {/* Sumário compacto para telas menores */}
            <details className="lg:hidden mt-8 card">
              <summary className="px-5 py-3.5 text-sm font-medium cursor-pointer">Nesta página</summary>
              <ol className="px-5 pb-4 space-y-2 text-sm">
                {sections.map(([sid, label], i) => (
                  <li key={sid}><a href={`#${sid}`} className="text-muted hover:text-ink"><span className="font-mono text-xs text-faint mr-2">{i + 1}</span>{label}</a></li>
                ))}
              </ol>
            </details>
          </div>
          <Infobox algorithm={algorithm} category={category} />
        </header>

        <div className="mt-16 space-y-16 max-w-4xl">
          {Visualizer && (
            <Section id="visualizacao" number={number('visualizacao')} title="Visualização">
              <Suspense fallback={<Placeholder height="h-[420px]" />}>
                <Visualizer algorithm={algorithm} />
              </Suspense>
            </Section>
          )}

          <Section id="como-funciona" number={number('como-funciona')} title="Como funciona">
            <ol className="relative space-y-5 before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-px before:bg-line">
              {algorithm.steps.map((step, i) => (
                <li key={i} className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-4">
                  <span className="w-[27px] h-[27px] rounded-full bg-surface border border-line flex items-center justify-center text-xs font-medium text-ink">{i + 1}</span>
                  <p className="prose-body pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="implementacao" number={number('implementacao')} title="Implementação">
            <CodeBlock code={algorithm.code} />
            <p className="mt-3 text-xs text-faint">A linguagem escolhida fica salva e é usada em todos os artigos.</p>
          </Section>

          <Section id="onde-e-usado" number={number('onde-e-usado')} title="Onde é usado">
            <ul className="flex flex-wrap gap-2">
              {algorithm.usedIn.map(item => (
                <li key={item} className="px-3.5 h-9 inline-flex items-center rounded-full border border-line bg-surface text-sm text-ink/85">
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="mundo-real" number={number('mundo-real')} title="Aplicações no mundo real">
            <div className="grid gap-4 sm:grid-cols-2">
              {algorithm.realWorld.map(({ title, text }, i) => (
                <div key={title} className={`card p-6 ${algorithm.realWorld.length % 2 && i === algorithm.realWorld.length - 1 ? 'sm:col-span-2' : ''}`}>
                  <h3 className="title text-base">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="curiosidades" number={number('curiosidades')} title="Notas e curiosidades">
            <ol className="divide-y divide-line border-y border-line">
              {algorithm.curiosities.map((c, i) => (
                <li key={i} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 py-5">
                  <span className="font-display italic text-2xl leading-none text-faint">{i + 1}</span>
                  <p className="prose-body">{c}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Citation algorithm={algorithm} />

          {/* Navegação entre artigos */}
          <nav className="grid sm:grid-cols-2 gap-4" aria-label="Artigos vizinhos">
            {prev ? (
              <Link to={`/algoritmos/${prev.id}`} className="group card card-hover p-5">
                <span className="text-xs text-faint">← Anterior</span>
                <span className="block mt-1 title text-lg group-hover:text-accent">{prev.name}</span>
              </Link>
            ) : <span className="hidden sm:block" />}
            {next && (
              <Link to={`/algoritmos/${next.id}`} className="group card card-hover p-5 sm:text-right">
                <span className="text-xs text-faint">Próximo →</span>
                <span className="block mt-1 title text-lg group-hover:text-accent">{next.name}</span>
              </Link>
            )}
          </nav>
        </div>
      </article>
    </div>
  )
}

function Placeholder({ height = 'h-40' }) {
  return <div className={`${height} rounded-2xl bg-subtle/70 animate-pulse`} />
}

// Exibido enquanto o conteúdo completo do artigo é baixado: usa só os campos do índice leve.
function ArticleSkeleton({ algorithm, error, onRetry }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-12 grid-cols-[minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)]">
      <div className="hidden lg:block" />
      <article className="min-w-0" aria-busy={!error}>
        <div className="h-4 mb-8" />
        <h1 className="title text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.04em]">{algorithm.name}</h1>
        <p className="mt-4 font-display italic text-2xl leading-snug text-muted">{algorithm.summary}</p>
        <p className="mt-7 prose-body max-w-3xl">{algorithm.description}</p>
        {error ? (
          <div className="mt-12 card p-6 max-w-xl">
            <p className="text-sm text-ink">Não foi possível carregar o restante do artigo.</p>
            <p className="mt-1 text-sm text-muted">Verifique sua conexão — ou o site pode ter sido atualizado agora há pouco.</p>
            <button onClick={onRetry} className="btn-primary mt-4">Tentar de novo</button>
          </div>
        ) : (
          <div className="mt-16 space-y-6 max-w-4xl">
            <Placeholder height="h-[420px]" />
            <Placeholder />
          </div>
        )}
      </article>
    </div>
  )
}

const contentCache = new Map()

export default function AlgorithmPage() {
  const { id } = useParams()
  const algorithm = getAlgorithm(id)
  const [content, setContent] = useState(() => contentCache.get(id) ?? null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!algorithm) return
    if (contentCache.has(id)) { setContent(contentCache.get(id)); return }
    let cancelled = false
    setError(false)
    loadAlgorithmContent(id)
      .then(full => {
        contentCache.set(id, full)
        if (!cancelled) setContent(full)
      })
      .catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [id, algorithm, attempt])

  // Adianta o download dos artigos vizinhos.
  useEffect(() => {
    const i = algorithms.findIndex(a => a.id === id)
    ;[algorithms[i - 1], algorithms[i + 1]].forEach(a => a && preloadAlgorithm(a.id))
  }, [id])

  if (!algorithm) return <Navigate to="/algoritmos" replace />
  const current = content?.id === id ? content : contentCache.get(id)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {current
          // key: reinicia o estado (sumário ativo, visualizador) ao trocar de artigo
          ? <Article key={id} algorithm={current} />
          : <ArticleSkeleton algorithm={algorithm} error={error} onRetry={() => setAttempt(a => a + 1)} />}
      </main>
      <Footer />
    </div>
  )
}
