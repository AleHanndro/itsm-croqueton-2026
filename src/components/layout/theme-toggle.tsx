'use client'

import { Moon } from '@/assets/icons/moon'
import { Sun } from '@/assets/icons/sun'
import { useLanguage } from '@/providers/language-provider'
import { useTheme } from '@/providers/theme-provider'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { language } = useLanguage()
  const isDark = theme === 'dark'
  return (
    <button
      className="theme-toggle fixed right-25 bottom-6.25 z-90 grid h-11.5 w-13.5 place-items-center rounded-pill border-3 border-stroke bg-surface-floating text-fg-control shadow-chip [transition:transform_0.2s_ease] hover:transform-[translateY(-2px)_rotate(-2deg)] in-data-[theme='dark']:shadow-chip! phone:right-22 phone:bottom-3.5 phone:h-10.5 phone:w-12 [&_svg]:size-5.75"
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={
        isDark
          ? language === 'en'
            ? 'Switch to light mode'
            : 'Cambiar a modo claro'
          : language === 'en'
            ? 'Switch to dark mode'
            : 'Cambiar a modo oscuro'
      }
      aria-pressed={isDark}
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}

export { ThemeToggle }
