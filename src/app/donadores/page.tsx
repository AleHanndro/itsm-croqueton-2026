'use client'

import { EmptyStateCard } from '@/components/empty-state-card'
import { PageHero, PolaroidFigure } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { SectionIntro } from '@/components/section-intro'
import { Container } from '@/components/ui/container'
import { donationMemeImage } from '@/lib/images'
import { useEffect, useState } from 'react'
import { TextInput } from '@/components/ui/field'
import { useLanguage } from '@/providers/language-provider'

type PublicDonor = { firstName: string; lastName: string; year: number | null }

export default function DonorsPage() {
  const { language } = useLanguage()
  const isEnglish = language === 'en'

  const [donors, setDonors] = useState<PublicDonor[]>([])
  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const response = await fetch('/api/donors')
        if (!response.ok) throw new Error('request_failed')
        const data = (await response.json()) as { donors: PublicDonor[] }
        if (active) setDonors(data.donors)
      } catch {
        if (active) setDonors([])
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [])

  const years = Array.from(new Set(donors.map((donor) => donor.year).filter((year): year is number => year !== null))).sort((a, b) => b - a)

  const filteredDonors = donors.filter((donor) => {
    const query = search.trim().toLowerCase()
    if (query) {
      const name = `${donor.firstName} ${donor.lastName}`.toLowerCase()
      if (!name.includes(query)) return false
    }
    if (selectedYear !== 'all' && donor.year !== selectedYear) return false
    return true
  })

  return (
    <PageShell surface="mint">
      <PageHero
        surface="bar"
        spacing="compact"
        containerClassName="grid-cols-[1fr_0.7fr] gap-21.25"
        eyebrow={isEnglish ? 'Official donor wall' : 'Muro oficial de donadores'}
        title={isEnglish ? 'Humans with' : 'Humanos con'}
        accentTitle={isEnglish ? 'a big heart.' : 'coraz\xF3n grandote.'}
        titleClassName="text-[clamp(60px,6vw,90px)] leading-[0.85]"
        description={
          isEnglish
            ? "This wall celebrates confirmed donations. Only the Croquet\xF3n admin team publishes names here, with each donor's permission."
            : 'Este muro celebra donaciones confirmadas. Solo el equipo administrador del Croquet\xF3n publica nombres aqu\xED, con autorizaci\xF3n de cada donador.'
        }
        aside={
          <PolaroidFigure
            src={donationMemeImage}
            alt={
              isEnglish
                ? 'Dog demanding kibble donations'
                : 'Perrito exigiendo donaciones de croquetas'
            }
            caption={
              isEnglish
                ? 'Your name could be here. No pressure.'
                : 'Tu nombre podr\xEDa estar aqu\xED. Sin presi\xF3n.'
            }
            className="tablet:mx-auto tablet:mt-7.5 tablet:w-[min(100%,430px)]"
            imageClassName="rounded-[22px] border-9 shadow-[14px_16px_0_rgba(32,36,54,0.24)]"
            captionClassName="-mt-3 max-w-[90%] rounded-tag px-3.5 py-2.25"
          />
        }
      />

      <section
        className="min-h-175 bg-surface-donor-wall pt-27.5 pb-31.25 phone:pt-18.75 phone:pb-22.5"
        aria-labelledby="official-donors-title"
      >
        <Container>
          <SectionIntro
            className="max-w-180"
            eyebrow={isEnglish ? 'Verified by the pack' : 'Verificado por la manada'}
            titleId="official-donors-title"
            title={
              <>
                {isEnglish ? 'The good human' : 'La lista de humanos'}
                <br />
                {isEnglish ? 'honor roll.' : 'buena onda.'}
              </>
            }
            description={
              isEnglish
                ? 'Names appear after the admin team confirms the donation and publication permission.'
                : 'Los nombres aparecen despu\xE9s de que el equipo administrador confirma la donaci\xF3n y el permiso de publicaci\xF3n.'
            }
            descriptionClassName="max-w-162.5"
          />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <TextInput
              variant="control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={isEnglish ? 'Search by name' : 'Buscar por nombre'}
            />
            <select
              className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value === 'all' ? 'all' : Number(event.target.value))}
            >
              <option value="all">{isEnglish ? 'All years' : 'Todos los años'}</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 min-h-97.5 rounded-card-lg border-4 border-stroke bg-card p-8 text-ink shadow-panel phone:min-h-85 phone:px-4.5 phone:py-5.5">
            {loading ? (
              <p className="text-small font-extrabold opacity-65">{isEnglish ? 'Loading…' : 'Cargando…'}</p>
            ) : filteredDonors.length > 0 ? (
              <ol className="mt-5.5 grid list-none gap-2.25 p-0">
                {filteredDonors.map((donor, index) => (
                  <li
                    key={`${donor.firstName}-${donor.lastName}-${donor.year}-${index}`}
                    className="flex items-center justify-between gap-4.5 rounded-chip bg-surface-chip px-3.5 py-3 font-extrabold before:text-accent before:content-['✦']"
                  >
                    <span className="flex-1 wrap-anywhere">{donor.firstName} {donor.lastName}</span>
                    {donor.year && (
                      <strong className="whitespace-nowrap text-accent">{donor.year}</strong>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyStateCard
                variant="donor-wall"
                title={
                  isEnglish
                    ? 'The admin is sharpening the pencil.'
                    : 'El admin est\xE1 sac\xE1ndole punta al l\xE1piz.'
                }
                description={
                  isEnglish
                    ? 'Confirmed donor names will appear here soon.'
                    : 'Los nombres confirmados aparecer\xE1n aqu\xED muy pronto.'
                }
              />
            )}
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
