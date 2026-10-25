import { SITE } from '../config/site'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 py-8 px-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-display text-sm font-bold">
          <span className="text-brand-400">{SITE.namePrefix}</span>
          <span className="text-zinc-500">{SITE.nameSuffix}</span>
        </span>
        <p className="text-xs text-zinc-600 font-body">
          © {new Date().getFullYear()} {SITE.name} · {SITE.tagline} · Gratuito 🇧🇷
        </p>
      </div>
    </footer>
  )
}
