'use client'

import { cn } from 'cn'
import Image from 'next/image'
import { useState, type FormEvent } from 'react'

import { NoteCallout } from '@/components/callout-banner'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogViewport
} from '@/components/ui/dialog'
import { Eyebrow } from '@/components/ui/eyebrow'
import { CheckboxCard, FieldLabel, TextareaInput, TextInput } from '@/components/ui/field'
import { heroDogImage, rejectedApplicationImage } from '@/lib/images'

type JoinResult = 'duplicate' | 'error' | 'requirements' | 'waitlisted' | 'welcome'

type Bilingual = { en: string; es: string }

const RESULT_COPY: Record<
  JoinResult,
  {
    description: Bilingual
    eyebrow: Bilingual
    title: { en: (name: string) => string; es: (name: string) => string }
  }
> = {
  duplicate: {
    description: {
      en: 'This email already has an active application. Check your inbox (and spam folder) for our message.',
      es: 'Este correo ya tiene una solicitud activa. Revisa tu bandeja de entrada (y la de spam) para ver nuestro mensaje.'
    },
    eyebrow: { en: 'Already sniffed', es: 'Ya te olfateamos' },
    title: {
      en: () => 'You are already registered.',
      es: () => 'Ya estás registrado.'
    }
  },
  error: {
    description: {
      en: 'We could not send your application. Please try again in a few minutes.',
      es: 'No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.'
    },
    eyebrow: { en: 'Oops', es: 'Ups' },
    title: {
      en: () => 'Something went wrong.',
      es: () => 'Algo salió mal.'
    }
  },
  requirements: {
    description: {
      en: 'You need to be 18+, explain your motivation in at least 20 characters, be available and ready to work as a team. The dog is laughing with you, not at you. Probably.',
      es: 'Necesitas ser mayor de edad, explicar tu motivación en al menos 20 caracteres, tener disponibilidad y aceptar el trabajo en equipo. El perrito se ríe contigo, no de ti. Probablemente.'
    },
    eyebrow: { en: 'Almost, human', es: 'Casi, humano' },
    title: {
      en: () => 'Your checklist needs work.',
      es: () => 'Te faltaron unas casillas.'
    }
  },
  waitlisted: {
    description: {
      en: 'All volunteer spots are taken for now, so you are on the waiting list. We sent you an email, and if a spot opens up we will write to you with the event details.',
      es: 'Por ahora todos los lugares para colaboradores están ocupados, así que quedaste en lista de espera. Te enviamos un correo y, si se libera un lugar, te escribiremos con la información del evento.'
    },
    eyebrow: { en: 'Waiting list', es: 'Lista de espera' },
    title: {
      en: (name) => `Thank you, ${name}!`,
      es: (name) => `¡Gracias, ${name}!`
    }
  },
  welcome: {
    description: {
      en: 'Your time and motivation can fill many bowls. Your spot is confirmed: we sent the event details to your email.',
      es: 'Tu tiempo y tu motivación pueden llenar muchos platos. Tu lugar está confirmado: te enviamos la información del evento a tu correo.'
    },
    eyebrow: { en: 'Registration complete', es: 'Registro completado' },
    title: {
      en: (name) => `Thank you for joining, ${name}!`,
      es: (name) => `¡Gracias por registrarte, ${name}!`
    }
  }
}

