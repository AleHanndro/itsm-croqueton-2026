'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Cloud } from '@/assets/icons/cloud'
import { LanguageToggle, ThemeToggle, SiteNavigation } from '@/components/ui'
import { errorDogImage } from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

export default function NotFoundPage() {
  const { language } = useLanguage()

  const isEnglish = language === 'en'

  return (
    <main className="relative flex min-h-screen items-center bg-surface-not-found-page text-foreground [&_.page-nav-spacer]:hidden">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />
      <div className="absolute top-[8%] -left-12.5 w-57.5 text-[#ffe982] opacity-80 [&_svg]:w-full">
        <Cloud />
      </div>
      <div className="absolute right-[3%] bottom-[4%] w-45 text-[#ffe982] opacity-80 [&_svg]:w-full">
        <Cloud />
      </div>
      <div className="relative z-2 mx-auto grid min-h-screen w-[min(1240px,calc(100%-96px))] grid-cols-[0.9fr_1.1fr] items-center py-20 tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] tablet:pt-25 phone:w-[min(100%-28px,680px)] phone:pt-17.5 phone:pb-5 laptop:w-[min(100%-48px,1040px)]">
        <div className="relative z-4">
          <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
            {isEnglish ? 'Error 404 \xB7 Lost the scent' : 'Error 404 \xB7 Olfato perdido'}
          </span>
          <p
            className="-mb-8.75 font-heading text-[clamp(130px,17vw,260px)] leading-[0.7] font-black -tracking-label-wide text-fg-not-found-code phone:-mb-4.5 phone:text-[120px]"
            aria-hidden="true"
          >
            404
          </p>
          <h1 className="mb-6.25 text-[clamp(60px,6vw,90px)] leading-display-tight font-extrabold phone:text-[62px]">
            {isEnglish ? 'You got lost,' : 'Te perdiste,'}
            <br />
            <span className="text-accent">{isEnglish ? 'human.' : 'humano.'}</span>
          </h1>
          <p className="max-w-142.5 text-lg leading-loose font-extrabold phone:text-base">
            {isEnglish
              ? "I know how to get home and I cannot even read maps. Don't worry: I won't tell anyone."
              : 'Yo s\xED s\xE9 volver a casa y ni siquiera s\xE9 leer mapas. Pero tranquilo: no le diremos a nadie.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5.5 phone:flex-col phone:items-start">
            <Link
              className="relative inline-flex min-h-14 items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink pr-4.5 pl-6.75 font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none!"
              href="/"
            >
              {isEnglish ? 'Return with dignity' : 'Regresar con dignidad'}
            </Link>
            <Link className="border-b-3 border-foreground font-black" href="/avatar-mascota">
              {isEnglish ? 'Distract me with an avatar' : 'Distraerme creando un avatar'}
            </Link>
          </div>
          <small className="mt-7 block font-extrabold opacity-60">
            {isEnglish
              ? "This page doesn't exist. Your browsing history, unfortunately, does."
              : 'Esta p\xE1gina no existe. Tu historial de navegaci\xF3n, lamentablemente, s\xED.'}
          </small>
        </div>
        <div className="relative min-h-162.5 tablet:min-h-140 phone:min-h-110">
          <span className="absolute top-10 right-0 size-130 rounded-circle bg-surface-not-found-burst before:absolute before:-inset-8.75 before:rounded-circle before:bg-[repeating-conic-gradient(transparent_0deg_12deg,rgba(255,255,255,0.38)_12deg_18deg)] before:content-[''] tablet:right-1/2 tablet:translate-x-1/2 phone:top-17.5 phone:size-82.5" />
          <Image
            src={errorDogImage}
            className="absolute right-5 bottom-16.25 z-3 w-115 max-w-[92%] rotate-2 rounded-card-lg border-9 border-card shadow-[14px_17px_0_rgba(32,36,54,0.25)] tablet:right-1/2 tablet:translate-x-1/2 phone:w-100"
            alt={
              isEnglish
                ? 'Laughing puppy in a bucket pointing at the visitor'
                : 'Cachorro ri\xE9ndose dentro de una cubeta y se\xF1alando al visitante'
            }
          />
          <p className="absolute top-20 right-2.5 z-5 rotate-4 rounded-[22px_22px_5px_22px] border-3 border-ink bg-card px-4.5 py-3.5 text-center font-heading text-base leading-[1.2] font-black text-ink shadow-pop phone:top-11.25 phone:right-0 phone:text-small">
            {isEnglish ? 'So much internet.' : 'Mucho internet.'}
            <br />
            {isEnglish ? 'So little direction.' : 'Poco sentido de orientaci\xF3n.'}
          </p>
        </div>
      </div>
    </main>
  )
}
