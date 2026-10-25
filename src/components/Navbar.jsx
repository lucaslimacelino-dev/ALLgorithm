import { Link, NavLink, useLocation } from 'react-router-dom'
import { SITE } from '../config/site'
import { useI18n } from '../i18n'
import { locales } from '../i18n/messages'
import { useTheme } from '../lib/useTheme'
import SearchBox from './SearchBox'

// Símbolo ∀ ("para todo"), um aceno ao "ALL" do nome.
export function LogoMark({ className = 'w-[22px] h-[22px]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 4.5 L12 19.5 L19 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.9 10.75 H16.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function Logo() {
  const { t } = useI18n()
  return (
    <Link to="/" className="group flex items-center gap-2 shrink-0" aria-label={t('logo.home', { name: SITE.name })}>
      <span className="text-ink group-hover:text-accent">
        <LogoMark />
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-ink">
        {SITE.namePrefix}<span className="font-normal text-ink/70">{SITE.nameSuffix}</span>
      </span>
    </Link>
  )
}

function ThemeToggle() {
  const { dark, toggle } = useTheme()
  const { t } = useI18n()
  return (
    <button
      onClick={toggle}
      aria-label={dark ? t('theme.toLight') : t('theme.toDark')}
      title={dark ? t('theme.light') : t('theme.dark')}
      className="w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-subtle"
    >
      {dark ? (
        <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
        </svg>
      ) : (
        <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}

function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n()
  return (
    <div className="inline-flex p-0.5 rounded-full border border-line" role="group" aria-label={t('nav.language')}>
      {locales.map(l => (
        <button
          key={l.id}
          onClick={() => setLocale(l.id)}
          aria-pressed={locale === l.id}
          title={l.label}
          lang={l.htmlLang}
          className={`h-7 px-2.5 rounded-full text-[11.5px] font-semibold tracking-wide ${locale === l.id ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
        >
          {l.short}
        </button>
      ))}
    </div>
  )
}

const navItem = active =>
  `px-3.5 h-8 inline-flex items-center rounded-full text-[13.5px] ${active ? 'bg-subtle text-ink font-medium' : 'text-muted hover:text-ink'}`

export default function Navbar() {
  const { pathname, hash } = useLocation()
  const { t } = useI18n()
  const isHome = pathname === '/'

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-4 sm:gap-6">
        <Logo />

        {!isHome && (
          <div className="hidden md:block flex-1 max-w-sm">
            <SearchBox size="sm" shortcut placeholder={t('nav.search')} />
          </div>
        )}

        <nav className="ml-auto flex items-center gap-1">
          <NavLink to="/algoritmos" className={({ isActive }) => navItem(isActive)}>{t('nav.library')}</NavLink>
          <Link to="/#categorias" className={`hidden lg:inline-flex ${navItem(isHome && hash === '#categorias')}`}>{t('nav.categories')}</Link>
          <Link to="/#sobre" className={`hidden lg:inline-flex ${navItem(isHome && hash === '#sobre')}`}>{t('nav.about')}</Link>
          <span className="w-px h-4 bg-line mx-1.5" />
          <LanguageSwitch />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
