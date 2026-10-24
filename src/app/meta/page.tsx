'use client'

import { cn } from 'cn'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { Paw } from '@/assets/icons/paw'
import { LanguageToggle, ThemeToggle, SiteNavigation } from '@/components/ui'
import { goalImage } from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

const collectedKilograms = 640
const goalProgress = 64

export default function GoalPage() {
  const { language } = useLanguage()
  const [showGoal, setShowGoal] = useState(false)
  const goalRef = useRef(null)
  const isEnglish = language === 'en'

  useEffect(() => {
    const goal = goalRef.current
    if (!goal) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowGoal(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(goal)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-surface-page-warm text-foreground">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="bg-surface-soft pt-22.5 pb-27.5 phone:pt-15 phone:pb-20">
        <div className="relative z-2 mx-auto grid w-[min(1240px,calc(100%-96px))] grid-cols-[1fr_0.75fr] items-center gap-22.5 tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div>
            <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
              {isEnglish ? 'The great kibble goal' : 'La gran meta croquetera'}
            </span>
            <h1 className="mt-3.5 mb-7 text-[clamp(62px,6.3vw,96px)] leading-display-tight font-extrabold phone:text-[52px]">
              {isEnglish ? "Let's fill" : 'Vamos a llenar'}
              <br />
              <span className="text-accent">{isEnglish ? 'every bowl.' : 'todos los platos.'}</span>
            </h1>
            <p className="max-w-155 text-body leading-loose font-extrabold phone:text-base">
              {isEnglish
                ? 'Our goal is to collect 1,000 kg of sealed dog food. It sounds huge, but so did teaching Croqueto not to eat the homework.'
                : 'Queremos reunir 1,000 kg de alimento sellado. Suena enorme, pero tambi\xE9n sonaba enorme ense\xF1arle a Croqueto a no comerse la tarea.'}
            </p>
          </div>
          <figure className="relative mx-auto w-[min(100%,430px)] rotate-2 tablet:mt-7.5">
            <Image
              src={goalImage}
              className="block aspect-[0.778] w-full rounded-3xl border-10 border-card object-cover shadow-[16px_18px_0_rgba(32,36,54,0.23)]"
              alt={
                isEnglish
                  ? 'Happy group of dogs celebrating among donated food bags'
                  : 'Grupo de perros felices celebrando entre bolsas de alimento donado'
              }
            />
            <figcaption className="relative mx-auto -mt-3.5 w-max max-w-[88%] -rotate-3 rounded-lg bg-ink px-4 py-2.5 text-center font-heading font-black text-card phone:text-small">
              {isEnglish ? 'Final boss: the empty bowl.' : 'Jefe final: el plato vac\xEDo.'}
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        ref={goalRef}
        className="flex min-h-180 items-center bg-surface-team-goal py-25 phone:min-h-auto phone:py-18.75"
        aria-labelledby="croquette-goal-title"
      >
        <div className="relative z-2 mx-auto grid w-[min(1240px,calc(100%-96px))] grid-cols-[0.8fr_1.2fr] items-center gap-20 tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] tablet:gap-8.75 phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div>
            <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
              {isEnglish ? 'Current progress' : 'Progreso actual'}
            </span>
            <h2
              id="croquette-goal-title"
              className="mb-6.25 min-[541px]:text-[clamp(48px,4.6vw,70px)]"
            >
              1,000 kg
              <br />
              {isEnglish ? 'of kibble.' : 'de croquetas.'}
            </h2>
            <p className="max-w-135 text-lg leading-copy font-extrabold">
              {isEnglish
                ? `We have collected ${collectedKilograms} kg. We need ${Math.max(0, 1e3 - collectedKilograms)} more to make the scale say \u201Cwow\u201D and many tails say \u201Cthank you.\u201D`
                : `Llevamos ${collectedKilograms} kg reunidos. Faltan ${Math.max(0, 1e3 - collectedKilograms)} para que la b\xE1scula diga \u201Cguau\u201D y muchas colitas digan \u201Cgracias\u201D.`}
            </p>
          </div>
          <div className="relative rotate-1 rounded-card-lg border-4 border-stroke bg-card px-10 pt-9.5 pb-8 text-ink shadow-panel before:absolute before:-top-3.25 before:left-1/2 before:h-6.25 before:w-18.5 before:-translate-x-1/2 before:-rotate-2 before:bg-[rgba(255,235,168,0.9)] before:content-[''] phone:px-5 phone:pt-8 phone:pb-6.75">
            <div className="absolute -top-8.75 right-6 flex rotate-8 gap-1.75" aria-hidden="true">
              <span className="h-4.25 w-6 rounded-circle border-4 border-ink bg-kibble-dark" />
              <span className="size-4.5 -translate-y-2.25 rounded-circle border-4 border-ink bg-kibble-light" />
              <span className="h-4.25 w-6 rounded-circle border-4 border-ink bg-kibble-dark" />
            </div>
            <div className="mb-6.75 flex items-end justify-between">
              <div className="grid">
                <strong className="font-heading text-[48px] leading-display phone:text-[40px]">
                  {collectedKilograms} kg
                </strong>
                <span className="mt-1.75 text-caption font-black tracking-label-wide uppercase">
                  {isEnglish ? 'collected' : 'reunidos'}
                </span>
              </div>
              <div className="grid text-right">
                <strong className="font-heading text-[48px] leading-display phone:text-[40px]">
                  1,000 kg
                </strong>
                <span className="mt-1.75 text-caption font-black tracking-label-wide uppercase">
                  {isEnglish ? 'the goal' : 'la meta'}
                </span>
              </div>
            </div>
            <div
              className="relative h-5 rounded-pill border-4 border-ink bg-[#e7dcbf]"
              style={{ '--goal-progress': `${goalProgress}%` } as CSSProperties}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={1e3}
              aria-valuenow={collectedKilograms}
              aria-label={
                isEnglish
                  ? `${collectedKilograms} of 1,000 kilograms collected`
                  : `${collectedKilograms} de 1,000 kilogramos reunidos`
              }
            >
              <span
                className={cn(
                  'absolute inset-y-0 left-0 w-0 rounded-pill bg-accent motion-reduce:w-(--goal-progress,64%)!',
                  showGoal && 'animate-[team-goal-fill_1.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]'
                )}
              />
              <span
                className={cn(
                  'absolute top-1/2 left-0 z-2 grid size-13.5 transform-[translate(-50%,-50%)_rotate(-18deg)] place-items-center rounded-circle border-4 border-ink bg-brand text-ink opacity-0 phone:size-12 [&_svg]:size-8',
                  'motion-reduce:left-(--goal-progress,64%)! motion-reduce:transform-[translate(-50%,-50%)]! motion-reduce:animate-none! motion-reduce:opacity-100!',
                  showGoal && 'animate-[team-goal-paw_1.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]'
                )}
              >
                <Paw />
              </span>
            </div>
            <div className="mt-3.75 flex justify-between text-caption font-black tracking-label uppercase phone:text-micro">
              <span>{isEnglish ? 'First kibble' : 'Primera croqueta'}</span>
              <span>{isEnglish ? 'Bowls full' : 'Platos llenos'}</span>
            </div>
            <p className="mt-7 border-t-2 border-dashed border-divider pt-5 text-center font-heading text-body font-extrabold">
              {isEnglish
                ? "No donation is too small. Except an imaginary kibble. Those don't count."
                : 'Ninguna donaci\xF3n es peque\xF1a. Excepto una croqueta imaginaria. Esas no cuentan.'}
            </p>
            <Link
              className="relative mx-auto mt-6.75 inline-flex min-h-14 w-max items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink pr-4.5 pl-6.75 font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none!"
              href="/como-donar"
            >
              {isEnglish ? 'Help the goal' : 'Ayudar a la meta'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
