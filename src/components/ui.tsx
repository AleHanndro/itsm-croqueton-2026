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
import { Dog } from '@/components/illustrations/dog'
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

export {
  LanguageToggle,
  MayaTranslationNotice,
  ThemeToggle,
  PawColorButton,
  Logo,
  SiteNavigation,
  StoryImage,
  MoodPollCard,
  MemePlaceholder
}
