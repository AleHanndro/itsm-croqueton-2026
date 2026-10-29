'use client'

import { Paw } from '@/assets/icons/paw'
import { PageHero, PolaroidFigure } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { SectionIntro } from '@/components/section-intro'
import { Container } from '@/components/ui/container'
import { donationMemeImage } from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

const officialDonors: { name: string; contribution: string }[] = []

export default function DonorsPage() {
  const { language } = useLanguage()

  const isEnglish = language === 'en'

  return (
    <PageShell surface="mint">
      <PageHero
        surface="bar"
        spacing="compact"
        containerClassName="grid-cols-[1fr_0.7fr] gap-21.25"
        eyebrow={isEnglish ? 'Official donor wall' : 'Muro oficial de donadores'}
        title={isEnglish ? 'Humans with' : 'Humanos con'}
        accentTitle={isEnglish ? 'a big heart.' : 'coraz\xF3n grandote.'}
        titleClassName="text-[clamp(60px,6vw,90px)] leading-[0.85]"
        description={
          isEnglish
            ? "This wall celebrates confirmed donations. Only the Croquet\xF3n admin team publishes names here, with each donor's permission."
            : 'Este muro celebra donaciones confirmadas. Solo el equipo administrador del Croquet\xF3n publica nombres aqu\xED, con autorizaci\xF3n de cada donador.'
        }
        aside={
          <PolaroidFigure
            src={donationMemeImage}
            alt={
              isEnglish
                ? 'Dog demanding kibble donations'
                : 'Perrito exigiendo donaciones de croquetas'
            }
            caption={
              isEnglish
                ? 'Your name could be here. No pressure.'
                : 'Tu nombre podr\xEDa estar aqu\xED. Sin presi\xF3n.'
            }
            className="tablet:mx-auto tablet:mt-7.5 tablet:w-[min(100%,430px)]"
            imageClassName="rounded-[22px] border-9 shadow-[14px_16px_0_rgba(32,36,54,0.24)]"
            captionClassName="-mt-3 max-w-[90%] rounded-tag px-3.5 py-2.25"
          />
        }
      />

      <section
        className="min-h-175 bg-surface-donor-wall pt-27.5 pb-31.25 phone:pt-18.75 phone:pb-22.5"
        aria-labelledby="official-donors-title"
      >
        <Container>
          <SectionIntro
            className="max-w-180"
            eyebrow={isEnglish ? 'Verified by the pack' : 'Verificado por la manada'}
            titleId="official-donors-title"
            title={
              <>
                {isEnglish ? 'The good human' : 'La lista de humanos'}
                <br />
                {isEnglish ? 'honor roll.' : 'buena onda.'}
              </>
            }
            description={
              isEnglish
                ? 'Names appear after the admin team confirms the donation and publication permission.'
                : 'Los nombres aparecen despu\xE9s de que el equipo administrador confirma la donaci\xF3n y el permiso de publicaci\xF3n.'
            }
            descriptionClassName="max-w-162.5"
          />

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
        </Container>
      </section>
    </PageShell>
  )
}
