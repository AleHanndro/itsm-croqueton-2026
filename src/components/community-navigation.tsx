import Link from 'next/link'

import { Paw } from '@/components/ui'
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
      <header className="community-header">
        <div className="community-nav container">
          <Link href="/" className="logo" aria-label="Croquetón">
            <span className="logo-mark">
              <Paw />
            </span>
            <span>Croquetón</span>
          </Link>
          <nav aria-label={isEnglish ? 'Community navigation' : 'Navegaci\xF3n de la comunidad'}>
            <Link href="/guaubook">{isEnglish ? 'GuauBook' : 'GuauBook'}</Link>
            <Link href="/mi-perfil">{isEnglish ? 'My profile' : 'Mi perfil'}</Link>
            <Link href="/avatar-mascota">{isEnglish ? 'Avatar & pet' : 'Avatar y mascota'}</Link>
          </nav>
          {user && (
            <button
              className="community-logout"
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
      <div className="community-nav-spacer" aria-hidden="true" />
    </>
  )
}
export default CommunityNavigation
