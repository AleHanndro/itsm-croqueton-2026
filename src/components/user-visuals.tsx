'use client'

import { cn } from 'cn'

import { SmallDogMascot } from '@/assets/icons/small-dog-mascot'
import { CareAvatar } from '@/components/illustrations/care-avatar'
import type { CommunityUser } from '@/providers/community-provider'

export function UserAvatar({
  user,
  className,
  imageClassName
}: {
  user: CommunityUser
  className?: string
  imageClassName?: string
}) {
  if (user.avatarImage) {
    return (
      <span
        className={cn(
          'block overflow-hidden rounded-circle border-3 border-ink bg-brand',
          className
        )}
      >
        <img
          src={user.avatarImage}
          alt={user.name}
          className={cn('block size-full object-cover', imageClassName)}
        />
      </span>
    )
  }

  return (
    <span
      className={cn('block overflow-hidden rounded-circle border-3 border-ink bg-brand', className)}
      aria-label={user.name}
    >
      <span
        className={cn(
          'grid size-full place-items-start [&_.care-avatar]:mt-0 [&_.care-avatar]:h-auto [&_.care-avatar]:w-full [&_.care-avatar]:drop-shadow-none',
          imageClassName
        )}
      >
        <CareAvatar {...user.avatarConfig} />
      </span>
    </span>
  )
}

export function PetVisual({
  user,
  furColor,
  className
}: {
  user: CommunityUser
  furColor: string
  className?: string
}) {
  if (user.petPhoto) {
    return (
      <img src={user.petPhoto} alt={user.petName} className={cn('block object-cover', className)} />
    )
  }

  return <SmallDogMascot furColor={furColor} className={className} aria-label={user.petName} />
}
