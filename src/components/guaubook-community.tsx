'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState, type FormEvent } from 'react'

import { Paw } from '@/assets/icons/paw'
import { EmptyStateCard } from '@/components/empty-state-card'
import { GuaubookProfileButton } from '@/components/guaubook-profile-button'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { FieldLabel, TextareaInput } from '@/components/ui/field'
import { assessPostRelevance } from '@/lib/content'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export function GuaubookCommunity({ variant = 'page' }: { variant?: 'page' | 'admin' }) {
  const { language } = useLanguage()
  const pathname = usePathname()
  const { user, posts, follows, petFurColor, addPost, requestPostReview } = useCommunity()
  const profileHref = pathname.startsWith('/admin')
    ? '/admin/guaubook/perfil'
    : user
      ? '/mi-perfil'
      : '/iniciar-sesion?redirect=%2Fmi-perfil'
  const [body, setBody] = useState('')
  const [image, setImage] = useState<string>()
  const [notice, setNotice] = useState('')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isPromptDismissed, setIsPromptDismissed] = useState(false)
  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('all')
  const bodyId = useId()

  const isEnglish = language === 'en'
  const isAdminView = variant === 'admin'

  const followingEmails = user ? (follows[user.email] ?? []) : []
  const visiblePosts =
    feedFilter === 'following'
      ? posts.filter((post) =>
          post.authorEmail ? followingEmails.includes(post.authorEmail) : false
        )
      : posts

  useEffect(() => {
    if (!isComposerOpen) return

    const focusTimeout = window.setTimeout(() => {
      document.getElementById(bodyId)?.focus()
    }, 80)

    return () => window.clearTimeout(focusTimeout)
  }, [bodyId, isComposerOpen])

  const openComposer = () => {
    setIsPromptDismissed(false)
    setIsComposerOpen(true)
  }

  const handleSelectPostImage = (file: File | undefined) => {
    if (!file) return

    const reader = new FileReader()

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') setImage(reader.result)
    })
    reader.readAsDataURL(file)
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

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          render={<Link href={profileHref} />}
        >
          {isEnglish ? 'View my profile' : 'Ver mi perfil'}
        </Button>
      </div>
      <div className={isAdminView ? 'mb-6' : 'mb-8 tablet:mb-7 phone:mb-6'}>
        <GuaubookProfileButton user={user} petFurColor={petFurColor} />
      </div>

      <div
        className={
          isAdminView
            ? 'grid grid-cols-[minmax(260px,0.72fr)_minmax(0,1fr)] items-start gap-8 tablet:grid-cols-[1fr] tablet:gap-7 phone:gap-5'
            : 'grid grid-cols-[minmax(300px,0.72fr)_minmax(0,1fr)] items-start gap-13.75 tablet:grid-cols-[1fr] tablet:gap-8.75'
        }
      >
        <div
          className={
            isAdminView
              ? 'relative top-0 grid gap-3.75 phone:gap-3'
              : 'sticky top-31.5 grid gap-3.75 tablet:relative tablet:top-0 phone:gap-3'
          }
        >
          {user ? (
            <>
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
                    <img
                      className="block max-h-90 w-full rounded-control object-cover"
                      src={image}
                      alt={
                        isEnglish ? 'Selected post preview' : 'Vista previa de la foto seleccionada'
                      }
                    />
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <label className="cursor-(--paw-cursor) text-small font-black underline">
                      <input
                        type="file"
                        className="absolute size-px opacity-0"
                        accept="image/*"
                        onChange={(event) => handleSelectPostImage(event.target.files?.[0])}
                      />
                      {isEnglish ? 'Add photo' : 'Añadir foto'}
                    </label>
                    <Button size="sm" type="submit">
                      {isEnglish ? 'Publish' : 'Publicar'}
                    </Button>
                  </div>
                  <small
                    className="block min-h-4.5 text-[12px] leading-label font-extrabold text-[#9e3b28]"
                    aria-live="polite"
                  >
                    {notice}
                  </small>
                </form>
              )}
            </>
          ) : (
            <aside
              className={
                isAdminView
                  ? 'grid justify-items-start gap-3.25 rounded-3xl border-4 border-ink bg-card p-6.75 text-ink shadow-card phone:p-4.75'
                  : 'sticky top-31.5 grid justify-items-start gap-3.25 rounded-3xl border-4 border-ink bg-card p-6.75 text-ink shadow-card tablet:relative tablet:top-0 phone:p-4.75'
              }
            >
              <Paw className="w-13.5 text-accent" />
              <Eyebrow>{isEnglish ? 'Your profile' : 'Tu perfil'}</Eyebrow>
              <h2 className="m-0 min-[541px]:text-[42px]">
                {isEnglish ? 'Join the conversation.' : 'Únete a la conversación.'}
              </h2>
              <p className="mb-2 leading-normal font-extrabold">
                {isEnglish
                  ? "Everyone can read the pack's stories. Create an account or sign in to publish, love and comment."
                  : 'Todos pueden leer las historias de la manada. Crea una cuenta o inicia sesión para publicar, dar Me encanta y comentar.'}
              </p>
              <Button render={<Link href="/iniciar-sesion" />}>
                {isEnglish ? 'Join or sign in' : 'Unirme o iniciar sesión'}
              </Button>
            </aside>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFeedFilter('all')}
            className={
              feedFilter === 'all'
                ? 'rounded-pill border-2 border-ink bg-brand px-3 py-1.5 text-small font-black'
                : 'rounded-pill border-2 border-ink bg-card px-3 py-1.5 text-small font-black'
            }
          >
            {isEnglish ? 'Community' : 'Comunidad'}
          </button>
          <button
            type="button"
            onClick={() => setFeedFilter('following')}
            className={
              feedFilter === 'following'
                ? 'rounded-pill border-2 border-ink bg-brand px-3 py-1.5 text-small font-black'
                : 'rounded-pill border-2 border-ink bg-card px-3 py-1.5 text-small font-black'
            }
          >
            {isEnglish ? 'Following' : 'Siguiendo'}
          </button>
        </div>
        <div className="grid gap-5" aria-live="polite">
          {visiblePosts.length ? (
            visiblePosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyStateCard
              title={
                feedFilter === 'following'
                  ? isEnglish
                    ? 'No posts available.'
                    : 'No hay publicaciones disponibles.'
                  : isEnglish
                    ? "The pack's first story will appear here."
                    : 'Aquí aparecerá la primera publicación de la manada.'
              }
            />
          )}
        </div>
      </div>

      </>
  )
}
