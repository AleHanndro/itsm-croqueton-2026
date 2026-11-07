'use client'

import { cn } from 'cn'
import type { ReactNode } from 'react'

import { Eyebrow } from '@/components/ui/eyebrow'
import { PetVisual, UserAvatar } from '@/components/user-visuals'
import type { CommunityUser } from '@/providers/community-provider'

export type ProfileStatId = 'posts' | 'followers' | 'following'

export function ProfileStat({
  label,
  value,
  onClick,
  active
}: {
  label: string
  value: number
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'rounded-2xl border-3 border-ink bg-brand px-3 py-2.5 text-center shadow-[3px_3px_0_var(--ink-faint)]'
          : 'rounded-2xl border-3 border-ink bg-card px-3 py-2.5 text-center transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--ink-faint)]'
      }
    >
      <strong className="block font-heading text-[clamp(24px,4vw,34px)] leading-none">
        {value}
      </strong>
      <span className="mt-1 block text-caption font-extrabold opacity-65 phone:text-micro">
        {label}
      </span>
    </button>
  )
}

export function ProfileStats({
  posts,
  followers,
  following,
  activeStat,
  isEnglish,
  onPosts,
  onFollowers,
  onFollowing
}: {
  posts: number
  followers: number
  following: number
  activeStat?: ProfileStatId
  isEnglish: boolean
  onPosts: () => void
  onFollowers: () => void
  onFollowing: () => void
}) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-3 phone:gap-2">
      <ProfileStat
        value={posts}
        label={isEnglish ? 'Posts' : 'Publicaciones'}
        active={activeStat === 'posts'}
        onClick={onPosts}
      />
      <ProfileStat
        value={followers}
        label={isEnglish ? 'Followers' : 'Seguidores'}
        active={activeStat === 'followers'}
        onClick={onFollowers}
      />
      <ProfileStat
        value={following}
        label={isEnglish ? 'Following' : 'Siguiendo'}
        active={activeStat === 'following'}
        onClick={onFollowing}
      />
    </div>
  )
}

export function ProfileSummaryCard({
  profile,
  petFurColor,
  isEnglish,
  isOwner,
  actions,
  className
}: {
  profile: CommunityUser
  petFurColor: string
  isEnglish: boolean
  isOwner: boolean
  actions?: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'grid grid-cols-[132px_minmax(0,1fr)] items-center gap-6 rounded-3xl border-4 border-ink bg-surface-warm p-5.5 shadow-card tablet:grid-cols-[120px_minmax(0,1fr)] phone:grid-cols-[1fr] phone:justify-items-center phone:gap-4 phone:p-4.5 phone:text-center',
        actions && 'grid-cols-[132px_minmax(0,1fr)_auto]',
        className
      )}
    >
      <UserAvatar
        user={profile}
        className="size-32 flex-none shadow-[4px_4px_0_var(--ink-faint)] tablet:size-28 phone:size-26"
      />
      <div className="min-w-0">
        <Eyebrow>
          {isOwner
            ? isEnglish
              ? 'Account'
              : 'Cuenta'
            : isEnglish
              ? 'Community member'
              : 'Miembro de la manada'}
        </Eyebrow>
        <h2 className="m-0 mt-1.5 text-[clamp(38px,5vw,58px)] leading-[0.9] break-words phone:text-[clamp(34px,11vw,44px)]">
          {profile.name}
        </h2>
        <p className="mt-1 mb-1 text-small font-black opacity-65">@{profile.username}</p>
        {isOwner && (
          <p className="m-0 text-small font-extrabold break-all opacity-65">{profile.email}</p>
        )}
        <div className="mt-3 inline-flex max-w-full items-center gap-2.5 rounded-pill border-2 border-ink bg-card px-3 py-1.5 text-left phone:max-w-full">
          <span className="size-10 flex-none overflow-hidden rounded-circle border-2 border-ink bg-brand">
            <PetVisual user={profile} furColor={petFurColor} className="size-full object-cover" />
          </span>
          <span className="min-w-0">
            <span className="block text-micro font-black tracking-label uppercase opacity-60">
              {isOwner ? (isEnglish ? 'My pet' : 'Mi mascota') : isEnglish ? 'Pet' : 'Mascota'}
            </span>
            <strong className="block truncate text-small leading-tight">{profile.petName}</strong>
            {profile.petBio && (
              <span className="block max-w-70 truncate text-micro font-extrabold opacity-60 phone:max-w-full">
                {profile.petBio}
              </span>
            )}
          </span>
        </div>
      </div>
      {actions && (
        <div className="grid justify-items-end gap-2.5 tablet:col-span-full tablet:grid-cols-2 tablet:justify-items-stretch phone:col-auto phone:w-full phone:grid-cols-1">
          {actions}
        </div>
      )}
    </section>
  )
}
