'use client'

import { useEffect, useRef, useState } from 'react'

import { ChevronDown } from '@/assets/icons/chevron-down'
import { useLanguage, type Language } from '@/providers/language-provider'

function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const languageLabels: Record<Language, string> = {
    es: 'ES',
    en: 'EN',
    yua: 'YUA'
  }

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  function selectLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage)
    setIsOpen(false)
  }

  return (
    <div
      className="fixed right-5 bottom-6.25 z-90 text-ink phone:right-3.5 phone:bottom-3.5"
      ref={menuRef}
    >
      {isOpen && (
        <div
          id="language-options"
          className="absolute right-0 bottom-[calc(100%+12px)] grid gap-2"
          role="menu"
          aria-label="Idioma · Language · Maaya t'aan"
        >
          {(Object.keys(languageLabels) as Language[]).map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              className="h-10 w-16 rounded-pill border-3 border-stroke bg-surface-floating p-0 text-caption font-black text-fg-control shadow-chip! [transition:background_0.2s_ease,color_0.2s_ease,transform_0.2s_ease] hover:transform-[translateY(-1px)] hover:bg-surface-inverse hover:text-fg-control-active aria-checked:transform-[translateY(-1px)] aria-checked:bg-surface-inverse aria-checked:text-fg-control-active phone:h-9 phone:w-14.5"
              aria-checked={language === option}
              onClick={() => selectLanguage(option)}
            >
              {languageLabels[option]}
            </button>
          ))}
        </div>
      )}
      <button
        className="language-trigger flex h-11.5 w-16 items-center justify-center gap-1.25 rounded-pill border-3 border-stroke bg-surface-floating p-0 text-caption font-black text-fg-control shadow-chip [transition:background_0.2s_ease,color_0.2s_ease,transform_0.2s_ease] hover:transform-[translateY(-2px)] in-data-[theme='dark']:shadow-chip! aria-expanded:transform-[translateY(-2px)] phone:h-10.5 phone:w-14.5 [&_svg]:size-3.5 [&_svg]:[transition:transform_0.2s_ease] aria-expanded:[&_svg]:transform-[rotate(180deg)]"
        type="button"
        aria-label="Seleccionar idioma"
        aria-expanded={isOpen}
        aria-controls="language-options"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{languageLabels[language]}</span>
        <ChevronDown />
      </button>
    </div>
  )
}

export { LanguageToggle }
