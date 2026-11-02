'use client'

import { useEffect, useRef, useState } from 'react'

import { GoalProgressCard } from '@/components/goal-progress-card'
import { PageHero, PolaroidFigure } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { SectionIntro } from '@/components/section-intro'
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
          <GoalProgressCard
            collectedKilograms={collectedKilograms}
            goalProgress={goalProgress}
            showGoal={showGoal}
            isEnglish={isEnglish}
          />
        </Container>
      </section>
    </PageShell>
  )
}
