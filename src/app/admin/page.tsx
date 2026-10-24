'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Paw } from '@/assets/icons/paw'
import AdminIcon from '@/components/admin-icon'
import CommunityNavigation from '@/components/community-navigation'
import { LanguageToggle, ThemeToggle } from '@/components/ui'
import { useNavigate } from '@/lib/navigation'
import { useCommunity } from '@/providers/community-provider'

export default function AdminPage() {
  const {
    user,
    posts,
    postReviewRequests,
    accountCount,
    approvePostReview,
    rejectPostReview,
    adminDeletePost,
    signOut
  } = useCommunity()
  const navigate = useNavigate()
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)
  const [today, setToday] = useState('')

  const isAdmin = user?.email === 'admin@croqueton.mx'
  const totalReactions = posts.reduce(
    (total, post) => total + post.likedBy.length + post.comments.length,
    0
  )

  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(
        new Date()
      )
    )
  }, [])

  if (!user || !isAdmin) {
    return (
      <main className="community-page">
        <CommunityNavigation />
        <section className="admin-access container">
          <Paw />
          <span className="eyebrow">Acceso restringido</span>
          <h1>Panel de administración</h1>
          <p>Inicia sesión con la cuenta administradora para gestionar la comunidad.</p>
          <Link className="button button-dark" href="/iniciar-sesion">
            Ir al acceso
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <LanguageToggle />
      <ThemeToggle />
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link href="/" className="logo admin-brand" aria-label="Croquetón">
            <span className="logo-mark">
              <Paw />
            </span>
            <span>Croquetón</span>
          </Link>
          <div className="admin-role">Administrador</div>
          <nav className="admin-menu" aria-label="Navegación del panel">
            <a className="is-active" href="#resumen">
              <AdminIcon type="heart" />
              <span>Resumen</span>
            </a>
            <a href="#moderacion">
              <AdminIcon type="review" />
              <span>Moderación</span>
              {postReviewRequests.length > 0 && <strong>{postReviewRequests.length}</strong>}
            </a>
            <a href="#comunidad">
              <AdminIcon type="posts" />
              <span>Comunidad</span>
            </a>
            <Link href="/guaubook">
              <AdminIcon type="users" />
              <span>Ver GuauBook</span>
            </Link>
          </nav>
          <div className="admin-account">
            <span className="admin-avatar">A</span>
            <div>
              <strong>Admin Croquetón</strong>
              <small>{user.email}</small>
            </div>
          </div>
          <button
            className="admin-signout"
            type="button"
            onClick={() => {
              signOut()
              navigate('/')
            }}
          >
            Cerrar sesión
          </button>
        </aside>

        <div className="admin-workspace">
          <header className="admin-topbar">
            <div>
              <span>Panel de administración</span>
              <small>{today}</small>
            </div>
            <Link href="/guaubook">
              Abrir sitio público <span>↗</span>
            </Link>
          </header>

          <section className="admin-main" id="resumen">
            <div className="admin-welcome">
              <div>
                <span className="eyebrow">Resumen general</span>
                <h1>Buenos días, admin.</h1>
                <p>
                  Revisa la actividad de la comunidad y atiende lo importante desde un solo lugar.
                </p>
              </div>
              <div className="admin-status">
                <span />
                <div>
                  <strong>Cuenta protegida</strong>
                  <small>Sesión activa como administrador</small>
                </div>
              </div>
            </div>

            {postReviewRequests.length > 0 && (
              <a className="admin-priority" href="#moderacion">
                <span className="admin-priority-icon">
                  <AdminIcon type="review" />
                </span>
                <div>
                  <strong>
                    Tienes {postReviewRequests.length}{' '}
                    {postReviewRequests.length === 1
                      ? 'solicitud pendiente'
                      : 'solicitudes pendientes'}
                  </strong>
                  <small>Revísalas para mantener GuauBook actualizado y seguro.</small>
                </div>
                <span className="admin-priority-action">Revisar ahora →</span>
              </a>
            )}

            <section className="admin-stats" aria-label="Resumen de la comunidad">
              <article>
                <span className="admin-stat-icon coral">
                  <AdminIcon type="posts" />
                </span>
                <div>
                  <small>Publicaciones</small>
                  <strong>{posts.length}</strong>
                  <span>contenido publicado</span>
                </div>
              </article>
              <article>
                <span className="admin-stat-icon yellow">
                  <AdminIcon type="review" />
                </span>
                <div>
                  <small>Por revisar</small>
                  <strong>{postReviewRequests.length}</strong>
                  <span>
                    {postReviewRequests.length ? 'requieren atenci\xF3n' : 'todo al d\xEDa'}
                  </span>
                </div>
              </article>
              <article>
                <span className="admin-stat-icon blue">
                  <AdminIcon type="users" />
                </span>
                <div>
                  <small>Miembros</small>
                  <strong>{accountCount}</strong>
                  <span>cuentas registradas</span>
                </div>
              </article>
              <article>
                <span className="admin-stat-icon green">
                  <AdminIcon type="heart" />
                </span>
                <div>
                  <small>Interacciones</small>
                  <strong>{totalReactions}</strong>
                  <span>reacciones totales</span>
                </div>
              </article>
            </section>

            <div className="admin-grid">
              <section className="admin-panel admin-review-panel" id="moderacion">
                <div className="admin-panel-heading">
                  <div>
                    <span className="chapter">Cola de trabajo</span>
                    <h2>Moderación</h2>
                    <p>Contenido que necesita una decisión antes de publicarse.</p>
                  </div>
                  <span className="admin-count">{postReviewRequests.length}</span>
                </div>
                {postReviewRequests.length ? (
                  <div className="admin-review-list">
                    {postReviewRequests.map((request) => (
                      <article key={request.id} className="admin-review-item">
                        <div className="admin-review-meta">
                          <div className="admin-review-avatar">
                            <Paw />
                          </div>
                          <div>
                            <strong>{request.author}</strong>
                            <small>
                              Enviado el{' '}
                              {new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(
                                new Date(request.requestedAt)
                              )}
                            </small>
                          </div>
                          <span>Pendiente</span>
                        </div>
                        <p>
                          {request.body ||
                            'Publicaci\xF3n con contenido visual pendiente de revisi\xF3n.'}
                        </p>
                        <div className="admin-review-actions">
                          <button
                            type="button"
                            className="admin-approve"
                            onClick={() => approvePostReview(request.id)}
                          >
                            Aprobar publicación
                          </button>
                          <button type="button" onClick={() => rejectPostReview(request.id)}>
                            Descartar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="admin-empty">
                    <span>
                      <AdminIcon type="review" />
                    </span>
                    <strong>La cola está al día</strong>
                    <p>
                      No hay solicitudes pendientes. Aquí aparecerá el contenido que necesite
                      revisión.
                    </p>
                  </div>
                )}
              </section>

              <aside className="admin-panel admin-activity" id="comunidad">
                <div className="admin-panel-heading">
                  <div>
                    <span className="chapter">Actividad reciente</span>
                    <h2>Comunidad</h2>
                    <p>Últimas publicaciones en GuauBook.</p>
                  </div>
                </div>
                {posts.length ? (
                  <div className="admin-post-list">
                    {posts.slice(0, 5).map((post) => (
                      <article key={post.id}>
                        <span className="post-avatar">
                          <Paw />
                        </span>
                        <div>
                          <strong>{post.author}</strong>
                          <small>{post.createdAt}</small>
                          <p>{post.body || 'Publicaci\xF3n con imagen'}</p>
                        </div>
                        {deletingPostId === post.id ? (
                          <div className="admin-delete-confirm">
                            <span>¿Eliminar?</span>
                            <button
                              type="button"
                              onClick={() => {
                                adminDeletePost(post.id)
                                setDeletingPostId(null)
                              }}
                            >
                              Sí
                            </button>
                            <button type="button" onClick={() => setDeletingPostId(null)}>
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingPostId(post.id)}
                            aria-label={`Eliminar publicaci\xF3n de ${post.author}`}
                          >
                            Eliminar
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="admin-empty compact">
                    <Paw />
                    <strong>Aún no hay publicaciones</strong>
                    <p>La actividad de GuauBook aparecerá aquí.</p>
                  </div>
                )}
                <Link className="admin-view-all" href="/guaubook">
                  Gestionar toda la comunidad <span>→</span>
                </Link>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
