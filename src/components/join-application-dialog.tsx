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

export function JoinApplicationDialog({
  open,
  onOpenChange,
  isEnglish
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEnglish: boolean
}) {
  const [joinResult, setJoinResult] = useState<'requirements' | 'welcome' | null>(null)
  const [applicantName, setApplicantName] = useState('')
  const [applicantAge, setApplicantAge] = useState('')
  const [motivation, setMotivation] = useState('')
  const [hasAvailability, setHasAvailability] = useState(false)
  const [acceptsCommitment, setAcceptsCommitment] = useState(false)

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setJoinResult(null)
    }
    onOpenChange(nextOpen)
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
                  <FieldLabel className="col-span-full phone:col-1">
                    <span>
                      {isEnglish
                        ? 'Why do you want to participate?'
                        : '\xBFPor qu\xE9 quieres participar?'}
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
                    className="col-span-full mt-1.25 w-max phone:col-1 phone:w-full"
                  >
                    {isEnglish ? 'Check my application' : 'Revisar mi solicitud'}
                  </Button>
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
                <Eyebrow variant="section" tone="accent">
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? 'Registration complete'
                      : 'Registro completado'
                    : isEnglish
                      ? 'Almost, human'
                      : 'Casi, humano'}
                </Eyebrow>
                <DialogTitle id="join-dialog-title">
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? `Thank you for joining, ${applicantName.trim()}!`
                      : `\xA1Gracias por registrarte, ${applicantName.trim()}!`
                    : isEnglish
                      ? 'Your checklist needs work.'
                      : 'Te faltaron unas casillas.'}
                </DialogTitle>
                <DialogDescription>
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? 'Your time and motivation can fill many bowls. The pack received your registration and will contact you to confirm the next steps.'
                      : 'Tu tiempo y tu motivaci\xF3n pueden llenar muchos platos. La manada recibi\xF3 tu registro y se pondr\xE1 en contacto contigo para confirmar los siguientes pasos.'
                    : isEnglish
                      ? 'You need to be 18+, explain your motivation in at least 20 characters, be available and ready to work as a team. The dog is laughing with you, not at you. Probably.'
                      : 'Necesitas ser mayor de edad, explicar tu motivaci\xF3n en al menos 20 caracteres, tener disponibilidad y aceptar el trabajo en equipo. El perrito se r\xEDe contigo, no de ti. Probablemente.'}
                </DialogDescription>
                <Button className="mt-3" onClick={() => setJoinResult(null)}>
                  {joinResult === 'welcome'
                    ? isEnglish
                      ? 'Review my answers'
                      : 'Revisar mis respuestas'
                    : isEnglish
                      ? 'Complete the form'
                      : 'Completar el formulario'}
                </Button>
              </div>
            )}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  )
}
