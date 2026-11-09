'use client'

import type { ReactNode } from 'react'

import { AdminSidebar } from '@/components/admin-dashboard'
import { PageShell } from '@/components/page-shell'
import { Container } from '@/components/ui/container'
import { useNavigate } from '@/lib/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useCommunity } from '@/providers/community-provider'

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isHydrated, postReviewRequests, signOut } = useCommunity()
  const navigate = useNavigate()
  const router = useRouter()
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'
  const [requestCount, setRequestCount] = useState(0)

  useEffect(() => {
    if (!isHydrated) return
    if (!user) {
      router.replace('/iniciar-sesion?redirect=%2Fadmin')
      return
    }
    if (!isAdmin) {
      router.replace('/mi-perfil')
    }
  }, [isAdmin, isHydrated, router, user])

  useEffect(() => {
    function updateCount() {
      try {
        const stored = window.localStorage.getItem('croqueton-join-requests')
        const requests = stored ? (JSON.parse(stored) as { status?: string }[]) : []
        setRequestCount(requests.filter((request) => request.status === 'pending').length)
      } catch {
        setRequestCount(0)
      }
    }
    updateCount()
    window.addEventListener('storage', updateCount)
    return () => window.removeEventListener('storage', updateCount)
  }, [])

  if (!isHydrated || !user || !isAdmin) {
    return (
      <PageShell surface="mint" navigation="none" showToggles={false}>
        <Container
          as="section"
          className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center"
        >
          <p className="m-0 font-extrabold opacity-65">
            {isHydrated ? 'Redirigiendo…' : 'Verificando tu sesión…'}
          </p>
        </Container>
      </PageShell>
    )
  }

  const today = new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date())

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
              navigate('/')
            }}
          />

        <div className="min-w-0">
          <header className="flex min-h-18 items-center justify-between gap-5 border-b border-stroke-admin-topbar bg-surface-admin-topbar px-[clamp(24px,4vw,56px)] backdrop-blur-md tablet:px-6 phone:min-h-15.5 phone:px-3.5">
            <div className="flex items-baseline gap-3 phone:grid phone:gap-0">
              <small className="text-caption font-extrabold text-[#7a7e89] capitalize">
                {today}
              </small>
            </div>
          </header>

          {children}
        </div>
      </div>
    </PageShell>
  )
}
