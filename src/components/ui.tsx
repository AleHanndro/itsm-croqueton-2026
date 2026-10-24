'use client'

import { cn, type ClassValue } from 'cn'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type ComponentProps } from 'react'

import { useLocation } from '@/lib/navigation'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage, type Language } from '@/providers/language-provider'
import { useTheme } from '@/providers/theme-provider'

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
    <div className="language-toggle" ref={menuRef}>
      {isOpen && (
        <div
          id="language-options"
          className="language-options"
          role="menu"
          aria-label="Idioma · Language · Maaya t'aan"
        >
          {(Object.keys(languageLabels) as Language[]).map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={language === option}
              onClick={() => selectLanguage(option)}
            >
              {languageLabels[option]}
            </button>
          ))}
        </div>
      )}
      <button
        className="language-trigger"
        type="button"
        aria-label="Seleccionar idioma"
        aria-expanded={isOpen}
        aria-controls="language-options"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{languageLabels[language]}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="m4 6 4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

function MayaTranslationNotice() {
  const { language } = useLanguage()

  if (language !== 'yua') return null

  return (
    <aside className="maya-translation-notice" role="status">
      <strong>Maaya t&apos;aan</strong>
      <span>
        Traducción comunitaria en revisión. El contenido se muestra temporalmente en español.
      </span>
    </aside>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { language } = useLanguage()
  const isDark = theme === 'dark'
  return (
    <button
      className="theme-toggle"
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
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path
            d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 15.2A8.5 8.5 0 018.8 4 8.5 8.5 0 1020 15.2z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}

function Dog({ mood = 'cool', className = '' }) {
  const sad = mood === 'sad' || mood === 'sick'
  const strong = mood === 'strong'
  return (
    <svg
      viewBox="0 0 520 520"
      className={className}
      role="img"
      aria-label={`Perrito ${strong ? 'fuerte y feliz' : sad ? 'triste' : 'feliz'}`}
    >
      <g className="dog-shadow">
        <ellipse cx="262" cy="466" rx="142" ry="28" fill="#202436" opacity=".16" />
      </g>
      {strong && (
        <g fill="#c8753c" stroke="#202436" strokeWidth="8" strokeLinejoin="round">
          <path d="M167 335c-39-35-85-17-91 22-5 31 19 54 52 43 16-5 27-21 28-41l32 22z" />
          <path d="M353 335c39-35 85-17 91 22 5 31-19 54-52 43-16-5-27-21-28-41l-32 22z" />
          <path d="M85 358c-22-5-32 10-28 26 5 19 30 22 49 9M435 358c22-5 32 10 28 26-5 19-30 22-49 9" />
        </g>
      )}
      <path
        d={
          strong
            ? 'M165 326c17-43 50-68 95-68s79 25 96 68l16 109H148z'
            : 'M185 327c16-41 42-63 76-63s60 22 75 63l20 111H165z'
        }
        fill="#d98a4e"
        stroke="#202436"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d="M188 388c35 17 111 17 145 0"
        fill="none"
        stroke="#202436"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M192 427l-21 39M331 427l21 39"
        stroke="#202436"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path d="M174 468h52M298 468h52" stroke="#202436" strokeWidth="16" strokeLinecap="round" />
      <path
        d="M178 176c-34-69-101-60-103-13-2 49 58 82 112 74z"
        fill="#9f592f"
        stroke="#202436"
        strokeWidth="9"
      />
      <path
        d="M342 176c34-69 101-60 103-13 2 49-58 82-112 74z"
        fill="#9f592f"
        stroke="#202436"
        strokeWidth="9"
      />
      <path
        d="M151 205c0-78 48-135 110-135s109 57 109 135c0 72-42 128-109 128s-110-56-110-128z"
        fill="#dc8c50"
        stroke="#202436"
        strokeWidth="9"
      />
      <path
        d="M216 82c12 25 12 48 0 70M302 82c-12 25-12 48 0 70"
        fill="none"
        stroke="#f3b06e"
        strokeWidth="15"
        strokeLinecap="round"
      />
      {mood === 'cool' ? (
        <>
          <g fill="#202436" stroke="#202436" strokeWidth="8">
            <path d="M168 177h78c3 39-14 58-40 58-29 0-40-24-38-58z" />
            <path d="M276 177h78c2 34-9 58-39 58-27 0-44-20-39-58z" />
            <path d="M244 186c10-8 22-8 34 0" fill="none" />
          </g>
          <path d="M179 189l51-5M287 189l49-5" stroke="#fff" strokeWidth="8" opacity=".55" />
        </>
      ) : (
        <>
          <path
            d={sad ? 'M186 207q20-18 40 0M296 207q20-18 40 0' : 'M190 194h30M302 194h30'}
            fill="none"
            stroke="#202436"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {mood === 'sick' && (
            <>
              <path
                d="M194 224c-4 13-11 18-11 26a12 12 0 0024 0c0-8-8-14-13-26zM323 224c-4 13-11 18-11 26a12 12 0 0024 0c0-8-8-14-13-26z"
                fill="#76bde8"
              />
              <path
                d="M155 184l33-22M333 162l34 22"
                stroke="#202436"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </>
          )}
        </>
      )}
      <ellipse cx="261" cy="241" rx="30" ry="25" fill="#202436" />
      <path
        d={sad ? 'M230 292q31-25 62 0' : 'M226 276q35 35 70 0'}
        fill={sad ? 'none' : '#fff'}
        stroke="#202436"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {strong && (
        <path
          d="M219 350l18 20 24-22 24 22 19-20"
          fill="none"
          stroke="#f4c64e"
          strokeWidth="10"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

function Bowl({ empty = false, className = '' }) {
  return (
    <svg viewBox="0 0 300 180" className={className} aria-hidden="true">
      {!empty && (
        <g fill="#744421" stroke="#202436" strokeWidth="4">
          <circle cx="92" cy="54" r="18" />
          <circle cx="126" cy="38" r="18" />
          <circle cx="162" cy="50" r="18" />
          <circle cx="199" cy="40" r="18" />
          <circle cx="221" cy="68" r="18" />
          <circle cx="112" cy="73" r="18" />
          <circle cx="153" cy="74" r="18" />
          <circle cx="188" cy="76" r="18" />
        </g>
      )}
      <path
        d="M41 72h218l-26 77H67z"
        fill="#ef5d45"
        stroke="#202436"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path d="M41 72h218" stroke="#202436" strokeWidth="12" strokeLinecap="round" />
      <path d="M115 108h70" stroke="#fff7df" strokeWidth="11" strokeLinecap="round" opacity=".9" />
    </svg>
  )
}

function Cloud({ className = '' }) {
  return (
    <svg viewBox="0 0 220 100" className={className} aria-hidden="true">
      <path
        d="M21 77c0-17 14-30 31-30 5-25 26-41 52-34 16-16 48-4 50 21 25-2 43 13 43 35 0 6-1 9-3 13H24c-2-2-3-4-3-5z"
        fill="currentColor"
      />
    </svg>
  )
}

function Paw({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <ellipse cx="40" cy="51" rx="22" ry="18" fill="currentColor" />
      <ellipse cx="17" cy="34" rx="9" ry="12" fill="currentColor" transform="rotate(-24 17 34)" />
      <ellipse cx="34" cy="19" rx="9" ry="12" fill="currentColor" transform="rotate(-6 34 19)" />
      <ellipse cx="58" cy="23" rx="9" ry="12" fill="currentColor" transform="rotate(16 58 23)" />
      <ellipse cx="67" cy="43" rx="9" ry="12" fill="currentColor" transform="rotate(30 67 43)" />
    </svg>
  )
}

function PawColorButton({
  color,
  label,
  selected,
  onClick
}: {
  color: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="color-swatch paw-color-button"
      aria-label={`Color ${label}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="paw-color-preview" style={{ color }}>
        <Paw />
      </span>
      {label}
    </button>
  )
}

function Logo() {
  return (
    <a href="#inicio" className="logo" aria-label="Croquetón, volver al inicio">
      <span className="logo-mark">
        <Paw />
      </span>
      <span>Croquetón</span>
    </a>
  )
}

function SiteNavigation({
  home = false,
  isScrolled = false
}: {
  home?: boolean
  isScrolled?: boolean
}) {
  const { language } = useLanguage()
  const { user } = useCommunity()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigationRef = useRef<HTMLElement>(null)

  const isEnglish = language === 'en'
  const navigationItems = [
    {
      to: '/#historia',
      label: isEnglish ? 'Story' : 'Historia',
      active: location.pathname === '/'
    },
    { to: '/meta', label: isEnglish ? 'Goal' : 'Meta', active: location.pathname === '/meta' },
    { to: '/guaubook', label: 'GuauBook', active: location.pathname === '/guaubook' },
    {
      to: '/unirme',
      label: isEnglish ? 'Join us' : 'Unirme',
      active: location.pathname === '/unirme'
    },
    {
      to: '/donadores',
      label: isEnglish ? 'Donors' : 'Donadores',
      active: location.pathname === '/donadores'
    },
    {
      to: '/manada',
      label: isEnglish ? 'The Croquetones' : 'Los Croquetones',
      active: location.pathname === '/manada'
    }
  ]

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!isMenuOpen) return

    const closeMobileMenu = (event: MouseEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) setIsMenuOpen(false)
    }

    const closeMobileMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', closeMobileMenu)
    document.addEventListener('keydown', closeMobileMenuOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeMobileMenu)
      document.removeEventListener('keydown', closeMobileMenuOnEscape)
    }
  }, [isMenuOpen])

  return (
    <>
      <header
        className={`${home ? 'nav-wrap' : 'page-nav-wrap'} ${isScrolled ? 'is-scrolled' : ''}`}
      >
        <nav
          ref={navigationRef}
          className="nav container"
          aria-label={isEnglish ? 'Main navigation' : 'Navegaci\xF3n principal'}
        >
          {home ? (
            <Logo />
          ) : (
            <Link
              href="/"
              className="logo"
              aria-label={isEnglish ? 'Back to Croquet\xF3n' : 'Volver a Croquet\xF3n'}
            >
              <span className="logo-mark">
                <Paw />
              </span>
              <span>Croquetón</span>
            </Link>
          )}
          <div id="mobile-navigation-menu" className={`nav-links ${isMenuOpen ? 'is-open' : ''}`}>
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={item.active ? 'is-active' : void 0}
                aria-current={item.active ? 'page' : void 0}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <button
              className="mobile-menu-button"
              type="button"
              aria-label={
                isMenuOpen
                  ? isEnglish
                    ? 'Close menu'
                    : 'Cerrar men\xFA'
                  : isEnglish
                    ? 'Open menu'
                    : 'Abrir men\xFA'
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation-menu"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="m5 5 14 14M19 5 5 19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
            <Link
              className={`user-login-button ${location.pathname === '/iniciar-sesion' || location.pathname === '/mi-perfil' ? 'is-active' : ''}`}
              href={user ? '/mi-perfil' : '/iniciar-sesion'}
              aria-current={
                location.pathname === '/iniciar-sesion' || location.pathname === '/mi-perfil'
                  ? 'page'
                  : void 0
              }
              aria-label={
                user
                  ? isEnglish
                    ? 'My profile'
                    : 'Mi perfil'
                  : isEnglish
                    ? 'User sign in'
                    : 'Iniciar sesi\xF3n de usuario'
              }
              title={
                user
                  ? isEnglish
                    ? 'My profile'
                    : 'Mi perfil'
                  : isEnglish
                    ? 'Sign in'
                    : 'Iniciar sesi\xF3n'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
                <path
                  d="M4.5 21c.7-5 3.2-7.5 7.5-7.5s6.8 2.5 7.5 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          </div>
        </nav>
      </header>
      {!home && <div className="page-nav-spacer" aria-hidden="true" />}
    </>
  )
}

function StoryImage({
  alt,
  className,
  label,
  src
}: {
  alt: string
  className?: ClassValue
  label: string
  src: ComponentProps<typeof Image>['src']
}) {
  return (
    <figure className={cn('story-image', className)}>
      <span className="photo-tape photo-tape-left" />
      <span className="photo-tape photo-tape-right" />
      <div className="story-image-inner">
        <Image src={src} alt={alt} />
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  )
}

function MoodPollCard({
  alt,
  className,
  label,
  src
}: {
  alt: string
  className?: ClassValue
  label: string
  src: ComponentProps<typeof Image>['src']
}) {
  const { language } = useLanguage()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  const isEnglish = language === 'en'
  const hasResults = selectedMood !== null

  return (
    <figure className={`story-image mood-poll-card ${className}`}>
      <span className="photo-tape photo-tape-left" />
      <span className="photo-tape photo-tape-right" />
      <div className="story-image-inner">
        <Image src={src} alt={alt} />
        <div
          className={`mood-poll-options ${hasResults ? 'has-results' : ''}`}
          aria-label={isEnglish ? 'How do I look? Poll' : 'Encuesta: c\xF3mo me veo'}
        >
          <button
            type="button"
            className="mood-option mood-option-happy"
            aria-pressed={selectedMood === 'happy'}
            onClick={() => setSelectedMood('happy')}
          >
            <span className="mood-option-heading">
              <span>{isEnglish ? 'Happy' : 'Feliz'}</span>
              <strong>60%</strong>
            </span>
            <span className="mood-result-bar" aria-hidden="true">
              <span />
            </span>
          </button>
          <button
            type="button"
            className="mood-option mood-option-crying"
            aria-pressed={selectedMood === 'crying'}
            onClick={() => setSelectedMood('crying')}
          >
            <span className="mood-option-heading">
              <span>{isEnglish ? 'You were crying' : 'Estuviste llorando'}</span>
              <strong>40%</strong>
            </span>
            <span className="mood-result-bar" aria-hidden="true">
              <span />
            </span>
          </button>
        </div>
        <span className="mood-poll-status" aria-live="polite">
          {hasResults
            ? isEnglish
              ? 'Poll results: Happy 60%, You were crying 40%.'
              : 'Resultados: Feliz 60%, Estuviste llorando 40%.'
            : ''}
        </span>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  )
}

function MemePlaceholder({
  alt,
  className,
  label,
  mood,
  note
}: {
  alt: string
  className?: ClassValue
  label: string
  mood: string
  note: string
}) {
  return (
    <figure className={cn('story-image meme-placeholder', className)}>
      <span className="photo-tape photo-tape-left" />
      <span className="photo-tape photo-tape-right" />
      <div className="story-image-inner" role="img" aria-label={alt}>
        <span className="placeholder-note">{note}</span>
        <Dog mood={mood} className="placeholder-dog" />
        <span className="swap-note">Tu Cheems va aquí</span>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  )
}

function CareAvatar({
  furColor = '#d98a4e',
  shirtColor = '#ef6547',
  shortsColor = '#647fa1',
  shoesColor = '#fff8df',
  glassesColor = '#202436',
  outfit = 'shirt',
  hair = 'none'
}) {
  return (
    <svg
      className="care-avatar"
      viewBox="0 0 400 650"
      role="img"
      aria-label="Avatar de perro antropomórfico con gafas, camiseta, shorts y tenis personalizables"
    >
      <ellipse cx="202" cy="625" rx="132" ry="18" fill="#202436" opacity=".12" />
      <path
        d="M126 403c-58 13-89 55-70 92 13 25 51 13 72-21"
        fill={furColor}
        stroke="#202436"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M151 444c-3 50-8 102-15 148h48l14-111M249 444c3 50 8 102 15 148h-48l-14-111"
        fill={furColor}
        stroke="#202436"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d="M91 304c-25 32-37 80-31 126M289 299c29-14 41-46 43-79"
        fill="none"
        stroke="#202436"
        strokeWidth="48"
        strokeLinecap="round"
      />
      <path
        d="M91 304c-25 32-37 80-31 126M289 299c29-14 41-46 43-79"
        fill="none"
        stroke={furColor}
        strokeWidth="32"
        strokeLinecap="round"
      />

      <g fill={furColor} stroke="#202436" strokeWidth="7" strokeLinecap="round">
        <path d="M38 425c-6 20 4 39 22 42 19 2 31-15 26-34-4-18-42-27-48-8z" />
        <path d="M312 203c-3-19 6-38 22-42 18-3 31 13 28 31-3 20-47 29-50 11z" />
        <ellipse cx="318" cy="168" rx="10" ry="19" transform="rotate(-24 318 168)" />
        <ellipse cx="337" cy="157" rx="10" ry="20" transform="rotate(-5 337 157)" />
        <ellipse cx="357" cy="166" rx="10" ry="19" transform="rotate(19 357 166)" />
      </g>
      <path d="M48 438l11 7M63 429l10 7" stroke="#202436" strokeWidth="5" strokeLinecap="round" />

      {outfit === 'shirt' && (
        <>
          <path
            d="M107 273c23-21 163-21 186 0l30 42-37 39-14-20 8 120H120l8-120-14 20-37-39z"
            fill={shirtColor}
            stroke="#202436"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d="M119 440h162l-8 99h-61l-12-51-12 51h-61z"
            fill={shortsColor}
            stroke="#202436"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d="M128 468h45M227 468h45"
            stroke="#fff8df"
            strokeWidth="7"
            strokeLinecap="round"
            opacity=".9"
          />
        </>
      )}
      {outfit === 'dress' && (
        <>
          <path
            d="M107 273c23-21 163-21 186 0l30 42-37 39-16-22-1 67 49 116c-56 28-180 28-236 0l49-116-1-67-16 22-37-39z"
            fill={shirtColor}
            stroke="#202436"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d="M130 399c39 15 101 15 140 0"
            fill="none"
            stroke={shortsColor}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M107 490c48 17 138 17 186 0"
            fill="none"
            stroke="#fff8df"
            strokeWidth="7"
            strokeLinecap="round"
            opacity=".8"
          />
        </>
      )}
      {outfit === 'overalls' && (
        <>
          <path
            d="M107 273c23-21 163-21 186 0l30 42-37 39-18-25-10 80H142l-10-80-18 25-37-39z"
            fill={shortsColor}
            stroke="#202436"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d="M130 323h140l12 215h-68l-14-58-14 58h-68z"
            fill={shirtColor}
            stroke="#202436"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d="M145 267l18 58M255 267l-18 58"
            stroke="#202436"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <rect
            x="159"
            y="348"
            width="82"
            height="62"
            rx="14"
            fill="#fff8df"
            stroke="#202436"
            strokeWidth="7"
          />
          <circle cx="162" cy="326" r="8" fill="#ffc929" stroke="#202436" strokeWidth="5" />
          <circle cx="238" cy="326" r="8" fill="#ffc929" stroke="#202436" strokeWidth="5" />
        </>
      )}
      <path
        d="M88 324l27 19M312 315l-25 28"
        fill="none"
        stroke="#202436"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M150 257c8 39 92 39 100 0"
        fill="#fff8df"
        stroke="#202436"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="200" cy="354" r="32" fill="#ffc929" stroke="#202436" strokeWidth="6" />
      <g fill="#202436">
        <ellipse cx="200" cy="361" rx="11" ry="9" />
        <ellipse cx="188" cy="349" rx="5" ry="7" transform="rotate(-20 188 349)" />
        <ellipse cx="199" cy="344" rx="5" ry="7" />
        <ellipse cx="211" cy="349" rx="5" ry="7" transform="rotate(20 211 349)" />
      </g>

      <path
        d="M108 615c2-24 21-39 44-37l31 7 7 29c-19 13-63 14-82 1zM292 615c-2-24-21-39-44-37l-31 7-7 29c19 13 63 14 82 1z"
        fill={shoesColor}
        stroke="#202436"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d="M114 605h69M217 605h69M132 585l20 18M268 585l-20 18"
        fill="none"
        stroke="#202436"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M109 616c17 8 61 8 81-2M210 614c20 10 64 10 81 2"
        fill="none"
        stroke="#202436"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {hair === 'long' && (
        <path
          d="M114 87c-35 45-35 149-12 210l52-18 46 25 46-25 52 18c23-61 23-165-12-210-45-49-127-49-172 0z"
          fill="#6f4937"
          stroke="#202436"
          strokeWidth="9"
          strokeLinejoin="round"
        />
      )}
      <path
        d="M126 104C88 47 60 55 64 111c3 40 30 67 67 70M274 104c38-57 66-49 62 7-3 40-30 67-67 70"
        fill={furColor}
        stroke="#202436"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <ellipse
        cx="200"
        cy="157"
        rx="101"
        ry="111"
        fill={furColor}
        stroke="#202436"
        strokeWidth="9"
      />
      {hair === 'short' && (
        <path
          d="M126 93c16-44 48-62 74-62s58 18 74 62c-24-14-44-14-56 4-8-17-24-24-38-9-13-13-31-11-54 5z"
          fill="#6f4937"
          stroke="#202436"
          strokeWidth="8"
          strokeLinejoin="round"
        />
      )}
      {hair === 'long' && (
        <path
          d="M119 106c12-52 47-75 81-75s69 23 81 75c-24-18-47-20-62-2-8-18-24-25-40-9-15-10-34-7-60 11z"
          fill="#6f4937"
          stroke="#202436"
          strokeWidth="8"
          strokeLinejoin="round"
        />
      )}
      <path
        d="M142 88c14 18 19 37 15 56M258 88c-14 18-19 37-15 56"
        fill="none"
        stroke="#f3b06e"
        strokeWidth="12"
        strokeLinecap="round"
        opacity=".65"
      />
      <path
        d="M140 126c12-10 27-12 40-5M260 126c-12-10-27-12-40-5"
        fill="none"
        stroke="#202436"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <ellipse cx="158" cy="151" rx="10" ry="14" fill="#202436" />
      <ellipse cx="242" cy="151" rx="10" ry="14" fill="#202436" />
      <circle cx="154" cy="146" r="3" fill="#fff" />
      <circle cx="238" cy="146" r="3" fill="#fff" />
      <ellipse cx="200" cy="194" rx="60" ry="46" fill="#f0b977" />
      <ellipse cx="200" cy="173" rx="19" ry="15" fill="#202436" />
      <path
        d="M165 204c22 35 48 35 70 0-22 9-48 9-70 0z"
        fill="#202436"
        stroke="#202436"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M185 225c10-8 20-8 30 0" stroke="#ef8a62" strokeWidth="7" strokeLinecap="round" />
      <circle cx="136" cy="190" r="9" fill="#ef8a62" opacity=".55" />
      <circle cx="264" cy="190" r="9" fill="#ef8a62" opacity=".55" />
      <g fill="none" stroke={glassesColor} strokeWidth="8">
        <rect x="119" y="127" width="71" height="53" rx="22" />
        <rect x="210" y="127" width="71" height="53" rx="22" />
        <path d="M190 145h20M119 139l-23-8M281 139l23-8" />
      </g>
    </svg>
  )
}

function SmallDogMascot({ furColor = '#efc88f' }) {
  return (
    <svg
      className="kibble-mascot"
      viewBox="0 0 250 300"
      role="img"
      aria-label="Perrito pequeño sentado con pañuelo azul"
    >
      <path
        d="M174 218c55-31 72 19 37 49-18 15-35 3-31-14"
        fill={furColor}
        stroke="#202436"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <ellipse cx="125" cy="210" rx="72" ry="74" fill={furColor} stroke="#202436" strokeWidth="9" />
      <path
        d="M75 76L45 20c42 1 61 20 66 57M175 76l30-56c-42 1-61 20-66 57"
        fill={furColor}
        stroke="#202436"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <ellipse cx="125" cy="112" rx="82" ry="77" fill={furColor} stroke="#202436" strokeWidth="9" />
      <path
        d="M73 47l21 31M177 78l21-31"
        stroke="#ef9c9c"
        strokeWidth="10"
        strokeLinecap="round"
        opacity=".8"
      />
      <ellipse cx="125" cy="135" rx="45" ry="35" fill="#fff0bd" />
      <path
        d="M86 108q14-16 28 0M136 108q14-16 28 0"
        fill="none"
        stroke="#202436"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <ellipse cx="125" cy="129" rx="14" ry="11" fill="#202436" />
      <path
        d="M101 145c15 18 33 18 48 0"
        fill="none"
        stroke="#202436"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M62 166c39 22 87 22 126 0l-20 66-43-33-43 33z"
        fill="#4f83bd"
        stroke="#202436"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M83 255l-8 28M167 255l8 28M67 283h35M148 283h35"
        fill="none"
        stroke="#202436"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  )
}

export {
  LanguageToggle,
  MayaTranslationNotice,
  ThemeToggle,
  Dog,
  Bowl,
  Cloud,
  Paw,
  PawColorButton,
  Logo,
  SiteNavigation,
  StoryImage,
  MoodPollCard,
  MemePlaceholder,
  CareAvatar,
  SmallDogMascot
}
