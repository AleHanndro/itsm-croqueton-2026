'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Paw } from '@/assets/icons/paw'
import { EmptyStateCard } from '@/components/empty-state-card'
import { PostCard } from '@/components/post-card'
import { ProfileConnectionsDialog } from '@/components/profile-connections-dialog'
import { ProfileStats, ProfileSummaryCard, type ProfileStatId } from '@/components/profile-summary'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { findProfileByUsername, followersOf, followingOf, getPostsByAuthor } from '@/lib/community'
import { useCommunity, type CommunityUser } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export function PublicProfilePage({ username }: { username: string }) {
  const { language } = useLanguage()
  const { isHydrated, user, profiles, posts, follows, petFurColor, toggleFollow } = useCommunity()
  const router = useRouter()
  const isEnglish = language === 'en'
  const [activeStat, setActiveStat] = useState<ProfileStatId>('posts')
  const [isFollowersOpen, setIsFollowersOpen] = useState(false)
  const [isFollowingOpen, setIsFollowingOpen] = useState(false)

  const profile = findProfileByUsername(profiles, username)
  const isSelf = !!user && !!profile && user.email === profile.email
  const authorPosts = profile ? getPostsByAuthor(posts, profiles, profile.email) : []
  const followerEmails = profile ? followersOf(follows, profile.email) : []
  const followingEmails = profile ? followingOf(follows, profile.email) : []
  const followerProfiles = followerEmails
    .map((email) => profiles[email])
    .filter((item): item is CommunityUser => Boolean(item) && item.isActive !== false)
  const followingProfiles = followingEmails
    .map((email) => profiles[email])
    .filter((item): item is CommunityUser => Boolean(item) && item.isActive !== false)
  const isFollowingTarget =
    !!user && !!profile && followingOf(follows, user.email).includes(profile.email)
  const loginRedirect = profile
    ? `/iniciar-sesion?redirect=${encodeURIComponent(`/usuarios/${profile.username}`)}`
    : '/iniciar-sesion'

  useEffect(() => {
    if (isHydrated && isSelf) router.replace('/mi-perfil')
  }, [isHydrated, isSelf, router])

  if (!isHydrated) {
    return (
      <Container
        as="section"
        className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center"
      >
        <Eyebrow>{isEnglish ? 'Loading profile' : 'Cargando perfil'}</Eyebrow>
        <p className="m-0 font-extrabold opacity-65">
          {isEnglish ? 'Finding this member of the pack…' : 'Buscando a este miembro de la manada…'}
        </p>
      </Container>
    )
  }

  if (!profile) {
    return (
      <Container
        as="section"
        className="grid min-h-[60vh] content-center justify-items-center gap-4 text-center"
      >
        <Eyebrow variant="section" tone="accent">
          {isEnglish ? 'Profile not found' : 'Perfil no encontrado'}
        </Eyebrow>
        <h1 className="m-0 font-heading text-[clamp(42px,7vw,76px)] leading-[0.9]">
          {isEnglish ? 'This user does not exist.' : 'Este usuario no existe.'}
        </h1>
        <p className="m-0 max-w-130 font-extrabold opacity-65">
          {isEnglish
            ? 'The profile you are looking for may have changed its username or no longer belongs to the pack.'
            : 'El perfil que buscas puede haber cambiado su nombre de usuario o ya no pertenecer a la manada.'}
        </p>
        <Button size="sm" render={<Link href="/guaubook" />}>
          {isEnglish ? 'Back to GuauBook' : 'Volver a GuauBook'}
        </Button>
      </Container>
    )
  }

  if (isSelf) {
    return (
      <Container
        as="section"
        className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center"
      >
        <Eyebrow>{isEnglish ? 'Opening your profile' : 'Abriendo tu perfil'}</Eyebrow>
        <p className="m-0 font-extrabold opacity-65">
          {isEnglish ? 'Taking you to your private profile…' : 'Te llevamos a tu perfil privado…'}
        </p>
      </Container>
    )
  }

  return (
    <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
      <div className="mb-5">
        <Eyebrow variant="section" tone="accent">
          {isEnglish ? 'Public profile' : 'Perfil público'}
        </Eyebrow>
        <h1 className="mt-2 mb-0 text-[clamp(42px,6vw,72px)] leading-[0.88]">{profile.name}</h1>
      </div>

      <ProfileSummaryCard
        profile={profile}
        petFurColor={petFurColor}
        isEnglish={isEnglish}
        isOwner={false}
        actions={
          user ? (
            <Button
              type="button"
              size="sm"
              className="w-full"
              variant={isFollowingTarget ? 'link-border' : 'primary'}
              onClick={() => toggleFollow(profile.email)}
              aria-pressed={isFollowingTarget}
            >
              {isFollowingTarget
                ? isEnglish
                  ? 'Unfollow'
                  : 'Dejar de seguir'
                : isEnglish
                  ? 'Follow'
                  : 'Seguir'}
            </Button>
          ) : (
            <Button size="sm" className="w-full" render={<Link href={loginRedirect} />}>
              {isEnglish ? 'Sign in to follow' : 'Inicia sesión para seguir'}
            </Button>
          )
        }
      />

      <ProfileStats
        posts={authorPosts.length}
        followers={followerEmails.length}
        following={followingEmails.length}
        activeStat={activeStat}
        isEnglish={isEnglish}
        onPosts={() => {
          setActiveStat('posts')
          document
            .getElementById('public-posts')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        onFollowers={() => {
          setActiveStat('followers')
          setIsFollowersOpen(true)
        }}
        onFollowing={() => {
          setActiveStat('following')
          setIsFollowingOpen(true)
        }}
      />

      <section id="public-posts" className="mt-6 grid scroll-mt-24 gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Eyebrow variant="section" tone="accent">
              {isEnglish ? 'Activity' : 'Actividad'}
            </Eyebrow>
            <h2 className="mt-1.5 mb-0 font-heading text-[clamp(28px,4vw,40px)] leading-[0.95]">
              {isEnglish ? 'Posts' : 'Publicaciones'}
            </h2>
            <p className="mt-1.5 mb-0 text-small font-extrabold opacity-65">
              {isEnglish
                ? `Only posts shared by @${profile.username} appear here.`
                : `Aquí solo aparecen las publicaciones de @${profile.username}.`}
            </p>
          </div>
          <span className="rounded-pill border-2 border-ink bg-brand px-3 py-1 font-heading text-[20px] font-black">
            {authorPosts.length}
          </span>
        </div>

        {authorPosts.length ? (
          <div className="grid gap-4 tablet:grid-cols-2 phone:grid-cols-1">
            {authorPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyStateCard
            title={isEnglish ? 'No posts yet.' : 'Todavía no hay publicaciones.'}
            description={
              isEnglish
                ? `@${profile.username} has not shared anything with the pack yet.`
                : `@${profile.username} aún no ha compartido nada con la manada.`
            }
          />
        )}

        <span className="inline-flex items-center gap-1.5 text-small font-extrabold opacity-60">
          <Paw className="w-4" />
          {isEnglish ? 'Croquetón community' : 'Comunidad Croquetón'}
        </span>
      </section>

      <ProfileConnectionsDialog
        open={isFollowersOpen}
        onOpenChange={setIsFollowersOpen}
        title={isEnglish ? `Followers · @${profile.username}` : `Seguidores · @${profile.username}`}
        connectionProfiles={followerProfiles}
        emptyText={
          isEnglish
            ? 'This member does not have followers yet.'
            : 'Este usuario aún no tiene seguidores.'
        }
      />

      <ProfileConnectionsDialog
        open={isFollowingOpen}
        onOpenChange={setIsFollowingOpen}
        title={isEnglish ? `Following · @${profile.username}` : `Siguiendo · @${profile.username}`}
        connectionProfiles={followingProfiles}
        emptyText={
          isEnglish
            ? 'This member is not following anyone yet.'
            : 'Este usuario todavía no sigue a nadie.'
        }
      />
    </Container>
  )
}
