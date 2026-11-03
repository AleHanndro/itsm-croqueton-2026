'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Paw } from '@/assets/icons/paw'
import { AdminPanelCard, AdminStatCard } from '@/components/admin-dashboard'
import { AdminLayout } from '@/components/admin-layout'
import AdminIcon from '@/components/admin-icon'
import { Eyebrow } from '@/components/ui/eyebrow'
import { useCommunity } from '@/providers/community-provider'

export default function AdminPage() {
  const {
    posts,
    postReviewRequests,
    accountCount,
    approvePostReview,
    rejectPostReview,
    adminDeletePost
  } = useCommunity()
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  const totalReactions = posts.reduce(
    (total, post) => total + post.likedBy.length + post.comments.length,
    0
  )

  return (
    <AdminLayout>
          <section
            className="mx-auto max-w-345 px-[clamp(24px,4vw,56px)] pt-11.5 pb-22.5 phone:px-3.5 phone:pt-8.75 phone:pb-18.75"
            id="resumen"
          >
            <div className="mb-7.5 flex items-end justify-between gap-8.75 tablet:flex-col tablet:items-start">
              <div>
                <Eyebrow>Resumen general</Eyebrow>
                <h1 className="mt-1.5 mb-2 text-[clamp(48px,5vw,68px)] leading-[0.9] phone:text-[48px]">
                  Buenos días, admin.
                </h1>
                <p className="m-0 max-w-162.5 text-body-sm font-extrabold text-fg-admin-welcome">
                  Revisa la actividad de la comunidad y atiende lo importante desde un solo lugar.
                </p>
              </div>
              <div className="flex min-w-61.25 items-center gap-2.75 rounded-control border border-stroke-card-admin bg-surface-panel px-4 py-3.25 text-foreground tablet:w-full">
                <span className="size-2.5 flex-none rounded-circle bg-[#38a879] shadow-[0_0_0_4px_#dff3e9]" />
                <div>
                  <strong className="block text-[12px]">Cuenta protegida</strong>
                  <small className="mt-px block text-tiny font-bold text-muted-foreground">
                    Sesión activa como administrador
                  </small>
                </div>
              </div>
            </div>

            {postReviewRequests.length > 0 && (
              <a
                className="mb-5 grid grid-cols-[46px_1fr_auto] items-center gap-3.5 rounded-2xl border border-stroke-admin-priority bg-surface-admin-priority px-4.5 py-3.75 [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-2px)] hover:shadow-[0_6px_18px_rgba(32,36,54,0.08)] phone:grid-cols-[42px_1fr]"
                href="#moderacion"
              >
                <span className="grid size-10.5 place-items-center rounded-xl bg-brand [&_svg]:w-5.75">
                  <AdminIcon type="review" />
                </span>
                <div>
                  <strong className="block text-small">
                    Tienes {postReviewRequests.length}{' '}
                    {postReviewRequests.length === 1
                      ? 'solicitud pendiente'
                      : 'solicitudes pendientes'}
                  </strong>
                  <small className="mt-0.5 block text-caption font-bold text-fg-admin-priority-meta">
                    Revísalas para mantener GuauBook actualizado y seguro.
                  </small>
                </div>
                <span className="text-caption font-black phone:col-2">Revisar ahora →</span>
              </a>
            )}

            <section
              className="mb-5.5 grid grid-cols-4 gap-3.5 tablet:grid-cols-[1fr_1fr] phone:grid-cols-[1fr]"
              aria-label="Resumen de la comunidad"
            >
              <AdminStatCard
                icon="posts"
                label="Publicaciones"
                value={posts.length}
                meta="contenido publicado"
              />
              <AdminStatCard
                icon="review"
                label="Por revisar"
                value={postReviewRequests.length}
                meta={postReviewRequests.length ? 'requieren atenci\xF3n' : 'todo al d\xEDa'}
              />
              <AdminStatCard
                icon="users"
                label="Miembros"
                value={accountCount}
                meta="cuentas registradas"
              />
              <AdminStatCard
                icon="heart"
                label="Interacciones"
                value={totalReactions}
                meta="reacciones totales"
              />
            </section>

            <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(330px,0.9fr)] items-start gap-4.5 tablet:grid-cols-[1fr]">
              <AdminPanelCard
                as="section"
                id="moderacion"
                eyebrow="Cola de trabajo"
                title="Moderación"
                description="Contenido que necesita una decisión antes de publicarse."
                badge={postReviewRequests.length}
              >
                {postReviewRequests.length ? (
                  <div className="grid">
                    {postReviewRequests.map((request) => (
                      <article
                        key={request.id}
                        className="border-b border-stroke-divider px-5.75 py-5.25 last:border-0 phone:p-4.5"
                      >
                        <div className="grid grid-cols-[42px_1fr_auto] items-center gap-2.75 phone:grid-cols-[38px_1fr]">
                          <div className="grid size-10.5 place-items-center rounded-xl bg-surface-note text-ink phone:size-9.5 [&_svg]:w-5.75">
                            <Paw />
                          </div>
                          <div>
                            <strong className="block font-heading text-[16px]">
                              {request.author}
                            </strong>
                            <small className="block text-micro font-extrabold text-[#7b7f8d]">
                              Enviado el{' '}
                              {new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(
                                new Date(request.requestedAt)
                              )}
                            </small>
                          </div>
                          <span className="rounded-pill bg-surface-note px-2 py-1.25 text-[8px] font-black tracking-label-wide text-[#765700] uppercase phone:col-2 phone:w-max">
                            Pendiente
                          </span>
                        </div>
                        <p className="mt-3.5 mb-3.5 rounded-chip bg-surface-admin-review-note px-3.75 py-3.25 text-[12px] leading-normal font-bold text-fg-admin-review-note">
                          {request.body ||
                            'Publicaci\xF3n con contenido visual pendiente de revisi\xF3n.'}
                        </p>
                        <div className="flex gap-2 phone:flex-col">
                          <button
                            type="button"
                            className="min-h-8.75 rounded-[9px] border border-stroke bg-surface-inverse px-3 text-tiny font-black text-fg-admin-approve"
                            onClick={() => approvePostReview(request.id)}
                          >
                            Aprobar publicación
                          </button>
                          <button
                            type="button"
                            className="min-h-8.75 rounded-[9px] border border-stroke-admin-action bg-surface-panel px-3 text-tiny font-black text-foreground"
                            onClick={() => rejectPostReview(request.id)}
                          >
                            Descartar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="grid min-h-78.75 place-items-center content-center gap-1.75 p-7.5 text-center">
                    <span className="grid size-14.5 place-items-center rounded-[17px] bg-surface-note text-[#9a7000] [&_svg]:size-7.75">
                      <AdminIcon type="review" />
                    </span>
                    <strong className="mt-1.25 font-heading text-lead">La cola está al día</strong>
                    <p className="m-0 max-w-75 text-caption font-bold text-muted-foreground">
                      No hay solicitudes pendientes. Aquí aparecerá el contenido que necesite
                      revisión.
                    </p>
                  </div>
                )}
              </AdminPanelCard>

              <AdminPanelCard
                as="aside"
                id="comunidad"
                eyebrow="Actividad reciente"
                title="Comunidad"
                description="Últimas publicaciones en GuauBook."
                footer={
                  <Link
                    className="flex min-h-12.5 items-center justify-between border-t border-stroke-divider px-5 text-tiny font-black text-fg-admin-view-all"
                    href="/admin/guaubook"
                  >
                    Gestionar toda la comunidad <span className="text-[18px]">→</span>
                  </Link>
                }
              >
                {posts.length ? (
                  <div className="grid">
                    {posts.slice(0, 5).map((post) => (
                      <article
                        key={post.id}
                        className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-start gap-2.5 border-b border-stroke-divider px-4.5 py-3.75 phone:grid-cols-[38px_minmax(0,1fr)] phone:px-4.25"
                      >
                        <span className="grid size-9.5 place-items-center rounded-circle bg-brand [&_svg]:w-5.25">
                          <Paw />
                        </span>
                        <div>
                          <strong className="block font-heading text-[14px]">{post.author}</strong>
                          <small className="block text-[8px] font-extrabold text-[#7b7f8d]">
                            {post.createdAt}
                          </small>
                          <p className="mt-0.75 overflow-hidden text-tiny font-bold text-ellipsis whitespace-nowrap text-fg-admin-post-excerpt">
                            {post.body || 'Publicaci\xF3n con imagen'}
                          </p>
                        </div>
                        {deletingPostId === post.id ? (
                          <div className="grid grid-cols-[auto_auto] justify-items-end gap-1 phone:col-2 phone:justify-self-start">
                            <span className="col-span-full text-micro font-black text-danger">
                              ¿Eliminar?
                            </span>
                            <button
                              type="button"
                              className="rounded-md border border-stroke-admin-danger-action bg-danger px-1.5 py-0.75 text-micro font-black text-fg-admin-danger-action"
                              onClick={() => {
                                adminDeletePost(post.id)
                                setDeletingPostId(null)
                              }}
                            >
                              Sí
                            </button>
                            <button
                              type="button"
                              className="rounded-md border border-stroke-admin-action-alt bg-surface-panel px-1.5 py-0.75 text-micro font-black text-foreground"
                              onClick={() => setDeletingPostId(null)}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="border-0 bg-transparent px-1.25 py-1 text-micro font-black text-danger underline phone:col-2 phone:justify-self-start"
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
                  <div className="grid min-h-62.5 place-items-center content-center gap-1.75 p-7.5 text-center">
                    <Paw className="size-7.75 text-[#d2c9b3]" />
                    <strong className="mt-1.25 font-heading text-lead">
                      Aún no hay publicaciones
                    </strong>
                    <p className="m-0 max-w-75 text-caption font-bold text-muted-foreground">
                      La actividad de GuauBook aparecerá aquí.
                    </p>
                  </div>
                )}
              </AdminPanelCard>
            </div>
      </section>
    </AdminLayout>
  )
}
