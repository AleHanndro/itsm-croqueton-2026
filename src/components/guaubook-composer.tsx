'use client'

import { useEffect, useId, useState, type FormEvent } from 'react'

import { Paw } from '@/assets/icons/paw'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { FieldLabel, TextareaInput } from '@/components/ui/field'
import { OPEN_COMPOSER_EVENT } from '@/lib/community'
import { assessPostRelevance } from '@/lib/content'
import { readImageFile, type ImageFileError } from '@/lib/image-file'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export function GuaubookComposer() {
  const { language } = useLanguage()
  const { addPost, requestPostReview, user } = useCommunity()
  const [body, setBody] = useState('')
  const [image, setImage] = useState<string>()
  const [notice, setNotice] = useState('')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isPromptDismissed, setIsPromptDismissed] = useState(false)
  const bodyId = useId()

  const isEnglish = language === 'en'
  const isBlocked = !!user && user.accountStatus !== 'active'

  const openComposer = () => {
    setIsPromptDismissed(false)
    setIsComposerOpen(true)
    window.setTimeout(() => {
      document.getElementById('crear-publicacion')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 40)
  }

  useEffect(() => {
    const handleOpen = () => openComposer()
    const handleHash = () => {
      if (window.location.hash === '#crear-publicacion') openComposer()
    }

    window.addEventListener(OPEN_COMPOSER_EVENT, handleOpen)
    window.addEventListener('hashchange', handleHash)
    handleHash()

    return () => {
      window.removeEventListener(OPEN_COMPOSER_EVENT, handleOpen)
      window.removeEventListener('hashchange', handleHash)
    }
  }, [])

  useEffect(() => {
    if (!isComposerOpen) return

    const focusTimeout = window.setTimeout(() => {
      document.getElementById(bodyId)?.focus()
    }, 80)

    return () => window.clearTimeout(focusTimeout)
  }, [bodyId, isComposerOpen])

  const handleSelectPostImage = (file: File | undefined) => {
    readImageFile(
      file,
      (dataUrl) => {
        setImage(dataUrl)
        setNotice('')
      },
      (reason: ImageFileError) => {
        setNotice(
          reason === 'too_large'
            ? isEnglish
              ? 'The image is too large. Use one smaller than 8 MB.'
              : 'La imagen es muy grande. Usa una de menos de 8 MB.'
            : isEnglish
              ? 'Choose a valid image file that can be read.'
              : 'Elige un archivo de imagen válido que se pueda leer.'
        )
      }
    )
  }

  const resetComposer = () => {
    setBody('')
    setImage(void 0)
    setNotice('')
  }

  const cancelComposer = () => {
    resetComposer()
    setIsComposerOpen(false)
  }

  const handlePublish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!body.trim() && !image) return

    const relevance = assessPostRelevance(body.trim(), !!image)
    if (relevance === 'blocked') {
      setNotice(
        isEnglish
          ? 'This post does not appear to be related to pets or animal care, so it was not published.'
          : 'Esta publicación no parece estar relacionada con mascotas o cuidado animal, por eso no se publicó.'
      )
      return
    }

    if (relevance === 'review') {
      requestPostReview(body.trim())
      setNotice(
        isEnglish
          ? 'We could not confirm the topic. Add details such as dog, cat, pet, adoption or animal care, or wait for review.'
          : 'No pudimos confirmar el tema. Añade detalles como perro, gato, mascota, adopción o cuidado animal, o espera la revisión.'
      )
      return
    }

    addPost(body.trim(), image)
    setBody('')
    setImage(void 0)
    setNotice(isEnglish ? 'Your post is now in GuauBook.' : 'Tu publicación ya está en GuauBook.')
  }

  if (isBlocked) {
    return (
      <section className="grid gap-3 rounded-3xl border-4 border-ink bg-card p-6.25 text-ink shadow-card phone:p-4.75">
        <Eyebrow>{isEnglish ? 'Account suspended' : 'Cuenta suspendida'}</Eyebrow>
        <h2 className="m-0 text-[clamp(24px,3vw,36px)] leading-[0.95]">
          {isEnglish ? 'Your account is temporarily suspended.' : 'Tu cuenta está suspendida temporalmente.'}
        </h2>
        <p className="m-0 leading-normal font-extrabold">
          {isEnglish
            ? 'You can keep browsing GuauBook, but you cannot publish, comment or react for now.'
            : 'Puedes seguir navegando por GuauBook, pero por ahora no puedes publicar, comentar ni reaccionar.'}
        </p>
      </section>
    )
  }

  return (
    <div id="crear-publicacion" className="grid scroll-mt-28 gap-3">
      {!isComposerOpen && !isPromptDismissed && (
        <section className="grid gap-3.25 rounded-3xl border-4 border-ink bg-card p-6.25 text-ink shadow-card phone:p-4.75">
          <Paw className="w-12 text-accent phone:w-10" />
          <Eyebrow>{isEnglish ? 'GuauBook' : 'GuauBook'}</Eyebrow>
          <h2 className="m-0 text-[clamp(30px,3.6vw,44px)] leading-[0.95]">
            {isEnglish ? 'Do you want to post something?' : '¿Quieres publicar algo?'}
          </h2>
          <p className="m-0 leading-normal font-extrabold">
            {isEnglish
              ? 'Share a photo, a story or a moment with the pack.'
              : 'Comparte una foto, una historia o un momento con la manada.'}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
            <Button type="button" size="sm" onClick={openComposer}>
              {isEnglish ? 'Yes, publish' : 'Sí, publicar'}
            </Button>
            <Button
              type="button"
              variant="underline"
              className="text-ink"
              onClick={() => setIsPromptDismissed(true)}
            >
              {isEnglish ? 'Not now' : 'Ahora no'}
            </Button>
          </div>
        </section>
      )}

      {!isComposerOpen && isPromptDismissed && (
        <section className="grid justify-items-start gap-3 rounded-3xl border-4 border-ink bg-card p-5 text-ink shadow-card phone:p-4">
          <p className="m-0 text-small font-extrabold opacity-65">
            {isEnglish
              ? 'You can publish whenever you feel like it.'
              : 'Puedes publicar cuando tú quieras.'}
          </p>
          <Button type="button" size="sm" onClick={openComposer}>
            {isEnglish ? 'Open composer' : 'Abrir compositor'}
          </Button>
        </section>
      )}

      {isComposerOpen && (
        <form
          className="grid gap-3.75 rounded-3xl border-4 border-ink bg-card p-6.25 shadow-card phone:p-4.75"
          onSubmit={handlePublish}
        >
          <FieldLabel htmlFor={bodyId}>
            {isEnglish ? 'What do you want to share?' : '¿Qué quieres compartir?'}
          </FieldLabel>
          <TextareaInput
            id={bodyId}
            variant="control"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={isEnglish ? 'Write something kind…' : 'Escribe algo bonito…'}
          />
          <small className="-mt-1.75 block text-[12px] leading-label font-extrabold text-[#526165]">
            {isEnglish
              ? 'Please share pets, care, food, animal health, adoption or experiences with animals.'
              : 'Comparte sobre mascotas, cuidados, alimentación, salud animal, adopción o experiencias con animales.'}
          </small>
          {image && (
            <div className="relative">
              <img
                className="block max-h-90 w-full rounded-control object-cover"
                src={image}
                alt={isEnglish ? 'Selected post preview' : 'Vista previa de la foto seleccionada'}
              />
              <button
                type="button"
                className="absolute top-2.5 right-2.5 rounded-pill border-2 border-ink bg-card px-2.5 py-1 text-caption font-black text-ink"
                onClick={() => setImage(void 0)}
              >
                {isEnglish ? 'Remove photo' : 'Quitar foto'}
              </button>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="cursor-(--paw-cursor) text-small font-black underline">
              <input
                type="file"
                className="absolute size-px opacity-0"
                accept="image/*"
                onChange={(event) => {
                  handleSelectPostImage(event.target.files?.[0])
                  event.target.value = ''
                }}
              />
              {image
                ? isEnglish
                  ? 'Change photo'
                  : 'Cambiar foto'
                : isEnglish
                  ? 'Add photo'
                  : 'Añadir foto'}
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                variant="underline"
                className="text-ink"
                onClick={cancelComposer}
              >
                {isEnglish ? 'Cancel' : 'Cancelar'}
              </Button>
              <Button size="sm" type="submit">
                {isEnglish ? 'Publish' : 'Publicar'}
              </Button>
            </div>
          </div>
          <small
            className="block min-h-4.5 text-[12px] leading-label font-extrabold text-[#9e3b28]"
            aria-live="polite"
          >
            {notice}
          </small>
        </form>
      )}
    </div>
  )
}
