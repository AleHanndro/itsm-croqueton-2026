'use client'

import Link from 'next/link'

import { ChevronDown } from '@/assets/icons/chevron-down'
import { User } from '@/assets/icons/user'
import { PetVisual, UserAvatar } from '@/components/user-visuals'
import type { CommunityUser } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

const LOGIN_WITH_PROFILE_REDIRECT = '/iniciar-sesion?redirect=%2Fmi-perfil'

export function GuaubookProfileButton({
  user,
  petFurColor
}: {
  user: CommunityUser | null
  petFurColor: string
}) {
  const { language } = useLanguage()
  const isEnglish = language === 'en'

  const className =
    'group flex w-full min-w-0 items-center gap-3.5 rounded-3xl border-4 border-ink bg-card px-4 py-3 text-left text-ink shadow-card [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:transform-[translateY(-2px)] active:transform-[translateY(2px)] active:shadow-none phone:gap-2.5 phone:rounded-[22px] phone:px-3 phone:py-2.5'

  if (!user) {
    return (
      <Link
        href={LOGIN_WITH_PROFILE_REDIRECT}
        className={className}
        aria-label={isEnglish ? 'Sign in to see my profile' : 'Inicia sesión para ver mi perfil'}
      >
        <span className="grid size-14 flex-none place-items-center rounded-circle border-3 border-ink bg-brand shadow-[3px_3px_0_var(--ink-faint)] phone:size-12 [&_svg]:size-7">
          <User />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-heading text-[20px] leading-tight font-black phone:text-[17px]">
            {isEnglish ? 'My profile' : 'Mi perfil'}
          </span>
          <span className="block truncate text-caption font-extrabold opacity-60">
            {isEnglish ? 'Sign in to continue' : 'Inicia sesión para continuar'}
          </span>
        </span>
        <ChevronDown className="size-5 flex-none -rotate-90 opacity-60 [transition:transform_0.2s_ease] group-hover:translate-x-0.5 phone:size-4" />
      </Link>
    )
  }

  return (
    <Link
      href="/mi-perfil"
      className={className}
      aria-label={
        isEnglish
          ? `Open ${user.name}'s profile and ${user.petName}`
          : `Abrir el perfil de ${user.name} y ${user.petName}`
      }
    >
      <UserAvatar
        user={user}
        className="size-14 flex-none shadow-[3px_3px_0_var(--ink-faint)] phone:size-12"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-heading text-[20px] leading-tight font-black phone:text-[17px]">
          {user.name}
        </span>
        <span className="block truncate text-caption font-extrabold opacity-60">
          @{user.username}
        </span>
      </span>
      <span className="flex max-w-[42%] min-w-0 items-center gap-2 rounded-pill border-2 border-ink bg-surface-warm px-2.5 py-1.5 phone:max-w-[43%] phone:gap-1.5 phone:px-2">
        <span className="size-9 flex-none overflow-hidden rounded-circle border-2 border-ink bg-brand phone:size-8">
          <PetVisual user={user} furColor={petFurColor} className="size-full object-cover" />
        </span>
        <span className="min-w-0">
          <span className="block text-micro font-black tracking-label uppercase opacity-60">
            {isEnglish ? 'My pet' : 'Mi mascota'}
          </span>
          <span className="block truncate text-small leading-tight font-black phone:text-[11px]">
            {user.petName}
          </span>
        </span>
      </span>
      <ChevronDown className="size-5 flex-none -rotate-90 opacity-60 [transition:transform_0.2s_ease] group-hover:translate-x-0.5 phone:size-4" />
    </Link>
  )
}
