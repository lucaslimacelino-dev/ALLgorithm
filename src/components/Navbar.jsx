import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SITE } from '../config/site'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
        <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
          <path d="M2 11 L5 7.5 L8 9.5 L12 3" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="font-display text-base font-bold tracking-tight">
        <span className="text-brand-400">{SITE.namePrefix}</span>
        <span className="text-zinc-100">{SITE.nameSuffix}</span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/60'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-5">
          <NavLink
            to="/algoritmos"
            className={({ isActive }) =>
              `text-sm font-body transition-colors ${isActive ? 'text-brand-400' : 'text-zinc-400 hover:text-zinc-100'}`}
          >
            Biblioteca
          </NavLink>
          {isHome && (
            <Link
              to="/algoritmos"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-400 text-zinc-950 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Explorar
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
