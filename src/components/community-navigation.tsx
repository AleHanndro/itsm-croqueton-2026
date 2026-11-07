'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Paw } from '@/assets/icons/paw'
import { User } from '@/assets/icons/user'
import { UserAvatar } from '@/components/user-visuals'
import { OPEN_COMPOSER_EVENT } from '@/lib/community'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

const LOGIN_WALL_REDIRECT = '/iniciar-sesion?redirect=%2Fguaubook'
const LOGIN_PROFILE_REDIRECT = '/iniciar-sesion?redirect=%2Fmi-perfil'
const LOGIN_COMPOSE_REDIRECT = '/iniciar-sesion?redirect=%2Fguaubook%23crear-publicacion'

function CommunityNavigation() {
  const { language } = useLanguage()
  const { user, signOut } = useCommunity()
  const pathname = usePathname()
  const router = useRouter()

  const isEnglish = language === 'en'
  const isWall = pathname === '/guaubook'
  const isProfile = pathname === '/mi-perfil'

  const navLinkClass = (active: boolean) =>
    active
      ? 'inline-flex items-center gap-2 rounded-pill border-2 border-ink bg-brand px-3 py-1.5 font-black text-ink'
      : 'inline-flex items-center gap-2 rounded-pill border-2 border-transparent px-3 py-1.5 font-black text-foreground transition hover:border-ink hover:bg-surface-warm'

  function openComposer() {
    if (!user) {
      router.push(LOGIN_COMPOSE_REDIRECT)
      return
    }

    if (!isWall) {
      router.push('/guaubook#crear-publicacion')
      return
    }

    window.dispatchEvent(new Event(OPEN_COMPOSER_EVENT))
    document.getElementById('crear-publicacion')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b-3 border-stroke bg-surface-bar">
        <div className="relative z-2 mx-auto flex min-h-20.5 w-[min(1240px,calc(100%-96px))] items-center gap-6 tablet:w-[min(100%-36px,680px)] phone:min-h-auto phone:w-[min(100%-28px,680px)] phone:flex-wrap phone:gap-3 phone:py-3.5 laptop:w-[min(100%-48px,1040px)]">
          <Link
            href="/"
            className="inline-flex w-max items-center gap-2.5 font-heading text-title-sm font-extrabold tracking-heading"
            aria-label="Croquetón"
          >
            <span className="grid size-10.75 place-items-center rounded-circle bg-surface-inverse text-fg-control-active [&_svg]:size-6.25">
              <Paw />
            </span>
            <span className="phone:hidden">Croquetón</span>
          </Link>

          <nav
            aria-label={isEnglish ? 'GuauBook navigation' : 'Navegación de GuauBook'}
            className="flex flex-1 items-center justify-center gap-2 phone:order-3 phone:basis-full phone:justify-start phone:overflow-x-auto phone:pb-0.75"
          >
            <Link
              href="/guaubook"
              className={navLinkClass(isWall)}
              aria-current={isWall ? 'page' : undefined}
            >
              <Paw className="size-4" />
              {isEnglish ? 'Home' : 'Inicio'}
            </Link>
            <button type="button" className={navLinkClass(false)} onClick={openComposer}>
              <span aria-hidden="true" className="text-[18px] leading-none">
                +
              </span>
              {isEnglish ? 'Create post' : 'Crear publicación'}
            </button>
            <Link
              href={user ? '/mi-perfil' : LOGIN_PROFILE_REDIRECT}
              className={navLinkClass(isProfile)}
              aria-current={isProfile ? 'page' : undefined}
            >
              {user ? (
                <UserAvatar user={user} className="size-7 border-2" />
              ) : (
                <span className="grid size-7 place-items-center rounded-circle border-2 border-ink bg-brand">
                  <User className="size-4" />
                </span>
              )}
              <span className="truncate">{isEnglish ? 'My profile' : 'Mi perfil'}</span>
            </Link>
          </nav>

          {user ? (
            <div className="flex items-center gap-3 phone:hidden">
              <span className="max-w-36 truncate text-small font-extrabold opacity-60">
                @{user.username}
              </span>
              <button
                type="button"
                className="text-small font-black underline underline-offset-4"
                onClick={() => {
                  signOut()
                  router.push('/')
                }}
              >
                {isEnglish ? 'Sign out' : 'Cerrar sesión'}
              </button>
            </div>
          ) : (
            <Link
              href={LOGIN_WALL_REDIRECT}
              className="text-small font-black underline underline-offset-4 phone:ml-auto phone:text-[12px]"
            >
              {isEnglish ? 'Sign in' : 'Iniciar sesión'}
            </Link>
          )}
        </div>
      </header>
      <div className="h-20.5 bg-surface-bar" aria-hidden="true" />
    </>
  )
}

export default CommunityNavigation
