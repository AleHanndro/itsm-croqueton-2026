'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { AdminLayout } from '@/components/admin-layout'
import { GuaubookProfilePage } from '@/components/guaubook-profile'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export default function AdminGuauBookProfilePage() {
  const { user, isHydrated } = useCommunity()
  const { language } = useLanguage()
  const router = useRouter()
  const isEnglish = language === 'en'

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace('/iniciar-sesion?redirect=%2Fadmin%2Fguaubook%2Fperfil')
    }
  }, [isHydrated, router, user])

  if (!isHydrated || !user) {
    return (
      <div className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center">
        <p className="m-0 font-extrabold opacity-65">
          {isEnglish ? 'Checking your session…' : 'Verificando tu sesión…'}
        </p>
      </div>
    )
  }

  return (
    <AdminLayout>
      <GuaubookProfilePage />
    </AdminLayout>
  )
}
