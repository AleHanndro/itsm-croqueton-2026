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
    <main className="community-page">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />
      <section className="community-hero">
        <div className="container">
          <span className="eyebrow">GuauBook</span>
          <h1>
            {isEnglish ? 'Stories from' : 'Historias de'}
            <br />
            <span>{isEnglish ? 'the pack.' : 'la manada.'}</span>
          </h1>
          <p>
            {isEnglish
              ? 'Share a moment, a photo or a little good news with the Croquet\xF3n community.'
              : 'Comparte un momento, una foto o una buena noticia con la comunidad Croquet\xF3n.'}
          </p>
        </div>
      </section>
      <section className="community-content container">
        {user ? (
          <form className="post-composer" onSubmit={handlePublish}>
            <label htmlFor="post-body">
              {isEnglish ? 'What do you want to share?' : '\xBFQu\xE9 quieres compartir?'}
            </label>
            <textarea
              id="post-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={isEnglish ? 'Write something kind\u2026' : 'Escribe algo bonito\u2026'}
            />
            <small className="post-guidelines">
              {isEnglish
                ? 'Please share pets, care, food, animal health, adoption or experiences with animals.'
                : 'Comparte sobre mascotas, cuidados, alimentaci\xF3n, salud animal, adopci\xF3n o experiencias con animales.'}
            </small>
            {image && (
              <Image
                className="post-preview"
                src={image}
                alt={isEnglish ? 'Selected post preview' : 'Vista previa de la foto seleccionada'}
              />
            )}
            <div>
              <label className="photo-picker">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSelectPostImage(event.target.files?.[0])}
                />
                {isEnglish ? 'Add photo' : 'A\xF1adir foto'}
              </label>
              <button className="button button-dark" type="submit">
                {isEnglish ? 'Publish' : 'Publicar'}
              </button>
            </div>
            <small className="post-notice" aria-live="polite">
              {notice}
            </small>
          </form>
        ) : (
          <aside className="post-signup-card">
            <Paw />
            <span className="eyebrow">{isEnglish ? 'Your profile' : 'Tu perfil'}</span>
            <h2>{isEnglish ? 'Join the conversation.' : '\xDAnete a la conversaci\xF3n.'}</h2>
            <p>
              {isEnglish
                ? "Everyone can read the pack's stories. Create an account or sign in to publish, love and comment."
                : 'Todos pueden leer las historias de la manada. Crea una cuenta o inicia sesi\xF3n para publicar, dar Me encanta y comentar.'}
            </p>
            <Link className="button button-dark" href="/iniciar-sesion">
              {isEnglish ? 'Join or sign in' : 'Unirme o iniciar sesi\xF3n'}
            </Link>
          </aside>
        )}
        <div className="post-feed" aria-live="polite">
          {posts.length ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="empty-posts">
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
