'use client'

import Image from 'next/image'

import { LanguageToggle, ThemeToggle, SiteNavigation } from '@/components/ui'
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
    <main className="min-h-screen bg-surface-page-warm text-foreground">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="bg-surface-bar pt-21.25 pb-26.25 phone:pt-15 phone:pb-20">
        <div className="relative z-2 mx-auto grid w-[min(1240px,calc(100%-96px))] grid-cols-[1fr_0.85fr] items-center gap-20 tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div>
            <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
              {isEnglish ? 'How to donate' : 'C\xF3mo donar'}
            </span>
            <h1 className="mt-3 mb-7 text-[clamp(62px,6.3vw,96px)] leading-display-tight font-extrabold phone:text-[52px]">
              {isEnglish ? 'One little kibble,' : 'Una croquetita,'}
              <br />
              <span className="text-accent">{isEnglish ? 'please.' : 'por favor.'}</span>
            </h1>
            <p className="max-w-155 text-body leading-loose font-extrabold phone:text-base">
              {isEnglish
                ? 'No complicated quests here. Bring a sealed bag of dog food and help us turn an empty bowl into a happy ending.'
                : 'Aqu\xED no hay misiones complicadas. Trae una bolsa sellada de alimento y ay\xFAdanos a convertir un plato vac\xEDo en un final feliz.'}
            </p>
          </div>
          <figure className="relative mx-auto mt-5 w-[min(100%,390px)] rotate-2 tablet:mt-7.5">
            <span className="absolute -top-2 -left-6.5 z-7 h-6.75 w-21.25 -rotate-35 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
            <span className="absolute -top-2 -right-6.25 z-7 h-6.75 w-21.25 rotate-34 bg-[rgba(255,235,168,0.88)] shadow-[0_2px_3px_rgba(0,0,0,0.08)]" />
            <Image
              src={donationMemeImage}
              className="block aspect-[0.753] w-full rounded-[22px] border-10 border-card object-cover shadow-[15px_18px_0_rgba(32,36,54,0.25)]"
              alt={
                isEnglish
                  ? 'Masked dog demanding every bag of kibble'
                  : 'Perrito enmascarado exigiendo todas las croquetas'
              }
            />
            <figcaption className="relative mx-auto -mt-3.75 w-max max-w-[90%] -rotate-3 rounded-lg bg-ink px-4.25 py-2.5 text-center font-heading text-body font-black text-card phone:text-[14px]">
              {isEnglish ? 'Hand over all the kibble' : 'Deme todas las croquetas que tenga'}
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="pt-27.5 pb-30 phone:pt-18.75 phone:pb-22.5"
        aria-labelledby="donation-guide-title"
      >
        <div className="relative z-2 mx-auto w-[min(1240px,calc(100%-96px))] tablet:w-[min(100%-36px,680px)] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div className="mb-13.75 max-w-175 phone:mb-9.5">
            <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
              {isEnglish ? 'Three easy steps' : 'Tres pasos sencillos'}
            </span>
            <h2 id="donation-guide-title" className="mb-0">
              {isEnglish ? 'Donate without' : 'Dona sin'}
              <br />
              {isEnglish ? 'getting lost.' : 'hacerte bolas.'}
            </h2>
          </div>
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
              <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-ink uppercase">
                {isEnglish ? 'Still have questions?' : '\xBFTodav\xEDa tienes dudas?'}
              </span>
              <h2 className="mt-1.25 mb-2.5 text-[clamp(44px,4.2vw,62px)] phone:text-[43px]">
                {isEnglish ? "Let's talk." : 'Hablemos.'}
              </h2>
              <p className="m-0 font-extrabold">
                {isEnglish
                  ? "Write to us and we'll help you prepare your donation."
                  : 'Escr\xEDbenos y te ayudamos a preparar tu donaci\xF3n.'}
              </p>
            </div>
            <a
              className="relative mt-2.5 inline-flex min-h-17 items-center justify-center gap-7.5 rounded-full border-3 border-current bg-card px-8.5 text-[20px] font-black text-ink shadow-[0_9px_0_var(--accent-deep)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] active:transform-[translateY(4px)] active:shadow-none! [&_span]:text-[31px] [&_span]:leading-0"
              href="mailto:croqueton@tecnologico.edu.mx"
            >
              {isEnglish ? 'Send an email' : 'Enviar un correo'} <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
