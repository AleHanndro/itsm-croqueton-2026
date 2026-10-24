'use client'

import { cn, type ClassValue } from 'cn'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type ComponentProps } from 'react'

import { ChevronDown } from '@/assets/icons/chevron-down'
import { Close } from '@/assets/icons/close'
import { Menu } from '@/assets/icons/menu'
import { Moon } from '@/assets/icons/moon'
import { Paw } from '@/assets/icons/paw'
import { Sun } from '@/assets/icons/sun'
import { User } from '@/assets/icons/user'
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

function MayaTranslationNotice() {
  const { language } = useLanguage()

  if (language !== 'yua') return null

  return (
    <aside
      className="fixed right-5 bottom-22 z-89 w-[min(340px,calc(100vw-28px))] rounded-[8px_16px_16px_8px] border-l-5 border-stroke-notice bg-surface-floating px-3.75 py-3 text-[12px] leading-tight-copy text-foreground shadow-notice phone:right-3.5 phone:bottom-18"
      role="status"
    >
      <strong className="block font-heading text-[16px]">Maaya t&apos;aan</strong>
      <span className="block">
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
      className="group/swatch grid justify-items-center gap-1.75 rounded-control border-2 border-[#c7baa0] bg-white px-1.25 py-2.5 text-caption font-black text-ink shadow-[0_3px_0_#c7baa0] [transition:transform_0.18s_ease,box-shadow_0.18s_ease] hover:transform-[translateY(-2px)] hover:shadow-[0_5px_0_#9e927b]! active:transform-[translateY(2px)] active:shadow-none! aria-pressed:border-ink aria-pressed:bg-brand aria-pressed:shadow-[0_4px_0_var(--ink)]!"
      aria-label={`Color ${label}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span
        className="grid size-13 place-items-center filter-[drop-shadow(0_3px_0_var(--ink))] group-aria-pressed/swatch:transform-[rotate(-8deg)_scale(1.08)] [&_svg]:size-12 [&_svg]:overflow-visible"
        style={{ color }}
      >
        <Paw />
      </span>
      {label}
    </button>
  )
}

function Logo() {
  return (
    <a
      href="#inicio"
      className="logo inline-flex w-max items-center gap-2.5 font-heading text-title-sm font-extrabold tracking-heading"
      aria-label="Croquetón, volver al inicio"
    >
      <span className="logo-mark grid size-10.75 place-items-center rounded-circle bg-ink text-brand [&_svg]:size-6.25">
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
        className={
          home
            ? isScrolled
              ? 'fixed top-0 left-0 z-50 w-full border-b border-stroke-nav-scrolled bg-surface-nav-scrolled shadow-nav-scrolled backdrop-blur-[14px] [transition:background_0.28s_ease,border-color_0.28s_ease,box-shadow_0.28s_ease]'
              : 'fixed top-0 left-0 z-50 w-full border-b border-transparent bg-transparent [transition:background_0.28s_ease,border-color_0.28s_ease,box-shadow_0.28s_ease]'
            : 'fixed top-0 left-0 z-50 w-full border-b-3 border-stroke bg-surface-bar'
        }
      >
        <nav
          ref={navigationRef}
          className={cn(
            'relative z-2 mx-auto flex w-[min(1240px,calc(100%-96px))] items-center [transition:height_0.28s_ease,min-height_0.28s_ease,padding_0.28s_ease] tablet:w-[min(100%-36px,680px)] phone:w-[min(100%-28px,680px)] phone:gap-2 laptop:w-[min(100%-48px,1040px)] phone:[&_.logo]:text-sub phone:[&_.logo-mark]:size-9.5',
            home && isScrolled
              ? 'h-19.5 gap-7 tablet:h-auto tablet:min-h-19.5 tablet:gap-3 tablet:py-2.5'
              : 'h-26 gap-7 tablet:h-auto tablet:min-h-20.5 tablet:gap-3 tablet:py-3.25'
          )}
          aria-label={isEnglish ? 'Main navigation' : 'Navegaci\xF3n principal'}
        >
          {home ? (
            <Logo />
          ) : (
            <Link
              href="/"
              className="logo inline-flex w-max items-center gap-2.5 font-heading text-title-sm font-extrabold tracking-heading"
              aria-label={isEnglish ? 'Back to Croquet\xF3n' : 'Volver a Croquet\xF3n'}
            >
              <span className="logo-mark grid size-10.75 place-items-center rounded-circle bg-surface-inverse text-fg-control-active [&_svg]:size-6.25">
                <Paw />
              </span>
              <span>Croquetón</span>
            </Link>
          )}
          <div
            id="mobile-navigation-menu"
            className={cn(
              'flex flex-1 justify-center gap-5.5 text-body-sm font-extrabold tablet:absolute tablet:top-[calc(100%+8px)] tablet:right-0 tablet:left-0 tablet:w-full tablet:gap-1.75 tablet:rounded-dialog-sm tablet:border-3 tablet:p-3.5 laptop:gap-2.5 laptop:text-[12px]',
              isMenuOpen ? 'tablet:grid' : 'tablet:hidden',
              home && isScrolled
                ? 'tablet:border-ink tablet:bg-card tablet:text-ink tablet:shadow-[7px_8px_0_var(--ink)]'
                : 'tablet:border-stroke tablet:bg-surface-floating tablet:text-foreground tablet:shadow-nav-menu phone:top-[calc(100%+5px)]'
            )}
          >
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "relative rounded-pill px-2.75 py-1.75 [transition:background_0.2s_ease,color_0.2s_ease,transform_0.2s_ease] after:absolute after:-bottom-1.75 after:left-0 after:h-0.75 after:rounded-[3px] after:bg-current after:content-[''] after:[transition:width_0.25s_ease] tablet:flex tablet:min-h-10.75 tablet:items-center tablet:rounded-xl tablet:border-2 tablet:border-stroke tablet:px-3.5 tablet:py-0 tablet:text-small tablet:after:hidden phone:min-h-10 phone:px-2.75 phone:text-[12px]",
                  item.active
                    ? 'transform-[rotate(-1deg)] bg-surface-inverse text-fg-inverse after:w-full'
                    : 'after:w-0 hover:after:w-full'
                )}
                aria-current={item.active ? 'page' : void 0}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3.25 phone:absolute phone:top-3 phone:right-0">
            <button
              className="mobile-menu-button hidden size-11.5 flex-none place-items-center rounded-field border-3 border-stroke bg-surface-menu-button p-0 text-fg-control shadow-icon-button in-data-[theme='dark']:shadow-icon-button! tablet:grid [&_svg]:size-6.25"
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
              {isMenuOpen ? <Close /> : <Menu />}
            </button>
            <Link
              className={cn(
                'user-login-button grid size-12.5 flex-none place-items-center rounded-circle border-3 border-stroke [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-3px)_rotate(2deg)] active:transform-[translateY(3px)] tablet:size-11.5 [&_svg]:size-6.25',
                location.pathname === '/iniciar-sesion' || location.pathname === '/mi-perfil'
                  ? 'bg-surface-inverse text-fg-control-active shadow-[0_5px_0_var(--accent)]!'
                  : "bg-surface-floating text-fg-control shadow-icon-button active:shadow-none in-data-[theme='dark']:shadow-icon-button!"
              )}
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
              <User />
            </Link>
          </div>
        </nav>
      </header>
      {!home && (
        <div className="page-nav-spacer h-26 bg-surface-bar tablet:h-20.5" aria-hidden="true" />
      )}
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
    <figure className={cn('absolute z-5 m-0', className)}>
      <span className="absolute -top-2 -left-6.5 z-7 h-6.75 w-21.25 -rotate-35 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <span className="absolute -top-2 -right-6.25 z-7 h-6.75 w-21.25 rotate-34 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <div className="relative overflow-hidden rounded-control border-8 border-[#f9f4e6] bg-[#f9f4e6] shadow-[15px_18px_0_rgba(15,22,36,0.28)] after:pointer-events-none after:absolute after:inset-0 after:rounded-tag after:border-3 after:border-ink after:content-['']">
        <Image src={src} alt={alt} className="block size-full object-cover" />
      </div>
      <figcaption className="relative mx-auto -mt-2 w-max max-w-[90%] rotate-2 rounded-tag border-0 bg-brand px-4.25 py-2.25 text-center font-heading text-[14px] leading-[1.1] font-extrabold text-ink shadow-none">
        {label}
      </figcaption>
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
    <figure className={cn('absolute z-5 m-0', className)}>
      <span className="absolute -top-2 -left-6.5 z-7 h-6.75 w-21.25 -rotate-35 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <span className="absolute -top-2 -right-6.25 z-7 h-6.75 w-21.25 rotate-34 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <div className="relative overflow-hidden rounded-control border-8 border-[#f9f4e6] bg-[#f9f4e6] shadow-[15px_18px_0_rgba(15,22,36,0.28)] after:pointer-events-none after:absolute after:inset-0 after:rounded-tag after:border-3 after:border-ink after:content-['']">
        <Image src={src} alt={alt} className="block size-full object-cover" />
        <div
          className="absolute right-[1.1%] bottom-[5.8%] left-[33.1%] z-4 grid h-[17.2%] grid-cols-[1fr_1fr] gap-0.5"
          aria-label={isEnglish ? 'How do I look? Poll' : 'Encuesta: c\xF3mo me veo'}
        >
          <button
            type="button"
            className="min-w-0 rounded-l-control border-0 bg-[#fffdf5] px-2.5 py-2 font-heading font-black text-[#259575] uppercase [transition:transform_0.22s_ease,box-shadow_0.22s_ease,padding_0.35s_ease] hover:relative hover:z-2 hover:transform-[scale(1.05)] hover:shadow-[0_7px_15px_var(--ink-soft)]"
            aria-pressed={selectedMood === 'happy'}
            onClick={() => setSelectedMood('happy')}
          >
            <span
              className={cn(
                'flex items-center leading-[0.95]',
                hasResults ? 'justify-between gap-1.25' : 'justify-center'
              )}
            >
              <span
                className={
                  hasResults ? 'text-[clamp(9px,1.25vw,14px)]' : 'text-[clamp(13px,2.3vw,27px)]'
                }
              >
                {isEnglish ? 'Happy' : 'Feliz'}
              </span>
              <strong
                className={cn(
                  'overflow-hidden text-[clamp(13px,1.9vw,22px)] [transition:max-width_0.35s_ease,opacity_0.3s_ease]',
                  hasResults ? 'max-w-11.25 opacity-100' : 'max-w-0 opacity-0'
                )}
              >
                60%
              </strong>
            </span>
            <span
              className={cn(
                'block w-full overflow-hidden rounded-pill bg-[#dedbd1] [transition:height_0.35s_ease,margin-top_0.35s_ease,opacity_0.3s_ease]',
                hasResults ? 'mt-1.75 h-2 opacity-100' : 'mt-0 h-0 opacity-0'
              )}
              aria-hidden="true"
            >
              <span
                className={cn(
                  'block h-full rounded-[inherit] bg-[#38a879] [transition:width_0.65s_cubic-bezier(0.22,1,0.36,1)_0.1s]',
                  hasResults ? 'w-[60%]' : 'w-0'
                )}
              />
            </span>
          </button>
          <button
            type="button"
            className="min-w-0 rounded-r-control border-0 bg-[#fffdf5] px-2.5 py-2 font-heading font-black text-[#a74e71] uppercase [transition:transform_0.22s_ease,box-shadow_0.22s_ease,padding_0.35s_ease] hover:relative hover:z-2 hover:transform-[scale(1.05)] hover:shadow-[0_7px_15px_var(--ink-soft)]"
            aria-pressed={selectedMood === 'crying'}
            onClick={() => setSelectedMood('crying')}
          >
            <span
              className={cn(
                'flex items-center leading-[0.95]',
                hasResults ? 'justify-between gap-1.25' : 'justify-center'
              )}
            >
              <span
                className={
                  hasResults ? 'text-[clamp(9px,1.25vw,14px)]' : 'text-[clamp(13px,2.3vw,27px)]'
                }
              >
                {isEnglish ? 'You were crying' : 'Estuviste llorando'}
              </span>
              <strong
                className={cn(
                  'overflow-hidden text-[clamp(13px,1.9vw,22px)] [transition:max-width_0.35s_ease,opacity_0.3s_ease]',
                  hasResults ? 'max-w-11.25 opacity-100' : 'max-w-0 opacity-0'
                )}
              >
                40%
              </strong>
            </span>
            <span
              className={cn(
                'block w-full overflow-hidden rounded-pill bg-[#dedbd1] [transition:height_0.35s_ease,margin-top_0.35s_ease,opacity_0.3s_ease]',
                hasResults ? 'mt-1.75 h-2 opacity-100' : 'mt-0 h-0 opacity-0'
              )}
              aria-hidden="true"
            >
              <span
                className={cn(
                  'block h-full rounded-[inherit] bg-[#8b5aad] [transition:width_0.65s_cubic-bezier(0.22,1,0.36,1)_0.1s]',
                  hasResults ? 'w-[40%]' : 'w-0'
                )}
              />
            </span>
          </button>
        </div>
        <span
          className="absolute size-px overflow-hidden [clip-path:inset(50%)]"
          aria-live="polite"
        >
          {hasResults
            ? isEnglish
              ? 'Poll results: Happy 60%, You were crying 40%.'
              : 'Resultados: Feliz 60%, Estuviste llorando 40%.'
            : ''}
        </span>
      </div>
      <figcaption className="relative mx-auto -mt-2 w-max max-w-[90%] rotate-2 rounded-tag border-0 bg-brand px-4.25 py-2.25 text-center font-heading text-[14px] leading-[1.1] font-extrabold text-ink shadow-none">
        {label}
      </figcaption>
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
    <figure
      className={cn(
        'absolute z-5 m-0',
        '[&>div]:grid [&>div]:place-items-center [&>div]:bg-[#f2c65e]',
        className
      )}
    >
      <span className="absolute -top-2 -left-6.5 z-7 h-6.75 w-21.25 -rotate-35 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <span className="absolute -top-2 -right-6.25 z-7 h-6.75 w-21.25 rotate-34 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
      <div
        className="relative overflow-hidden rounded-control border-8 border-[#f9f4e6] bg-[#f9f4e6] shadow-[15px_18px_0_rgba(15,22,36,0.28)] after:pointer-events-none after:absolute after:inset-0 after:rounded-tag after:border-3 after:border-ink after:content-['']"
        role="img"
        aria-label={alt}
      >
        <span className="absolute top-4.5 left-1/2 z-2 w-[90%] -translate-x-1/2 text-center font-heading text-[20px] leading-[1.05] font-black uppercase">
          {note}
        </span>
        <Dog mood={mood} className="size-[82%] self-end" />
        <span className="absolute right-3 bottom-3 z-2 rounded-pill bg-ink px-2.5 py-1.5 text-center font-heading text-tiny font-black tracking-label text-white uppercase">
          Tu Cheems va aquí
        </span>
      </div>
      <figcaption className="relative mx-auto -mt-2 w-max max-w-[90%] rotate-2 rounded-tag border-0 bg-brand px-4.25 py-2.25 text-center font-heading text-[14px] leading-[1.1] font-extrabold text-ink shadow-none">
        {label}
      </figcaption>
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
      className="care-avatar relative z-2 mt-6.25 h-162.5 w-100 drop-shadow-[12px_15px_0_var(--ink-faint)] phone:h-147.5 phone:w-[min(100%,330px)]"
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

export {
  LanguageToggle,
  MayaTranslationNotice,
  ThemeToggle,
  Dog,
  Bowl,
  PawColorButton,
  Logo,
  SiteNavigation,
  StoryImage,
  MoodPollCard,
  MemePlaceholder,
  CareAvatar
}
