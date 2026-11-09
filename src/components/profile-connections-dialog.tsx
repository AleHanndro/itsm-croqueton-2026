'use client'

import { cn } from 'cn'
import Link from 'next/link'
import { useState } from 'react'

import {
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogViewport
} from '@/components/ui/dialog'
import { TextInput } from '@/components/ui/field'
import { UserAvatar } from '@/components/user-visuals'
import { followingOf, profilePath } from '@/lib/community'
import { useCommunity, type CommunityUser } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export function ProfileConnectionsDialog({
  open,
  onOpenChange,
  title,
  connectionProfiles,
  emptyText
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  connectionProfiles: CommunityUser[]
  emptyText: string
}) {
  const { language } = useLanguage()
  const { user, follows, toggleFollow } = useCommunity()
  const [query, setQuery] = useState('')
  const isEnglish = language === 'en'
  const currentFollowing = user ? followingOf(follows, user.email) : []
  const normalizedQuery = query.trim().toLowerCase()
  const filteredProfiles = connectionProfiles.filter((profile) => {
    if (!normalizedQuery) return true
    return (
      profile.name.toLowerCase().includes(normalizedQuery) ||
      profile.username.toLowerCase().includes(normalizedQuery)
    )
  })

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setQuery('')
    onOpenChange(nextOpen)
  }

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogViewport>
          <DialogPopup className="w-[min(620px,100%)]">
            <DialogClose />
            <DialogTitle>{title}</DialogTitle>
            <TextInput
              variant="control"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isEnglish ? 'Search by name or username' : 'Buscar por nombre o usuario'}
            />
            <div className="mt-4 grid gap-3">
              {filteredProfiles.length ? (
                filteredProfiles.map((profile) => {
                  const isSelf = user?.email === profile.email
                  const isFollowing = currentFollowing.includes(profile.email)

                  return (
                    <div
                      key={profile.email}
                      className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-surface-warm p-3"
                    >
                      <Link
                        href={isSelf ? '/mi-perfil' : profilePath(profile.username)}
                        onClick={() => handleOpenChange(false)}
                        className="flex min-w-0 flex-1 items-center gap-3"
                        aria-label={
                          isEnglish
                            ? `Open ${profile.name}'s profile`
                            : `Abrir el perfil de ${profile.name}`
                        }
                      >
                        <UserAvatar user={profile} className="size-12 flex-none" />
                        <span className="min-w-0">
                          <strong className="block truncate font-heading text-[18px]">
                            {profile.name}
                          </strong>
                          <span className="block truncate text-small font-extrabold opacity-65">
                            @{profile.username}
                          </span>
                        </span>
                      </Link>
                      {isSelf ? (
                        <span className="rounded-pill border-2 border-ink bg-brand px-2.5 py-1 text-micro font-black">
                          {isEnglish ? 'You' : 'Tú'}
                        </span>
                      ) : (
                        user && (
                          <button
                            type="button"
                            className={cn(
                              'rounded-pill border-2 border-ink px-2.5 py-1 text-micro font-black [transition:background_0.2s_ease]',
                              isFollowing ? 'bg-brand text-ink' : 'bg-card text-ink hover:bg-brand'
                            )}
                            onClick={() => toggleFollow(profile.email)}
                            aria-pressed={isFollowing}
                          >
                            {isFollowing
                              ? isEnglish
                                ? 'Unfollow'
                                : 'Dejar de seguir'
                              : isEnglish
                                ? 'Follow'
                                : 'Seguir'}
                          </button>
                        )
                      )}
                    </div>
                  )
                })
              ) : (
                <p className="m-0 font-extrabold opacity-65">
                  {normalizedQuery
                    ? isEnglish
                      ? 'No matching members.'
                      : 'No hay miembros que coincidan.'
                    : emptyText}
                </p>
              )}
            </div>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  )
}
