'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

import Image from 'next/image'

import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import {
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogViewport
} from '@/components/ui/dialog'
import { FieldLabel, TextInput, TextareaInput } from '@/components/ui/field'
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

export default function CroquetonesAdminPage() {
  const { language } = useLanguage()
  const { user, isHydrated } = useCommunity()
  const isEnglish = language === 'en'

  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [year, setYear] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState<string>()
  const [members, setMembers] = useState('')
  const [generationNumber, setGenerationNumber] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
  const [saving, setSaving] = useState(false)

  async function loadGenerations() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/croquetones')
      if (!response.ok) throw new Error('request_failed')
      const data = (await response.json()) as { croquetones: Generation[] }
      setGenerations(data.croquetones)
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not load generations.' : 'No se pudieron cargar las generaciones.' })
    } finally {
      setLoading(false)
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadGenerations()
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

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

  if (!isHydrated || !user) {
    return (
      <AdminLayout>
        <Container as="section" className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center">
          <p className="m-0 font-extrabold opacity-65">
            {isEnglish ? 'Loading…' : 'Cargando…'}
          </p>
        </Container>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Croquetones</Eyebrow>
            <h1 className="mt-1.5 mb-2 text-[clamp(40px,5vw,64px)] leading-[0.9]">
              {isEnglish ? 'Croquetones' : 'Croquetones'}
            </h1>
            <p className="m-0 max-w-162.5 text-body-sm font-extrabold text-fg-admin-welcome">
              {isEnglish ? 'Manage pack generations and their members.' : 'Gestiona las generaciones de la manada y sus integrantes.'}
            </p>
          </div>
          <Button type="button" onClick={openCreate}>
            {isEnglish ? '+ Add generation' : '+ Agregar generación'}
          </Button>
        </div>

        {message && (
          <p className={message.type === 'error' ? 'mb-4 text-small font-extrabold text-[#9e3b28]' : 'mb-4 text-small font-extrabold text-[#2f6b45]'}>
            {message.text}
          </p>
        )}

        {loading ? (
          <p className="text-small font-extrabold opacity-65">{isEnglish ? 'Loading…' : 'Cargando…'}</p>
        ) : (
          <div className="grid gap-4">
            {generations.length === 0 && (
              <p className="text-small font-extrabold opacity-65">
                {isEnglish ? 'No generations yet.' : 'Aún no hay generaciones.'}
              </p>
            )}
            {generations.map((generation) => (
              <div key={generation.id} className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <strong className="block font-heading text-[22px]">
                      {isEnglish ? 'Generation' : 'Generación'} {generation.generationNumber} — {generation.year}
                    </strong>
                    <span className="block text-small font-extrabold opacity-65">{generation.title}</span>
                    <span className="block text-caption font-extrabold opacity-60">
                      {generation.members.length} {isEnglish ? 'members' : 'integrantes'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="text-caption font-black underline" onClick={() => openEdit(generation)}>
                      {isEnglish ? 'Edit' : 'Editar'}
                    </button>
                    <button type="button" className="text-caption font-black text-[#9e3b28] underline" onClick={() => void handleDelete(generation.id)}>
                      {isEnglish ? 'Delete' : 'Eliminar'}
                    </button>
                  </div>
                </div>
                {generation.groupPhoto && (
                  <Image
                    src={generation.groupPhoto}
                    alt={generation.title}
                    width={160}
                    height={100}
                    className="mt-3 rounded-xl object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

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
      </Container>
    </AdminLayout>
  )
}
