'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'

import { Paw } from '@/assets/icons/paw'
import { PostCard } from '@/components/post-card'
import { LanguageToggle, ThemeToggle, SiteNavigation } from '@/components/ui'
import { assessPostRelevance } from '@/lib/content'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export default function GuauBookPage() {
  const { language } = useLanguage()
  const { user, posts, addPost, requestPostReview } = useCommunity()
  const [body, setBody] = useState('')
  const [image, setImage] = useState<string>()
  const [notice, setNotice] = useState('')

  const isEnglish = language === 'en'

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
          : 'Esta publicaci\xF3n no parece estar relacionada con mascotas o cuidado animal, por eso no se public\xF3.'
      )
      return
    }

    if (relevance === 'review') {
      requestPostReview(body.trim())
      setNotice(
        isEnglish
          ? 'We could not confirm the topic. Add details such as dog, cat, pet, adoption or animal care, or wait for review.'
          : 'No pudimos confirmar el tema. A\xF1ade detalles como perro, gato, mascota, adopci\xF3n o cuidado animal, o espera la revisi\xF3n.'
      )
      return
    }

    addPost(body.trim(), image)
    setBody('')
    setImage(void 0)
    setNotice(
      isEnglish ? 'Your post is now in GuauBook.' : 'Tu publicaci\xF3n ya est\xE1 en GuauBook.'
    )
  }

  return (
    <main className="min-h-screen bg-surface-page-mint text-foreground">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />
      <section className="bg-surface-soft pt-21.5 pb-23 phone:pt-14.5 phone:pb-16.25">
        <div className="relative z-2 mx-auto w-[min(1240px,calc(100%-96px))] tablet:w-[min(100%-36px,680px)] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
            GuauBook
          </span>
          <h1 className="mt-2.75 mb-5 text-[clamp(64px,7vw,104px)] leading-display phone:text-[56px]">
            {isEnglish ? 'Stories from' : 'Historias de'}
            <br />
            <span className="text-accent">{isEnglish ? 'the pack.' : 'la manada.'}</span>
          </h1>
          <p className="m-0 max-w-155 text-lg leading-copy font-extrabold">
            {isEnglish
              ? 'Share a moment, a photo or a little good news with the Croquet\xF3n community.'
              : 'Comparte un momento, una foto o una buena noticia con la comunidad Croquet\xF3n.'}
          </p>
        </div>
      </section>
      <section className="relative z-2 mx-auto grid w-[min(1240px,calc(100%-96px))] grid-cols-[minmax(300px,0.72fr)_minmax(0,1fr)] items-start gap-13.75 pt-18 pb-27.5 tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] tablet:gap-8.75 phone:w-[min(100%-28px,680px)] phone:pt-10.5 laptop:w-[min(100%-48px,1040px)]">
        {user ? (
          <form
            className="sticky top-31.5 grid gap-3.75 rounded-3xl border-4 border-ink bg-card p-6.25 shadow-card tablet:relative tablet:top-0 phone:p-4.75"
            onSubmit={handlePublish}
          >
            <label
              htmlFor="post-body"
              className="grid gap-1.75 text-[12px] font-black tracking-label uppercase"
            >
              {isEnglish ? 'What do you want to share?' : '\xBFQu\xE9 quieres compartir?'}
            </label>
            <textarea
              id="post-body"
              className="min-h-30 w-full resize-y rounded-control border-3 border-ink bg-white p-3.5 font-bold text-ink"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={isEnglish ? 'Write something kind\u2026' : 'Escribe algo bonito\u2026'}
            />
            <small className="-mt-1.75 block text-[12px] leading-label font-extrabold text-[#526165]">
              {isEnglish
                ? 'Please share pets, care, food, animal health, adoption or experiences with animals.'
                : 'Comparte sobre mascotas, cuidados, alimentaci\xF3n, salud animal, adopci\xF3n o experiencias con animales.'}
            </small>
            {image && (
              <Image
                className="block max-h-90 w-full rounded-control object-cover"
                src={image}
                alt={isEnglish ? 'Selected post preview' : 'Vista previa de la foto seleccionada'}
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
                {isEnglish ? 'Add photo' : 'A\xF1adir foto'}
              </label>
              <button
                className="relative inline-flex min-h-12 items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink pr-4.5 pl-6.75 font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none!"
                type="submit"
              >
                {isEnglish ? 'Publish' : 'Publicar'}
              </button>
            </div>
            <small
              className="block min-h-4.5 text-[12px] leading-label font-extrabold text-[#9e3b28]"
              aria-live="polite"
            >
              {notice}
            </small>
          </form>
        ) : (
          <aside className="sticky top-31.5 grid justify-items-start gap-3.25 rounded-3xl border-4 border-ink bg-card p-6.75 text-ink shadow-card tablet:relative tablet:top-0 phone:p-4.75">
            <Paw className="w-13.5 text-accent" />
            <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
              {isEnglish ? 'Your profile' : 'Tu perfil'}
            </span>
            <h2 className="m-0 min-[541px]:text-[42px]">
              {isEnglish ? 'Join the conversation.' : '\xDAnete a la conversaci\xF3n.'}
            </h2>
            <p className="mb-2 leading-normal font-extrabold">
              {isEnglish
                ? "Everyone can read the pack's stories. Create an account or sign in to publish, love and comment."
                : 'Todos pueden leer las historias de la manada. Crea una cuenta o inicia sesi\xF3n para publicar, dar Me encanta y comentar.'}
            </p>
            <Link
              className="relative inline-flex min-h-14 items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink pr-4.5 pl-6.75 font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none!"
              href="/iniciar-sesion"
            >
              {isEnglish ? 'Join or sign in' : 'Unirme o iniciar sesi\xF3n'}
            </Link>
          </aside>
        )}
        <div className="grid gap-5" aria-live="polite">
          {posts.length ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="grid min-h-55 place-items-center rounded-3xl border-3 border-dashed border-secondary text-center font-black [&_svg]:w-14.5 [&_svg]:text-secondary">
              <Paw />
              <p>
                {isEnglish
                  ? "The pack's first story will appear here."
                  : 'Aqu\xED aparecer\xE1 la primera publicaci\xF3n de la manada.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
