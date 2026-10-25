import { Link } from 'react-router-dom'
import { SITE } from '../config/site'
import { categories } from '../data'
import { useI18n } from '../i18n'
import { Logo } from './Navbar'

export default function Footer() {
  const { t, loc } = useI18n()
  return (
    <footer className="mt-auto border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">{t('site.description')}</p>
        </div>
        <div>
          <h2 className="kicker mb-4">{t('footer.categories')}</h2>
          <ul className="space-y-2.5 text-sm">
            {categories.map(c => (
              <li key={c.id}><Link to={`/algoritmos#${c.id}`} className="text-muted hover:text-ink">{loc(c).title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="kicker mb-4">{t('footer.navigation')}</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="text-muted hover:text-ink">{t('footer.home')}</Link></li>
            <li><Link to="/algoritmos" className="text-muted hover:text-ink">{t('footer.library')}</Link></li>
            <li><Link to="/#sobre" className="text-muted hover:text-ink">{t('footer.about')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-line flex flex-col sm:flex-row justify-between gap-2 text-xs text-faint">
        <span>{t('footer.rights', { year: new Date().getFullYear(), name: SITE.name })}</span>
        <span>{t('footer.made')}</span>
      </div>
    </footer>
  )
}
