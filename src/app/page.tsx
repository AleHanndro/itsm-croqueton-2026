'use client'

import { cn } from 'cn'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { ArrowDown } from '@/assets/icons/arrow-down'
import { Cloud } from '@/assets/icons/cloud'
import { Paw } from '@/assets/icons/paw'
import {
  LanguageToggle,
  ThemeToggle,
  Logo,
  SiteNavigation,
  StoryImage,
  MoodPollCard
} from '@/components/ui'
import { dogFacts, dogFactsEn } from '@/lib/content'
import {
  chapterOneImage,
  chapterTwoImage,
  chapterThreeImage,
  chapterFourImage,
  chapterFiveImage,
  chapterSixImage,
  heroDogImage
} from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

export default function HomePage() {
  const { language } = useLanguage()
  const [mascot, setMascot] = useState({ message: '', secretFound: false })
  const [isNavScrolled, setIsNavScrolled] = useState(false)
  const [celebrateFinale, setCelebrateFinale] = useState(false)
  const [sparkleRescue, setSparkleRescue] = useState(false)
  const finaleRef = useRef(null)
  const rescueRef = useRef(null)

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
        <div className="relative z-2 mx-auto grid w-[min(1240px,calc(100%-96px))] grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-x-[clamp(56px,7vw,120px)] pt-6 pb-28 tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] tablet:gap-y-18 tablet:pt-0 tablet:pb-35 phone:w-[min(100%-28px,680px)] phone:gap-y-14 phone:pb-32 laptop:w-[min(100%-48px,1040px)]">
          <div className="z-5 pl-7.5 tablet:p-0">
            <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
              {isEnglish ? 'A furry tale' : 'Una historia de pelos'}
            </span>
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
              <Link
                className="relative inline-flex min-h-16.5 items-center justify-center gap-3.5 rounded-full border-3 border-current bg-surface-inverse pr-5.5 pl-8.5 text-[20px] font-black text-fg-cta shadow-[0_9px_0_var(--accent-deep)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-9 after:flex-none after:place-items-center after:rounded-circle after:bg-brand after:text-lg after:leading-none after:text-ink after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none! phone:w-full"
                href="/como-donar"
              >
                {isEnglish ? 'I want to donate' : 'Quiero donar'}
              </Link>
              <a
                className="border-b-3 border-current pb-0.5 text-body-sm font-black"
                href="#historia"
              >
                {isEnglish ? 'Read the story' : 'Leer la historia'}
              </a>
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
        </div>
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

      <section
        id="historia"
        className="relative isolate flex min-h-212.5 items-center bg-surface-soft text-foreground before:absolute before:top-22.5 before:-left-45 before:size-117.5 before:rounded-circle before:bg-surface-good-life-orb before:opacity-65 before:content-[''] tablet:min-h-280 phone:min-h-242.5"
      >
        <Paw className="absolute top-[9%] right-[4%] w-26.25 rotate-21 text-[#eab934] opacity-55" />
        <Paw className="absolute right-[38%] bottom-[7%] w-26.25 -rotate-18 text-[#eab934] opacity-55" />
        <div className="relative z-2 mx-auto grid min-h-[inherit] w-[min(1240px,calc(100%-96px))] grid-cols-[1.05fr_0.95fr] items-center tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] tablet:pt-22.5 tablet:pb-25 phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div className="relative h-162.5 tablet:order-2 tablet:h-147.5 phone:h-120">
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
          </div>
          <div className="relative z-4 pl-6.25 tablet:px-2.5! tablet:py-0!">
            <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
              {isEnglish ? 'Chapter 01 \xB7 The good life' : 'Cap\xEDtulo 01 \xB7 La buena vida'}
            </span>
            <h2 className="min-[541px]:text-[clamp(50px,4.7vw,74px)]">
              {isEnglish ? 'Full belly,' : 'Pancita llena,'}
              <br />
              <em className="text-[#ef6547] not-italic">
                {isEnglish ? 'happy heart.' : 'coraz\xF3n contento.'}
              </em>
            </h2>
            <p className="max-w-132.5 text-[clamp(18px,1.6vw,20px)] leading-loose font-bold">
              {isEnglish
                ? 'Full bowl, nap pending. Life was perfect.'
                : 'Plato lleno, siesta pendiente. La vida era perfecta.'}
            </p>
            <span className="inline-flex rotate-1 border-y-2 border-dashed border-stroke py-2 text-[12px] font-black tracking-label-wide text-foreground uppercase">
              {isEnglish ? 'Worry level: zero' : 'Nivel de preocupaci\xF3n: cero'}
            </span>
          </div>
        </div>
        <div className="absolute -bottom-px h-10.5 w-full bg-[#25334c] [clip-path:polygon(0_70%,8%_45%,17%_67%,26%_35%,36%_59%,45%_32%,55%_65%,64%_35%,75%_55%,84%_29%,93%_58%,100%_40%,100%_100%,0_100%)]" />
      </section>

      <section className="relative isolate flex min-h-212.5 items-center bg-[#25334c] text-[#eef4ff] tablet:min-h-300">
        <div
          className="absolute inset-0 animate-[rainy_0.65s_linear_infinite] bg-[repeating-linear-gradient(105deg,transparent_0_28px,#b8d8ef_29px_32px,transparent_33px_62px)] bg-size-[110px_160px] opacity-18 motion-reduce:animate-none!"
          aria-hidden="true"
        />
        <Cloud className="absolute top-1.25 -left-25 z-2 w-125 text-[#121c31]" />
        <Cloud className="absolute top-22.5 -right-17.5 z-2 w-110 text-[#121c31]" />
        <div className="relative z-2 mx-auto grid min-h-[inherit] w-[min(1240px,calc(100%-96px))] grid-cols-[1.08fr_0.92fr] items-center tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] tablet:pt-25 tablet:pb-17.5 phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div className="relative h-162.5 tablet:order-2 tablet:h-142.5">
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
          </div>
          <div className="relative z-4 tablet:px-2.5! tablet:py-0!">
            <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-brand uppercase">
              {isEnglish ? 'Chapter 02 \xB7 The fall' : 'Cap\xEDtulo 02 \xB7 La ca\xEDda'}
            </span>
            <h2>
              {isEnglish ? 'What could' : '\xBFQu\xE9 podr\xEDa'}
              <br />
              {isEnglish ? 'go wrong?' : 'salir mal?'}
            </h2>
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
          </div>
        </div>
      </section>

      <section className="relative isolate flex min-h-207.5 items-center bg-surface-sinking text-foreground before:absolute before:top-30 before:-left-32.5 before:size-80 before:rounded-circle before:border-3 before:border-dashed before:border-stroke-sinking-ring before:content-[''] tablet:min-h-312.5">
        <div className="noise" />
        <div className="relative z-2 mx-auto grid min-h-[inherit] w-[min(1240px,calc(100%-96px))] grid-cols-[0.9fr_1.1fr] items-center tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] tablet:pt-25 tablet:pb-17.5 phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div className="relative z-4 pl-8.75 tablet:order-1 tablet:px-2.5! tablet:py-0!">
            <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
              {isEnglish ? 'Chapter 03 \xB7 Sinking' : 'Cap\xEDtulo 03 \xB7 El hundimiento'}
            </span>
            <h2>
              {isEnglish ? 'Things got a' : 'La cosa se puso'}
              <br />
              {isEnglish ? 'little ' : 'un poquito '}
              <em className="text-[#777d82] not-italic">{isEnglish ? 'gray.' : 'gris.'}</em>
            </h2>
            <p className="max-w-132.5 font-heading text-[20px] leading-note font-bold">
              {isEnglish
                ? 'Dignity was intact. The eyeliner, not so much.'
                : 'La dignidad segu\xEDa intacta. El delineador, no tanto.'}
            </p>
          </div>
          <div className="relative h-162.5 tablet:order-2">
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
          </div>
        </div>
      </section>

      <section className="relative isolate flex min-h-212.5 items-center bg-[#566c82] text-[#eef4f7] tablet:min-h-312.5">
        <div className="relative z-2 mx-auto grid min-h-[inherit] w-[min(1240px,calc(100%-96px))] grid-cols-[1fr_1fr] items-center tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div className="relative h-150 tablet:mt-25">
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
          </div>
          <div className="relative z-4 pl-7.5 tablet:px-2.5! tablet:pt-0! tablet:pb-22.5!">
            <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-brand uppercase">
              {isEnglish ? 'Chapter 04 \xB7 Rock bottom' : 'Cap\xEDtulo 04 \xB7 El fondo'}
            </span>
            <h2 className="min-[541px]:text-[clamp(46px,4.3vw,68px)]">
              {isEnglish ? 'I guess this is' : 'Supongo que este es'}
              <br />
              {isEnglish ? 'my worst moment\u2026' : 'mi peor momento\u2026'}
            </h2>
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
          </div>
        </div>
      </section>

      <section
        ref={rescueRef}
        id="evento"
        className="relative isolate flex min-h-230 items-center bg-surface-rescue text-foreground before:absolute before:inset-0 before:bg-[linear-gradient(145deg,var(--rescue-glow)_0%,transparent_var(--rescue-glow-stop))] before:content-[''] tablet:min-h-375"
      >
        <div
          className="pointer-events-none absolute inset-0 z-1 overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: 10 }, (_, index) => (
            <span
              className={cn(
                "absolute size-7 text-card opacity-0 filter-[drop-shadow(0_0_7px_rgba(255,255,255,0.9))] before:block before:text-[28px] before:leading-none before:content-['✦'] nth-1:top-[12%] nth-1:left-[5%] nth-1:[animation-delay:0.1s]! nth-10:top-[47%] nth-10:left-[38%] nth-10:transform-[scale(0.5)] nth-10:text-white nth-10:[animation-delay:2.2s]! nth-2:top-[67%] nth-2:left-[18%] nth-2:transform-[scale(0.7)] nth-2:text-accent nth-2:[animation-delay:1.2s]! nth-3:top-[20%] nth-3:left-[31%] nth-3:transform-[scale(0.55)] nth-3:[animation-delay:2.1s]! nth-4:top-[78%] nth-4:left-[43%] nth-4:text-secondary nth-4:[animation-delay:0.7s]! nth-5:top-[9%] nth-5:left-[54%] nth-5:transform-[scale(0.7)] nth-5:[animation-delay:1.7s]! nth-6:top-[55%] nth-6:left-[65%] nth-6:transform-[scale(0.55)] nth-6:text-accent nth-6:[animation-delay:2.5s]! nth-7:top-[17%] nth-7:left-[76%] nth-7:[animation-delay:0.4s]! nth-8:top-[73%] nth-8:left-[87%] nth-8:transform-[scale(0.65)] nth-8:text-secondary nth-8:[animation-delay:1.4s]! nth-9:top-[34%] nth-9:left-[94%] nth-9:transform-[scale(0.5)] nth-9:[animation-delay:2.8s]! motion-reduce:animate-none!",
                sparkleRescue && 'animate-[rescue-twinkle_3.2s_ease-in-out_infinite]'
              )}
              key={index}
            />
          ))}
        </div>
        <div className="absolute top-12.5 -right-25 size-75 rounded-circle bg-surface-warm-orb opacity-(--warm-orb-opacity)" />
        <div className="absolute bottom-25 -left-22.5 size-45 rounded-circle bg-surface-warm-orb opacity-(--warm-orb-opacity)" />
        <div className="relative z-2 mx-auto grid min-h-[inherit] w-[min(1240px,calc(100%-96px))] grid-cols-[0.92fr_1.08fr] items-center tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] tablet:pt-25 phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div className="pl-7 tablet:pl-0">
            <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
              {isEnglish ? 'Chapter 05 \xB7 The way out' : 'Cap\xEDtulo 05 \xB7 La salida'}
            </span>
            <h2 className="mb-4.5 min-[541px]:text-[clamp(66px,6.5vw,104px)]">
              {isEnglish ? 'He is not' : '\xA1No est\xE1'}
              <br />
              <span className="text-accent">{isEnglish ? 'alone!' : 'solo!'}</span>
            </h2>
            <p className="mb-7 text-lg leading-normal font-extrabold">
              {isEnglish
                ? 'When friends arrive, so do laughs\u2026'
                : 'Cuando llegan amigos, llegan risas\u2026'}
              <br />
              {isEnglish ? 'and lots and lots of kibble.' : 'y muchas, muchas croquetas.'}
            </p>
            <p className="-mt-3 mb-6 max-w-118.75 text-[14px] font-extrabold opacity-72">
              {isEnglish
                ? "You don't need to donate a mountain. One bag can change the ending too."
                : 'No necesitas donar una monta\xF1a. Una bolsa tambi\xE9n cambia el final.'}
            </p>
            <div className="grid max-w-123.75 gap-2.75">
              <article className="flex items-center gap-4 rounded-[8px_18px_18px_8px] border-l-5 border-stroke bg-surface-event-detail px-4 py-3 shadow-none">
                <span className="grid size-12.5 flex-none place-items-center rounded-control bg-accent font-heading text-[20px] font-black text-white">
                  26
                </span>
                <div>
                  <strong className="block text-[16px]">
                    {isEnglish ? 'Saturday, October 26' : 'S\xE1bado 26 de octubre'}
                  </strong>
                  <small className="mt-0.5 block leading-tight-copy font-bold opacity-65">
                    {isEnglish ? '10:00 to 17:00' : 'De 10:00 a 17:00 h'}
                  </small>
                </div>
              </article>
              <article className="flex items-center gap-4 rounded-[8px_18px_18px_8px] border-l-5 border-stroke bg-surface-event-detail px-4 py-3 shadow-none">
                <span className="grid size-12.5 flex-none place-items-center rounded-control bg-ink font-heading text-[20px] font-black text-brand">
                  ●
                </span>
                <div>
                  <strong className="block text-[16px]">
                    {isEnglish ? 'Main plaza' : 'Explanada principal'}
                  </strong>
                  <small className="mt-0.5 block leading-tight-copy font-bold opacity-65">
                    {isEnglish
                      ? 'Higher Technological Institute'
                      : 'Instituto Tecnol\xF3gico Superior'}
                  </small>
                </div>
              </article>
              <article className="flex items-center gap-4 rounded-[8px_18px_18px_8px] border-l-5 border-stroke bg-surface-event-detail px-4 py-3 shadow-none">
                <span className="grid size-12.5 flex-none place-items-center rounded-control bg-ink font-heading text-[20px] font-black text-brand">
                  ▰
                </span>
                <div>
                  <strong className="block text-[16px]">
                    {isEnglish ? 'Bring sealed dog food' : 'Trae alimento sellado'}
                  </strong>
                  <small className="mt-0.5 block leading-tight-copy font-bold opacity-65">
                    {isEnglish
                      ? 'Kibble bags of any size'
                      : 'Bolsas de croquetas de cualquier tama\xF1o'}
                  </small>
                </div>
              </article>
            </div>
            <div className="mt-5 grid max-w-123.75 gap-0.75 border-l-5 border-accent bg-surface-trust-note px-4.25 py-3.5 text-small leading-tight-copy">
              <strong className="font-heading text-[16px]">
                {isEnglish ? 'No fine print' : 'Sin letras chiquitas'}
              </strong>
              <span>
                {isEnglish
                  ? 'We receive sealed food, check its date and deliver it to people who care for dogs.'
                  : 'Recibimos alimento cerrado, revisamos su fecha y lo entregamos a quienes cuidan perritos.'}
              </span>
            </div>
          </div>
          <div className="relative h-175 tablet:min-h-170 phone:min-h-162.5">
            <span className="absolute top-10 left-2.5 text-[46px] font-black text-accent">✦</span>
            <span className="absolute top-17.5 right-12.5 text-[46px] font-black text-[#54a5a5]">
              ●
            </span>
            <span className="absolute top-1.25 left-[48%] text-[46px] font-black text-ink">◆</span>
            <StoryImage
              src={chapterFiveImage}
              alt="Grupo de seis perros sosteniendo bolsas de alimento donado"
              label={
                isEnglish
                  ? 'Rescue plan: friends + kibble.'
                  : 'Plan de rescate: amigos + croquetas.'
              }
              className="top-26.25 left-1/2 w-140 -translate-x-1/2 rotate-3 phone:w-[min(88vw,420px)] phone:rotate-2 [&_figcaption]:bg-accent [&_figcaption]:text-white [&>div]:aspect-[1.5]"
            />
          </div>
        </div>
      </section>

      <section
        ref={finaleRef}
        id="donar"
        className="relative isolate flex min-h-220 items-center bg-[#f2673f] text-[#fff9e8] tablet:min-h-330"
      >
        <div
          className="pointer-events-none absolute inset-0 z-3 overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <span
              className={cn(
                'absolute -top-11.25 h-3.5 w-5 rounded-circle border-3 border-ink bg-kibble-dark opacity-0 shadow-[inset_3px_2px_0_rgba(255,255,255,0.25)] nth-1:left-[6%] nth-1:transform-[rotate(18deg)] nth-1:[animation-delay:0.1s]! nth-10:left-[84%] nth-10:size-4 nth-10:[animation-delay:1.9s]! nth-11:left-[91%] nth-11:bg-kibble-light nth-11:[animation-delay:0.95s]! nth-12:left-[96%] nth-12:h-3 nth-12:w-3.75 nth-12:[animation-delay:2.45s]! nth-2:left-[14%] nth-2:size-4 nth-2:bg-brand nth-2:[animation-delay:1.1s]! nth-3:left-[23%] nth-3:bg-kibble-light nth-3:[animation-delay:0.45s]! nth-4:left-[34%] nth-4:h-3 nth-4:w-4.25 nth-4:[animation-delay:1.7s]! nth-5:left-[43%] nth-5:bg-[#ffdc5e] nth-5:[animation-delay:0.8s]! nth-6:left-[52%] nth-6:size-3.75 nth-6:[animation-delay:2.1s]! nth-7:left-[61%] nth-7:bg-[#d98a4e] nth-7:[animation-delay:0.25s]! nth-8:left-[69%] nth-8:h-3.25 nth-8:w-4.5 nth-8:[animation-delay:1.4s]! nth-9:left-[76%] nth-9:bg-brand nth-9:[animation-delay:0.65s]! motion-reduce:animate-none!',
                celebrateFinale && 'animate-[croquette-fall_5.4s_linear_infinite]'
              )}
              key={index}
            />
          ))}
        </div>
        <Paw className="absolute top-[8%] right-[2%] w-40 rotate-23 text-[#d84f31] opacity-60" />
        <Paw className="absolute right-[38%] bottom-[3%] w-27.5 -rotate-20 text-[#d84f31] opacity-60" />
        <div className="relative z-2 mx-auto grid min-h-[inherit] w-[min(1240px,calc(100%-96px))] grid-cols-[0.9fr_1.1fr] items-center tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] tablet:py-20 phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div className="relative h-175 tablet:order-2 phone:min-h-172.5">
            <span className="absolute top-25 -left-2.5 size-122.5 max-h-[94%] max-w-[94%] rounded-circle bg-brand before:absolute before:-inset-10 before:rounded-circle before:bg-[repeating-conic-gradient(from_0deg,transparent_0deg_12deg,rgba(255,255,255,0.35)_12deg_18deg)] before:content-['']" />
            <StoryImage
              src={chapterSixImage}
              alt="Perrito musculoso y feliz rodeado de bolsas, platos y croquetas donadas"
              label={
                isEnglish ? 'Good ending. Very strong dog.' : 'Final bueno. Perrito fuert\xEDsimo.'
              }
              className="top-5 left-13.75 w-98.75 -rotate-3 phone:left-1/2 phone:w-[min(88vw,420px)] phone:-translate-x-1/2 phone:-rotate-2 [&>div]:aspect-[0.778] [&>div]:border-[#fff3c1]"
            />
          </div>
          <div className="relative z-4 pl-8.75 tablet:pl-0">
            <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] text-[#fff9e8] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
              {isEnglish ? 'Happy ending unlocked' : 'Final feliz desbloqueado'}
            </span>
            <h2 className="mt-4.25 mb-6.75 min-[541px]:text-[clamp(55px,5.6vw,86px)]">
              {isEnglish ? 'Together we can' : '\xA1Juntos podemos'}
              <br />
              {isEnglish ? 'make a ' : 'hacer la '}
              <span className="text-brand">{isEnglish ? 'difference!' : 'diferencia!'}</span>
            </h2>
            <p className="max-w-150 text-lead leading-loose font-extrabold">
              {isEnglish
                ? 'Before: an empty bowl. After: friends, food and a suspiciously muscular dog.'
                : 'Antes: un plato vac\xEDo. Despu\xE9s: amigos, comida y un perrito sospechosamente musculoso.'}
            </p>
            <Link
              className="relative mt-2.5 inline-flex min-h-17 items-center justify-center gap-7.5 rounded-full border-3 border-current bg-card px-8.5 text-[20px] font-black text-ink shadow-[0_9px_0_var(--accent-deep)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] active:transform-[translateY(4px)] active:shadow-none! [&_span]:text-[31px] [&_span]:leading-0"
              href="/como-donar"
            >
              {isEnglish ? 'I want to donate' : 'Quiero donar'} <span>→</span>
            </Link>
            <small className="mt-5.25 block font-extrabold opacity-75">
              {isEnglish
                ? "Opens your email. No endless forms, dog's word."
                : 'Abre tu correo. Sin formularios eternos, palabra de perrito.'}
            </small>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Compromisos del Croquetón">
              <span className="rounded-md bg-[rgba(255,255,255,0.14)] px-2.75 py-1.75 text-[12px] leading-note font-black tracking-[0.04em]">
                {isEnglish ? 'Sealed food' : 'Alimento sellado'}
              </span>
              <span className="rounded-md bg-[rgba(255,255,255,0.14)] px-2.75 py-1.75 text-[12px] leading-note font-black tracking-[0.04em]">
                {isEnglish ? 'Responsible delivery' : 'Entrega responsable'}
              </span>
              <span className="rounded-md bg-[rgba(255,255,255,0.14)] px-2.75 py-1.75 text-[12px] leading-note font-black tracking-[0.04em]">
                {isEnglish ? 'Shared impact' : 'Impacto compartido'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="[&_.logo-mark]:bg-brand [&_.logo-mark]:text-ink">
        <div className="relative z-2 mx-auto grid w-[min(1240px,calc(100%-96px))] grid-cols-[1.3fr_0.7fr_1fr_1fr] items-start gap-11.25 tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr_1fr] phone:w-[min(100%-28px,680px)] phone:grid-cols-[1fr] laptop:w-[min(100%-48px,1040px)]">
          <div>
            <Logo />
            <p className="mt-4.25 text-[14px] leading-copy text-[#9fa6b6]">
              {isEnglish ? 'Kibble by kibble,' : 'De croqueta en croqueta,'}
              <br />
              {isEnglish ? 'we change a story.' : 'cambiamos una historia.'}
            </p>
          </div>
          <div className="flex flex-col gap-2.25 text-body-sm leading-label text-[#abb1c0] shadow-none outline-0 [&_a]:wrap-anywhere [&_a]:shadow-none! [&_a]:outline-0! [&_a]:hover:text-brand">
            <strong className="mb-1.75 text-small tracking-[0.12em] text-white uppercase">
              {isEnglish ? 'Follow us' : 'S\xEDguenos'}
            </strong>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a
              className="facebook-link"
              href="https://www.facebook.com/share/1CN9Dqyy2W/"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">
              TikTok
            </a>
          </div>
          <div className="flex flex-col gap-2.25 text-body-sm leading-label text-[#abb1c0] [&_a]:wrap-anywhere [&_a]:hover:text-brand">
            <strong className="mb-1.75 text-small tracking-[0.12em] text-white uppercase">
              {isEnglish ? 'Contact' : 'Contacto'}
            </strong>
            <a href="mailto:croqueton@tecnologico.edu.mx">croqueton@tecnologico.edu.mx</a>
            <a href="tel:+0001234567">(000) 123 4567</a>
          </div>
          <div className="flex items-center gap-3.25 justify-self-end tablet:justify-self-start">
            <span className="grid size-14 place-items-center rounded-circle border-2 border-brand font-black text-brand">
              ITS
            </span>
            <p className="m-0 text-small leading-tight font-extrabold">
              {isEnglish ? 'Higher' : 'Instituto'}
              <br />
              {isEnglish ? 'Technological Institute' : 'Tecnol\xF3gico Superior'}
            </p>
          </div>
        </div>
        <div className="relative z-2 mx-auto mt-13.75 flex w-[min(1240px,calc(100%-96px))] justify-between border-t border-[#393e51] pt-5.5 text-small text-[#858c9d] tablet:w-[min(100%-36px,680px)] phone:w-[min(100%-28px,680px)] phone:flex-col phone:gap-2 laptop:w-[min(100%-48px,1040px)]">
          <span>
            {isEnglish
              ? 'Made with love and lots of kibble.'
              : 'Hecho con amor y muchas croquetas.'}
          </span>
          <span>© 2026 Croquetón</span>
        </div>
      </footer>
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
