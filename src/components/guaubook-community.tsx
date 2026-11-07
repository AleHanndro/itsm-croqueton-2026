'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Paw } from '@/assets/icons/paw'
import { EmptyStateCard } from '@/components/empty-state-card'
import { GuaubookComposer } from '@/components/guaubook-composer'
import { GuaubookProfileButton } from '@/components/guaubook-profile-button'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { getCommunityFeed, getFollowingFeed, OPEN_COMPOSER_EVENT } from '@/lib/community'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

type FeedFilter = 'all' | 'following'

function FeedTabs({
  filter,
  counts,
  isEnglish,
  onChange
}: {
  filter: FeedFilter
  counts: Record<FeedFilter, number>
  isEnglish: boolean
  onChange: (filter: FeedFilter) => void
}) {
  const tabs: { id: FeedFilter; label: string }[] = [
    { id: 'all', label: isEnglish ? 'Community' : 'Comunidad' },
    { id: 'following', label: isEnglish ? 'Following' : 'Seguidos' }
  ]

  return (
    <div
      role="tablist"
      aria-label={isEnglish ? 'GuauBook feed' : 'Muro de GuauBook'}
      className="flex flex-wrap items-center gap-2"
    >
      {tabs.map((tab) => {
        const isActive = filter === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={
              isActive
                ? 'inline-flex items-center gap-2 rounded-pill border-2 border-ink bg-brand px-3.5 py-2 text-small font-black text-ink'
                : 'inline-flex items-center gap-2 rounded-pill border-2 border-ink bg-card px-3.5 py-2 text-small font-black text-ink transition hover:bg-surface-warm'
            }
          >
            {tab.label}
            <span
              className={
                isActive
                  ? 'rounded-pill bg-ink px-1.75 py-0.5 text-micro leading-none text-white'
                  : 'rounded-pill bg-surface-warm px-1.75 py-0.5 text-micro leading-none text-ink'
              }
            >
              {counts[tab.id]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function GuaubookCommunity({ variant = 'page' }: { variant?: 'page' | 'admin' }) {
  const { language } = useLanguage()
  const pathname = usePathname()
  const { user, posts, follows, profiles, petFurColor } = useCommunity()
  const profileHref = pathname.startsWith('/admin')
    ? '/admin/guaubook/perfil'
    : user
      ? '/mi-perfil'
      : '/iniciar-sesion?redirect=%2Fmi-perfil'
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all')

  const isEnglish = language === 'en'
  const isAdminView = variant === 'admin'

  const communityPosts = getCommunityFeed(posts)
  const followingPosts = user ? getFollowingFeed(posts, follows, user.email, profiles) : []
  const visiblePosts = feedFilter === 'following' ? followingPosts : communityPosts
  const counts = {
    all: communityPosts.length,
    following: followingPosts.length
  }

  function openComposer() {
    window.dispatchEvent(new Event(OPEN_COMPOSER_EVENT))
    document.getElementById('crear-publicacion')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  function renderEmptyFeed() {
    if (feedFilter === 'following' && !user) {
      return (
        <div className="grid justify-items-center gap-3 rounded-3xl border-4 border-dashed border-stroke bg-card p-6 text-center">
          <Paw className="size-14 text-secondary" />
          <strong className="font-heading text-[24px]">
            {isEnglish
              ? 'Sign in to see the people you follow.'
              : 'Inicia sesión para ver a quienes sigues.'}
          </strong>
          <p className="m-0 max-w-90 font-extrabold opacity-65">
            {isEnglish
              ? 'Create an account or sign in to build your pack and see their posts here.'
              : 'Crea una cuenta o inicia sesión para formar tu manada y ver sus publicaciones aquí.'}
          </p>
          <Button size="sm" render={<Link href="/iniciar-sesion?redirect=%2Fguaubook" />}>
            {isEnglish ? 'Sign in' : 'Iniciar sesión'}
          </Button>
        </div>
      )
    }

    if (feedFilter === 'following') {
      return (
        <EmptyStateCard
          title={
            isEnglish
              ? 'No posts from the people you follow yet.'
              : 'Aún no hay publicaciones de las personas que sigues.'
          }
          description={
            isEnglish
              ? 'Follow other members from their posts to see their stories here.'
              : 'Sigue a otros miembros desde sus publicaciones para ver sus historias aquí.'
          }
        />
      )
    }

    return (
      <div className="grid justify-items-center gap-3">
        <EmptyStateCard
          title={isEnglish ? 'Do you want to post something?' : '¿Quieres publicar algo?'}
          description={
            isEnglish
              ? 'Share a photo, a story or a moment with the pack.'
              : 'Comparte una foto, una historia o un momento con la manada.'
          }
        />
        {user ? (
          <Button size="sm" type="button" onClick={openComposer}>
            {isEnglish ? 'Create post' : 'Crear publicación'}
          </Button>
        ) : (
          <Button size="sm" render={<Link href="/iniciar-sesion?redirect=%2Fguaubook" />}>
            {isEnglish ? 'Join the pack' : 'Únete a la manada'}
          </Button>
        )}
      </div>
    )
  }

  const tabs = (
    <FeedTabs filter={feedFilter} counts={counts} isEnglish={isEnglish} onChange={setFeedFilter} />
  )

  const feed = (
    <div className="grid gap-5" aria-live="polite">
      {visiblePosts.length
        ? visiblePosts.map((post) => <PostCard key={post.id} post={post} />)
        : renderEmptyFeed()}
    </div>
  )

  const guestCard = (
    <aside className="grid justify-items-start gap-3.25 rounded-3xl border-4 border-ink bg-card p-6.75 text-ink shadow-card phone:p-4.75">
      <Paw className="w-13.5 text-accent" />
      <Eyebrow>{isEnglish ? 'Your profile' : 'Tu perfil'}</Eyebrow>
      <h2 className="m-0 min-[541px]:text-[42px]">
        {isEnglish ? 'Join the conversation.' : 'Únete a la conversación.'}
      </h2>
      <p className="mb-2 leading-normal font-extrabold">
        {isEnglish
          ? "Everyone can read the pack's stories. Create an account or sign in to publish, like and comment."
          : 'Todos pueden leer las historias de la manada. Crea una cuenta o inicia sesión para publicar, dar Me gusta y comentar.'}
      </p>
      <Button render={<Link href="/iniciar-sesion" />}>
        {isEnglish ? 'Join or sign in' : 'Unirme o iniciar sesión'}
      </Button>
    </aside>
  )

  if (isAdminView) {
    return (
      <>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Button type="button" render={<Link href={profileHref} />}>
            {isEnglish ? 'View my profile' : 'Ver mi perfil'}
          </Button>
        </div>
        <div className="mb-6">
          <GuaubookProfileButton user={user} petFurColor={petFurColor} />
        </div>

        <div className="grid grid-cols-[minmax(260px,0.72fr)_minmax(0,1fr)] items-start gap-8 tablet:grid-cols-[1fr] tablet:gap-7 phone:gap-5">
          <div className="relative top-0 grid gap-3.75 phone:gap-3">
            {user ? <GuaubookComposer /> : guestCard}
          </div>
          <div className="grid min-w-0 gap-4">
            {tabs}
            {feed}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="grid gap-5">
      <header className="rounded-3xl border-4 border-ink bg-surface-warm p-6.25 shadow-card phone:p-4.75">
        <Eyebrow variant="section" tone="accent">
          GuauBook
        </Eyebrow>
        <h1 className="mt-2 mb-2 text-[clamp(42px,6vw,72px)] leading-[0.88]">
          {isEnglish ? 'The pack wall' : 'El muro de la manada'}
        </h1>
        <p className="m-0 max-w-160 text-[18px] leading-[1.55] font-extrabold opacity-75">
          {isEnglish
            ? 'See what the community is sharing, follow the members you like and post your own moments.'
            : 'Mira lo que comparte la comunidad, sigue a los miembros que te gusten y publica tus propios momentos.'}
        </p>
      </header>

      <div className="grid grid-cols-[minmax(280px,0.78fr)_minmax(0,1.45fr)] items-start gap-8 tablet:grid-cols-[1fr] tablet:gap-6">
        <aside className="sticky top-31.5 grid gap-3.75 tablet:static phone:gap-3">
          {user ? <GuaubookComposer /> : guestCard}
        </aside>

        <div className="grid min-w-0 gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-4 border-ink bg-card p-2.5 shadow-card">
            {tabs}
            <span className="px-2 text-small font-extrabold opacity-60">
              {visiblePosts.length}{' '}
              {isEnglish
                ? visiblePosts.length === 1
                  ? 'post'
                  : 'posts'
                : visiblePosts.length === 1
                  ? 'publicación'
                  : 'publicaciones'}
            </span>
          </div>
          {feed}
        </div>
      </div>
    </div>
  )
}
