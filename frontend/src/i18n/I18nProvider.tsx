import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Language } from './translations'
import { translations } from './translations'

const LANGUAGE_STORAGE_KEY = 'dalil-sante-language'

interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function resolveTranslation(language: Language, key: string): string | undefined {
  return key.split('.').reduce<unknown>((value, part) => {
    if (value && typeof value === 'object' && part in value) return (value as Record<string, unknown>)[part]
    return undefined
  }, translations[language]) as string | undefined
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return stored === 'ar' ? 'ar' : 'fr'
  })

  const setLanguage = (nextLanguage: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    setLanguageState(nextLanguage)
  }

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string) => resolveTranslation(language, key) ?? key
    return { language, setLanguage, t }
  }, [language])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside I18nProvider.')
  return context
}
