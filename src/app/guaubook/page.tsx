'use client'

import { GuaubookCommunity } from '@/components/guaubook-community'
import { PageShell } from '@/components/page-shell'
import { Container } from '@/components/ui/container'

export default function GuauBookPage() {
  return (
    <PageShell surface="mint" navigation="community">
      <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
        <GuaubookCommunity />
      </Container>
    </PageShell>
  )
}
