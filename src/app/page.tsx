'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { ArrowDown } from '@/assets/icons/arrow-down'
import {
  LanguageToggle,
  ThemeToggle,
  Cloud,
  Paw,
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

      <section id="inicio" className="hero story-section">
        <Cloud className="cloud cloud-one" />
        <Cloud className="cloud cloud-two" />
        <Paw className="paw paw-one" />
        <Paw className="paw paw-two" />
        <div className="hero-grid container">
          <div className="hero-copy">
            <span className="eyebrow">{isEnglish ? 'A furry tale' : 'Una historia de pelos'}</span>
            <h1>
              Croque<span>tón</span>
            </h1>
            <p className="hero-lead">
              {isEnglish ? "My life couldn't" : 'Mi vida no podr\xEDa'}
              <br />
              {isEnglish ? 'be better.' : 'ir mejor.'}
            </p>
            <p className="hero-note">
              {isEnglish
                ? 'Narrated by Croqueto, certified expert in naps and second chances.'
                : 'Narrado por Croqueto, experto certificado en siestas y segundas oportunidades.'}
            </p>
            <div className="hero-actions">
              <Link className="button button-dark hero-cta" href="/como-donar">
                {isEnglish ? 'I want to donate' : 'Quiero donar'}
              </Link>
              <a className="hero-secondary" href="#historia">
                {isEnglish ? 'Read the story' : 'Leer la historia'}
              </a>
            </div>
          </div>
          <div className="hero-art">
            <span className="sunburst" />
            <button
              className="mascot-button"
              type="button"
              onClick={surpriseMascot}
              aria-label="Preguntarle un secreto a Croqueto"
            >
              <Image
                className="dog dog-cool"
                src={heroDogImage}
                alt="Croqueto, la mascota del Croquetón, con gafas de sol y dos premios en la boca"
              />
            </button>
            <p className={`mascot-reply ${mascot.message ? 'is-visible' : ''}`} aria-live="polite">
              {mascot.message}
            </p>
            <span className="doodle doodle-one">✦</span>
            <span className="doodle doodle-two">✦</span>
          </div>
        </div>
        <a className="scroll-cue" href="#historia">
          <span>
            {isEnglish ? 'Scroll to follow the story' : 'Desliza para seguir la historia'}
          </span>
          <span className="scroll-icon">
            <ArrowDown />
          </span>
        </a>
        <div className="wave wave-happy" />
      </section>

      <section id="historia" className="good-life story-section">
        <Paw className="good-life-paw paw-snack-one" />
        <Paw className="good-life-paw paw-snack-two" />
        <div className="good-life-grid container">
          <div className="good-life-art">
            <span className="meme-banner">
              {isEnglish ? 'Day 1: everything under control' : 'D\xEDa 1: todo bajo control'}
            </span>
            <StoryImage
              src={chapterOneImage}
              alt="Perrito con gafas sosteniendo una tostada en un martes soleado"
              label={
                isEnglish ? 'Full belly. Zero pending tasks.' : 'Pancita llena. Cero pendientes.'
              }
              className="panel-landscape panel-good-life"
            />
          </div>
          <div className="story-copy good-life-copy">
            <span className="chapter">
              {isEnglish ? 'Chapter 01 \xB7 The good life' : 'Cap\xEDtulo 01 \xB7 La buena vida'}
            </span>
            <h2>
              {isEnglish ? 'Full belly,' : 'Pancita llena,'}
              <br />
              <em>{isEnglish ? 'happy heart.' : 'coraz\xF3n contento.'}</em>
            </h2>
            <p>
              {isEnglish
                ? 'Full bowl, nap pending. Life was perfect.'
                : 'Plato lleno, siesta pendiente. La vida era perfecta.'}
            </p>
            <span className="worry-level">
              {isEnglish ? 'Worry level: zero' : 'Nivel de preocupaci\xF3n: cero'}
            </span>
          </div>
        </div>
        <div className="wave wave-dark" />
      </section>

      <section className="fall story-section">
        <div className="rain" aria-hidden="true" />
        <Cloud className="storm-cloud storm-one" />
        <Cloud className="storm-cloud storm-two" />
        <div className="split-grid container">
          <div className="fall-art">
            <StoryImage
              src={chapterTwoImage}
              alt="Cheems intenta alcanzar una tostada que sale volando durante una tormenta"
              label={
                isEnglish
                  ? "Everything was fine\u2026 until it wasn't."
                  : 'Todo iba bien\u2026 hasta que dej\xF3 de ir bien.'
              }
              className="panel-landscape panel-fall"
            />
          </div>
          <div className="story-copy light-copy">
            <span className="chapter">
              {isEnglish ? 'Chapter 02 \xB7 The fall' : 'Cap\xEDtulo 02 \xB7 La ca\xEDda'}
            </span>
            <h2>
              {isEnglish ? 'What could' : '\xBFQu\xE9 podr\xEDa'}
              <br />
              {isEnglish ? 'go wrong?' : 'salir mal?'}
            </h2>
            <p>
              {isEnglish
                ? 'Ah\u2026 well. At least I still have my savings.'
                : 'Ah\u2026 bueno. Al menos todav\xEDa tengo mis ahorros.'}
            </p>
            <strong aria-label="Silencio incómodo">…</strong>
          </div>
        </div>
      </section>

      <section className="sinking story-section">
        <div className="noise" />
        <div className="split-grid reverse container">
          <div className="story-copy">
            <span className="chapter">
              {isEnglish ? 'Chapter 03 \xB7 Sinking' : 'Cap\xEDtulo 03 \xB7 El hundimiento'}
            </span>
            <h2>
              {isEnglish ? 'Things got a' : 'La cosa se puso'}
              <br />
              {isEnglish ? 'little ' : 'un poquito '}
              <em>{isEnglish ? 'gray.' : 'gris.'}</em>
            </h2>
            <p className="sinking-note">
              {isEnglish
                ? 'Dignity was intact. The eyeliner, not so much.'
                : 'La dignidad segu\xEDa intacta. El delineador, no tanto.'}
            </p>
          </div>
          <div className="weak-art">
            <MoodPollCard
              src={chapterThreeImage}
              alt="Cheems llorando junto a las opciones feliz y estuviste llorando"
              label={
                isEnglish
                  ? 'Mood: doing my best.'
                  : 'Estado de \xE1nimo: haciendo lo mejor que puedo.'
              }
              className="panel-landscape panel-sad"
            />
          </div>
        </div>
      </section>

      <section className="bottom story-section">
        <div className="bottom-grid container">
          <div className="hospital-art">
            <StoryImage
              src={chapterFourImage}
              alt="Cheems descansa en una cama de hospital con apoyo de oxígeno"
              label={
                isEnglish
                  ? 'This is where the story stopped being a joke.'
                  : 'Aqu\xED la historia dej\xF3 de ser un chiste.'
              }
              className="panel-portrait panel-hospital"
            />
          </div>
          <div className="story-copy light-copy bottom-copy">
            <span className="chapter">
              {isEnglish ? 'Chapter 04 \xB7 Rock bottom' : 'Cap\xEDtulo 04 \xB7 El fondo'}
            </span>
            <h2>
              {isEnglish ? 'I guess this is' : 'Supongo que este es'}
              <br />
              {isEnglish ? 'my worst moment\u2026' : 'mi peor momento\u2026'}
            </h2>
            <div className="fact-card">
              <span className="fact-number">01</span>
              <p>
                <strong>{isEnglish ? 'Hunger is real.' : 'El hambre s\xED es real.'}</strong>
                <br />
                {isEnglish
                  ? 'That is why every sealed bag counts.'
                  : 'Por eso cada bolsa sellada cuenta.'}
              </p>
            </div>
            <p className="serious-note">
              {isEnglish
                ? 'Croqueto may be a character. The need he represents is not.'
                : 'Croqueto puede ser un personaje. La necesidad que representa no lo es.'}
            </p>
          </div>
        </div>
      </section>

      <section ref={rescueRef} id="evento" className="rescue story-section">
        <div className={`rescue-stars ${sparkleRescue ? 'is-sparkling' : ''}`} aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span className="rescue-star" key={index} />
          ))}
        </div>
        <div className="warm-orb orb-one" />
        <div className="warm-orb orb-two" />
        <div className="rescue-grid container">
          <div className="rescue-copy">
            <span className="chapter">
              {isEnglish ? 'Chapter 05 \xB7 The way out' : 'Cap\xEDtulo 05 \xB7 La salida'}
            </span>
            <h2>
              {isEnglish ? 'He is not' : '\xA1No est\xE1'}
              <br />
              <span>{isEnglish ? 'alone!' : 'solo!'}</span>
            </h2>
            <p className="rescue-lead">
              {isEnglish
                ? 'When friends arrive, so do laughs\u2026'
                : 'Cuando llegan amigos, llegan risas\u2026'}
              <br />
              {isEnglish ? 'and lots and lots of kibble.' : 'y muchas, muchas croquetas.'}
            </p>
            <p className="rescue-microcopy">
              {isEnglish
                ? "You don't need to donate a mountain. One bag can change the ending too."
                : 'No necesitas donar una monta\xF1a. Una bolsa tambi\xE9n cambia el final.'}
            </p>
            <div className="event-details">
              <article>
                <span className="detail-icon">26</span>
                <div>
                  <strong>{isEnglish ? 'Saturday, October 26' : 'S\xE1bado 26 de octubre'}</strong>
                  <small>{isEnglish ? '10:00 to 17:00' : 'De 10:00 a 17:00 h'}</small>
                </div>
              </article>
              <article>
                <span className="detail-icon pin-icon">●</span>
                <div>
                  <strong>{isEnglish ? 'Main plaza' : 'Explanada principal'}</strong>
                  <small>
                    {isEnglish
                      ? 'Higher Technological Institute'
                      : 'Instituto Tecnol\xF3gico Superior'}
                  </small>
                </div>
              </article>
              <article>
                <span className="detail-icon bag-icon">▰</span>
                <div>
                  <strong>{isEnglish ? 'Bring sealed dog food' : 'Trae alimento sellado'}</strong>
                  <small>
                    {isEnglish
                      ? 'Kibble bags of any size'
                      : 'Bolsas de croquetas de cualquier tama\xF1o'}
                  </small>
                </div>
              </article>
            </div>
            <div className="trust-note">
              <strong>{isEnglish ? 'No fine print' : 'Sin letras chiquitas'}</strong>
              <span>
                {isEnglish
                  ? 'We receive sealed food, check its date and deliver it to people who care for dogs.'
                  : 'Recibimos alimento cerrado, revisamos su fecha y lo entregamos a quienes cuidan perritos.'}
              </span>
            </div>
          </div>
          <div className="friends-art">
            <span className="confetti c1">✦</span>
            <span className="confetti c2">●</span>
            <span className="confetti c3">◆</span>
            <StoryImage
              src={chapterFiveImage}
              alt="Grupo de seis perros sosteniendo bolsas de alimento donado"
              label={
                isEnglish
                  ? 'Rescue plan: friends + kibble.'
                  : 'Plan de rescate: amigos + croquetas.'
              }
              className="panel-portrait panel-friends"
            />
          </div>
        </div>
      </section>

      <section ref={finaleRef} id="donar" className="finale story-section">
        <div
          className={`croquette-rain ${celebrateFinale ? 'is-celebrating' : ''}`}
          aria-hidden="true"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <span className="croquette-particle" key={index} />
          ))}
        </div>
        <Paw className="final-paw fp-one" />
        <Paw className="final-paw fp-two" />
        <div className="finale-grid container">
          <div className="finale-art">
            <span className="final-burst" />
            <StoryImage
              src={chapterSixImage}
              alt="Perrito musculoso y feliz rodeado de bolsas, platos y croquetas donadas"
              label={
                isEnglish ? 'Good ending. Very strong dog.' : 'Final bueno. Perrito fuert\xEDsimo.'
              }
              className="panel-portrait panel-final"
            />
          </div>
          <div className="finale-copy">
            <span className="eyebrow light-eyebrow">
              {isEnglish ? 'Happy ending unlocked' : 'Final feliz desbloqueado'}
            </span>
            <h2>
              {isEnglish ? 'Together we can' : '\xA1Juntos podemos'}
              <br />
              {isEnglish ? 'make a ' : 'hacer la '}
              <span>{isEnglish ? 'difference!' : 'diferencia!'}</span>
            </h2>
            <p>
              {isEnglish
                ? 'Before: an empty bowl. After: friends, food and a suspiciously muscular dog.'
                : 'Antes: un plato vac\xEDo. Despu\xE9s: amigos, comida y un perrito sospechosamente musculoso.'}
            </p>
            <Link className="button button-light donate-button" href="/como-donar">
              {isEnglish ? 'I want to donate' : 'Quiero donar'} <span>→</span>
            </Link>
            <small>
              {isEnglish
                ? "Opens your email. No endless forms, dog's word."
                : 'Abre tu correo. Sin formularios eternos, palabra de perrito.'}
            </small>
            <div className="donation-proof" aria-label="Compromisos del Croquetón">
              <span>{isEnglish ? 'Sealed food' : 'Alimento sellado'}</span>
              <span>{isEnglish ? 'Responsible delivery' : 'Entrega responsable'}</span>
              <span>{isEnglish ? 'Shared impact' : 'Impacto compartido'}</span>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-grid container">
          <div>
            <Logo />
            <p>
              {isEnglish ? 'Kibble by kibble,' : 'De croqueta en croqueta,'}
              <br />
              {isEnglish ? 'we change a story.' : 'cambiamos una historia.'}
            </p>
          </div>
          <div className="footer-column social-column">
            <strong>{isEnglish ? 'Follow us' : 'S\xEDguenos'}</strong>
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
          <div className="footer-column">
            <strong>{isEnglish ? 'Contact' : 'Contacto'}</strong>
            <a href="mailto:croqueton@tecnologico.edu.mx">croqueton@tecnologico.edu.mx</a>
            <a href="tel:+0001234567">(000) 123 4567</a>
          </div>
          <div className="school-mark">
            <span>ITS</span>
            <p>
              {isEnglish ? 'Higher' : 'Instituto'}
              <br />
              {isEnglish ? 'Technological Institute' : 'Tecnol\xF3gico Superior'}
            </p>
          </div>
        </div>
        <div className="footer-bottom container">
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
