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
      <main className="min-h-screen bg-surface-page-mint text-foreground">
        <CommunityNavigation />
        <section className="relative z-2 mx-auto grid min-h-[calc(100vh-82px)] w-[min(1240px,calc(100%-96px))] content-center justify-items-center gap-3 text-center tablet:w-[min(100%-36px,680px)] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <Paw className="w-18 text-accent" />
          <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
            Acceso restringido
          </span>
          <h1 className="m-0 text-[62px] phone:text-[47px]">Panel de administración</h1>
          <p className="max-w-125 font-extrabold">
            Inicia sesión con la cuenta administradora para gestionar la comunidad.
          </p>
          <Link
            className="relative inline-flex min-h-14 items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink pr-4.5 pl-6.75 font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none!"
            href="/iniciar-sesion"
          >
            Ir al acceso
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-admin-page text-foreground">
      <LanguageToggle />
      <ThemeToggle />
      <div className="grid min-h-screen grid-cols-[250px_minmax(0,1fr)] tablet:grid-cols-[1fr]">
        <aside className="sticky top-0 z-20 flex h-screen flex-col bg-surface-admin-sidebar px-5 pt-6.75 pb-5.5 text-card tablet:relative tablet:grid tablet:h-auto tablet:grid-cols-[auto_1fr_auto] tablet:items-center tablet:gap-5 tablet:px-5 tablet:py-4 phone:grid-cols-[1fr_auto] phone:gap-2.5 phone:p-3.5">
          <Link
            href="/"
            className="inline-flex w-max items-center gap-2.5 px-2 font-heading text-[25px] font-extrabold tracking-heading phone:text-sub"
            aria-label="Croquetón"
          >
            <span className="grid size-10.75 place-items-center rounded-circle bg-brand text-ink [&_svg]:size-6.25">
              <Paw />
            </span>
            <span>Croquetón</span>
          </Link>
          <div className="mx-2 mt-4 mb-7.5 w-max rounded-pill border border-[#5c6272] px-2.5 py-1.25 text-micro font-black tracking-[0.14em] text-brand uppercase tablet:hidden">
            Administrador
          </div>
          <nav
            className="grid gap-1.75 tablet:flex tablet:justify-center tablet:overflow-x-auto phone:order-3 phone:col-span-full phone:row-2 phone:justify-start"
            aria-label="Navegación del panel"
          >
            <a
              className="grid min-h-11.5 grid-cols-[24px_1fr_auto] items-center gap-2.75 rounded-xl bg-brand px-3.25 text-small font-black text-ink [transition:background_0.2s_ease,color_0.2s_ease,transform_0.2s_ease] hover:transform-[translateX(2px)] tablet:min-w-max tablet:grid-cols-[21px_auto_auto] phone:min-h-10 phone:px-2.5 phone:text-caption [&_svg]:size-5.25"
              href="#resumen"
            >
              <AdminIcon type="heart" />
              <span>Resumen</span>
            </a>
            <a
              className="grid min-h-11.5 grid-cols-[24px_1fr_auto] items-center gap-2.75 rounded-xl px-3.25 text-small font-black text-[#bfc3cd] [transition:background_0.2s_ease,color_0.2s_ease,transform_0.2s_ease] hover:transform-[translateX(2px)] hover:bg-[#2d3245] hover:text-card tablet:min-w-max tablet:grid-cols-[21px_auto_auto] phone:min-h-10 phone:px-2.5 phone:text-caption [&_svg]:size-5.25"
              href="#moderacion"
            >
              <AdminIcon type="review" />
              <span>Moderación</span>
              {postReviewRequests.length > 0 && (
                <strong className="grid size-5.75 min-w-5.75 place-items-center rounded-circle bg-accent text-tiny text-white">
                  {postReviewRequests.length}
                </strong>
              )}
            </a>
            <a
              className="grid min-h-11.5 grid-cols-[24px_1fr_auto] items-center gap-2.75 rounded-xl px-3.25 text-small font-black text-[#bfc3cd] [transition:background_0.2s_ease,color_0.2s_ease,transform_0.2s_ease] hover:transform-[translateX(2px)] hover:bg-[#2d3245] hover:text-card tablet:min-w-max tablet:grid-cols-[21px_auto_auto] phone:min-h-10 phone:px-2.5 phone:text-caption [&_svg]:size-5.25"
              href="#comunidad"
            >
              <AdminIcon type="posts" />
              <span>Comunidad</span>
            </a>
            <Link
              href="/guaubook"
              className="grid min-h-11.5 grid-cols-[24px_1fr_auto] items-center gap-2.75 rounded-xl px-3.25 text-small font-black text-[#bfc3cd] [transition:background_0.2s_ease,color_0.2s_ease,transform_0.2s_ease] hover:transform-[translateX(2px)] hover:bg-[#2d3245] hover:text-card tablet:min-w-max tablet:grid-cols-[21px_auto_auto] phone:hidden phone:min-h-10 phone:px-2.5 phone:text-caption [&_svg]:size-5.25"
            >
              <AdminIcon type="users" />
              <span>Ver GuauBook</span>
            </Link>
          </nav>
          <div className="mt-auto grid grid-cols-[39px_minmax(0,1fr)] items-center gap-2.5 border-t border-[#3c4152] px-2 py-4 tablet:hidden">
            <span className="grid size-9.75 place-items-center rounded-xl bg-brand font-heading font-black text-ink">
              A
            </span>
            <div>
              <strong className="block overflow-hidden text-[12px] text-ellipsis whitespace-nowrap">
                Admin Croquetón
              </strong>
              <small className="mt-0.5 block overflow-hidden text-micro font-bold text-ellipsis whitespace-nowrap text-[#959aa8]">
                {user.email}
              </small>
            </div>
          </div>
          <button
            className="border-0 bg-transparent px-2 py-2.5 text-left text-caption font-black text-[#f19a89] underline underline-offset-4 tablet:text-right phone:col-2 phone:row-1 phone:text-tiny"
            type="button"
            onClick={() => {
              signOut()
              navigate('/')
            }}
          >
            Cerrar sesión
          </button>
        </aside>

        <div className="min-w-0">
          <header className="flex min-h-18 items-center justify-between gap-5 border-b border-stroke-admin-topbar bg-surface-admin-topbar px-[clamp(24px,4vw,56px)] backdrop-blur-md tablet:px-6 phone:min-h-15.5 phone:px-3.5">
            <div className="flex items-baseline gap-3 phone:grid phone:gap-0">
              <span className="font-heading text-body font-black phone:text-body-sm">
                Panel de administración
              </span>
              <small className="text-caption font-extrabold text-[#7a7e89] capitalize">
                {today}
              </small>
            </div>
            <Link
              href="/guaubook"
              className="flex items-center gap-2 rounded-chip border border-stroke-admin-topbar-link bg-surface-panel px-3.25 py-2.25 text-caption font-black phone:p-2 phone:text-[0px]"
            >
              Abrir sitio público <span className="text-body-sm phone:text-[16px]">↗</span>
            </Link>
          </header>

          <section
            className="mx-auto max-w-345 px-[clamp(24px,4vw,56px)] pt-11.5 pb-22.5 phone:px-3.5 phone:pt-8.75 phone:pb-18.75"
            id="resumen"
          >
            <div className="mb-7.5 flex items-end justify-between gap-8.75 tablet:flex-col tablet:items-start">
              <div>
                <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
                  Resumen general
                </span>
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
              <article className="flex min-w-0 items-center gap-3.5 rounded-2xl border border-stroke-card-admin bg-surface-panel p-4.5 text-foreground [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-2px)] hover:shadow-[0_7px_20px_rgba(32,36,54,0.07)] phone:p-4">
                <span className="grid size-11 flex-none place-items-center rounded-xl bg-[#ffe2da] text-accent-deep [&_svg]:size-5.75">
                  <AdminIcon type="posts" />
                </span>
                <div className="grid min-w-0">
                  <small className="text-micro font-black tracking-label-wide text-muted-foreground uppercase">
                    Publicaciones
                  </small>
                  <strong className="mt-0.5 -mb-px font-heading text-[30px] leading-none">
                    {posts.length}
                  </strong>
                  <span className="overflow-hidden text-tiny font-bold text-ellipsis whitespace-nowrap text-muted-foreground">
                    contenido publicado
                  </span>
                </div>
              </article>
              <article className="flex min-w-0 items-center gap-3.5 rounded-2xl border border-stroke-card-admin bg-surface-panel p-4.5 text-foreground [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-2px)] hover:shadow-[0_7px_20px_rgba(32,36,54,0.07)] phone:p-4">
                <span className="grid size-11 flex-none place-items-center rounded-xl bg-surface-note text-[#8b6500] [&_svg]:size-5.75">
                  <AdminIcon type="review" />
                </span>
                <div className="grid min-w-0">
                  <small className="text-micro font-black tracking-label-wide text-muted-foreground uppercase">
                    Por revisar
                  </small>
                  <strong className="mt-0.5 -mb-px font-heading text-[30px] leading-none">
                    {postReviewRequests.length}
                  </strong>
                  <span className="overflow-hidden text-tiny font-bold text-ellipsis whitespace-nowrap text-muted-foreground">
                    {postReviewRequests.length ? 'requieren atenci\xF3n' : 'todo al d\xEDa'}
                  </span>
                </div>
              </article>
              <article className="flex min-w-0 items-center gap-3.5 rounded-2xl border border-stroke-card-admin bg-surface-panel p-4.5 text-foreground [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-2px)] hover:shadow-[0_7px_20px_rgba(32,36,54,0.07)] phone:p-4">
                <span className="grid size-11 flex-none place-items-center rounded-xl bg-[#d9efef] text-[#287b7b] [&_svg]:size-5.75">
                  <AdminIcon type="users" />
                </span>
                <div className="grid min-w-0">
                  <small className="text-micro font-black tracking-label-wide text-muted-foreground uppercase">
                    Miembros
                  </small>
                  <strong className="mt-0.5 -mb-px font-heading text-[30px] leading-none">
                    {accountCount}
                  </strong>
                  <span className="overflow-hidden text-tiny font-bold text-ellipsis whitespace-nowrap text-muted-foreground">
                    cuentas registradas
                  </span>
                </div>
              </article>
              <article className="flex min-w-0 items-center gap-3.5 rounded-2xl border border-stroke-card-admin bg-surface-panel p-4.5 text-foreground [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-2px)] hover:shadow-[0_7px_20px_rgba(32,36,54,0.07)] phone:p-4">
                <span className="grid size-11 flex-none place-items-center rounded-xl bg-[#dff3e9] text-[#237d59] [&_svg]:size-5.75">
                  <AdminIcon type="heart" />
                </span>
                <div className="grid min-w-0">
                  <small className="text-micro font-black tracking-label-wide text-muted-foreground uppercase">
                    Interacciones
                  </small>
                  <strong className="mt-0.5 -mb-px font-heading text-[30px] leading-none">
                    {totalReactions}
                  </strong>
                  <span className="overflow-hidden text-tiny font-bold text-ellipsis whitespace-nowrap text-muted-foreground">
                    reacciones totales
                  </span>
                </div>
              </article>
            </section>

            <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(330px,0.9fr)] items-start gap-4.5 tablet:grid-cols-[1fr]">
              <section
                className="scroll-mt-5 overflow-hidden rounded-card-sm border border-stroke-card-admin bg-surface-panel text-foreground"
                id="moderacion"
              >
                <div className="flex min-h-26 items-center justify-between gap-5 border-b border-stroke-divider px-5.75 py-5.25 phone:p-4.5">
                  <div>
                    <span className="mb-1 inline-flex items-center text-micro leading-tight font-black tracking-[0.16em] text-accent uppercase">
                      Cola de trabajo
                    </span>
                    <h2 className="m-0 text-[27px] tracking-[-0.03em] phone:text-[24px]">
                      Moderación
                    </h2>
                    <p className="mt-0.5 text-tiny font-bold text-[#777b87]">
                      Contenido que necesita una decisión antes de publicarse.
                    </p>
                  </div>
                  <span className="grid h-9 min-w-9 place-items-center rounded-[11px] bg-brand font-heading text-[16px] font-black">
                    {postReviewRequests.length}
                  </span>
                </div>
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
              </section>

              <aside
                className="scroll-mt-5 overflow-hidden rounded-card-sm border border-stroke-card-admin bg-surface-panel text-foreground"
                id="comunidad"
              >
                <div className="flex min-h-26 items-center justify-between gap-5 border-b border-stroke-divider px-5.75 py-5.25 phone:p-4.5">
                  <div>
                    <span className="mb-1 inline-flex items-center text-micro leading-tight font-black tracking-[0.16em] text-accent uppercase">
                      Actividad reciente
                    </span>
                    <h2 className="m-0 text-[27px] tracking-[-0.03em] phone:text-[24px]">
                      Comunidad
                    </h2>
                    <p className="mt-0.5 text-tiny font-bold text-[#777b87]">
                      Últimas publicaciones en GuauBook.
                    </p>
                  </div>
                </div>
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
                <Link
                  className="flex min-h-12.5 items-center justify-between border-t border-stroke-divider px-5 text-tiny font-black text-fg-admin-view-all"
                  href="/guaubook"
                >
                  Gestionar toda la comunidad <span className="text-[18px]">→</span>
                </Link>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
