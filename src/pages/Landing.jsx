import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SearchBox from '../components/SearchBox'
import HeroVisual from '../components/HeroVisual'
import DifficultyBadge from '../components/DifficultyBadge'
import { SITE } from '../config/site'
import { usePageTitle } from '../lib/usePageTitle'
import { algorithms, categories, getAlgorithm, getCategory, languages, upcomingCategories } from '../data'

const popular = ['quick-sort', 'merge-sort', 'heap-sort', 'bubble-sort'].map(getAlgorithm).filter(Boolean)

const anatomy = [
  ['Visualização', 'Animação interativa, passo a passo, do algoritmo em execução.'],
  ['Como funciona', 'A ideia central explicada em etapas curtas e objetivas.'],
  ['Implementação', `Código testado em ${languages.map(l => l.label).join(', ')}.`],
  ['Onde é usado', 'Bibliotecas, sistemas e produtos que dependem do algoritmo.'],
  ['Aplicações reais', 'Cenários concretos em que o algoritmo resolve um problema.'],
  ['Notas e curiosidades', 'Contexto histórico, autores e fatos pouco conhecidos.'],
]

// Escolhas determinísticas por dia, para que todos vejam o mesmo destaque.
const day = Math.floor(Date.now() / 86_400_000)
const featured = algorithms[day % algorithms.length]
const trivia = algorithms[(day * 7 + 3) % algorithms.length]
const triviaText = trivia.curiosities[day % trivia.curiosities.length]

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="max-w-2xl">
      <p className="kicker">{eyebrow}</p>
      <h2 className="mt-2 title text-3xl sm:text-[40px] leading-[1.1]">{title}</h2>
      {children && <p className="mt-4 text-[17px] leading-relaxed text-muted">{children}</p>}
    </div>
  )
}

export default function Landing() {
  usePageTitle(null)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* APRESENTAÇÃO */}
        <section className="relative overflow-hidden border-b border-line">
          <div className="absolute inset-0 bg-glow pointer-events-none" />
          <div className="absolute inset-0 bg-grid pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div className="animate-page-in">
              <span className="eyebrow">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Enciclopédia aberta e gratuita
              </span>
              <h1 className="mt-6 title text-[44px] sm:text-6xl lg:text-[68px] leading-[1.02] tracking-[-0.04em]">
                A enciclopédia visual dos <span className="font-display italic font-normal tracking-[-0.01em]">algoritmos</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Veja cada algoritmo em ação, entenda como funciona, onde é usado e como implementá-lo
                na linguagem que você preferir.
              </p>

              <div className="mt-9 max-w-xl">
                <SearchBox size="lg" />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-faint mr-1">Populares</span>
                {popular.map(a => (
                  <Link key={a.id} to={`/algoritmos/${a.id}`} className="px-3 h-7 inline-flex items-center rounded-full border border-line bg-surface text-muted hover:text-ink hover:border-ink/20">
                    {a.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="animate-page-in [animation-delay:120ms]">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* NÚMEROS */}
        <section className="border-b border-line">
          <dl className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4">
            {[
              [algorithms.length, 'algoritmos documentados'],
              [categories.length + upcomingCategories.length, 'categorias planejadas'],
              [languages.length, 'linguagens de programação'],
              ['0', 'anúncios ou paywall'],
            ].map(([v, l], i) => (
              <div key={l} className={`py-8 ${i % 2 ? 'pl-6 border-l border-line' : ''} ${i === 2 ? 'lg:pl-6 lg:border-l' : ''} ${i >= 2 ? 'border-t lg:border-t-0 border-line' : ''}`}>
                <dd className="title text-3xl tabular-nums">{v}</dd>
                <dt className="mt-1 text-sm text-muted">{l}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* DESTAQUE + VOCÊ SABIA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <Link to={`/algoritmos/${featured.id}`} className="group card card-hover p-7 sm:p-9 flex flex-col">
            <p className="kicker">Artigo em destaque</p>
            <h2 className="mt-3 title text-3xl group-hover:text-accent">{featured.name}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
              <span>{getCategory(featured.category).title}</span>
              <span className="text-faint">·</span>
              <DifficultyBadge level={featured.difficulty} className="!text-[13px]" />
              <span className="text-faint">·</span>
              <span className="font-mono text-xs">{featured.complexity.average}</span>
            </div>
            <p className="mt-5 prose-body line-clamp-4">{featured.description}</p>
            <span className="mt-auto pt-7 text-sm font-medium text-ink inline-flex items-center gap-1.5">
              Ler o artigo <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>

          <aside className="rounded-2xl bg-ink text-paper p-7 sm:p-9 flex flex-col">
            <p className="text-[13px] font-medium text-paper/50">Você sabia?</p>
            <p className="mt-4 font-display text-2xl sm:text-[28px] leading-snug flex-1">{triviaText}</p>
            <Link to={`/algoritmos/${trivia.id}`} className="mt-8 text-sm text-paper/70 hover:text-paper">
              Do artigo <span className="underline underline-offset-4 decoration-paper/30">{trivia.name}</span> →
            </Link>
          </aside>
        </section>

        {/* ÍNDICE POR CATEGORIA */}
        <section id="categorias" className="scroll-mt-20 border-t border-line bg-subtle/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <SectionHeading eyebrow="Índice" title="Explore por categoria" />
              <Link to="/algoritmos" className="btn-ghost shrink-0">Ver índice completo →</Link>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, i) => (
                <div key={cat.id} className="card p-7 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-xs text-muted">{cat.items.length} artigos</span>
                  </div>
                  <h3 className="mt-4 title text-xl">
                    <Link to={`/algoritmos#${cat.id}`} className="hover:text-accent">{cat.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{cat.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {cat.items.slice(0, 6).map(a => (
                      <li key={a.id}>
                        <Link to={`/algoritmos/${a.id}`} className="px-2.5 h-7 inline-flex items-center rounded-full bg-subtle text-[13px] text-muted hover:text-ink hover:bg-line/60">
                          {a.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="rounded-2xl border border-dashed border-line p-7 md:col-span-2 lg:col-span-2">
                <span className="font-mono text-xs text-faint">Em preparação</span>
                <p className="mt-4 text-sm text-muted">Novas categorias sendo escritas e revisadas:</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {upcomingCategories.map(c => (
                    <li key={c} className="px-2.5 h-7 inline-flex items-center rounded-full border border-line text-[13px] text-faint">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ANATOMIA DE UM ARTIGO */}
        <section className="border-t border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <SectionHeading eyebrow="Método" title="Todo artigo segue a mesma estrutura">
              Você sempre sabe onde encontrar cada informação — da intuição ao código.
            </SectionHeading>
            <ol className="mt-12 grid gap-px bg-line border border-line rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
              {anatomy.map(([title, text], i) => (
                <li key={title} className="bg-surface p-7">
                  <span className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-subtle font-mono text-xs text-muted">{i + 1}</span>
                  <h3 className="mt-4 title text-base">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SOBRE */}
        <section id="sobre" className="scroll-mt-20 border-t border-line">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
            <p className="kicker">Sobre o projeto</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-[1.1] text-ink">
              Conhecimento aberto, <span className="italic">em português.</span>
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-muted">
              O {SITE.name} explica algoritmos com clareza: dos métodos clássicos do primeiro semestre aos que
              sustentam criptografia, compressão e aprendizado de máquina. Cada artigo combina explicação,
              visualização e código testado — e liga a teoria ao mundo real.
            </p>
            <Link to="/algoritmos" className="btn-primary mt-9">Explorar a biblioteca</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
