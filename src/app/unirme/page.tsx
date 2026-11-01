'use client'

import { useState } from 'react'

import { CalloutBanner } from '@/components/callout-banner'
import { FeatureCard } from '@/components/feature-card'
import { JoinApplicationDialog } from '@/components/join-application-dialog'
import { PageHero, PolaroidFigure } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { SectionIntro } from '@/components/section-intro'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { recruitmentDogImage } from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

export default function JoinPage() {
  const { language } = useLanguage()
  const [showJoinForm, setShowJoinForm] = useState(false)

  const isEnglish = language === 'en'

  const openJoinForm = () => {
    setShowJoinForm(true)
  }

  return (
    <PageShell surface="mint">
      <PageHero
        surface="soft"
        spacing="default"
        containerClassName="grid-cols-[0.9fr_1.1fr] gap-20"
        eyebrow={isEnglish ? 'Join the pack' : '\xDAnete a la manada'}
        title={isEnglish ? 'Be part of the' : 'S\xE9 parte de los'}
        accentTitle={isEnglish ? 'Croquetones.' : 'Croquetones.'}
        description={
          isEnglish
            ? "You don't need superpowers. A little time, good ideas and a big heart are enough to help more bowls end up full."
            : 'No necesitas superpoderes. Con un poco de tiempo, buenas ideas y un coraz\xF3n enorme podemos lograr que m\xE1s platos terminen llenos.'
        }
        descriptionClassName="max-w-147.5 phone:text-base"
        actions={
          <>
            <Button
              className="mt-3.5 in-data-[theme='dark']:bg-[#ffc929] in-data-[theme='dark']:text-[#202436] in-data-[theme='dark']:shadow-[0_7px_0_#9f592f]!"
              onClick={openJoinForm}
            >
              {isEnglish ? 'I want to join' : 'Quiero unirme'}
            </Button>
            <small className="mt-4.75 block font-extrabold opacity-62">
              {isEnglish
                ? 'Opens your email. No secret initiation rituals.'
                : 'Abre tu correo. Sin rituales secretos de iniciaci\xF3n.'}
            </small>
          </>
        }
        aside={
          <PolaroidFigure
            src={recruitmentDogImage}
            alt={
              isEnglish
                ? 'Dog wearing glasses and using a laptop to welcome volunteers'
                : 'Perrito con lentes usando una laptop para recibir voluntarios'
            }
            caption={
              isEnglish
                ? 'Recruitment manager. Paid in kibble.'
                : 'Gerente de reclutamiento. Cobra en croquetas.'
            }
            speechBubble={
              isEnglish
                ? 'Want to lend a paw? Leave me your details.'
                : '\xBFQuieres echar una pata? D\xE9jame tus datos.'
            }
            className="relative mx-auto mt-10 w-[min(100%,340px)] pt-8.75 tablet:mt-13.75"
            imageClassName="aspect-[0.593] bg-white object-contain"
            captionClassName="phone:text-[13px]"
          />
        }
      />

      <section
        className="pt-27.5 pb-30 phone:pt-18.75 phone:pb-22.5"
        aria-labelledby="join-experience-title"
      >
        <Container>
          <SectionIntro
            eyebrow={isEnglish ? 'The Croquet\xF3n experience' : 'La experiencia Croquet\xF3n'}
            titleId="join-experience-title"
            titleClassName="mb-6"
            title={
              <>
                {isEnglish ? 'What awaits you' : '\xBFQu\xE9 te espera'}
                <br />
                {isEnglish ? 'in the pack?' : 'en la manada?'}
              </>
            }
            description={
              isEnglish
                ? 'Good people, wagging tails and the strange satisfaction of knowing that a bag of kibble can change an entire story.'
                : 'Gente buena onda, colitas felices y esa extra\xF1a satisfacci\xF3n de saber que una bolsa de croquetas puede cambiar una historia completa.'
            }
            descriptionClassName="max-w-150 text-[18px] leading-[1.55]"
          />
          <div className="mt-12.5 grid grid-cols-[repeat(3,1fr)] gap-5.5 tablet:grid-cols-[1fr]">
            <FeatureCard
              iconTone="brand"
              title={isEnglish ? 'Leave a paw print' : 'Dejar una huellita'}
              description={
                isEnglish
                  ? 'See how your time turns into full bowls, calmer bellies and much happier tails.'
                  : 'Mira c\xF3mo tu tiempo se convierte en platos llenos, pancitas tranquilas y colitas mucho m\xE1s felices.'
              }
            />
            <FeatureCard
              iconTone="accent"
              title={isEnglish ? 'Meet your pack' : 'Encontrar tu manada'}
              description={
                isEnglish
                  ? 'Share laughs, ideas and possibly too many dog photos with people who care about the same cause.'
                  : 'Comparte risas, ideas y posiblemente demasiadas fotos de perros con personas que creen en la misma causa.'
              }
            />
            <FeatureCard
              iconTone="secondary"
              title={isEnglish ? 'Unlock good memories' : 'Desbloquear buenos recuerdos'}
              description={
                isEnglish
                  ? 'Take part in an experience worth remembering and earn your place in the next pack photo.'
                  : 'Vive una experiencia que vale la pena recordar y gana tu lugar en la pr\xF3xima foto de la manada.'
              }
            />
          </div>

          <CalloutBanner
            tone="ink"
            eyebrow={isEnglish ? 'Pack promise' : 'Promesa de la manada'}
            title={isEnglish ? 'Your help matters.' : 'Tu ayuda s\xED cuenta.'}
            description={
              isEnglish
                ? 'We organize tasks, respect your time and share the impact achieved by the team.'
                : 'Organizamos las tareas, respetamos tu tiempo y compartimos el impacto logrado por el equipo.'
            }
            action={
              <Button variant="card-cta" className="mt-2.5" onClick={openJoinForm}>
                {isEnglish ? 'Join the team' : 'Unirme al equipo'} <span>→</span>
              </Button>
            }
          />
        </Container>
      </section>

      <JoinApplicationDialog
        open={showJoinForm}
        onOpenChange={setShowJoinForm}
        isEnglish={isEnglish}
      />
    </PageShell>
  )
}
