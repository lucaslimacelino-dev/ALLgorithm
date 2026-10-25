import { useState } from 'react'

const STORAGE_KEY = 'allgorithm:theme'

// O tema inicial é aplicado por um script em index.html, antes da renderização.
export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light') } catch { /* armazenamento indisponível */ }
    setDark(next)
  }

  return { dark, toggle }
}
