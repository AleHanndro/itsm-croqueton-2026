'use client'

import Image from 'next/image'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

import { Paw } from '@/assets/icons/paw'
import { EmptyStateCard } from '@/components/empty-state-card'
import { PageHero } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { SectionIntro } from '@/components/section-intro'
import { Container } from '@/components/ui/container'
import {
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogViewport
} from '@/components/ui/dialog'
import { FieldLabel, TextInput, TextareaInput } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { packGenerationImage } from '@/lib/images'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

type Generation = {
  description?: string | null
  generationNumber: number
  groupPhoto?: string | null
  id: string
  members: { id: string; name: string; order: number }[]
  title: string
  year: string
}

export default function PackPage() {
  const { language } = useLanguage()
  const { user, isHydrated } = useCommunity()
  const isEnglish = language === 'en'

  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Generation | null>(null)

  const [isAdmin, setIsAdmin] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [year, setYear] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState<string>()
  const [members, setMembers] = useState('')
  const [generationNumber, setGenerationNumber] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/croquetones')
        if (!response.ok) throw new Error('request_failed')
        const data = (await response.json()) as { croquetones: Generation[] }
        setGenerations(data.croquetones)
      } catch {
        setGenerations([])
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  useEffect(() => {
    void fetch('/api/auth/session')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const role = data?.user?.role
        setIsAdmin(role === 'admin' || role === 'superadmin')
      })
      .catch(() => setIsAdmin(false))
  }, [])

  async function loadGenerations() {
    try {
      const response = await fetch('/api/croquetones')
      if (!response.ok) throw new Error('request_failed')
      const data = (await response.json()) as { croquetones: Generation[] }
      setGenerations(data.croquetones)
    } catch {
      setGenerations([])
    }
  }

  const filtered = generations.filter((generation) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      generation.title.toLowerCase().includes(query) ||
      generation.year.toLowerCase().includes(query) ||
      String(generation.generationNumber).includes(query) ||
      generation.members.some((member) => member.name.toLowerCase().includes(query))
    )
  })

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') setPhoto(reader.result)
    })
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function openCreate() {
    setEditingId(null)
    setYear('')
    setTitle('')
    setDescription('')
    setPhoto(undefined)
    setMembers('')
    setGenerationNumber('')
    setMessage(null)
    setIsFormOpen(true)
  }

  function openEdit(generation: Generation) {
    setEditingId(generation.id)
    setYear(generation.year)
    setTitle(generation.title)
    setDescription(generation.description ?? '')
    setPhoto(generation.groupPhoto ?? undefined)
    setMembers(generation.members.map((member) => member.name).join(', '))
    setGenerationNumber(String(generation.generationNumber))
    setMessage(null)
    setIsFormOpen(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    if (!year.trim() || !title.trim() || !generationNumber.trim()) {
      setMessage({ type: 'error', text: isEnglish ? 'Year, title and generation number are required.' : 'Año, título y número de generación son obligatorios.' })
      return
    }

    const memberList = members
      .split(/[,\n]/)
      .map((name) => name.trim())
      .filter(Boolean)

    setSaving(true)
    try {
      const payload = {
        description,
        generationNumber: Number(generationNumber),
        groupPhoto: photo ?? null,
        members: memberList,
        title: title.trim(),
        year: year.trim()
      }

      const response = await fetch(
        editingId ? `/api/admin/croquetones/${editingId}` : '/api/admin/croquetones',
        {
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
          method: editingId ? 'PATCH' : 'POST'
        }
      )

      if (!response.ok) throw new Error('save_failed')

      setMessage({ type: 'success', text: editingId ? (isEnglish ? 'Generation updated.' : 'Generación actualizada.') : (isEnglish ? 'Generation added.' : 'Generación agregada.') })
      setIsFormOpen(false)
      setEditingId(null)
      await loadGenerations()
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not save generation.' : 'No se pudo guardar la generación.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(isEnglish ? 'Delete this generation?' : '¿Eliminar esta generación?')) return
    try {
      const response = await fetch(`/api/admin/croquetones/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('delete_failed')
      setMessage({ type: 'success', text: isEnglish ? 'Generation deleted.' : 'Generación eliminada.' })
      await loadGenerations()
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not delete generation.' : 'No se pudo eliminar la generación.' })
    }
  }

  return (
    <PageShell surface="mint">
      <PageHero
        surface="soft"
        spacing="compact"
        className="relative overflow-hidden"
        eyebrow={isEnglish ? 'The Croquetón pack' : 'La manada Croquetón'}
        title={isEnglish ? 'Every generation' : 'Cada generación'}
        accentTitle={isEnglish ? 'leaves paw prints.' : 'deja huellitas.'}
        description={
          isEnglish
            ? 'Our group album keeps the volunteers, laughs and heroic kibble-carrying poses from every edition.'
            : 'Nuestro álbum grupal guarda a los voluntarios, las risas y las poses heroicas cargando croquetas de cada edición.'
        }
        descriptionClassName="max-w-175"
        backdrop={
          <div
            className="pointer-events-none absolute top-5 right-[5%] z-1 h-82.5 w-107.5 phone:top-8.75 phone:-right-21.25 phone:h-62.5 phone:w-77.5 phone:origin-top-left phone:scale-78"
            aria-hidden="true"
          >
            {Array.from({ length: 7 }, (_, index) => (
              <span
                className="absolute block size-14.5 text-[#a67b5b] nth-1:bottom-2.5 nth-1:left-4.5 nth-1:-rotate-12 nth-2:bottom-12 nth-2:left-24 nth-2:rotate-13 nth-3:bottom-29 nth-3:left-36.25 nth-3:-rotate-10 nth-4:bottom-36.25 nth-4:left-56.25 nth-4:rotate-15 nth-5:bottom-53.25 nth-5:left-66.5 nth-5:-rotate-14 nth-6:bottom-58.75 nth-6:left-86.5 nth-6:rotate-11 nth-7:bottom-73.75 nth-7:left-91.5 nth-7:-rotate-12 [&_svg]:size-full [&_svg]:transform-[scale(0.9)] [&_svg]:animate-[pack-paw-mark_0.6s_ease-in-out_forwards] [&_svg]:opacity-0 nth-2:[&_svg]:[animation-delay:0.4s] nth-3:[&_svg]:[animation-delay:0.8s] nth-4:[&_svg]:[animation-delay:1.2s] nth-5:[&_svg]:[animation-delay:1.6s] nth-6:[&_svg]:[animation-delay:2s] nth-7:[&_svg]:[animation-delay:2.4s] motion-reduce:[&_svg]:transform-[scale(1)] motion-reduce:[&_svg]:animate-none! motion-reduce:[&_svg]:opacity-80"
                key={index}
              >
                <Paw />
              </span>
            ))}
          </div>
        }
      />

      <section className="pt-27.5 pb-31.25 phone:pt-18.75 phone:pb-22.5">
        <Container>
          <SectionIntro
            className="max-w-180"
            eyebrow={isEnglish ? 'Croquetón generations' : 'Generaciones Croquetón'}
            title={
              <>
                {isEnglish ? "The pack's" : 'El álbum de'}
                <br />
                {isEnglish ? 'group album.' : 'la manada.'}
              </>
            }
            description={
              isEnglish
                ? "A home for each generation's official group photo, published by the Croquetón team."
                : 'Un espacio para la foto grupal oficial de cada generación, publicada por el equipo Croquetón.'
            }
          />

          <div className="mt-6 mb-8">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={isEnglish ? 'Search by name, generation or year' : 'Buscar por nombre, generación o año'}
              className="w-full rounded-control border border-stroke bg-card px-4 py-3 text-small font-black"
            />
          </div>

          {isAdmin && (
            <div className="mb-6">
              <Button type="button" onClick={openCreate}>
                {isEnglish ? '+ Add generation' : '+ Agregar generación'}
              </Button>
            </div>
          )}

          {message && (
            <p className={message.type === 'error' ? 'mb-4 text-small font-extrabold text-[#9e3b28]' : 'mb-4 text-small font-extrabold text-[#2f6b45]'}>
              {message.text}
            </p>
          )}

          {loading ? (
            <p className="text-small font-extrabold opacity-65">{isEnglish ? 'Loading…' : 'Cargando…'}</p>
          ) : (
            <div className="mt-11.25 grid grid-cols-[1.2fr_0.9fr_0.9fr] gap-5.5 tablet:grid-cols-[1fr]">
              {filtered.length === 0 && generations.length === 0 && (
                <>
                  <figure className="-rotate-1 overflow-hidden rounded-3xl bg-card text-ink shadow-card">
                    <Image
                      src={packGenerationImage}
                      className="block aspect-[1.35] w-full object-cover"
                      alt={isEnglish ? 'Croquetón 2025 team' : 'Equipo Croquetón 2025'}
                    />
                    <figcaption className="px-5 py-4.5">
                      <strong className="block font-heading text-lead-lg">
                        {isEnglish ? 'Generation 2025' : 'Generación 2025'}
                      </strong>
                      <span className="block text-[12px] font-extrabold opacity-60">
                        {isEnglish ? 'The founding pack' : 'La manada fundadora'}
                      </span>
                    </figcaption>
                  </figure>
                  <EmptyStateCard
                    variant="generation"
                    className="rotate-1"
                    iconClassName="text-secondary"
                    title={isEnglish ? 'Next group photo' : 'Próxima foto grupal'}
                    description={
                      isEnglish
                        ? 'Reserved for the next generation of Croquetones.'
                        : 'Reservado para la siguiente generación de Croquetones.'
                    }
                  />
                  <EmptyStateCard
                    variant="generation"
                    className="rotate-[-1.5deg]"
                    iconClassName="text-accent"
                    title={isEnglish ? 'Your team could be here' : 'Aquí puede estar tu equipo'}
                    description={
                      isEnglish
                        ? 'Join, help and smile for the camera.'
                        : 'Únete, ayuda y sonríe para la foto.'
                    }
                  />
                </>
              )}

              {filtered.map((generation) => (
                <div key={generation.id} className="relative">
                  <figure
                    className="-rotate-1 cursor-pointer overflow-hidden rounded-3xl bg-card text-ink shadow-card"
                    onClick={() => setSelected(generation)}
                  >
                    {generation.groupPhoto ? (
                      <Image
                        src={generation.groupPhoto}
                        alt={generation.title}
                        width={600}
                        height={400}
                        className="block aspect-[1.35] w-full object-cover"
                      />
                    ) : (
                      <div className="grid aspect-[1.35] w-full place-items-center bg-surface-warm">
                        <Paw className="size-16 text-secondary" />
                      </div>
                    )}
                    <figcaption className="px-5 py-4.5">
                      <strong className="block font-heading text-lead-lg">
                        {isEnglish ? 'Generation' : 'Generación'} {generation.generationNumber} — {generation.year}
                      </strong>
                      <span className="block text-[12px] font-extrabold opacity-60">{generation.title}</span>
                    </figcaption>
                  </figure>
                  {isAdmin && (
                    <div className="mt-2 flex gap-2">
                      <button type="button" className="text-caption font-black underline" onClick={() => openEdit(generation)}>
                        {isEnglish ? 'Edit' : 'Editar'}
                      </button>
                      <button type="button" className="text-caption font-black text-[#9e3b28] underline" onClick={() => void handleDelete(generation.id)}>
                        {isEnglish ? 'Delete' : 'Eliminar'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {filtered.length === 0 && generations.length > 0 && (
            <p className="mt-6 text-small font-extrabold opacity-65">
              {isEnglish ? 'No matching generations.' : 'No se encontraron generaciones coincidentes.'}
            </p>
          )}

          {selected && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setSelected(null)}>
              <div className="w-full max-w-lg rounded-3xl bg-card p-6 text-ink shadow-card" onClick={(event) => event.stopPropagation()}>
                <h2 className="mb-3 font-heading text-[24px]">
                  {isEnglish ? 'Generation' : 'Generación'} {selected.generationNumber} — {selected.title}
                </h2>
                {selected.members.length === 0 ? (
                  <p className="text-small font-extrabold opacity-65">
                    {isEnglish ? 'No members listed.' : 'Sin integrantes registrados.'}
                  </p>
                ) : (
                  <ul className="m-0 grid gap-1 pl-5">
                    {selected.members.map((member) => (
                      <li key={member.id} className="text-small font-bold">{member.name}</li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  className="mt-4 text-caption font-black underline"
                  onClick={() => setSelected(null)}
                >
                  {isEnglish ? 'Close' : 'Cerrar'}
                </button>
              </div>
            </div>
          )}

          {isAdmin && (
            <DialogRoot open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogPortal>
                <DialogViewport>
                  <DialogPopup>
                    <DialogClose />
                    <DialogTitle>
                      {editingId
                        ? isEnglish
                          ? 'Edit generation'
                          : 'Editar generación'
                        : isEnglish
                          ? 'Add generation'
                          : 'Agregar generación'}
                    </DialogTitle>
                    <form className="grid gap-3" onSubmit={handleSubmit}>
                      <FieldLabel>
                        {isEnglish ? 'Generation number' : 'Número de generación'}
                        <TextInput variant="control" value={generationNumber} onChange={(e) => setGenerationNumber(e.target.value)} required />
                      </FieldLabel>
                      <FieldLabel>
                        {isEnglish ? 'Year' : 'Año'}
                        <TextInput variant="control" value={year} onChange={(e) => setYear(e.target.value)} required />
                      </FieldLabel>
                      <FieldLabel>
                        {isEnglish ? 'Title' : 'Título'}
                        <TextInput variant="control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                      </FieldLabel>
                      <FieldLabel>
                        {isEnglish ? 'Description' : 'Descripción'}
                        <TextareaInput variant="control" value={description} onChange={(e) => setDescription(e.target.value)} />
                      </FieldLabel>
                      <FieldLabel>
                        {isEnglish ? 'Photo' : 'Foto'}
                        <input type="file" accept="image/*" onChange={handlePhoto} />
                        {photo && <Image src={photo} alt="preview" width={160} height={100} className="mt-2 rounded-xl object-cover" />}
                      </FieldLabel>
                      <FieldLabel>
                        {isEnglish ? 'Members (one per line or comma separated)' : 'Integrantes (uno por línea o separados por coma)'}
                        <TextareaInput variant="control" value={members} onChange={(e) => setMembers(e.target.value)} />
                      </FieldLabel>
                      <Button type="submit" disabled={saving}>
                        {saving ? (isEnglish ? 'Saving…' : 'Guardando…') : editingId ? (isEnglish ? 'Save' : 'Guardar') : (isEnglish ? 'Add' : 'Agregar')}
                      </Button>
                    </form>
                  </DialogPopup>
                </DialogViewport>
              </DialogPortal>
            </DialogRoot>
          )}
        </Container>
      </section>
    </PageShell>
  )
}
