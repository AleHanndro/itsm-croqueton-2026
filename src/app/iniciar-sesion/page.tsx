'use client'

import Image from 'next/image'
import { useState, type FormEvent } from 'react'

import { LanguageToggle, ThemeToggle, SiteNavigation } from '@/components/ui'
import { errorDogImage, packAccessDogImage } from '@/lib/images'
import { useNavigate } from '@/lib/navigation'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export default function LoginPage() {
  const { language } = useLanguage()
  const { signIn, createAccount } = useCommunity()
  const navigate = useNavigate()
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState('')
  const [loginFailed, setLoginFailed] = useState(false)

  const isEnglish = language === 'en'

  const requestAccess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (signIn(email, password)) {
      setLoginFailed(false)
      setLoginMessage('')
      navigate(email.trim().toLowerCase() === 'admin@croqueton.mx' ? '/admin' : '/guaubook')
      return
    }

    setLoginFailed(true)
    setLoginMessage(
      isEnglish
        ? 'Wrong password. The dog has already started laughing.'
        : 'Contrase\xF1a incorrecta. El perrito ya empez\xF3 a re\xEDrse.'
    )
  }

  const requestAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (email.includes('@') && password.length >= 6 && createAccount(email, password)) {
      navigate('/mi-perfil')
      return
    }

    setLoginFailed(true)
    setLoginMessage(
      isEnglish
        ? 'Use an unused email and a password with at least 6 characters.'
        : 'Usa un correo que no exista y una contrase\xF1a de al menos 6 caracteres.'
    )
  }

  return (
    <main className="relative grid min-h-screen place-items-center bg-background px-5 pt-39.5 pb-20 text-foreground before:absolute before:top-[52%] before:left-1/2 before:size-130 before:-translate-1/2 before:rounded-circle before:bg-surface-soft before:content-[''] phone:px-3.5 phone:pt-46.25 phone:pb-12 phone:before:size-80 [&_.page-nav-spacer]:hidden">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />
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
            <span className="mb-2.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
              {isEnglish ? 'Pack access' : 'Acceso de la manada'}
            </span>
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
              : '\xDAnete a GuauBook, personaliza tu perfil y comparte momentos con la manada.'
            : isEnglish
              ? 'Enter to see what the Croquet\xF3n pack is sharing.'
              : 'Entra para ver lo que comparte la manada Croquet\xF3n.'}
        </p>
        <form
          className="mt-7 grid gap-4.5"
          onSubmit={isCreatingAccount ? requestAccount : requestAccess}
        >
          <label className="grid gap-1.75 text-[12px] font-black tracking-label uppercase">
            <span>{isEnglish ? 'Email' : 'Correo electr\xF3nico'}</span>
            <input
              type="email"
              className="min-h-13.5 rounded-field border-3 border-ink bg-white px-4 font-extrabold text-ink focus:outline-4 focus:outline-offset-2 focus:outline-secondary"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="tu@correo.com"
            />
          </label>
          <label className="grid gap-1.75 text-[12px] font-black tracking-label uppercase">
            <span>{isEnglish ? 'Password' : 'Contrase\xF1a'}</span>
            <input
              type="password"
              className="min-h-13.5 rounded-field border-3 border-ink bg-white px-4 font-extrabold text-ink focus:outline-4 focus:outline-offset-2 focus:outline-secondary"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isCreatingAccount ? 'new-password' : 'current-password'}
              minLength={isCreatingAccount ? 6 : void 0}
              placeholder="••••••••"
            />
          </label>
          <button
            className="relative mt-1 inline-flex min-h-14 w-full items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink pr-4.5 pl-6.75 font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none!"
            type="submit"
          >
            {isCreatingAccount
              ? isEnglish
                ? 'Create my account'
                : 'Crear mi cuenta'
              : isEnglish
                ? 'Sign in'
                : 'Iniciar sesi\xF3n'}
          </button>
          {!isCreatingAccount && (
            <small className="min-h-4.5 rounded-lg bg-surface-warm px-3 py-2.25 text-center font-extrabold text-ink">
              {isEnglish
                ? 'Demo: admin@croqueton.mx \xB7 croqueton2026'
                : 'Demo: admin@croqueton.mx \xB7 croqueton2026'}
            </small>
          )}
          <button
            className="justify-self-center border-b-3 border-current bg-transparent py-1 font-black text-ink"
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
          </button>
          <small aria-live="polite" className="min-h-4.5 font-extrabold opacity-65">
            {loginMessage ||
              (isCreatingAccount
                ? isEnglish
                  ? 'Your password must have at least 6 characters.'
                  : 'Tu contrase\xF1a debe tener al menos 6 caracteres.'
                : isEnglish
                  ? 'Use your email and password to continue.'
                  : 'Usa tu correo y contrase\xF1a para continuar.')}
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
                  : 'Perrito ri\xE9ndose por la contrase\xF1a incorrecta'
              }
            />
            <figcaption className="mx-auto -mt-2.25 w-max rotate-2 rounded-tag bg-ink px-3 py-1.75 font-heading font-black text-card">
              {isEnglish ? 'Nice try, human.' : 'Buen intento, humano.'}
            </figcaption>
          </figure>
        )}
      </section>
    </main>
  )
}
