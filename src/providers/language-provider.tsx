'use client'

import { createContext, use, useEffect, useMemo, useState, type ReactNode } from 'react'

interface LanguageContextValue {
  language: string
  setLanguage: (language: string) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'es',
  setLanguage: () => void 0
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('croqueton-language')
    if (savedLanguage === 'en' || savedLanguage === 'maya' || savedLanguage === 'es')
      setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('croqueton-language', language)
    document.documentElement.lang = language === 'maya' ? 'yua' : language
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage: (language: string) => void 0 }),
    [language]
  )

  return <LanguageContext value={value}>{children}</LanguageContext>
}

export function useLanguage() {
  const context = use(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
