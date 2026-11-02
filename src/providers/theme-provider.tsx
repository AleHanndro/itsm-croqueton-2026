'use client'

import { createContext, useState, useMemo, useEffect, use, type ReactNode } from 'react'

interface ThemeContextValue {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => void 0
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    window.localStorage.setItem('croqueton-theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('croqueton-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme)
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (theme: string) => setTheme(theme)
    }),
    [theme]
  )
  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme() {
  return use(ThemeContext)
}
