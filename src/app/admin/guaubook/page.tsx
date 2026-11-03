'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { AdminLayout } from '@/components/admin-layout'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { GuaubookCommunity } from '@/components/guaubook-community'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export default function AdminGuauBookPage() {
  const { user, isHydrated } = useCommunity()
  const { language } = useLanguage()
  const router = useRouter()
  const isEnglish = language === 'en'

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace('/iniciar-sesion?redirect=%2Fadmin%2Fguaubook')
    }
  }, [isHydrated, router, user])

  if (!isHydrated || !user) {
    return (
      <div className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center">
        <Eyebrow>{isEnglish ? 'Loading GuauBook' : 'Cargando GuauBook'}</Eyebrow>
      </div>
    )
  }

  return (
    <AdminLayout>
      <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
        <GuaubookCommunity variant="admin" />
      </Container>
    </AdminLayout>
  )
}
