import { Link } from 'react-router-dom'
import { SITE } from '../config/site'
import { categories } from '../data'
import { Logo } from './Navbar'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">{SITE.description}</p>
        </div>
        <div>
          <h2 className="kicker mb-4">Categorias</h2>
          <ul className="space-y-2.5 text-sm">
            {categories.map(c => (
              <li key={c.id}><Link to={`/algoritmos#${c.id}`} className="text-muted hover:text-ink">{c.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="kicker mb-4">Navegação</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="text-muted hover:text-ink">Início</Link></li>
            <li><Link to="/algoritmos" className="text-muted hover:text-ink">Biblioteca</Link></li>
            <li><Link to="/#sobre" className="text-muted hover:text-ink">Sobre o projeto</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-line flex flex-col sm:flex-row justify-between gap-2 text-xs text-faint">
        <span>© {new Date().getFullYear()} {SITE.name}. Conteúdo livre para fins educacionais.</span>
        <span>Feito no Brasil</span>
      </div>
    </footer>
  )
}
