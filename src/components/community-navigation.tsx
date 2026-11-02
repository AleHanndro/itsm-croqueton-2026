import Link from 'next/link'

import { Paw } from '@/assets/icons/paw'
import { useNavigate } from '@/lib/navigation'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

function CommunityNavigation() {
  const { language } = useLanguage()
  const { user, signOut } = useCommunity()
  const navigate = useNavigate()

  const isEnglish = language === 'en'

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b-3 border-stroke bg-surface-bar">
        <div className="relative z-2 mx-auto flex min-h-20.5 w-[min(1240px,calc(100%-96px))] items-center gap-7 tablet:w-[min(100%-36px,680px)] phone:min-h-auto phone:w-[min(100%-28px,680px)] phone:flex-wrap phone:gap-3 phone:py-3.5 laptop:w-[min(100%-48px,1040px)]">
          <Link
            href="/"
            className="inline-flex w-max items-center gap-2.5 font-heading text-title-sm font-extrabold tracking-heading"
            aria-label="Croquetón"
          >
            <span className="grid size-10.75 place-items-center rounded-circle bg-surface-inverse text-fg-control-active [&_svg]:size-6.25">
              <Paw />
            </span>
            <span>Croquetón</span>
          </Link>
          <nav
            aria-label={isEnglish ? 'Community navigation' : 'Navegaci\xF3n de la comunidad'}
            className="flex flex-1 justify-center gap-6 font-black phone:order-3 phone:basis-full phone:justify-start phone:overflow-x-auto phone:pb-0.75"
          >
            <Link
              href="/guaubook"
              className="border-b-3 border-transparent hover:border-current phone:flex-none phone:text-[12px]"
            >
              {isEnglish ? 'GuauBook' : 'GuauBook'}
            </Link>
            <Link
              href="/mi-perfil"
              className="border-b-3 border-transparent hover:border-current phone:flex-none phone:text-[12px]"
            >
              {isEnglish ? 'My profile' : 'Mi perfil'}
            </Link>
            <Link
              href="/avatar-mascota"
              className="border-b-3 border-transparent hover:border-current phone:flex-none phone:text-[12px]"
            >
              {isEnglish ? 'Avatar & pet' : 'Avatar y mascota'}
            </Link>
          </nav>
          {user && (
            <button
              className="border-0 bg-transparent font-black text-foreground underline underline-offset-4 phone:ml-auto phone:text-[12px]"
              type="button"
              onClick={() => {
                signOut()
                navigate('/')
              }}
            >
              {isEnglish ? 'Sign out' : 'Cerrar sesi\xF3n'}
            </button>
          )}
        </div>
      </header>
      <div className="h-20.5 bg-surface-bar" aria-hidden="true" />
    </>
  )
}
export default CommunityNavigation
