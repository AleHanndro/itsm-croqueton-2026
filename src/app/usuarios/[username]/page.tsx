import { Suspense } from 'react'

import { PageShell } from '@/components/page-shell'
import { PublicProfilePage } from '@/components/public-profile'

function ProfileFallback() {
  return <div className="min-h-screen bg-surface-page-mint" aria-hidden="true" />
}

async function ProfileRoute({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  return (
    <PageShell surface="mint" navigation="community">
      <PublicProfilePage username={username} />
    </PageShell>
  )
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <ProfileRoute params={params} />
    </Suspense>
  )
}
