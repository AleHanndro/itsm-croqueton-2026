'use client'

import Image from 'next/image'
import { useState, type FormEvent } from 'react'

import { LanguageToggle, ThemeToggle, Paw, SiteNavigation } from '@/components/ui'
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
    <main className="join-page">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="join-hero">
        <div className="join-hero-grid container">
          <div className="join-copy">
            <span className="eyebrow">{isEnglish ? 'Join the pack' : '\xDAnete a la manada'}</span>
            <h1>
              {isEnglish ? 'Be part of the' : 'S\xE9 parte de los'}
              <br />
              <span>{isEnglish ? 'Croquetones.' : 'Croquetones.'}</span>
            </h1>
            <p>
              {isEnglish
                ? "You don't need superpowers. A little time, good ideas and a big heart are enough to help more bowls end up full."
                : 'No necesitas superpoderes. Con un poco de tiempo, buenas ideas y un coraz\xF3n enorme podemos lograr que m\xE1s platos terminen llenos.'}
            </p>
            <button
              className="button button-dark join-main-cta"
              type="button"
              onClick={openJoinForm}
            >
              {isEnglish ? 'I want to join' : 'Quiero unirme'}
            </button>
            <small>
              {isEnglish
                ? 'Opens your email. No secret initiation rituals.'
                : 'Abre tu correo. Sin rituales secretos de iniciaci\xF3n.'}
            </small>
          </div>
          <figure className="join-team-image">
            <p className="join-team-prompt">
              {isEnglish
                ? 'Want to lend a paw? Leave me your details.'
                : '\xBFQuieres echar una pata? D\xE9jame tus datos.'}
            </p>
            <Image
              src={recruitmentDogImage}
              alt={
                isEnglish
                  ? 'Dog wearing glasses and using a laptop to welcome volunteers'
                  : 'Perrito con lentes usando una laptop para recibir voluntarios'
              }
            />
            <figcaption>
              {isEnglish
                ? 'Recruitment manager. Paid in kibble.'
                : 'Gerente de reclutamiento. Cobra en croquetas.'}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="join-roles" aria-labelledby="join-experience-title">
        <div className="container">
          <div className="join-roles-heading">
            <span className="chapter">
              {isEnglish ? 'The Croquet\xF3n experience' : 'La experiencia Croquet\xF3n'}
            </span>
            <h2 id="join-experience-title">
              {isEnglish ? 'What awaits you' : '\xBFQu\xE9 te espera'}
              <br />
              {isEnglish ? 'in the pack?' : 'en la manada?'}
            </h2>
            <p>
              {isEnglish
                ? 'Good people, wagging tails and the strange satisfaction of knowing that a bag of kibble can change an entire story.'
                : 'Gente buena onda, colitas felices y esa extra\xF1a satisfacci\xF3n de saber que una bolsa de croquetas puede cambiar una historia completa.'}
            </p>
          </div>
          <div className="join-role-grid">
            <article>
              <span className="join-role-icon">
                <Paw />
              </span>
              <strong>{isEnglish ? 'Leave a paw print' : 'Dejar una huellita'}</strong>
              <p>
                {isEnglish
                  ? 'See how your time turns into full bowls, calmer bellies and much happier tails.'
                  : 'Mira c\xF3mo tu tiempo se convierte en platos llenos, pancitas tranquilas y colitas mucho m\xE1s felices.'}
              </p>
            </article>
            <article>
              <span className="join-role-icon join-role-icon-coral">
                <Paw />
              </span>
              <strong>{isEnglish ? 'Meet your pack' : 'Encontrar tu manada'}</strong>
              <p>
                {isEnglish
                  ? 'Share laughs, ideas and possibly too many dog photos with people who care about the same cause.'
                  : 'Comparte risas, ideas y posiblemente demasiadas fotos de perros con personas que creen en la misma causa.'}
              </p>
            </article>
            <article>
              <span className="join-role-icon join-role-icon-blue">
                <Paw />
              </span>
              <strong>{isEnglish ? 'Unlock good memories' : 'Desbloquear buenos recuerdos'}</strong>
              <p>
                {isEnglish
                  ? 'Take part in an experience worth remembering and earn your place in the next pack photo.'
                  : 'Vive una experiencia que vale la pena recordar y gana tu lugar en la pr\xF3xima foto de la manada.'}
              </p>
            </article>
          </div>

          <div className="join-promise">
            <div>
              <span className="eyebrow">{isEnglish ? 'Pack promise' : 'Promesa de la manada'}</span>
              <h2>{isEnglish ? 'Your help matters.' : 'Tu ayuda s\xED cuenta.'}</h2>
              <p>
                {isEnglish
                  ? 'We organize tasks, respect your time and share the impact achieved by the team.'
                  : 'Organizamos las tareas, respetamos tu tiempo y compartimos el impacto logrado por el equipo.'}
              </p>
            </div>
            <button
              className="button button-light donate-button"
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
          className="join-dialog-backdrop"
          role="presentation"
          onMouseDown={() => setShowJoinForm(false)}
        >
          <section
            className="join-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="join-dialog-close"
              type="button"
              onClick={() => setShowJoinForm(false)}
              aria-label={isEnglish ? 'Close form' : 'Cerrar formulario'}
            >
              ×
            </button>
            {!joinResult ? (
              <>
                <span className="chapter">
                  {isEnglish ? 'Official pack application' : 'Solicitud oficial de la manada'}
                </span>
                <h2 id="join-dialog-title">
                  {isEnglish ? "Let's sniff out" : 'Vamos a olfatear'}
                  <br />
                  {isEnglish ? 'your profile.' : 'tu perfil.'}
                </h2>
                <p>
                  {isEnglish
                    ? 'Complete the checklist. Chispita takes recruitment very seriously for about six seconds.'
                    : 'Completa la lista. Chispita se toma el reclutamiento muy en serio durante unos seis segundos.'}
                </p>
                <form className="join-form" onSubmit={submitJoinForm}>
                  <label>
                    <span>{isEnglish ? 'Your name' : 'Tu nombre'}</span>
                    <input
                      value={applicantName}
                      onChange={(event) => setApplicantName(event.target.value)}
                      maxLength={40}
                      placeholder={
                        isEnglish ? 'Human or heroic nickname' : 'Nombre humano o apodo heroico'
                      }
                    />
                  </label>
                  <label>
                    <span>{isEnglish ? 'Your age' : 'Tu edad'}</span>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={applicantAge}
                      onChange={(event) => setApplicantAge(event.target.value)}
                      placeholder="18"
                    />
                  </label>
                  <label>
                    <span>
                      {isEnglish
                        ? 'Why do you want to participate?'
                        : '\xBFPor qu\xE9 quieres participar?'}
                    </span>
                    <textarea
                      value={motivation}
                      onChange={(event) => setMotivation(event.target.value)}
                      maxLength={400}
                      placeholder={
                        isEnglish
                          ? 'Tell the pack what motivates you to help\u2026'
                          : 'Cu\xE9ntale a la manada qu\xE9 te motiva a ayudar\u2026'
                      }
                    />
                    <small>
                      {isEnglish ? 'Minimum 20 characters.' : 'M\xEDnimo 20 caracteres.'}
                    </small>
                  </label>
                  <label className="join-check">
                    <input
                      type="checkbox"
                      checked={hasAvailability}
                      onChange={(event) => setHasAvailability(event.target.checked)}
                    />
                    <span>
                      {isEnglish
                        ? 'I am available on event day.'
                        : 'Tengo disponibilidad el d\xEDa del evento.'}
                    </span>
                  </label>
                  <label className="join-check">
                    <input
                      type="checkbox"
                      checked={acceptsCommitment}
                      onChange={(event) => setAcceptsCommitment(event.target.checked)}
                    />
                    <span>
                      {isEnglish
                        ? 'I agree to work as a team and follow care guidelines.'
                        : 'Acepto trabajar en equipo y seguir las indicaciones de cuidado.'}
                    </span>
                  </label>
                  <div className="join-requirements">
                    <strong>{isEnglish ? "Chispita's checklist" : 'Lista de Chispita'}</strong>
                    <span>
                      {isEnglish
                        ? '18+ \xB7 A clear motivation \xB7 Availability \xB7 Team commitment'
                        : '18+ \xB7 Una motivaci\xF3n clara \xB7 Disponibilidad \xB7 Compromiso'}
                    </span>
                  </div>
                  <button className="button button-dark" type="submit">
                    {isEnglish ? 'Check my application' : 'Revisar mi solicitud'}
                  </button>
                </form>
              </>
            ) : (
              <div className={`join-result join-result-${joinResult}`}>
                <Image
                  src={joinResult === 'welcome' ? heroDogImage : rejectedApplicationImage}
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
                <span className="chapter">
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? 'Registration complete'
                      : 'Registro completado'
                    : isEnglish
                      ? 'Almost, human'
                      : 'Casi, humano'}
                </span>
                <h2 id="join-dialog-title">
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? `Thank you for joining, ${applicantName.trim()}!`
                      : `\xA1Gracias por registrarte, ${applicantName.trim()}!`
                    : isEnglish
                      ? 'Your checklist needs work.'
                      : 'Te faltaron unas casillas.'}
                </h2>
                <p>
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? 'Your time and motivation can fill many bowls. The pack received your registration and will contact you to confirm the next steps.'
                      : 'Tu tiempo y tu motivaci\xF3n pueden llenar muchos platos. La manada recibi\xF3 tu registro y se pondr\xE1 en contacto contigo para confirmar los siguientes pasos.'
                    : isEnglish
                      ? 'You need to be 18+, explain your motivation in at least 20 characters, be available and ready to work as a team. The dog is laughing with you, not at you. Probably.'
                      : 'Necesitas ser mayor de edad, explicar tu motivaci\xF3n en al menos 20 caracteres, tener disponibilidad y aceptar el trabajo en equipo. El perrito se r\xEDe contigo, no de ti. Probablemente.'}
                </p>
                <button
                  className="button button-dark"
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
