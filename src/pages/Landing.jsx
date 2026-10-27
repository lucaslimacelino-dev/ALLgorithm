import { Suspense, lazy, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SearchBox from '../components/SearchBox'
import CategoryIcon from '../components/CategoryIcon'
import DifficultyBadge from '../components/DifficultyBadge'
import { SITE } from '../config/site'
import { usePageTitle } from '../lib/usePageTitle'
import { useI18n } from '../i18n'
import { upcomingNames } from '../i18n/messages'
import { algorithms, categories, getAlgorithm, getCategory, languages, loadAlgorithmContent, mainComplexity, preloadAlgorithm, upcomingCategories } from '../data'

// As animações ficam em pedaços separados do bundle e chegam logo depois da página.
const Showcase = lazy(() => import('../components/showcase/Showcase'))
const Gallery = lazy(() => import('../components/showcase/Gallery'))

const popular = ['quick-sort', 'merge-sort', 'heap-sort', 'bubble-sort'].map(getAlgorithm).filter(Boolean)

// Escolhas determinísticas por dia, para que todos vejam o mesmo destaque.
const day = Math.floor(Date.now() / 86_400_000)
const featured = algorithms[day % algorithms.length]

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
  const { t, loc, locale } = useI18n()
  const languageList = languages.map(l => l.label).join(', ')
  const anatomy = [1, 2, 3, 4, 5, 6].map(i => t(`landing.anatomy.${i}`, { languages: languageList }).split('|'))

  // "Você sabia?" só usa curiosidades já escritas no idioma atual.
  const triviaPool = algorithms.filter(a => locale === 'pt' || a[locale]?.hasCuriosities)
  const trivia = triviaPool.length ? triviaPool[(day * 7 + 3) % triviaPool.length] : null

  // Descrição do destaque e curiosidade vêm do conteúdo completo, baixado depois da página.
  const [full, setFull] = useState({})
  useEffect(() => {
    for (const a of [featured, trivia]) {
      if (a && !full[a.id]) loadAlgorithmContent(a.id).then(c => setFull(m => ({ ...m, [c.id]: c }))).catch(() => {})
    }
  }, [trivia?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const featuredFull = full[featured.id]
  const featuredText = featuredFull && (locale === 'pt' || featuredFull[locale]?.description) ? loc(featuredFull).description : loc(featured).summary
  const triviaFacts = trivia && full[trivia.id] && loc(full[trivia.id]).curiosities
  const triviaText = triviaFacts ? triviaFacts[day % triviaFacts.length] : null

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
              <h1 className="title text-[44px] sm:text-6xl lg:text-[68px] leading-[1.02] tracking-[-0.04em]">
                {t('landing.title')} <span className="font-display italic font-normal tracking-[-0.01em]">{t('landing.titleEm')}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {t('landing.subtitle')}
              </p>

              <div className="mt-9 max-w-xl">
                <SearchBox size="lg" />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-faint mr-1">{t('landing.popular')}</span>
                {popular.map(a => (
                  <Link key={a.id} onMouseEnter={() => preloadAlgorithm(a.id)} to={`/algoritmos/${a.id}`} className="px-3 h-7 inline-flex items-center rounded-full border border-line bg-surface text-muted hover:text-ink hover:border-ink/20">
                    {loc(a).name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="animate-page-in [animation-delay:120ms]">
              <Suspense fallback={<div className="card h-[22.5rem] sm:h-[25rem]" />}>
                <Showcase />
              </Suspense>
            </div>
          </div>
        </section>

        {/* NÚMEROS */}
        <section className="border-b border-line">
          <dl className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4">
            {[
              [algorithms.length, t('landing.stat.algorithms')],
              [categories.length + upcomingCategories.length, t('landing.stat.categories')],
              [languages.length, t('landing.stat.languages')],
              ['0', t('landing.stat.ads')],
            ].map(([v, l], i) => (
              <div key={l} className={`py-8 ${i % 2 ? 'pl-6 border-l border-line' : ''} ${i === 2 ? 'lg:pl-6 lg:border-l' : ''} ${i >= 2 ? 'border-t lg:border-t-0 border-line' : ''}`}>
                <dd className="title text-3xl tabular-nums">{v}</dd>
                <dt className="mt-1 text-sm text-muted">{l}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* DESTAQUE + VOCÊ SABIA */}
        <section className={`max-w-7xl mx-auto px-4 sm:px-6 py-20 grid gap-5 ${trivia ? 'lg:grid-cols-[1.5fr_1fr]' : ''}`}>
          <Link to={`/algoritmos/${featured.id}`} className="group card card-hover p-7 sm:p-9 flex flex-col">
            <p className="kicker">{t('landing.featured')}</p>
            <h2 className="mt-3 title text-3xl group-hover:text-accent">{loc(featured).name}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
              <span>{loc(getCategory(featured.category)).title}</span>
              <span className="text-faint">·</span>
              <DifficultyBadge level={featured.difficulty} className="!text-[13px]" />
              <span className="text-faint">·</span>
              <span className="font-mono text-xs">{mainComplexity(featured)}</span>
            </div>
            <p className="mt-5 prose-body line-clamp-4">{featuredText}</p>
            <span className="mt-auto pt-7 text-sm font-medium text-ink inline-flex items-center gap-1.5">
              {t('landing.read')} <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>

          {trivia && (
            <aside className="rounded-2xl bg-ink text-paper p-7 sm:p-9 flex flex-col">
              <p className="text-[13px] font-medium text-paper/50">{t('landing.didYouKnow')}</p>
              {triviaText ? (
                <p className="mt-4 font-display text-2xl sm:text-[28px] leading-snug flex-1">{triviaText}</p>
              ) : (
                <div className="mt-5 flex-1 space-y-3" aria-hidden="true">
                  {[100, 92, 70].map(w => <div key={w} className="h-5 rounded bg-paper/10 animate-pulse" style={{ width: w + '%' }} />)}
                </div>
              )}
              <Link to={`/algoritmos/${trivia.id}`} className="mt-8 text-sm text-paper/70 hover:text-paper">
                {t('landing.fromArticle')} <span className="underline underline-offset-4 decoration-paper/30">{loc(trivia).name}</span> →
              </Link>
            </aside>
          )}
        </section>

        {/* EM MOVIMENTO */}
        <section className="border-t border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <SectionHeading eyebrow={t('landing.motion')} title={t('landing.motionTitle')}>
              {t('landing.motionText')}
            </SectionHeading>
            <Suspense fallback={<div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="card h-80" />)}</div>}>
              <Gallery />
            </Suspense>
          </div>
        </section>

        {/* ÍNDICE POR CATEGORIA */}
        <section id="categorias" className="scroll-mt-20 border-t border-line bg-subtle/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <SectionHeading eyebrow={t('landing.index')} title={t('landing.explore')} />
              <Link to="/algoritmos" className="btn-ghost shrink-0">{t('landing.fullIndex')}</Link>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, i) => (
                <Link key={cat.id} to={`/categorias/${cat.id}`} className="group card card-hover p-7 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-3">
                      <span className="w-10 h-10 grid place-items-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                        <CategoryIcon id={cat.id} className="w-5 h-5" />
                      </span>
                      <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
                    </span>
                    <span className="text-xs text-muted">{t('landing.articles', { n: cat.items.length })}</span>
                  </div>
                  <h3 className="mt-4 title text-xl group-hover:text-accent">{loc(cat).title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{loc(cat).description}</p>
                  {/* Só uma prévia: os algoritmos são escolhidos na página da categoria. */}
                  <p className="mt-5 text-[13px] leading-relaxed text-faint line-clamp-2">
                    {cat.items.slice(0, 5).map(a => loc(a).name).join(' · ')}{cat.items.length > 5 ? ` · +${cat.items.length - 5}` : ''}
                  </p>
                  <span className="mt-auto pt-5 text-sm font-medium text-ink inline-flex items-center gap-1.5">
                    {t('category.explore')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              ))}

              {upcomingCategories.length > 0 && <div className="rounded-2xl border border-dashed border-line p-7 md:col-span-2 lg:col-span-2">
                <span className="font-mono text-xs text-faint">{t('landing.upcoming')}</span>
                <p className="mt-4 text-sm text-muted">{t('landing.upcomingText')}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {upcomingCategories.map(c => (
                    <li key={c} className="px-2.5 h-7 inline-flex items-center rounded-full border border-line text-[13px] text-faint">{locale === 'en' ? upcomingNames[c] ?? c : c}</li>
                  ))}
                </ul>
              </div>}
            </div>
          </div>
        </section>

        {/* ANATOMIA DE UM ARTIGO */}
        <section className="border-t border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <SectionHeading eyebrow={t('landing.method')} title={t('landing.methodTitle')}>
              {t('landing.methodText')}
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
            <p className="kicker">{t('landing.about')}</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-[1.1] text-ink">
              {t('landing.aboutTitle')} <span className="italic">{t('landing.aboutTitleEm')}</span>
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-muted">
              {t('landing.aboutText', { name: SITE.name })}
            </p>
            <Link to="/algoritmos" className="btn-primary mt-9">{t('landing.exploreLibrary')}</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
