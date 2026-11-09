'use client'

import { useEffect, useRef, useState } from 'react'

import { GoalProgressCard } from '@/components/goal-progress-card'
import { PageHero, PolaroidFigure } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { SectionIntro } from '@/components/section-intro'
import { Container } from '@/components/ui/container'
import { goalImage } from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

type DonorRecord = {
  croquetteAmount: number
  croquetteUnit: 'g' | 'kg'
}

function readDonors(): DonorRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem('croqueton-donors')
    return stored ? (JSON.parse(stored) as DonorRecord[]) : []
  } catch {
    return []
  }
}

function collectedFromDonors() {
  return readDonors().reduce((total, record) => {
    const amount =
      record.croquetteUnit === 'g' ? record.croquetteAmount / 1000 : record.croquetteAmount
    return total + (Number.isFinite(amount) ? amount : 0)
  }, 0)
}

export default function GoalPage() {
  const { language } = useLanguage()
  const [showGoal, setShowGoal] = useState(false)
  const [collectedKilograms, setCollectedKilograms] = useState(0)
  const [goalKg, setGoalKg] = useState(1000)
  const goalRef = useRef(null)
  const isEnglish = language === 'en'

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/meta')
        if (!response.ok) throw new Error('request_failed')
        const data = (await response.json()) as { collectedKg: number; goalKg: number }
        setCollectedKilograms(data.collectedKg)
        setGoalKg(data.goalKg)
      } catch {
        setCollectedKilograms(0)
        setGoalKg(1000)
      }
    }
    void load()
  }, [])

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

  const goalProgress = Math.min(100, goalKg > 0 ? (collectedKilograms / goalKg) * 100 : 0)

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
                {goalKg} kg
                <br />
                {isEnglish ? 'of kibble.' : 'de croquetas.'}
              </>
            }
            description={
              isEnglish
                ? `We have collected ${collectedKilograms} kg. We need ${Math.max(0, goalKg - collectedKilograms)} more to make the scale say \u201Cwow\u201D and many tails say \u201Cthank you.\u201D`
                : `Llevamos ${collectedKilograms} kg reunidos. Faltan ${Math.max(0, goalKg - collectedKilograms)} para que la b\xE1scula diga \u201Cguau\u201D y muchas colitas digan \u201Cgracias\u201D.`
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
