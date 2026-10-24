'use client'

import { cn } from 'cn'
import Image from 'next/image'
import { useState, type FormEvent } from 'react'

import { Paw } from '@/assets/icons/paw'
import { LanguageToggle, ThemeToggle, SiteNavigation } from '@/components/ui'
import { rejectedApplicationImage, heroDogImage, recruitmentDogImage } from '@/lib/images'
import { useLanguage } from '@/providers/language-provider'

export default function JoinPage() {
  const { language } = useLanguage()
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [joinResult, setJoinResult] = useState<'requirements' | 'welcome' | null>(null)
  const [applicantName, setApplicantName] = useState('')
  const [applicantAge, setApplicantAge] = useState('')
  const [motivation, setMotivation] = useState('')
  const [hasAvailability, setHasAvailability] = useState(false)
  const [acceptsCommitment, setAcceptsCommitment] = useState(false)

  const isEnglish = language === 'en'

  const openJoinForm = () => {
    setJoinResult(null)
    setShowJoinForm(true)
  }

  const submitJoinForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (
      !applicantName.trim() ||
      Number(applicantAge) < 18 ||
      motivation.trim().length < 20 ||
      !hasAvailability ||
      !acceptsCommitment
    ) {
      setJoinResult('requirements')
      return
    }

    setJoinResult('welcome')
  }

  return (
    <main className="min-h-screen bg-surface-page-mint text-foreground">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="bg-surface-soft pt-22.5 pb-27.5 phone:pt-15 phone:pb-20">
        <div className="relative z-2 mx-auto grid w-[min(1240px,calc(100%-96px))] grid-cols-[0.9fr_1.1fr] items-center gap-20 tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div>
            <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
              {isEnglish ? 'Join the pack' : '\xDAnete a la manada'}
            </span>
            <h1 className="mt-3.5 mb-7 text-[clamp(62px,6.3vw,96px)] leading-display-tight font-extrabold phone:text-[52px]">
              {isEnglish ? 'Be part of the' : 'S\xE9 parte de los'}
              <br />
              <span className="text-accent">{isEnglish ? 'Croquetones.' : 'Croquetones.'}</span>
            </h1>
            <p className="max-w-147.5 text-body leading-loose font-extrabold phone:text-base">
              {isEnglish
                ? "You don't need superpowers. A little time, good ideas and a big heart are enough to help more bowls end up full."
                : 'No necesitas superpoderes. Con un poco de tiempo, buenas ideas y un coraz\xF3n enorme podemos lograr que m\xE1s platos terminen llenos.'}
            </p>
            <button
              className="relative mt-3.5 inline-flex min-h-14 items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink pr-4.5 pl-6.75 font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none! in-data-[theme='dark']:bg-[#ffc929] in-data-[theme='dark']:text-[#202436] in-data-[theme='dark']:shadow-[0_7px_0_#9f592f]!"
              type="button"
              onClick={openJoinForm}
            >
              {isEnglish ? 'I want to join' : 'Quiero unirme'}
            </button>
            <small className="mt-4.75 block font-extrabold opacity-62">
              {isEnglish
                ? 'Opens your email. No secret initiation rituals.'
                : 'Abre tu correo. Sin rituales secretos de iniciaci\xF3n.'}
            </small>
          </div>
          <figure className="relative mx-auto mt-10 w-[min(100%,340px)] rotate-2 pt-8.75 tablet:mt-13.75">
            <p className="absolute -top-6.25 -right-7 z-2 m-0 w-[min(310px,82%)] -rotate-4 rounded-[22px_22px_4px_22px] border-3 border-ink bg-brand px-4.75 py-3.75 text-center font-heading text-[18px] leading-[1.15] font-black text-ink shadow-pop phone:-top-4.25 phone:-right-1 phone:text-body-sm">
              {isEnglish
                ? 'Want to lend a paw? Leave me your details.'
                : '\xBFQuieres echar una pata? D\xE9jame tus datos.'}
            </p>
            <Image
              src={recruitmentDogImage}
              className="block aspect-[0.593] w-full rounded-3xl border-10 border-card bg-white object-contain shadow-[16px_18px_0_rgba(32,36,54,0.23)]"
              alt={
                isEnglish
                  ? 'Dog wearing glasses and using a laptop to welcome volunteers'
                  : 'Perrito con lentes usando una laptop para recibir voluntarios'
              }
            />
            <figcaption className="relative mx-auto -mt-3.5 w-max max-w-[88%] -rotate-3 rounded-lg bg-ink px-4 py-2.5 text-center font-heading font-black text-card phone:text-small">
              {isEnglish
                ? 'Recruitment manager. Paid in kibble.'
                : 'Gerente de reclutamiento. Cobra en croquetas.'}
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="pt-27.5 pb-30 phone:pt-18.75 phone:pb-22.5"
        aria-labelledby="join-experience-title"
      >
        <div className="relative z-2 mx-auto w-[min(1240px,calc(100%-96px))] tablet:w-[min(100%-36px,680px)] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <div className="max-w-175">
            <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
              {isEnglish ? 'The Croquet\xF3n experience' : 'La experiencia Croquet\xF3n'}
            </span>
            <h2 id="join-experience-title" className="mb-6">
              {isEnglish ? 'What awaits you' : '\xBFQu\xE9 te espera'}
              <br />
              {isEnglish ? 'in the pack?' : 'en la manada?'}
            </h2>
            <p className="max-w-150 text-lg leading-copy font-extrabold">
              {isEnglish
                ? 'Good people, wagging tails and the strange satisfaction of knowing that a bag of kibble can change an entire story.'
                : 'Gente buena onda, colitas felices y esa extra\xF1a satisfacci\xF3n de saber que una bolsa de croquetas puede cambiar una historia completa.'}
            </p>
          </div>
          <div className="mt-12.5 grid grid-cols-[repeat(3,1fr)] gap-5.5 tablet:grid-cols-[1fr]">
            <article className="rounded-3xl bg-card px-6.75 py-7.5 text-ink shadow-card phone:px-5.75 phone:py-6.5">
              <span className="mb-5.5 grid size-14.5 place-items-center rounded-circle bg-brand text-ink [&_svg]:size-8">
                <Paw />
              </span>
              <strong className="block font-heading text-[24px]">
                {isEnglish ? 'Leave a paw print' : 'Dejar una huellita'}
              </strong>
              <p className="mt-2 text-body-sm leading-copy font-bold">
                {isEnglish
                  ? 'See how your time turns into full bowls, calmer bellies and much happier tails.'
                  : 'Mira c\xF3mo tu tiempo se convierte en platos llenos, pancitas tranquilas y colitas mucho m\xE1s felices.'}
              </p>
            </article>
            <article className="rounded-3xl bg-card px-6.75 py-7.5 text-ink shadow-card phone:px-5.75 phone:py-6.5">
              <span className="mb-5.5 grid size-14.5 place-items-center rounded-circle bg-accent text-card [&_svg]:size-8">
                <Paw />
              </span>
              <strong className="block font-heading text-[24px]">
                {isEnglish ? 'Meet your pack' : 'Encontrar tu manada'}
              </strong>
              <p className="mt-2 text-body-sm leading-copy font-bold">
                {isEnglish
                  ? 'Share laughs, ideas and possibly too many dog photos with people who care about the same cause.'
                  : 'Comparte risas, ideas y posiblemente demasiadas fotos de perros con personas que creen en la misma causa.'}
              </p>
            </article>
            <article className="rounded-3xl bg-card px-6.75 py-7.5 text-ink shadow-card phone:px-5.75 phone:py-6.5">
              <span className="mb-5.5 grid size-14.5 place-items-center rounded-circle bg-secondary text-ink [&_svg]:size-8">
                <Paw />
              </span>
              <strong className="block font-heading text-[24px]">
                {isEnglish ? 'Unlock good memories' : 'Desbloquear buenos recuerdos'}
              </strong>
              <p className="mt-2 text-body-sm leading-copy font-bold">
                {isEnglish
                  ? 'Take part in an experience worth remembering and earn your place in the next pack photo.'
                  : 'Vive una experiencia que vale la pena recordar y gana tu lugar en la pr\xF3xima foto de la manada.'}
              </p>
            </article>
          </div>

          <div className="mt-21.25 flex items-center justify-between gap-12.5 rounded-4xl bg-ink px-13 py-12 text-card tablet:flex-col tablet:items-start phone:mt-13.75 phone:px-6 phone:py-8">
            <div>
              <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
                {isEnglish ? 'Pack promise' : 'Promesa de la manada'}
              </span>
              <h2 className="mt-1.5 mb-3 text-[clamp(44px,4.2vw,62px)] phone:text-[43px]">
                {isEnglish ? 'Your help matters.' : 'Tu ayuda s\xED cuenta.'}
              </h2>
              <p className="m-0 max-w-155 leading-normal font-extrabold">
                {isEnglish
                  ? 'We organize tasks, respect your time and share the impact achieved by the team.'
                  : 'Organizamos las tareas, respetamos tu tiempo y compartimos el impacto logrado por el equipo.'}
              </p>
            </div>
            <button
              className="relative mt-2.5 inline-flex min-h-17 items-center justify-center gap-7.5 rounded-full border-3 border-current bg-card px-8.5 text-[20px] font-black text-ink shadow-[0_9px_0_var(--accent-deep)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] active:transform-[translateY(4px)] active:shadow-none! [&_span]:text-[31px] [&_span]:leading-0"
              type="button"
              onClick={openJoinForm}
            >
              {isEnglish ? 'Join the team' : 'Unirme al equipo'} <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {showJoinForm && (
        <div
          className="fixed inset-0 z-120 grid place-items-center bg-[rgba(15,22,36,0.78)] p-6 backdrop-blur-[7px] phone:p-2.5"
          role="presentation"
          onMouseDown={() => setShowJoinForm(false)}
        >
          <section
            className="relative max-h-[calc(100vh-48px)] w-[min(720px,100%)] overflow-y-auto rounded-4xl border-5 border-stroke bg-card p-10.5 text-ink shadow-join-dialog phone:max-h-[calc(100vh-20px)] phone:rounded-3xl phone:px-5 phone:pt-8.75 phone:pb-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="absolute top-4.25 right-4.5 z-3 size-11 rounded-circle border-3 border-ink bg-accent text-title-sm leading-none font-black text-white shadow-[3px_4px_0_var(--ink)] phone:top-2.75 phone:right-3"
              type="button"
              onClick={() => setShowJoinForm(false)}
              aria-label={isEnglish ? 'Close form' : 'Cerrar formulario'}
            >
              ×
            </button>
            {!joinResult ? (
              <>
                <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
                  {isEnglish ? 'Official pack application' : 'Solicitud oficial de la manada'}
                </span>
                <h2
                  id="join-dialog-title"
                  className="mt-2 mb-4.5 min-[541px]:text-[clamp(48px,6vw,70px)]"
                >
                  {isEnglish ? "Let's sniff out" : 'Vamos a olfatear'}
                  <br />
                  {isEnglish ? 'your profile.' : 'tu perfil.'}
                </h2>
                <p className="max-w-150 text-base leading-normal font-extrabold">
                  {isEnglish
                    ? 'Complete the checklist. Chispita takes recruitment very seriously for about six seconds.'
                    : 'Completa la lista. Chispita se toma el reclutamiento muy en serio durante unos seis segundos.'}
                </p>
                <form
                  className="mt-7 grid grid-cols-[1fr_1fr] gap-4.25 phone:grid-cols-[1fr]"
                  onSubmit={submitJoinForm}
                >
                  <label className="grid gap-1.75 text-[12px] font-black tracking-label uppercase">
                    <span>{isEnglish ? 'Your name' : 'Tu nombre'}</span>
                    <input
                      value={applicantName}
                      className="min-h-13 w-full rounded-field border-3 border-ink bg-white px-3.75 font-extrabold text-ink focus:outline-4 focus:outline-offset-2 focus:outline-brand"
                      onChange={(event) => setApplicantName(event.target.value)}
                      maxLength={40}
                      placeholder={
                        isEnglish ? 'Human or heroic nickname' : 'Nombre humano o apodo heroico'
                      }
                    />
                  </label>
                  <label className="grid gap-1.75 text-[12px] font-black tracking-label uppercase">
                    <span>{isEnglish ? 'Your age' : 'Tu edad'}</span>
                    <input
                      type="number"
                      className="min-h-13 w-full rounded-field border-3 border-ink bg-white px-3.75 font-extrabold text-ink focus:outline-4 focus:outline-offset-2 focus:outline-brand"
                      min="0"
                      max="99"
                      value={applicantAge}
                      onChange={(event) => setApplicantAge(event.target.value)}
                      placeholder="18"
                    />
                  </label>
                  <label className="col-span-full grid gap-1.75 text-[12px] font-black tracking-label uppercase phone:col-1">
                    <span>
                      {isEnglish
                        ? 'Why do you want to participate?'
                        : '\xBFPor qu\xE9 quieres participar?'}
                    </span>
                    <textarea
                      value={motivation}
                      className="min-h-31.25 w-full resize-y rounded-field border-3 border-ink bg-white px-3.75 pt-3.5 leading-label font-extrabold text-ink focus:outline-4 focus:outline-offset-2 focus:outline-brand"
                      onChange={(event) => setMotivation(event.target.value)}
                      maxLength={400}
                      placeholder={
                        isEnglish
                          ? 'Tell the pack what motivates you to help\u2026'
                          : 'Cu\xE9ntale a la manada qu\xE9 te motiva a ayudar\u2026'
                      }
                    />
                    <small className="text-tiny tracking-normal normal-case opacity-62">
                      {isEnglish ? 'Minimum 20 characters.' : 'M\xEDnimo 20 caracteres.'}
                    </small>
                  </label>
                  <label className="col-span-full flex items-start gap-2.75 rounded-xl bg-surface-chip px-3.75 py-3.25 text-small leading-tight-copy font-extrabold phone:col-1">
                    <input
                      type="checkbox"
                      className="size-5.25 flex-none accent-accent focus:outline-4 focus:outline-offset-2 focus:outline-brand"
                      checked={hasAvailability}
                      onChange={(event) => setHasAvailability(event.target.checked)}
                    />
                    <span>
                      {isEnglish
                        ? 'I am available on event day.'
                        : 'Tengo disponibilidad el d\xEDa del evento.'}
                    </span>
                  </label>
                  <label className="col-span-full flex items-start gap-2.75 rounded-xl bg-surface-chip px-3.75 py-3.25 text-small leading-tight-copy font-extrabold phone:col-1">
                    <input
                      type="checkbox"
                      className="size-5.25 flex-none accent-accent focus:outline-4 focus:outline-offset-2 focus:outline-brand"
                      checked={acceptsCommitment}
                      onChange={(event) => setAcceptsCommitment(event.target.checked)}
                    />
                    <span>
                      {isEnglish
                        ? 'I agree to work as a team and follow care guidelines.'
                        : 'Acepto trabajar en equipo y seguir las indicaciones de cuidado.'}
                    </span>
                  </label>
                  <div className="col-span-full grid gap-0.75 border-l-5 border-secondary bg-[#e7eee7] px-4.25 py-3.5 text-[12px] phone:col-1">
                    <strong className="font-heading text-[16px]">
                      {isEnglish ? "Chispita's checklist" : 'Lista de Chispita'}
                    </strong>
                    <span>
                      {isEnglish
                        ? '18+ \xB7 A clear motivation \xB7 Availability \xB7 Team commitment'
                        : '18+ \xB7 Una motivaci\xF3n clara \xB7 Disponibilidad \xB7 Compromiso'}
                    </span>
                  </div>
                  <button
                    className="relative col-span-full mt-1.25 inline-flex min-h-14 w-max items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink pr-4.5 pl-6.75 font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none! phone:col-1 phone:w-full"
                    type="submit"
                  >
                    {isEnglish ? 'Check my application' : 'Revisar mi solicitud'}
                  </button>
                </form>
              </>
            ) : (
              <div className="grid justify-items-center pt-2.5 text-center">
                <Image
                  src={joinResult === 'welcome' ? heroDogImage : rejectedApplicationImage}
                  className={cn(
                    'mb-6 block max-h-67.5 w-[min(300px,80%)] -rotate-2 border-7 border-ink bg-brand shadow-card phone:w-[min(250px,78%)]',
                    joinResult === 'welcome'
                      ? 'rounded-circle object-contain'
                      : 'aspect-square rounded-3xl object-cover'
                  )}
                  alt={
                    joinResult === 'welcome'
                      ? isEnglish
                        ? 'Happy dog welcoming the new volunteer'
                        : 'Perrito feliz dando la bienvenida al nuevo voluntario'
                      : isEnglish
                        ? 'Laughing dog reacting to the application'
                        : 'Perrito ri\xE9ndose de la solicitud'
                  }
                />
                <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? 'Registration complete'
                      : 'Registro completado'
                    : isEnglish
                      ? 'Almost, human'
                      : 'Casi, humano'}
                </span>
                <h2
                  id="join-dialog-title"
                  className="mt-2 mb-4.5 min-[541px]:text-[clamp(48px,6vw,70px)]"
                >
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? `Thank you for joining, ${applicantName.trim()}!`
                      : `\xA1Gracias por registrarte, ${applicantName.trim()}!`
                    : isEnglish
                      ? 'Your checklist needs work.'
                      : 'Te faltaron unas casillas.'}
                </h2>
                <p className="max-w-150 text-base leading-normal font-extrabold">
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? 'Your time and motivation can fill many bowls. The pack received your registration and will contact you to confirm the next steps.'
                      : 'Tu tiempo y tu motivaci\xF3n pueden llenar muchos platos. La manada recibi\xF3 tu registro y se pondr\xE1 en contacto contigo para confirmar los siguientes pasos.'
                    : isEnglish
                      ? 'You need to be 18+, explain your motivation in at least 20 characters, be available and ready to work as a team. The dog is laughing with you, not at you. Probably.'
                      : 'Necesitas ser mayor de edad, explicar tu motivaci\xF3n en al menos 20 caracteres, tener disponibilidad y aceptar el trabajo en equipo. El perrito se r\xEDe contigo, no de ti. Probablemente.'}
                </p>
                <button
                  className="relative mt-3 inline-flex min-h-14 items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink pr-4.5 pl-6.75 font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none!"
                  type="button"
                  onClick={() => setJoinResult(null)}
                >
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? 'Review my answers'
                      : 'Revisar mis respuestas'
                    : isEnglish
                      ? 'Complete the form'
                      : 'Completar el formulario'}
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
