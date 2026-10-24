'use client'

import Image from 'next/image'

import { Paw } from '@/assets/icons/paw'
import { LanguageToggle, ThemeToggle, SiteNavigation } from '@/components/ui'
import { donationMemeImage } from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

const officialDonors: { name: string; contribution: string }[] = []

export default function DonorsPage() {
  const { language } = useLanguage()

  const isEnglish = language === 'en'

  return (
    <main className="donors-page">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="donors-hero">
        <div className="donors-hero-grid container">
          <div>
            <span className="eyebrow">
              {isEnglish ? 'Official donor wall' : 'Muro oficial de donadores'}
            </span>
            <h1>
              {isEnglish ? 'Humans with' : 'Humanos con'}
              <br />
              <span>{isEnglish ? 'a big heart.' : 'coraz\xF3n grandote.'}</span>
            </h1>
            <p>
              {isEnglish
                ? "This wall celebrates confirmed donations. Only the Croquet\xF3n admin team publishes names here, with each donor's permission."
                : 'Este muro celebra donaciones confirmadas. Solo el equipo administrador del Croquet\xF3n publica nombres aqu\xED, con autorizaci\xF3n de cada donador.'}
            </p>
          </div>
          <figure className="donors-meme">
            <Image
              src={donationMemeImage}
              alt={
                isEnglish
                  ? 'Dog demanding kibble donations'
                  : 'Perrito exigiendo donaciones de croquetas'
              }
            />
            <figcaption>
              {isEnglish
                ? 'Your name could be here. No pressure.'
                : 'Tu nombre podr\xEDa estar aqu\xED. Sin presi\xF3n.'}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="donor-wall donor-wall-page" aria-labelledby="official-donors-title">
        <div className="container">
          <div className="official-donors-heading">
            <span className="chapter">
              {isEnglish ? 'Verified by the pack' : 'Verificado por la manada'}
            </span>
            <h2 id="official-donors-title">
              {isEnglish ? 'The good human' : 'La lista de humanos'}
              <br />
              {isEnglish ? 'honor roll.' : 'buena onda.'}
            </h2>
            <p>
              {isEnglish
                ? 'Names appear after the admin team confirms the donation and publication permission.'
                : 'Los nombres aparecen despu\xE9s de que el equipo administrador confirma la donaci\xF3n y el permiso de publicaci\xF3n.'}
            </p>
          </div>

          <div className="official-donor-board">
            {officialDonors.length > 0 ? (
              <ol className="donor-list">
                {officialDonors.map((donor) => (
                  <li key={donor.name}>
                    <span>{donor.name}</span>
                    <strong>{donor.contribution}</strong>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="donor-empty">
                <Paw />
                <strong>
                  {isEnglish
                    ? 'The admin is sharpening the pencil.'
                    : 'El admin est\xE1 sac\xE1ndole punta al l\xE1piz.'}
                </strong>
                <span>
                  {isEnglish
                    ? 'Confirmed donor names will appear here soon.'
                    : 'Los nombres confirmados aparecer\xE1n aqu\xED muy pronto.'}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
