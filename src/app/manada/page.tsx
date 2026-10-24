'use client'

import Image from 'next/image'

import { Paw } from '@/assets/icons/paw'
import { LanguageToggle, ThemeToggle, SiteNavigation } from '@/components/ui'
import { packGenerationImage } from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

export default function PackPage() {
  const { language } = useLanguage()

  const isEnglish = language === 'en'

  return (
    <main className="pack-page">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="pack-hero">
        <div className="pack-paw-trail" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <span className="pack-paw-step" key={index}>
              <Paw />
            </span>
          ))}
        </div>
        <div className="container">
          <span className="eyebrow">
            {isEnglish ? 'The Croquet\xF3n pack' : 'La manada Croquet\xF3n'}
          </span>
          <h1>
            {isEnglish ? 'Every generation' : 'Cada generaci\xF3n'}
            <br />
            <span>{isEnglish ? 'leaves paw prints.' : 'deja huellitas.'}</span>
          </h1>
          <p>
            {isEnglish
              ? 'Our group album keeps the volunteers, laughs and heroic kibble-carrying poses from every edition.'
              : 'Nuestro \xE1lbum grupal guarda a los voluntarios, las risas y las poses heroicas cargando croquetas de cada edici\xF3n.'}
          </p>
        </div>
      </section>

      <section className="pack-gallery" aria-labelledby="pack-gallery-title">
        <div className="container">
          <div className="generation-gallery-heading">
            <span className="chapter">
              {isEnglish ? 'Croquet\xF3n generations' : 'Generaciones Croquet\xF3n'}
            </span>
            <h2 id="pack-gallery-title">
              {isEnglish ? "The pack's" : 'El \xE1lbum de'}
              <br />
              {isEnglish ? 'group album.' : 'la manada.'}
            </h2>
            <p>
              {isEnglish
                ? "A home for each generation's official group photo, published by the Croquet\xF3n team."
                : 'Un espacio para la foto grupal oficial de cada generaci\xF3n, publicada por el equipo Croquet\xF3n.'}
            </p>
          </div>
          <div className="generation-grid">
            <figure className="generation-card">
              <Image
                src={packGenerationImage}
                alt={
                  isEnglish
                    ? 'Croquet\xF3n 2025 team posing with donated pet food'
                    : 'Equipo Croquet\xF3n 2025 posando con alimento donado para mascotas'
                }
              />
              <figcaption>
                <strong>{isEnglish ? 'Generation 2025' : 'Generaci\xF3n 2025'}</strong>
                <span>{isEnglish ? 'The founding pack' : 'La manada fundadora'}</span>
              </figcaption>
            </figure>
            <div className="generation-placeholder">
              <Paw />
              <strong>{isEnglish ? 'Next group photo' : 'Pr\xF3xima foto grupal'}</strong>
              <span>
                {isEnglish
                  ? 'Reserved for the next generation of Croquetones.'
                  : 'Reservado para la siguiente generaci\xF3n de Croquetones.'}
              </span>
            </div>
            <div className="generation-placeholder generation-placeholder-coral">
              <Paw />
              <strong>
                {isEnglish ? 'Your team could be here' : 'Aqu\xED puede estar tu equipo'}
              </strong>
              <span>
                {isEnglish
                  ? 'Join, help and smile for the camera.'
                  : '\xDAnete, ayuda y sonr\xEDe para la foto.'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
