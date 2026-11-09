'use client'

import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, type FormEvent } from 'react'

import { PageShell } from '@/components/page-shell'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { FieldLabel, TextInput } from '@/components/ui/field'
import { errorDogImage, packAccessDogImage } from '@/lib/images'
import { useNavigate } from '@/lib/navigation'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

function safeInternalPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return null
  }

  return value
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

function passwordChecks(value: string) {
  return {
    length: value.length >= 8,
    lowercase: /[a-z]/.test(value),
    numberOrSymbol: /[^A-Za-z]/.test(value),
    uppercase: /[A-Z]/.test(value)
  }
}

function passwordStrength(value: string) {
  const checks = passwordChecks(value)
  const score = Object.values(checks).filter(Boolean).length

  if (value.length === 0) return ''
  if (score <= 1) return 'weak'
  if (score <= 3) return 'medium'
  return 'strong'
}

function LoginContent() {
  const { language } = useLanguage()
  const { signIn, createAccount } = useCommunity()
  const navigate = useNavigate()
  const searchParams = useSearchParams()
  const redirectUrl = safeInternalPath(searchParams.get('redirect'))
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginMessage, setLoginMessage] = useState('')
  const [loginFailed, setLoginFailed] = useState(false)

  const isEnglish = language === 'en'
  const checks = passwordChecks(password)
  const strength = passwordStrength(password)
  const emailValid = email.trim() === '' || isValidEmail(email)

  const requestAccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      if (await signIn(email, password, remember)) {
        setLoginFailed(false)
        setLoginMessage('')
        const isAdmin = email.trim().toLowerCase() === 'admin@croqueton.mx'
        navigate(redirectUrl || (isAdmin ? '/admin' : '/mi-perfil'))
        return
      }

      setLoginFailed(true)
      setLoginMessage(
        isEnglish
          ? 'Wrong password. The dog has already started laughing.'
          : 'Contraseña incorrecta. El perro ya empezó a reírse.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const requestAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    if (!isValidEmail(email)) {
      setLoginFailed(true)
      setLoginMessage(
        isEnglish ? 'Enter a valid email address.' : 'Introduce un correo electrónico válido.'
      )
      return
    }

    if (!Object.values(checks).every(Boolean)) {
      setLoginFailed(true)
      setLoginMessage(
        isEnglish
          ? 'Your password does not meet all the requirements.'
          : 'Tu contraseña no cumple todos los requisitos.'
      )
      return
    }

    setIsSubmitting(true)
    try {
      if (await createAccount(email, password, remember)) {
        setLoginFailed(false)
        setLoginMessage('')
        navigate(redirectUrl || '/mi-perfil')
        return
      }

      setLoginFailed(true)
      setLoginMessage(
        isEnglish
          ? 'That email is already registered or the password is invalid.'
          : 'Ese correo ya está registrado o la contraseña no es válida.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const requirementItems = [
    {
      label: isEnglish ? 'At least 8 characters.' : 'Mínimo 8 caracteres.',
      met: checks.length
    },
    {
      label: isEnglish ? 'At least one uppercase letter.' : 'Al menos una mayúscula.',
      met: checks.uppercase
    },
    {
      label: isEnglish ? 'At least one lowercase letter.' : 'Al menos una minúscula.',
      met: checks.lowercase
    },
    {
      label: isEnglish ? 'At least one number or special symbol.' : 'Al menos un número o símbolo especial.',
      met: checks.numberOrSymbol
    }
  ]

  const strengthLabel =
    strength === 'weak'
      ? isEnglish
        ? 'Weak'
        : 'Débil'
      : strength === 'medium'
        ? isEnglish
          ? 'Medium'
          : 'Media'
        : strength === 'strong'
          ? isEnglish
            ? 'Strong'
            : 'Fuerte'
          : ''

  return (
    <PageShell
      surface="default"
      className="relative grid place-items-center px-5 pt-39.5 pb-20 before:absolute before:top-[52%] before:left-1/2 before:size-130 before:-translate-1/2 before:rounded-circle before:bg-surface-soft before:content-[''] phone:px-3.5 phone:pt-46.25 phone:pb-12 phone:before:size-80 [&_.page-nav-spacer]:hidden"
    >
      <section
        className="relative z-2 w-[min(520px,100%)] rounded-4xl border-5 border-stroke bg-card p-12 text-ink shadow-login-card phone:px-5.5 phone:pt-9.5 phone:pb-7"
        aria-labelledby="login-title"
      >
        <div className="mb-5.5 flex items-center gap-5 phone:gap-3.5">
          <figure className="m-0 size-20.5 flex-none -rotate-5 overflow-hidden rounded-circle border-3 border-ink bg-white shadow-[4px_5px_0_var(--accent)] phone:size-16.5">
            <Image
              src={packAccessDogImage}
              alt={isEnglish ? 'Puppy dressed for the pack' : 'Cachorro vestido para la manada'}
              className="block size-full object-cover"
            />
          </figure>
          <div className="flex-1">
            <Eyebrow variant="section" tone="accent" className="mb-2.25">
              {isEnglish ? 'Pack access' : 'Acceso de la manada'}
            </Eyebrow>
            <h1
              id="login-title"
              className="m-0 font-heading text-[clamp(48px,5vw,60px)] leading-[0.86] font-extrabold tracking-heading phone:text-[50px]"
            >
              {isCreatingAccount
                ? isEnglish
                  ? 'Create your'
                  : 'Crea tu'
                : isEnglish
                  ? 'Welcome'
                  : 'Bienvenido'}
              <br />
              <span className="text-accent">
                {isCreatingAccount
                  ? isEnglish
                    ? 'account.'
                    : 'cuenta.'
                  : isEnglish
                    ? 'back.'
                    : 'de vuelta.'}
              </span>
            </h1>
          </div>
        </div>
        <p className="leading-normal font-extrabold">
          {isCreatingAccount
            ? isEnglish
              ? 'Join GuauBook, customize your profile and share moments with the pack.'
              : 'Únete a GuauBook, personaliza tu perfil y comparte momentos con la manada.'
            : isEnglish
              ? 'Enter to see what the Croqueton pack is sharing.'
              : 'Entra para ver lo que comparte la manada Croqueton.'}
        </p>
        <form
          className="mt-7 grid gap-4.5"
          onSubmit={isCreatingAccount ? requestAccount : requestAccess}
        >
          <FieldLabel>
            <span>{isEnglish ? 'Email' : 'Correo electrónico'}</span>
            <TextInput
              type="email"
              variant="auth"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="tu@correo.com"
            />
            {!emailValid && (
              <small className="mt-1 block font-extrabold text-[#9e3b28]">
                {isEnglish
                  ? 'Enter a valid email address.'
                  : 'Introduce un correo electrónico válido.'}
              </small>
            )}
          </FieldLabel>
          <FieldLabel>
            <span>{isEnglish ? 'Password' : 'Contraseña'}</span>
            <div className="relative">
              <TextInput
                type={showPassword ? 'text' : 'password'}
                variant="auth"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isCreatingAccount ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                className="pr-11"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink opacity-70 transition hover:opacity-100"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword
                    ? isEnglish
                      ? 'Hide password'
                      : 'Ocultar contraseña'
                    : isEnglish
                      ? 'Show password'
                      : 'Mostrar contraseña'
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FieldLabel>

          {isCreatingAccount && (
            <div className="rounded-xl bg-surface-warm px-3.5 py-3 text-small font-bold">
              <p className="m-0 mb-2 font-black">
                {isEnglish
                  ? 'Your password must include:'
                  : 'Tu contraseña debe cumplir con lo siguiente:'}
              </p>
              <ul className="m-0 grid gap-1 pl-0" style={{ listStyle: 'none' }}>
                {requirementItems.map((item) => (
                  <li
                    key={item.label}
                    className={item.met ? 'text-[#2f6b45]' : 'opacity-65'}
                  >
                    <span className="mr-1.5 font-black">{item.met ? '✓' : '•'}</span>
                    {item.label}
                  </li>
                ))}
              </ul>
              {strengthLabel && (
                <p className="mt-2 mb-0 font-black">
                  {isEnglish ? 'Strength:' : 'Seguridad:'}{' '}
                  <span
                    className={
                      strength === 'weak'
                        ? 'text-[#9e3b28]'
                        : strength === 'medium'
                          ? 'text-[#8b6500]'
                          : 'text-[#2f6b45]'
                    }
                  >
                    {strengthLabel}
                  </span>
                </p>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 text-small font-bold">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-4 rounded border-2 border-ink"
            />
            {isEnglish ? 'Remember me' : 'Recordarme'}
          </label>

          <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
            {isSubmitting
              ? isEnglish
                ? 'Please wait…'
                : 'Procesando…'
              : isCreatingAccount
                ? isEnglish
                  ? 'Create my account'
                  : 'Crear mi cuenta'
                : isEnglish
                  ? 'Sign in'
                  : 'Iniciar sesión'}
          </Button>
          {!isCreatingAccount && (
            <small className="min-h-4.5 rounded-lg bg-surface-warm px-3 py-2.25 text-center font-extrabold text-ink">
              {isEnglish
                ? 'Demo: admin@croqueton.mx · croqueton2026'
                : 'Demo: admin@croqueton.mx · croqueton2026'}
            </small>
          )}
          <Button
            variant="link-border"
            className="justify-self-center py-1 text-ink"
            type="button"
            onClick={() => {
              setIsCreatingAccount((current) => !current)
              setLoginFailed(false)
              setLoginMessage('')
            }}
          >
            {isCreatingAccount
              ? isEnglish
                ? 'I already have an account'
                : 'Ya tengo una cuenta'
              : isEnglish
                ? 'Create my account'
                : 'Crear mi cuenta'}
          </Button>
          <small aria-live="polite" className="min-h-4.5 font-extrabold opacity-65">
            {loginMessage ||
              (isCreatingAccount
                ? isEnglish
                  ? 'Your password must have at least 8 characters.'
                  : 'Tu contraseña debe tener al menos 8 caracteres.'
                : isEnglish
                  ? 'Use your email and password to continue.'
                  : 'Usa tu correo y contraseña para continuar.')}
          </small>
        </form>
        {loginFailed && (
          <figure className="mt-6.25 border-t-2 border-dashed border-divider pt-5.75 text-center">
            <Image
              src={errorDogImage}
              className="mx-auto block aspect-square w-[min(230px,75%)] -rotate-2 rounded-dialog-sm border-6 border-ink object-cover shadow-[7px_8px_0_var(--accent)]"
              alt={
                isEnglish
                  ? 'Puppy laughing at the wrong password'
                  : 'Perrito riéndose por la contraseña incorrecta'
              }
            />
            <figcaption className="mx-auto -mt-2.25 w-max rotate-2 rounded-tag bg-ink px-3 py-1.75 font-heading font-black text-card">
              {isEnglish ? 'Nice try, human.' : 'Buen intento, humano.'}
            </figcaption>
          </figure>
        )}
      </section>
    </PageShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden="true" />}>
      <LoginContent />
    </Suspense>
  )
}
