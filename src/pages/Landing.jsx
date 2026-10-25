import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { SITE } from '../config/site'
import { algorithms, categories, languages } from '../data'

const features = [
  { icon: '▶', title: 'Visualização', text: 'Veja o algoritmo funcionando passo a passo, com animações interativas.' },
  { icon: '</>', title: 'Código na sua linguagem', text: `Implementações em ${languages.map(l => l.label).join(', ')}.` },
  { icon: '◎', title: 'Onde é usado', text: 'Em quais sistemas, bibliotecas e produtos cada algoritmo aparece.' },
  { icon: '⌂', title: 'Cenários reais', text: 'Problemas concretos do dia a dia resolvidos por cada algoritmo.' },
  { icon: '✦', title: 'Curiosidades', text: 'A história por trás de cada algoritmo e fatos que você não esperava.' },
  { icon: '⇡', title: 'Do simples ao avançado', text: 'Do Bubble Sort a algoritmos de criptografia e aprendizado de máquina.' },
]

export default function Landing() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = e => {
    e.preventDefault()
    navigate(query.trim() ? `/algoritmos?q=${encodeURIComponent(query.trim())}` : '/algoritmos')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-5 overflow-hidden pt-16">
        <div className="absolute inset-0 dot-bg opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-500/8 blur-[100px] pointer-events-none" />

        <div className="relative animate-fade-up opacity-0 delay-100 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-semibold tracking-widest uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
          100% gratuito
        </div>

        <h1 className="relative animate-fade-up opacity-0 delay-200 font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl">
          A enciclopédia visual dos{' '}
          <span className="text-brand-400">algoritmos</span>
        </h1>

        <p className="relative animate-fade-up opacity-0 delay-300 mt-6 text-zinc-400 text-lg max-w-xl leading-relaxed font-body">
          Explore algoritmos organizados por categoria: veja como funcionam, onde são usados e como implementá-los na linguagem que você preferir.
        </p>

        <form onSubmit={handleSearch} className="relative animate-fade-up opacity-0 delay-400 mt-8 w-full max-w-lg flex gap-2">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar um algoritmo…"
            className="flex-1 min-w-0 px-5 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 focus:border-brand-500 focus:outline-none text-sm font-body text-zinc-100 placeholder:text-zinc-600"
          />
          <button
            type="submit"
            className="shrink-0 px-6 py-3.5 rounded-full bg-brand-500 hover:bg-brand-400 text-zinc-950 font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/20"
          >
            Explorar
          </button>
        </form>

        <div className="relative animate-fade-up opacity-0 delay-500 mt-14 flex flex-wrap justify-center gap-10">
          {[[algorithms.length, 'Algoritmos'], [categories.length, 'Categorias'], [languages.length, 'Linguagens']].map(([v, l]) => (
            <div key={l} className="flex flex-col items-center">
              <span className="font-display text-2xl font-bold text-brand-400">{v}</span>
              <span className="text-xs text-zinc-600 mt-1 font-body">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3 font-body">Categorias</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100">Organizados do básico ao avançado</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/algoritmos#${cat.id}`}
                className="group flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-zinc-100 group-hover:text-brand-400 transition-colors">
                    {cat.title} <span className="text-zinc-600 font-body font-normal">· {cat.items.length}</span>
                  </h3>
                  <p className="text-xs text-zinc-500 font-body mt-1 leading-relaxed">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE TEM EM CADA PÁGINA */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3 font-body">Por que {SITE.name}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100">Tudo sobre cada algoritmo, em um só lugar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-display text-sm mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display text-base font-bold text-zinc-100 mb-1">{f.title}</h3>
                <p className="text-sm text-zinc-400 font-body leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full bg-brand-500/8 blur-[80px] pointer-events-none" />
        <div className="relative max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">Comece a explorar</h2>
          <p className="text-zinc-400 font-body mb-8">Sem cadastro, sem login. Todo o conteúdo é aberto.</p>
          <Link
            to="/algoritmos"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-400 text-zinc-950 font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/20"
          >
            Abrir a biblioteca
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
