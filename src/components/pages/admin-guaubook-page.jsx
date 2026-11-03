'use client'

import { useRef, useState } from 'react'

import AdminIcon from '@/components/admin-icon'
import AdminPostCard from '@/components/admin-post-card'
import GuaubookProfilePanel from '@/components/guaubook-profile-panel'
import PetVisual from '@/components/pet-visual'
import { CareAvatar, Paw } from '@/components/ui'
import { useCommunity } from '@/context/app-context'
import { assessPostRelevance } from '@/lib/content'
import { followers, following } from '@/lib/social'

function AdminGuaubookPage({ personalized = false }) {
  const { user, posts, addPost, requestPostReview, avatarConfig, petFurColor, follows, profiles, toggleFollow } = useCommunity()
  const followedEmails = follows?.[user?.email] || []
  const visiblePosts = personalized
    ? posts.filter((post) => post.authorEmail === user?.email || followedEmails.includes(post.authorEmail))
    : posts
  const [view, setView] = useState('feed')
  const [userSearch, setUserSearch] = useState('')
  const userQuery = userSearch.trim().toLowerCase()
  const communityUsers = Object.values(profiles || {}).filter((profile) => {
    if (!profile?.email || profile.email === user?.email) return false
    if (!userQuery) return false
    return `${profile.name} ${profile.username} ${profile.email}`.toLowerCase().includes(userQuery)
  })
  const [body, setBody] = useState('')
  const [image, setImage] = useState()
  const [notice, setNotice] = useState('')
  const composerRef = useRef(null)

  const myPosts = posts.filter((post) =>
    post.authorEmail ? post.authorEmail === user?.email : post.author === user?.name
  )

  function selectPostImage(file) {
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') setImage(reader.result)
    })
    reader.readAsDataURL(file)
  }
  function publish(event) {
    event.preventDefault()
    if (!body.trim() && !image) return
    const relevance = assessPostRelevance(body.trim(), !!image)
    if (relevance === 'blocked') {
      setNotice(
        'Esta publicación no parece estar relacionada con mascotas o cuidado animal, por eso no se publicó.'
      )
      return
    }
    if (relevance === 'review') {
      requestPostReview(body.trim(), image)
      setNotice(
        'No pudimos confirmar el tema. Añade detalles como perro, gato, mascota, adopción o cuidado animal, o espera la revisión.'
      )
      return
    }
    addPost(body.trim(), image)
    setBody('')
    setImage(void 0)
    setNotice('Tu publicación ya está en GuauBook.')
  }
  function startPublishing() {
    setView('feed')
    setNotice('')
    requestAnimationFrame(() => composerRef.current?.focus())
  }

  return (
    <section className="admin-main" id="guaubook">
      <button
        type="button"
        className={`admin-guaubook-profile-button ${view === 'profile' ? 'is-active' : ''}`}
        onClick={() => setView(view === 'profile' ? 'feed' : 'profile')}
        aria-expanded={view === 'profile'}
      >
        <span className="admin-guaubook-profile-thumb">
          <CareAvatar {...avatarConfig} />
        </span>
        <span className="admin-guaubook-profile-pet">
          <PetVisual user={user} furColor={petFurColor} />
        </span>
        <span className="admin-guaubook-profile-info">
          <span className="chapter">Mi perfil</span>
          <strong>{user?.name}</strong>
          <small>
            Mascota · {user?.petName || 'Chispita'} · {myPosts.length} publicaciones
          </small>
        </span>
        <span className="admin-guaubook-profile-action">
          {view === 'profile' ? 'Cerrar perfil' : 'Abrir perfil →'}
        </span>
      </button>

      {view === 'profile' ? (
        <GuaubookProfilePanel
          user={user}
          myPosts={myPosts}
          followers={followers}
          following={following}
          onPublish={startPublishing}
        />
      ) : (
        <>
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span className="chapter">Comunidad</span>
                <h2>Buscar usuarios</h2>
                <p>Encuentra personas y síguelas para personalizar tu GuauBook.</p>
              </div>
              <span className="admin-count">{communityUsers.length}</span>
            </div>
            <label className="admin-social-search">
              <span>Buscar</span>
              <input
                type="search"
                placeholder="Nombre o usuario"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
              />
            </label>
            {communityUsers.length ? (
              <div className="admin-guaubook-list">
                {communityUsers.map((profile) => {
                  const isFollowing = (follows?.[user?.email] || []).includes(profile.email)
                  return (
                    <article key={profile.email} className="admin-guaubook-post">
                      <div className="admin-guaubook-post-head">
                        <span className="post-avatar">
                          <Paw />
                        </span>
                        <div>
                          <strong>{profile.name}</strong>
                          <small>@{profile.username}</small>
                        </div>
                        <button type="button" className="admin-follow-button" onClick={() => toggleFollow(profile.email)}>
                          {isFollowing ? 'Siguiendo' : 'Seguir'}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="admin-empty compact">
                <strong>{userQuery ? 'Sin usuarios' : 'Buscar usuarios'}</strong>
                <p>{userQuery ? 'No encontramos personas con esa búsqueda.' : 'Escribe un nombre o usuario para ver resultados.'}</p>
              </div>
            )}
          </section>

          <div className="admin-guaubook-grid">
          <form className="admin-panel admin-post-composer" onSubmit={publish}>
            <div className="admin-panel-heading">
              <div>
                <span className="chapter">GuauBook</span>
                <h2>Nueva publicación</h2>
                <p>Comparte algo con la manada.</p>
              </div>
              <span className="admin-count">+</span>
            </div>
            <div className="admin-post-composer-body">
              <label>
                <span>¿Qué quieres compartir?</span>
                <textarea
                  ref={composerRef}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Escribe algo bonito…"
                />
              </label>
              <small className="admin-post-guidelines">
                Comparte sobre mascotas, cuidados, alimentación, salud animal, adopción o
                experiencias con animales.
              </small>
              {image && (
                <img
                  className="admin-post-preview"
                  src={image}
                  alt="Vista previa de la foto seleccionada"
                />
              )}
              <div className="admin-post-composer-actions">
                <label className="admin-photo-picker">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => selectPostImage(event.target.files?.[0])}
                  />
                  Añadir foto
                </label>
                <button className="admin-approve" type="submit">
                  Publicar
                </button>
              </div>
              <small className="admin-post-notice" aria-live="polite">
                {notice}
              </small>
            </div>
          </form>

          <section className="admin-panel admin-guaubook-feed">
            <div className="admin-panel-heading">
              <div>
                <span className="chapter">Comunidad</span>
                <h2>Publicaciones</h2>
                <p>Lo último que compartió la manada en GuauBook.</p>
              </div>
              <span className="admin-count">{visiblePosts.length}</span>
            </div>
            {visiblePosts.length ? (
              <div className="admin-guaubook-list">
                {visiblePosts.map((post) => (
                  <AdminPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="admin-empty compact">
                <AdminIcon type="posts" />
                <strong>Aún no hay publicaciones</strong>
                <p>Las historias de la manada aparecerán aquí.</p>
              </div>
            )}
          </section>
        </div>
        </>
      )}
    </section>
  )
}
export default AdminGuaubookPage
