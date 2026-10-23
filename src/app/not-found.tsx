'use client'

import Image from 'next/image'
import Link from 'next/link'

import { LanguageToggle, ThemeToggle, Cloud, SiteNavigation } from '@/components/ui'
import { errorDogImage } from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

export default function NotFoundPage() {
  const { language } = useLanguage()

  const isEnglish = language === 'en'

  return (
    <main className="not-found-page">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />
      <div className="not-found-cloud cloud-left">
        <Cloud />
      </div>
      <div className="not-found-cloud cloud-right">
        <Cloud />
      </div>
      <div className="not-found-grid container">
        <div className="not-found-copy">
          <span className="eyebrow">
            {isEnglish ? 'Error 404 \xB7 Lost the scent' : 'Error 404 \xB7 Olfato perdido'}
          </span>
          <p className="not-found-code" aria-hidden="true">
            404
          </p>
          <h1>
            {isEnglish ? 'You got lost,' : 'Te perdiste,'}
            <br />
            <span>{isEnglish ? 'human.' : 'humano.'}</span>
          </h1>
          <p>
            {isEnglish
              ? "I know how to get home and I cannot even read maps. Don't worry: I won't tell anyone."
              : 'Yo s\xED s\xE9 volver a casa y ni siquiera s\xE9 leer mapas. Pero tranquilo: no le diremos a nadie.'}
          </p>
          <div className="not-found-actions">
            <Link className="button button-dark" href="/">
              {isEnglish ? 'Return with dignity' : 'Regresar con dignidad'}
            </Link>
            <Link className="not-found-link" href="/avatar-mascota">
              {isEnglish ? 'Distract me with an avatar' : 'Distraerme creando un avatar'}
            </Link>
          </div>
          <small>
            {isEnglish
              ? "This page doesn't exist. Your browsing history, unfortunately, does."
              : 'Esta p\xE1gina no existe. Tu historial de navegaci\xF3n, lamentablemente, s\xED.'}
          </small>
        </div>
        <div className="not-found-art">
          <span className="not-found-burst" />
          <Image
            src={errorDogImage}
            alt={
              isEnglish
                ? 'Laughing puppy in a bucket pointing at the visitor'
                : 'Cachorro ri\xE9ndose dentro de una cubeta y se\xF1alando al visitante'
            }
          />
          <p>
            {isEnglish ? 'So much internet.' : 'Mucho internet.'}
            <br />
            {isEnglish ? 'So little direction.' : 'Poco sentido de orientaci\xF3n.'}
          </p>
        </div>
      </div>
    </main>
  )
}
