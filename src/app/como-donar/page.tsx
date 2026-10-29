'use client'

import { CalloutBanner } from '@/components/callout-banner'
import { StepCard } from '@/components/feature-card'
import { PageHero, PolaroidFigure } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { SectionIntro } from '@/components/section-intro'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import {
  donationMemeImage,
  chooseFoodImage,
  eventDeliveryImage,
  checkDateImage
} from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

export default function DonationPage() {
  const { language } = useLanguage()
  const isEnglish = language === 'en'
  return (
    <PageShell surface="warm">
      <PageHero
        surface="bar"
        spacing="donation"
        containerClassName="grid-cols-[1fr_0.85fr] gap-20"
        eyebrow={isEnglish ? 'How to donate' : 'C\xF3mo donar'}
        title={isEnglish ? 'One little kibble,' : 'Una croquetita,'}
        accentTitle={isEnglish ? 'please.' : 'por favor.'}
        titleClassName="mt-3"
        description={
          isEnglish
            ? 'No complicated quests here. Bring a sealed bag of dog food and help us turn an empty bowl into a happy ending.'
            : 'Aqu\xED no hay misiones complicadas. Trae una bolsa sellada de alimento y ay\xFAdanos a convertir un plato vac\xEDo en un final feliz.'
        }
        descriptionClassName="phone:text-base"
        aside={
          <PolaroidFigure
            tapes
            src={donationMemeImage}
            alt={
              isEnglish
                ? 'Masked dog demanding every bag of kibble'
                : 'Perrito enmascarado exigiendo todas las croquetas'
            }
            caption={isEnglish ? 'Hand over all the kibble' : 'Deme todas las croquetas que tenga'}
            className="relative mx-auto mt-5 w-[min(100%,390px)] tablet:mt-7.5"
            imageClassName="aspect-[0.753] rounded-[22px] shadow-[15px_18px_0_rgba(32,36,54,0.25)]"
            captionClassName="-mt-3.75 max-w-[90%] px-4.25 text-[17px] phone:text-[14px]"
          />
        }
      />

      <section
        className="pt-27.5 pb-30 phone:pt-18.75 phone:pb-22.5"
        aria-labelledby="donation-guide-title"
      >
        <Container>
          <SectionIntro
            className="mb-13.75 phone:mb-9.5"
            eyebrow={isEnglish ? 'Three easy steps' : 'Tres pasos sencillos'}
            titleId="donation-guide-title"
            titleClassName="mb-0"
            title={
              <>
                {isEnglish ? 'Donate without' : 'Dona sin'}
                <br />
                {isEnglish ? 'getting lost.' : 'hacerte bolas.'}
              </>
            }
          />
          <div className="group/steps grid grid-cols-[repeat(3,1fr)] items-stretch gap-5.5 phone:grid-cols-[1fr]">
            <StepCard
              step="01"
              title={isEnglish ? 'Choose the food' : 'Elige el alimento'}
              description={
                isEnglish
                  ? 'Any size of dry dog food bag helps. It must be sealed and in good condition.'
                  : 'Ayuda cualquier tama\xF1o de bolsa de croquetas. Debe estar sellada y en buen estado.'
              }
              imageSrc={chooseFoodImage}
              imageAlt={
                isEnglish
                  ? 'Dog carefully choosing food in front of a bakery display'
                  : 'Perrito eligiendo cuidadosamente alimento frente a una vitrina'
              }
              imageClassName="aspect-[1.33] rotate-[-1.5deg]"
            />
            <StepCard
              step="02"
              title={isEnglish ? 'Check the date' : 'Revisa la fecha'}
              description={
                isEnglish
                  ? 'Make sure it has not expired and that the packaging has no holes or moisture.'
                  : 'Verifica que no est\xE9 caducado y que el empaque no tenga perforaciones ni humedad.'
              }
              imageSrc={checkDateImage}
              imageAlt={
                isEnglish
                  ? 'Dog with glasses carefully checking a bag of kibble'
                  : 'Perrito con gafas revisando cuidadosamente una bolsa de croquetas'
              }
              imageClassName="aspect-square rotate-[0.75deg]"
            />
            <StepCard
              step="03"
              title={isEnglish ? 'Bring it to the event' : 'Tr\xE1elo al evento'}
              description={
                isEnglish
                  ? 'Saturday, October 26, from 10:00 to 17:00 at the main plaza of the Higher Technological Institute.'
                  : 'S\xE1bado 26 de octubre, de 10:00 a 17:00 h, en la explanada principal del Instituto Tecnol\xF3gico Superior.'
              }
              imageSrc={eventDeliveryImage}
              imageAlt={
                isEnglish
                  ? 'Small delivery dog carrying an orange backpack'
                  : 'Perrito repartidor llevando una mochila naranja'
              }
              imageClassName="aspect-[1.05] rotate-[1.5deg]"
            />
          </div>

          <CalloutBanner
            tone="coral"
            eyebrow={isEnglish ? 'Still have questions?' : '\xBFTodav\xEDa tienes dudas?'}
            title={isEnglish ? "Let's talk." : 'Hablemos.'}
            description={
              isEnglish
                ? "Write to us and we'll help you prepare your donation."
                : 'Escr\xEDbenos y te ayudamos a preparar tu donaci\xF3n.'
            }
            action={
              <Button
                variant="card-cta"
                className="mt-2.5"
                render={<a href="mailto:croqueton@tecnologico.edu.mx" />}
              >
                {isEnglish ? 'Send an email' : 'Enviar un correo'} <span>→</span>
              </Button>
            }
          />
        </Container>
      </section>
    </PageShell>
  )
}
