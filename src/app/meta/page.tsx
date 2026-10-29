'use client'

import { cn } from 'cn'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { Paw } from '@/assets/icons/paw'
import { PageHero, PolaroidFigure } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { SectionIntro } from '@/components/section-intro'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
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
    <PageShell surface="warm">
      <PageHero
        surface="soft"
        spacing="default"
        containerClassName="grid-cols-[1fr_0.75fr] gap-22.5"
        eyebrow={isEnglish ? 'The great kibble goal' : 'La gran meta croquetera'}
        title={isEnglish ? "Let's fill" : 'Vamos a llenar'}
        accentTitle={isEnglish ? 'every bowl.' : 'todos los platos.'}
        description={
          isEnglish
            ? 'Our goal is to collect 1,000 kg of sealed dog food. It sounds huge, but so did teaching Croqueto not to eat the homework.'
            : 'Queremos reunir 1,000 kg de alimento sellado. Suena enorme, pero tambi\xE9n sonaba enorme ense\xF1arle a Croqueto a no comerse la tarea.'
        }
        descriptionClassName="phone:text-base"
        aside={
          <PolaroidFigure
            src={goalImage}
            alt={
              isEnglish
                ? 'Happy group of dogs celebrating among donated food bags'
                : 'Grupo de perros felices celebrando entre bolsas de alimento donado'
            }
            caption={isEnglish ? 'Final boss: the empty bowl.' : 'Jefe final: el plato vac\xEDo.'}
            className="relative mx-auto w-[min(100%,430px)] tablet:mt-7.5"
            imageClassName="aspect-[0.778]"
            captionClassName="phone:text-[13px]"
          />
        }
      />

      <section
        ref={goalRef}
        className="flex min-h-180 items-center bg-surface-team-goal py-25 phone:min-h-auto phone:py-18.75"
        aria-labelledby="croquette-goal-title"
      >
        <Container className="grid grid-cols-[0.8fr_1.2fr] items-center gap-20 tablet:grid-cols-[1fr] tablet:gap-8.75">
          <SectionIntro
            className="max-w-none"
            eyebrow={isEnglish ? 'Current progress' : 'Progreso actual'}
            titleId="croquette-goal-title"
            titleClassName="mb-6.25 min-[541px]:text-[clamp(48px,4.6vw,70px)]"
            title={
              <>
                1,000 kg
                <br />
                {isEnglish ? 'of kibble.' : 'de croquetas.'}
              </>
            }
            description={
              isEnglish
                ? `We have collected ${collectedKilograms} kg. We need ${Math.max(0, 1e3 - collectedKilograms)} more to make the scale say \u201Cwow\u201D and many tails say \u201Cthank you.\u201D`
                : `Llevamos ${collectedKilograms} kg reunidos. Faltan ${Math.max(0, 1e3 - collectedKilograms)} para que la b\xE1scula diga \u201Cguau\u201D y muchas colitas digan \u201Cgracias\u201D.`
            }
            descriptionClassName="max-w-135 text-[18px] leading-[1.55]"
          />
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
            <Button className="mx-auto mt-6.75 w-max" render={<Link href="/como-donar" />}>
              {isEnglish ? 'Help the goal' : 'Ayudar a la meta'}
            </Button>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
