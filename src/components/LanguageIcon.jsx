// Logotipos simplificados das linguagens (SVG inline, cores oficiais), usados nas abas de código.
const PYTHON_HALF = 'M11.9 2C7.3 2 7.6 4 7.6 4v2.1H12v.6H5.8S2.8 6.4 2.8 11.1s2.6 4.5 2.6 4.5H7v-2.2s-.1-2.6 2.6-2.6H14s2.5 0 2.5-2.4V4.4S16.9 2 11.9 2zM9.5 3.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z'

const icons = {
  python: (
    <>
      <path d={PYTHON_HALF} fill="#3776AB" />
      <path d={PYTHON_HALF} fill="#FFD43B" transform="rotate(180 12 12)" />
    </>
  ),
  javascript: (
    <>
      <rect width="24" height="24" rx="3" fill="#F7DF1E" />
      <text x="21" y="20.5" textAnchor="end" fontSize="11" fontWeight="700" fontFamily="Geist, system-ui, sans-serif" fill="#111">JS</text>
    </>
  ),
  java: (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M10.5 2c1.8 1.8-1.8 2.7 0 5.2M13.8 3.4c1.3 1.3-1.3 2.1 0 3.8" stroke="#E76F00" />
      <path d="M5 10h11.5v3.5a5 5 0 0 1-5 5h-1.5a4.5 4.5 0 0 1-4.5-4.5z" stroke="#5382A1" />
      <path d="M16.5 11.5h1.3a2 2 0 0 1 0 4h-1.8M3.5 21.5h15" stroke="#5382A1" />
    </g>
  ),
  cpp: (
    <>
      <path d="M12 1.5l9.5 5.5v10L12 22.5 2.5 17V7z" fill="#00599C" />
      <text x="12" y="15.6" textAnchor="middle" fontSize="9.5" letterSpacing="-0.6" fontWeight="800" fontFamily="Geist, system-ui, sans-serif" fill="#fff">C++</text>
    </>
  ),
}

export default function LanguageIcon({ id, className = 'w-[18px] h-[18px]' }) {
  if (!icons[id]) return null
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true">{icons[id]}</svg>
}
