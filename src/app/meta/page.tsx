'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { LanguageToggle, ThemeToggle, Paw, SiteNavigation } from '@/components/ui'
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
    <main className="goal-page">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="goal-hero">
        <div className="goal-hero-grid container">
          <div className="goal-hero-copy">
            <span className="eyebrow">
              {isEnglish ? 'The great kibble goal' : 'La gran meta croquetera'}
            </span>
            <h1>
              {isEnglish ? "Let's fill" : 'Vamos a llenar'}
              <br />
              <span>{isEnglish ? 'every bowl.' : 'todos los platos.'}</span>
            </h1>
            <p>
              {isEnglish
                ? 'Our goal is to collect 1,000 kg of sealed dog food. It sounds huge, but so did teaching Croqueto not to eat the homework.'
                : 'Queremos reunir 1,000 kg de alimento sellado. Suena enorme, pero tambi\xE9n sonaba enorme ense\xF1arle a Croqueto a no comerse la tarea.'}
            </p>
          </div>
          <figure className="goal-hero-image">
            <Image
              src={goalImage}
              alt={
                isEnglish
                  ? 'Happy group of dogs celebrating among donated food bags'
                  : 'Grupo de perros felices celebrando entre bolsas de alimento donado'
              }
            />
            <figcaption>
              {isEnglish ? 'Final boss: the empty bowl.' : 'Jefe final: el plato vac\xEDo.'}
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        ref={goalRef}
        className="team-goal croquette-goal"
        aria-labelledby="croquette-goal-title"
      >
        <div className="team-goal-grid container">
          <div className="team-goal-copy">
            <span className="chapter">{isEnglish ? 'Current progress' : 'Progreso actual'}</span>
            <h2 id="croquette-goal-title">
              1,000 kg
              <br />
              {isEnglish ? 'of kibble.' : 'de croquetas.'}
            </h2>
            <p>
              {isEnglish
                ? `We have collected ${collectedKilograms} kg. We need ${Math.max(0, 1e3 - collectedKilograms)} more to make the scale say \u201Cwow\u201D and many tails say \u201Cthank you.\u201D`
                : `Llevamos ${collectedKilograms} kg reunidos. Faltan ${Math.max(0, 1e3 - collectedKilograms)} para que la b\xE1scula diga \u201Cguau\u201D y muchas colitas digan \u201Cgracias\u201D.`}
            </p>
          </div>
          <div className="team-goal-card croquette-goal-card">
            <div className="goal-kibbles" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="team-goal-numbers">
              <div>
                <strong>{collectedKilograms} kg</strong>
                <span>{isEnglish ? 'collected' : 'reunidos'}</span>
              </div>
              <div>
                <strong>1,000 kg</strong>
                <span>{isEnglish ? 'the goal' : 'la meta'}</span>
              </div>
            </div>
            <div
              className={`team-goal-track ${showGoal ? 'is-advancing' : ''}`}
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
              <span className="team-goal-fill" />
              <span className="team-goal-paw">
                <Paw />
              </span>
            </div>
            <div className="team-goal-labels">
              <span>{isEnglish ? 'First kibble' : 'Primera croqueta'}</span>
              <span>{isEnglish ? 'Bowls full' : 'Platos llenos'}</span>
            </div>
            <p>
              {isEnglish
                ? "No donation is too small. Except an imaginary kibble. Those don't count."
                : 'Ninguna donaci\xF3n es peque\xF1a. Excepto una croqueta imaginaria. Esas no cuentan.'}
            </p>
            <Link className="button button-dark goal-donate-button" href="/como-donar">
              {isEnglish ? 'Help the goal' : 'Ayudar a la meta'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
