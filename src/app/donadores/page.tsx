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
    <main className="min-h-screen bg-surface-page-mint text-foreground">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="bg-surface-bar pt-22.5 pb-26.25 phone:pt-15 phone:pb-20">
        <div className="relative z-2 mx-auto grid w-[min(1240px,calc(100%-96px))] grid-cols-[1fr_0.7fr] items-center gap-21.25 tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div>
            <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
              {isEnglish ? 'Official donor wall' : 'Muro oficial de donadores'}
            </span>
            <h1 className="mt-3.5 mb-7 text-[clamp(60px,6vw,90px)] leading-display-tight font-extrabold phone:text-[52px]">
              {isEnglish ? 'Humans with' : 'Humanos con'}
              <br />
              <span className="text-accent">
                {isEnglish ? 'a big heart.' : 'coraz\xF3n grandote.'}
              </span>
            </h1>
            <p className="max-w-155 text-body leading-loose font-extrabold">
              {isEnglish
                ? "This wall celebrates confirmed donations. Only the Croquet\xF3n admin team publishes names here, with each donor's permission."
                : 'Este muro celebra donaciones confirmadas. Solo el equipo administrador del Croquet\xF3n publica nombres aqu\xED, con autorizaci\xF3n de cada donador.'}
            </p>
          </div>
          <figure className="rotate-2 tablet:mx-auto tablet:mt-7.5 tablet:w-[min(100%,430px)]">
            <Image
              src={donationMemeImage}
              className="block w-full rounded-[22px] border-9 border-card shadow-[14px_16px_0_rgba(32,36,54,0.24)]"
              alt={
                isEnglish
                  ? 'Dog demanding kibble donations'
                  : 'Perrito exigiendo donaciones de croquetas'
              }
            />
            <figcaption className="relative mx-auto -mt-3 w-max max-w-[90%] -rotate-3 rounded-tag bg-ink px-3.5 py-2.25 text-center font-heading font-black text-card">
              {isEnglish
                ? 'Your name could be here. No pressure.'
                : 'Tu nombre podr\xEDa estar aqu\xED. Sin presi\xF3n.'}
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="min-h-175 bg-surface-donor-wall pt-27.5 pb-31.25 phone:pt-18.75 phone:pb-22.5"
        aria-labelledby="official-donors-title"
      >
        <div className="relative z-2 mx-auto w-[min(1240px,calc(100%-96px))] tablet:w-[min(100%-36px,680px)] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div className="max-w-180">
            <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
              {isEnglish ? 'Verified by the pack' : 'Verificado por la manada'}
            </span>
            <h2 id="official-donors-title" className="mb-5.5">
              {isEnglish ? 'The good human' : 'La lista de humanos'}
              <br />
              {isEnglish ? 'honor roll.' : 'buena onda.'}
            </h2>
            <p className="max-w-162.5 text-body leading-copy font-extrabold">
              {isEnglish
                ? 'Names appear after the admin team confirms the donation and publication permission.'
                : 'Los nombres aparecen despu\xE9s de que el equipo administrador confirma la donaci\xF3n y el permiso de publicaci\xF3n.'}
            </p>
          </div>

          <div className="mt-12 min-h-97.5 rounded-card-lg border-4 border-stroke bg-card p-8 text-ink shadow-panel phone:min-h-85 phone:px-4.5 phone:py-5.5">
            {officialDonors.length > 0 ? (
              <ol className="mt-5.5 grid list-none gap-2.25 p-0">
                {officialDonors.map((donor) => (
                  <li
                    key={donor.name}
                    className="flex items-center justify-between gap-4.5 rounded-chip bg-surface-chip px-3.5 py-3 font-extrabold before:text-accent before:content-['✦']"
                  >
                    <span className="flex-1 wrap-anywhere">{donor.name}</span>
                    <strong className="whitespace-nowrap text-accent">{donor.contribution}</strong>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="grid min-h-82.5 place-items-center content-center gap-2.5 text-center">
                <Paw className="size-17.5 -rotate-12 text-[#d8cba9]" />
                <strong className="max-w-82.5 font-heading text-[23px]">
                  {isEnglish
                    ? 'The admin is sharpening the pencil.'
                    : 'El admin est\xE1 sac\xE1ndole punta al l\xE1piz.'}
                </strong>
                <span className="text-small font-extrabold opacity-60">
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