export function JoinApplicationDialog({
  open,
  onOpenChange,
  isEnglish
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEnglish: boolean
}) {
  const [joinResult, setJoinResult] = useState<JoinResult | null>(null)
  const [applicantName, setApplicantName] = useState('')
  const [applicantAge, setApplicantAge] = useState('')
  const [applicantEmail, setApplicantEmail] = useState('')
  const [applicantPhone, setApplicantPhone] = useState('')
  const [motivation, setMotivation] = useState('')
  const [hasAvailability, setHasAvailability] = useState(false)
  const [acceptsCommitment, setAcceptsCommitment] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setJoinResult(null)
    }
    onOpenChange(nextOpen)
  }

  const submitJoinForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(applicantEmail.trim())
    const isPhoneValid = /^[0-9+\-\s]{7,20}$/.test(applicantPhone.trim())

    if (
      !applicantName.trim() ||
      Number(applicantAge) < 18 ||
      !isEmailValid ||
      !isPhoneValid ||
      motivation.trim().length < 20 ||
      !hasAvailability ||
      !acceptsCommitment
    ) {
      setJoinResult('requirements')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/join-requests', {
        body: JSON.stringify({
          acceptsCommitment,
          age: Number(applicantAge),
          email: applicantEmail.trim(),
          hasAvailability,
          motivation: motivation.trim(),
          name: applicantName.trim(),
          phone: applicantPhone.trim()
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      })
      const data = (await response.json().catch(() => ({}))) as { error?: string; status?: string }

      if (response.ok) {
        setJoinResult(data.status === 'waitlisted' ? 'waitlisted' : 'welcome')
      } else if (data.error === 'already_registered') {
        setJoinResult('duplicate')
      } else if (data.error === 'requirements_not_met') {
        setJoinResult('requirements')
      } else {
        setJoinResult('error')
      }
    } catch {
      setJoinResult('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resultCopy = joinResult ? RESULT_COPY[joinResult] : null
  const isPositive = joinResult === 'welcome' || joinResult === 'waitlisted'

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogViewport>
          <DialogPopup>
            <DialogClose aria-label={isEnglish ? 'Close form' : 'Cerrar formulario'} />
            {!joinResult ? (
              <>
                <Eyebrow variant="section" tone="accent">
                  {isEnglish ? 'Official pack application' : 'Solicitud oficial de la manada'}
                </Eyebrow>
                <DialogTitle id="join-dialog-title">
                  {isEnglish ? "Let's sniff out" : 'Vamos a olfatear'}
                  <br />
                  {isEnglish ? 'your profile.' : 'tu perfil.'}
                </DialogTitle>
                <DialogDescription>
                  {isEnglish
                    ? 'Complete the checklist. Chispita takes recruitment very seriously for about six seconds.'
                    : 'Completa la lista. Chispita se toma el reclutamiento muy en serio durante unos seis segundos.'}
                </DialogDescription>
                <form
                  className="mt-7 grid grid-cols-[1fr_1fr] gap-4.25 phone:grid-cols-[1fr]"
                  onSubmit={submitJoinForm}
                >
                  <FieldLabel>
                    <span>{isEnglish ? 'Your name' : 'Tu nombre'}</span>
                    <TextInput
                      value={applicantName}
                      onChange={(event) => setApplicantName(event.target.value)}
                      maxLength={40}
                      placeholder={
                        isEnglish ? 'Human or heroic nickname' : 'Nombre humano o apodo heroico'
                      }
                    />
                  </FieldLabel>
                  <FieldLabel>
                    <span>{isEnglish ? 'Your age' : 'Tu edad'}</span>
                    <TextInput
                      type="number"
                      min="0"
                      max="99"
                      value={applicantAge}
                      onChange={(event) => setApplicantAge(event.target.value)}
                      placeholder="18"
                    />
                  </FieldLabel>
                  <FieldLabel>
                    <span>{isEnglish ? 'Email' : 'Correo electrónico'}</span>
                    <TextInput
                      type="email"
                      value={applicantEmail}
                      onChange={(event) => setApplicantEmail(event.target.value)}
                      placeholder={isEnglish ? 'you@example.com' : 'tu@correo.com'}
                    />
                  </FieldLabel>
                  <FieldLabel>
                    <span>{isEnglish ? 'Phone' : 'Teléfono'}</span>
                    <TextInput
                      value={applicantPhone}
                      onChange={(event) => setApplicantPhone(event.target.value)}
                      placeholder="9991234567"
                    />
                  </FieldLabel>
                  <FieldLabel className="col-span-full phone:col-1">
                    <span>
                      {isEnglish
                        ? 'Why do you want to participate?'
                        : '¿Por qué quieres participar?'}
                    </span>
                    <TextareaInput
                      value={motivation}
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
                  </FieldLabel>
                  <CheckboxCard
                    checked={hasAvailability}
                    onChange={(event) => setHasAvailability(event.target.checked)}
                  >
                    {isEnglish
                      ? 'I am available on event day.'
                      : 'Tengo disponibilidad el d\xEDa del evento.'}
                  </CheckboxCard>
                  <CheckboxCard
                    checked={acceptsCommitment}
                    onChange={(event) => setAcceptsCommitment(event.target.checked)}
                  >
                    {isEnglish
                      ? 'I agree to work as a team and follow care guidelines.'
                      : 'Acepto trabajar en equipo y seguir las indicaciones de cuidado.'}
                  </CheckboxCard>
                  <NoteCallout
                    tone="secondary"
                    title={isEnglish ? "Chispita's checklist" : 'Lista de Chispita'}
                  >
                    {isEnglish
                      ? '18+ \xB7 A clear motivation \xB7 Availability \xB7 Team commitment'
                      : '18+ \xB7 Una motivaci\xF3n clara \xB7 Disponibilidad \xB7 Compromiso'}
                  </NoteCallout>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="col-span-full mt-1.25 w-max phone:col-1 phone:w-full"
                  >
                    {isEnglish ? 'Check my application' : 'Revisar mi solicitud'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="grid justify-items-center pt-2.5 text-center">
                <Image
                  src={isPositive ? heroDogImage : rejectedApplicationImage}
                  className={cn(
                    'mb-6 block max-h-67.5 w-[min(300px,80%)] -rotate-2 border-7 border-ink bg-brand shadow-card phone:w-[min(250px,78%)]',
                    isPositive
                      ? 'rounded-circle object-contain'
                      : 'aspect-square rounded-3xl object-cover'
                  )}
                  alt={
                    isPositive
                      ? isEnglish
                        ? 'Happy dog welcoming the new volunteer'
                        : 'Perrito feliz dando la bienvenida al nuevo voluntario'
                      : isEnglish
                        ? 'Laughing dog reacting to the application'
                        : 'Perrito riéndose de la solicitud'
                  }
                />
                {resultCopy && (
                  <>
                    <Eyebrow variant="section" tone="accent">
                      {isEnglish ? resultCopy.eyebrow.en : resultCopy.eyebrow.es}
                    </Eyebrow>
                    <DialogTitle id="join-dialog-title">
                      {isEnglish
                        ? resultCopy.title.en(applicantName.trim())
                        : resultCopy.title.es(applicantName.trim())}
                    </DialogTitle>
                    <DialogDescription>
                      {isEnglish ? resultCopy.description.en : resultCopy.description.es}
                    </DialogDescription>
                  </>
                )}
                <Button className="mt-3" onClick={() => setJoinResult(null)}>
                  {isPositive
                    ? isEnglish
                      ? 'Review my answers'
                      : 'Revisar mis respuestas'
                    : isEnglish
                      ? 'Back to the form'
                      : 'Volver al formulario'}
                </Button>
              </div>
            )}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  )
}
