'use client'

import { createContext, use, useEffect, useMemo, useState, type ReactNode } from 'react'

// `Yua` is the ISO code for Maya
export type Language = 'en' | 'es' | 'yua'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'es',
  setLanguage: () => void 0
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('croqueton-language')
    if (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'yua')
      setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('croqueton-language', language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage: (language) => setLanguage(language) }),
    [language]
  )

  return <LanguageContext value={value}>{children}</LanguageContext>
}

export function useLanguage() {
  const context = use(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
