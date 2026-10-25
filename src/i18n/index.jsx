import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { locales, messages } from './messages'

const STORAGE_KEY = 'allgorithm:locale'
const I18nContext = createContext(null)

function initialLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (locales.some(l => l.id === stored)) return stored
  } catch { /* armazenamento indisponível */ }
  return typeof navigator !== 'undefined' && !navigator.language?.toLowerCase().startsWith('pt') ? 'en' : 'pt'
}

const interpolate = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => (vars?.[k] ?? `{${k}}`))

// Junta a tradução (campo "en" dos dados) por cima dos campos originais em português.
export function localize(item, locale) {
  if (!item || locale === 'pt' || !item[locale]) return item
  return { ...item, ...item[locale] }
}

// Um artigo está traduzido quando o corpo dele (os passos) existe no idioma.
export const isFullyTranslated = (item, locale) => locale === 'pt' || !!item?.[locale]?.steps

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(initialLocale)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, locale) } catch { /* armazenamento indisponível */ }
    document.documentElement.lang = locales.find(l => l.id === locale).htmlLang
  }, [locale])

  const t = useCallback((key, vars) => {
    const text = messages[locale][key] ?? messages.pt[key] ?? key
    return interpolate(text, vars)
  }, [locale])

  const loc = useCallback(item => localize(item, locale), [locale])

  const value = useMemo(() => ({ locale, setLocale, t, loc }), [locale, t, loc])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
