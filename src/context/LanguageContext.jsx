import { createContext, useContext, useEffect, useState } from 'react'
import { languages } from '../data'

const STORAGE_KEY = 'allgorithm:language'
const LanguageContext = createContext(null)

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return languages.some(l => l.id === value) ? value : null
  } catch {
    return null
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => readStored() ?? languages[0].id)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, language) } catch { /* armazenamento indisponível */ }
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
