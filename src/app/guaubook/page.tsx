'use client'

import { GuaubookCommunity } from '@/components/guaubook-community'
import { PageHero } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { Container } from '@/components/ui/container'
import { useLanguage } from '@/providers/language-provider'

export default function GuauBookPage() {
  const { language } = useLanguage()
  const isEnglish = language === 'en'

  return (
    <PageShell surface="mint">
      <PageHero
        surface="soft"
        spacing="guaubook"
        eyebrow="GuauBook"
        title={isEnglish ? 'Stories from' : 'Historias de'}
        accentTitle={isEnglish ? 'the pack.' : 'la manada.'}
        titleClassName="mt-2.75 mb-5 text-[clamp(64px,7vw,104px)] leading-[0.8] font-normal phone:text-[56px]"
        description={
          isEnglish
            ? 'Share a moment, a photo or a little good news with the Croquetón community.'
            : 'Comparte un momento, una foto o una buena noticia con la comunidad Croquetón.'
        }
        descriptionClassName="m-0 text-[18px] leading-[1.55]"
      />
      <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
        <GuaubookCommunity />
      </Container>
    </PageShell>
  )
}
