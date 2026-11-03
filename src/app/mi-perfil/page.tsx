'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AdminSidebar } from '@/components/admin-dashboard'
import { GuaubookProfilePage } from '@/components/guaubook-profile'
import { PageShell } from '@/components/page-shell'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export default function ProfilePage() {
  const { user, isHydrated, signOut, postReviewRequests } = useCommunity()
  const [requestCount, setRequestCount] = useState(0)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('croqueton-join-requests')
      const requests = stored ? (JSON.parse(stored) as { status?: string }[]) : []
      setRequestCount(requests.filter((request) => request.status === 'pending').length)
    } catch {
      setRequestCount(0)
    }
  }, [])
  const { language } = useLanguage()
  const router = useRouter()
  const isEnglish = language === 'en'
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace('/iniciar-sesion?redirect=%2Fmi-perfil')
    }
  }, [isHydrated, router, user])

  if (!isHydrated || !user) {
    return (
      <PageShell surface="mint" navigation="none">
        <Container
          as="section"
          className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center"
        >
          <Eyebrow>{isEnglish ? 'Loading profile' : 'Cargando perfil'}</Eyebrow>
          <p className="m-0 font-extrabold opacity-65">
            {isEnglish ? 'Checking your session…' : 'Verificando tu sesión…'}
          </p>
        </Container>
      </PageShell>
    )
  }

  if (isAdmin) {
    return (
      <PageShell surface="admin" navigation="none">
        <div className="grid min-h-screen grid-cols-[250px_minmax(0,1fr)] tablet:grid-cols-[1fr]">
          <AdminSidebar
            userEmail={user.email}
            userRole={user.role === 'superadmin' ? 'superadmin' : 'admin'}
            pendingCount={postReviewRequests.length}
            requestCount={requestCount}
            onSignOut={() => {
              signOut()
              router.push('/')
            }}
          />
          <div className="min-w-0">
            <GuaubookProfilePage />
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell surface="mint" navigation="none">
      <GuaubookProfilePage />
    </PageShell>
  )
}
