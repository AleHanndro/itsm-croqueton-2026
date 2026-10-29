'use client'

import Image from 'next/image'

import { PageHero, PolaroidFigure } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { SectionIntro } from '@/components/section-intro'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
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
            <article className="relative z-1 origin-center transform-[scale(1)] rounded-[10px_10px_24px_24px] border-t-7 border-accent bg-card px-7 py-8 text-ink opacity-100 shadow-card will-change-[transform,opacity] [transition:transform_0.38s_cubic-bezier(0.2,0.8,0.2,1),opacity_0.38s_ease,box-shadow_0.38s_ease] phone:px-5.75 phone:py-6.75 [@media(hover:hover)_and_(pointer:fine)]:group-has-[article:hover]/steps:not-hover:transform-[scale(0.965)] [@media(hover:hover)_and_(pointer:fine)]:group-has-[article:hover]/steps:not-hover:opacity-58 [@media(hover:hover)_and_(pointer:fine)]:hover:z-3 [@media(hover:hover)_and_(pointer:fine)]:hover:transform-[scale(1.045)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[13px_15px_0_#202436]">
              <span className="mb-5.5 grid size-12 place-items-center rounded-circle bg-brand font-heading text-[20px] font-black">
                01
              </span>
              <strong className="block font-heading text-[23px]">
                {isEnglish ? 'Choose the food' : 'Elige el alimento'}
              </strong>
              <p className="mt-2 text-body-sm leading-copy font-bold">
                {isEnglish
                  ? 'Any size of dry dog food bag helps. It must be sealed and in good condition.'
                  : 'Ayuda cualquier tama\xF1o de bolsa de croquetas. Debe estar sellada y en buen estado.'}
              </p>
              <Image
                className="mt-5.5 block aspect-[1.33] w-full rotate-[-1.5deg] rounded-card-sm border-5 border-ink object-cover"
                src={chooseFoodImage}
                alt={
                  isEnglish
                    ? 'Dog carefully choosing food in front of a bakery display'
                    : 'Perrito eligiendo cuidadosamente alimento frente a una vitrina'
                }
              />
            </article>
            <article className="relative z-1 origin-center transform-[scale(1)] rounded-[10px_10px_24px_24px] border-t-7 border-accent bg-card px-7 py-8 text-ink opacity-100 shadow-card will-change-[transform,opacity] [transition:transform_0.38s_cubic-bezier(0.2,0.8,0.2,1),opacity_0.38s_ease,box-shadow_0.38s_ease] phone:px-5.75 phone:py-6.75 [@media(hover:hover)_and_(pointer:fine)]:group-has-[article:hover]/steps:not-hover:transform-[scale(0.965)] [@media(hover:hover)_and_(pointer:fine)]:group-has-[article:hover]/steps:not-hover:opacity-58 [@media(hover:hover)_and_(pointer:fine)]:hover:z-3 [@media(hover:hover)_and_(pointer:fine)]:hover:transform-[scale(1.045)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[13px_15px_0_#202436]">
              <span className="mb-5.5 grid size-12 place-items-center rounded-circle bg-brand font-heading text-[20px] font-black">
                02
              </span>
              <strong className="block font-heading text-[23px]">
                {isEnglish ? 'Check the date' : 'Revisa la fecha'}
              </strong>
              <p className="mt-2 text-body-sm leading-copy font-bold">
                {isEnglish
                  ? 'Make sure it has not expired and that the packaging has no holes or moisture.'
                  : 'Verifica que no est\xE9 caducado y que el empaque no tenga perforaciones ni humedad.'}
              </p>
              <Image
                className="mt-5.5 block aspect-square w-full rotate-[0.75deg] rounded-card-sm border-5 border-ink object-cover"
                src={checkDateImage}
                alt={
                  isEnglish
                    ? 'Dog with glasses carefully checking a bag of kibble'
                    : 'Perrito con gafas revisando cuidadosamente una bolsa de croquetas'
                }
              />
            </article>
            <article className="relative z-1 origin-center transform-[scale(1)] rounded-[10px_10px_24px_24px] border-t-7 border-accent bg-card px-7 py-8 text-ink opacity-100 shadow-card will-change-[transform,opacity] [transition:transform_0.38s_cubic-bezier(0.2,0.8,0.2,1),opacity_0.38s_ease,box-shadow_0.38s_ease] phone:px-5.75 phone:py-6.75 [@media(hover:hover)_and_(pointer:fine)]:group-has-[article:hover]/steps:not-hover:transform-[scale(0.965)] [@media(hover:hover)_and_(pointer:fine)]:group-has-[article:hover]/steps:not-hover:opacity-58 [@media(hover:hover)_and_(pointer:fine)]:hover:z-3 [@media(hover:hover)_and_(pointer:fine)]:hover:transform-[scale(1.045)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[13px_15px_0_#202436]">
              <span className="mb-5.5 grid size-12 place-items-center rounded-circle bg-brand font-heading text-[20px] font-black">
                03
              </span>
              <strong className="block font-heading text-[23px]">
                {isEnglish ? 'Bring it to the event' : 'Tr\xE1elo al evento'}
              </strong>
              <p className="mt-2 text-body-sm leading-copy font-bold">
                {isEnglish
                  ? 'Saturday, October 26, from 10:00 to 17:00 at the main plaza of the Higher Technological Institute.'
                  : 'S\xE1bado 26 de octubre, de 10:00 a 17:00 h, en la explanada principal del Instituto Tecnol\xF3gico Superior.'}
              </p>
              <Image
                className="mt-5.5 block aspect-[1.05] w-full rotate-[1.5deg] rounded-card-sm border-5 border-ink object-cover"
                src={eventDeliveryImage}
                alt={
                  isEnglish
                    ? 'Small delivery dog carrying an orange backpack'
                    : 'Perrito repartidor llevando una mochila naranja'
                }
              />
            </article>
          </div>

          <div className="mt-20 flex items-center justify-between gap-10 rounded-[30px] bg-[#f2673f] px-12.5 py-11.25 text-card tablet:flex-col tablet:items-start phone:mt-13.75 phone:px-6 phone:py-8">
            <div>
              <Eyebrow variant="section" tone="ink">
                {isEnglish ? 'Still have questions?' : '\xBFTodav\xEDa tienes dudas?'}
              </Eyebrow>
              <h2 className="mt-1.25 mb-2.5 text-[clamp(44px,4.2vw,62px)] phone:text-[43px]">
                {isEnglish ? "Let's talk." : 'Hablemos.'}
              </h2>
              <p className="m-0 font-extrabold">
                {isEnglish
                  ? "Write to us and we'll help you prepare your donation."
                  : 'Escr\xEDbenos y te ayudamos a preparar tu donaci\xF3n.'}
              </p>
            </div>
            <Button
              variant="card-cta"
              className="mt-2.5"
              render={<a href="mailto:croqueton@tecnologico.edu.mx" />}
            >
              {isEnglish ? 'Send an email' : 'Enviar un correo'} <span>→</span>
            </Button>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
