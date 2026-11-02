'use client'

import { cn } from 'cn'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { ArrowDown } from '@/assets/icons/arrow-down'
import { Cloud } from '@/assets/icons/cloud'
import { Paw } from '@/assets/icons/paw'
import {
  HomeFinaleSection,
  HomeRescueSection,
  SiteFooter,
  StoryChapter
} from '@/components/home-sections'
import { LanguageToggle } from '@/components/layout/language-toggle'
import { SiteNavigation } from '@/components/layout/site-navigation'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { StoryImage, MoodPollCard } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { dogFacts, dogFactsEn } from '@/lib/content'
import {
  chapterOneImage,
  chapterTwoImage,
  chapterThreeImage,
  chapterFourImage,
  heroDogImage
} from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

export default function HomePage() {
  const { language } = useLanguage()
  const [mascot, setMascot] = useState({ message: '', secretFound: false })
  const [isNavScrolled, setIsNavScrolled] = useState(false)
  const [celebrateFinale, setCelebrateFinale] = useState(false)
  const [sparkleRescue, setSparkleRescue] = useState(false)
  const finaleRef = useRef<HTMLElement | null>(null)
  const rescueRef = useRef<HTMLElement | null>(null)

  const isEnglish = language === 'en'

  useEffect(() => {
    const updateNavigation = () => setIsNavScrolled(window.scrollY > 24)
    updateNavigation()
    window.addEventListener('scroll', updateNavigation, { passive: true })
    return () => window.removeEventListener('scroll', updateNavigation)
  }, [])

  useEffect(() => {
    const finale = finaleRef.current
    if (!finale) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setCelebrateFinale(entry.isIntersecting)
      },
      { threshold: 0.01 }
    )
    observer.observe(finale)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const rescue = rescueRef.current
    if (!rescue) return
    const observer = new IntersectionObserver(([entry]) => setSparkleRescue(entry.isIntersecting), {
      threshold: 0.01
    })
    observer.observe(rescue)
    return () => observer.disconnect()
  }, [])

  const surpriseMascot = () => {
    setMascot((current) => {
      if (!current.secretFound) {
        return {
          message: isEnglish ? 'You found the secret button' : 'Haz encontrado el bot\xF3n secreto',
          secretFound: true
        }
      }

      const facts = isEnglish ? dogFactsEn : dogFacts
      const availableFacts = facts.filter((fact) => fact !== current.message)
      const randomFact = availableFacts[Math.floor(Math.random() * availableFacts.length)]

      return { message: randomFact, secretFound: true }
    })
  }

  return (
    <main>
      <LanguageToggle />
      <ThemeToggle />
      <SkipLink isEnglish={isEnglish} />
      <SiteNavigation home isScrolled={isNavScrolled} />

      <section
        id="inicio"
        className="relative isolate flex min-h-225 items-center bg-background pt-26 tablet:min-h-0 tablet:pt-31.25"
      >
        <Cloud className="absolute top-40 -left-10 w-62.5 text-fg-cloud opacity-75" />
        <Cloud className="absolute top-31.25 right-17.5 w-47.5 text-fg-cloud opacity-75" />
        <Paw className="absolute top-37.5 left-[42%] w-22.5 -rotate-18 text-fg-paw opacity-55" />
        <Paw className="absolute right-[4%] bottom-32.5 w-32.5 rotate-23 text-fg-paw opacity-55" />
        <Container className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-x-[clamp(56px,7vw,120px)] pt-6 pb-28 tablet:grid-cols-[1fr] tablet:gap-y-18 tablet:pt-0 tablet:pb-35 phone:gap-y-14 phone:pb-32">
          <div className="z-5 pl-7.5 tablet:p-0">
            <Eyebrow>{isEnglish ? 'A furry tale' : 'Una historia de pelos'}</Eyebrow>
            <h1 className="mt-3 mb-8.5 text-[clamp(86px,9.5vw,146px)] leading-[0.72] font-extrabold text-foreground tablet:text-[104px] phone:text-[70px]">
              Croque<span className="text-accent">tón</span>
            </h1>
            <p className="mb-5 font-heading text-[clamp(31px,3vw,37px)] leading-[1.08] font-bold phone:text-title-sm">
              {isEnglish ? "My life couldn't" : 'Mi vida no podr\xEDa'}
              <br />
              {isEnglish ? 'be better.' : 'ir mejor.'}
            </p>
            <p className="max-w-107.5 text-body leading-copy font-bold opacity-72">
              {isEnglish
                ? 'Narrated by Croqueto, certified expert in naps and second chances.'
                : 'Narrado por Croqueto, experto certificado en siestas y segundas oportunidades.'}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3.5 phone:mt-7.5">
              <Button variant="hero" className="phone:w-full" render={<Link href="/como-donar" />}>
                {isEnglish ? 'I want to donate' : 'Quiero donar'}
              </Button>
              <Button variant="link-border" className="text-[15px]" render={<a href="#historia" />}>
                {isEnglish ? 'Read the story' : 'Leer la historia'}
              </Button>
            </div>
          </div>
          <div className="relative min-h-155 tablet:min-h-130 phone:min-h-100">
            <span className="absolute top-7.5 right-1.25 size-135 max-h-[94%] max-w-[94%] rounded-circle bg-surface-sunburst before:absolute before:-inset-10 before:origin-center before:animate-[sunburst-rotation_48s_linear_infinite] before:rounded-circle before:bg-[repeating-conic-gradient(from_0deg,transparent_0deg_12deg,rgba(255,255,255,0.35)_12deg_18deg)] before:content-[''] motion-reduce:before:animate-none! phone:size-[min(96vw,350px)]" />
            <button
              className="group/mascot absolute inset-0 z-3 border-0 bg-transparent p-0 text-ink"
              type="button"
              onClick={surpriseMascot}
              aria-label="Preguntarle un secreto a Croqueto"
            >
              <Image
                className="absolute top-2 right-4 z-3 h-auto w-[min(565px,100%)] transform-[rotate(2deg)] overflow-visible filter-[drop-shadow(0_18px_0_rgba(154,95,0,0.12))] transition-[transform] duration-200 ease-[ease] group-hover/mascot:transform-[rotate(-1deg)_translateY(-5px)] tablet:right-1/2 tablet:w-[min(500px,100%)] tablet:max-w-none tablet:transform-[translateX(50%)] tablet:group-hover/mascot:transform-[translateX(50%)_translateY(-5px)] phone:w-[min(104vw,380px)]"
                src={heroDogImage}
                alt="Croqueto, la mascota del Croquetón, con gafas de sol y dos premios en la boca"
              />
            </button>
            <p
              className={cn(
                'absolute right-1.25 bottom-56.25 z-7 w-75 rounded-[22px_0_22px_22px] border-3 border-ink bg-card px-4.5 py-3.75 leading-[1.3] font-black shadow-pop [transition:opacity_0.2s_ease,transform_0.2s_ease] phone:right-0 phone:bottom-40 phone:w-[min(78vw,300px)]',
                mascot.message
                  ? 'transform-[translateY(0)_rotate(-2deg)] opacity-100'
                  : 'transform-[translateY(10px)_rotate(-2deg)] opacity-0'
              )}
              aria-live="polite"
            >
              {mascot.message}
            </p>
            <span className="absolute top-11.25 right-3.75 z-4 text-[54px] font-black text-accent">
              ✦
            </span>
            <span className="absolute top-50 left-10 z-4 text-[34px] font-black text-accent">
              ✦
            </span>
          </div>
        </Container>
        <a
          className="absolute bottom-11 left-1/2 z-8 flex -translate-x-1/2 items-center gap-3.75 text-[12px] font-black tracking-[0.14em] uppercase"
          href="#historia"
        >
          <span>
            {isEnglish ? 'Scroll to follow the story' : 'Desliza para seguir la historia'}
          </span>
          <span className="grid size-9.5 animate-[bob_1.8s_ease-in-out_infinite] place-items-center rounded-circle bg-ink text-white motion-reduce:animate-none! [&_svg]:w-5">
            <ArrowDown />
          </span>
        </a>
        <div className="absolute -bottom-px h-10.5 w-full bg-surface-soft [clip-path:polygon(0_70%,8%_45%,17%_67%,26%_35%,36%_59%,45%_32%,55%_65%,64%_35%,75%_55%,84%_29%,93%_58%,100%_40%,100%_100%,0_100%)]" />
      </section>

      <StoryChapter
        id="historia"
        theme="good-life"
        backdrop={
          <>
            <Paw className="absolute top-[9%] right-[4%] w-26.25 rotate-21 text-[#eab934] opacity-55" />
            <Paw className="absolute right-[38%] bottom-[7%] w-26.25 -rotate-18 text-[#eab934] opacity-55" />
          </>
        }
        bottomDivider={
          <div className="absolute -bottom-px h-10.5 w-full bg-[#25334c] [clip-path:polygon(0_70%,8%_45%,17%_67%,26%_35%,36%_59%,45%_32%,55%_65%,64%_35%,75%_55%,84%_29%,93%_58%,100%_40%,100%_100%,0_100%)]" />
        }
        containerClassName="grid-cols-[1.05fr_0.95fr] tablet:pt-22.5 tablet:pb-25"
        mediaWrapperClassName="h-162.5 tablet:order-2 tablet:h-147.5 phone:h-120"
        contentWrapperClassName="pl-6.25 tablet:px-2.5! tablet:py-0!"
        eyebrow={isEnglish ? 'Chapter 01 \xB7 The good life' : 'Cap\xEDtulo 01 \xB7 La buena vida'}
        eyebrowTone="accent"
        titleClassName="min-[541px]:text-[clamp(50px,4.7vw,74px)]"
        title={
          <>
            {isEnglish ? 'Full belly,' : 'Pancita llena,'}
            <br />
            <em className="text-[#ef6547] not-italic">
              {isEnglish ? 'happy heart.' : 'coraz\xF3n contento.'}
            </em>
          </>
        }
        media={
          <>
            <span className="absolute top-16.25 left-3.75 z-9 -rotate-4 rounded-lg border-4 border-[#fff7e5] bg-ink px-5.25 py-3.25 font-heading text-lead-lg font-extrabold text-white shadow-[7px_7px_0_var(--ink-soft)] phone:top-12 phone:left-0.5 phone:text-[16px]">
              {isEnglish ? 'Day 1: everything under control' : 'D\xEDa 1: todo bajo control'}
            </span>
            <StoryImage
              src={chapterOneImage}
              alt="Perrito con gafas sosteniendo una tostada en un martes soleado"
              label={
                isEnglish ? 'Full belly. Zero pending tasks.' : 'Pancita llena. Cero pendientes.'
              }
              className="top-23.75 left-11.25 w-126.25 rotate-[-2.5deg] tablet:left-1/2 tablet:-translate-x-1/2 tablet:-rotate-2 phone:top-18.75 phone:w-[min(88vw,440px)] [&_img]:object-[center_58%] [&_img]:filter-[saturate(0.92)_contrast(1.03)_sepia(0.05)] [&>div]:aspect-square"
            />
          </>
        }
      >
        <p className="max-w-132.5 text-[clamp(18px,1.6vw,20px)] leading-loose font-bold">
          {isEnglish
            ? 'Full bowl, nap pending. Life was perfect.'
            : 'Plato lleno, siesta pendiente. La vida era perfecta.'}
        </p>
        <span className="inline-flex rotate-1 border-y-2 border-dashed border-stroke py-2 text-[12px] font-black tracking-label-wide text-foreground uppercase">
          {isEnglish ? 'Worry level: zero' : 'Nivel de preocupaci\xF3n: cero'}
        </span>
      </StoryChapter>

      <StoryChapter
        theme="rainy"
        backdrop={
          <>
            <div
              className="absolute inset-0 animate-[rainy_0.65s_linear_infinite] bg-[repeating-linear-gradient(105deg,transparent_0_28px,#b8d8ef_29px_32px,transparent_33px_62px)] bg-size-[110px_160px] opacity-18 motion-reduce:animate-none!"
              aria-hidden="true"
            />
            <Cloud className="absolute top-1.25 -left-25 z-2 w-125 text-[#121c31]" />
            <Cloud className="absolute top-22.5 -right-17.5 z-2 w-110 text-[#121c31]" />
          </>
        }
        containerClassName="grid-cols-[1.08fr_0.92fr] tablet:pt-25 tablet:pb-17.5"
        mediaWrapperClassName="h-162.5 tablet:order-2 tablet:h-142.5"
        contentWrapperClassName="tablet:px-2.5! tablet:py-0!"
        eyebrow={isEnglish ? 'Chapter 02 \xB7 The fall' : 'Cap\xEDtulo 02 \xB7 La ca\xEDda'}
        eyebrowTone="brand"
        title={
          <>
            {isEnglish ? 'What could' : '\xBFQu\xE9 podr\xEDa'}
            <br />
            {isEnglish ? 'go wrong?' : 'salir mal?'}
          </>
        }
        media={
          <StoryImage
            src={chapterTwoImage}
            alt="Cheems intenta alcanzar una tostada que sale volando durante una tormenta"
            label={
              isEnglish
                ? "Everything was fine\u2026 until it wasn't."
                : 'Todo iba bien\u2026 hasta que dej\xF3 de ir bien.'
            }
            className="top-38.75 left-15.5 w-107.5 -rotate-3 tablet:right-auto tablet:left-1/2 tablet:w-[min(100%,590px)] tablet:-translate-x-1/2 tablet:-rotate-2 [&_img]:filter-[saturate(0.8)_contrast(1.04)] [&>div]:aspect-square"
          />
        }
      >
        <p className="max-w-132.5 text-[clamp(18px,1.6vw,20px)] leading-loose font-bold">
          {isEnglish
            ? 'Ah\u2026 well. At least I still have my savings.'
            : 'Ah\u2026 bueno. Al menos todav\xEDa tengo mis ahorros.'}
        </p>
        <strong
          className="mt-4.5 block font-heading text-[72px] leading-none tracking-[0.2em] text-[#8ca2b7]"
          aria-label="Silencio incómodo"
        >
          …
        </strong>
      </StoryChapter>

      <StoryChapter
        theme="sinking"
        backdrop={<div className="noise" />}
        containerClassName="grid-cols-[0.9fr_1.1fr] tablet:pt-25 tablet:pb-17.5"
        reverseOnDesktop
        contentWrapperClassName="pl-8.75 tablet:order-1 tablet:px-2.5! tablet:py-0!"
        mediaWrapperClassName="h-162.5 tablet:order-2"
        eyebrow={isEnglish ? 'Chapter 03 \xB7 Sinking' : 'Cap\xEDtulo 03 \xB7 El hundimiento'}
        eyebrowTone="accent"
        title={
          <>
            {isEnglish ? 'Things got a' : 'La cosa se puso'}
            <br />
            {isEnglish ? 'little ' : 'un poquito '}
            <em className="text-[#777d82] not-italic">{isEnglish ? 'gray.' : 'gris.'}</em>
          </>
        }
        media={
          <MoodPollCard
            src={chapterThreeImage}
            alt="Cheems llorando junto a las opciones feliz y estuviste llorando"
            label={
              isEnglish
                ? 'Mood: doing my best.'
                : 'Estado de \xE1nimo: haciendo lo mejor que puedo.'
            }
            className="top-37.5 right-22 w-110 rotate-2 tablet:right-auto tablet:left-1/2 tablet:w-[min(100%,590px)] tablet:-translate-x-1/2 tablet:-rotate-2 [&_img]:filter-[saturate(0.72)_contrast(1.03)] [&>div]:aspect-square"
          />
        }
      >
        <p className="max-w-132.5 font-heading text-[20px] leading-note font-bold">
          {isEnglish
            ? 'Dignity was intact. The eyeliner, not so much.'
            : 'La dignidad segu\xEDa intacta. El delineador, no tanto.'}
        </p>
      </StoryChapter>

      <StoryChapter
        theme="rock-bottom"
        containerClassName="grid-cols-[1fr_1fr]"
        mediaWrapperClassName="h-150 tablet:mt-25"
        contentWrapperClassName="pl-7.5 tablet:px-2.5! tablet:pt-0! tablet:pb-22.5!"
        eyebrow={isEnglish ? 'Chapter 04 \xB7 Rock bottom' : 'Cap\xEDtulo 04 \xB7 El fondo'}
        eyebrowTone="brand"
        titleClassName="min-[541px]:text-[clamp(46px,4.3vw,68px)]"
        title={
          <>
            {isEnglish ? 'I guess this is' : 'Supongo que este es'}
            <br />
            {isEnglish ? 'my worst moment\u2026' : 'mi peor momento\u2026'}
          </>
        }
        media={
          <StoryImage
            src={chapterFourImage}
            alt="Cheems descansa en una cama de hospital con apoyo de oxígeno"
            label={
              isEnglish
                ? 'This is where the story stopped being a joke.'
                : 'Aqu\xED la historia dej\xF3 de ser un chiste.'
            }
            className="top-0 left-7.5 w-111.25 -rotate-2 tablet:left-1/2 tablet:-translate-x-1/2 phone:w-[min(88vw,420px)] [&_figcaption]:bg-[#a8c8d2] [&_img]:filter-[saturate(0.7)_contrast(1.03)] [&>div]:aspect-[0.667]"
          />
        }
      >
        <div className="flex max-w-130 items-center gap-5.5 rounded-dialog-sm border-l-9 border-brand bg-[#eff1ea] px-6.25 py-5 text-ink shadow-[10px_10px_0_#34495c]">
          <span className="font-heading text-[43px] font-extrabold text-accent">01</span>
          <p className="m-0 max-w-132.5 text-[clamp(18px,1.6vw,20px)] leading-loose font-bold">
            <strong>{isEnglish ? 'Hunger is real.' : 'El hambre s\xED es real.'}</strong>
            <br />
            {isEnglish
              ? 'That is why every sealed bag counts.'
              : 'Por eso cada bolsa sellada cuenta.'}
          </p>
        </div>
        <p className="mt-5.5 max-w-132.5 text-body-sm leading-loose font-bold text-[#dce8ee]">
          {isEnglish
            ? 'Croqueto may be a character. The need he represents is not.'
            : 'Croqueto puede ser un personaje. La necesidad que representa no lo es.'}
        </p>
      </StoryChapter>

      <HomeRescueSection
        isEnglish={isEnglish}
        sparkleRescue={sparkleRescue}
        sectionRef={rescueRef}
      />

      <HomeFinaleSection
        isEnglish={isEnglish}
        celebrateFinale={celebrateFinale}
        sectionRef={finaleRef}
      />

      <SiteFooter isEnglish={isEnglish} />
    </main>
  )
}

function SkipLink({ isEnglish }: { isEnglish: boolean }) {
  return (
    <a
      className="fixed top-4 left-4 z-100 translate-y-[-160%] rounded-pill px-4 py-3 font-black shadow-md transition-transform duration-200 ease-out focus:translate-y-0"
      href="#historia"
    >
      {isEnglish ? 'Skip to the story' : 'Saltar a la historia'}
    </a>
  )
}
