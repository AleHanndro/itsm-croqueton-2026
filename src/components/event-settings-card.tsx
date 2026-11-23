'use client'

import { useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { FieldLabel, TextareaInput, TextInput } from '@/components/ui/field'

type EventFields = { date: string; details: string; location: string; time: string }

type EventSettingsResponse = {
  fallback: EventFields
  settings: EventFields
  updatedAt: string | null
  updatedBy: string | null
}

const EMPTY: EventFields = { date: '', details: '', location: '', time: '' }

async function fetchEventSettings() {
  const response = await fetch('/api/admin/event-settings', { cache: 'no-store' })
  if (!response.ok) throw new Error('request_failed')
  return (await response.json()) as EventSettingsResponse
}

/** Fecha, hora y lugar del evento que se envían en el correo de aceptación. */
export function EventSettingsCard({ isEnglish }: { isEnglish: boolean }) {
  const [form, setForm] = useState<EventFields>(EMPTY)
  const [meta, setMeta] = useState<EventSettingsResponse | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  useEffect(() => {
    fetchEventSettings()
      .then((data) => {
        setMeta(data)
        setForm(data.settings)
      })
      .catch(() =>
        setMessage({
          text: isEnglish
            ? 'Could not load the event details.'
            : 'No se pudieron cargar los datos del evento.',
          type: 'error'
        })
      )
  }, [isEnglish])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/event-settings', {
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT'
      })
      if (!response.ok) throw new Error('request_failed')
      const data = (await response.json()) as EventSettingsResponse
      setMeta(data)
      setForm(data.settings)
      setMessage({
        text: isEnglish
          ? 'Saved. New acceptance emails will include these details.'
          : 'Guardado. Los próximos correos de aceptación llevarán estos datos.',
        type: 'success'
      })
    } catch {
      setMessage({
        text: isEnglish ? 'Could not save the event details.' : 'No se pudieron guardar los datos.',
        type: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  const placeholder = (key: keyof EventFields) => meta?.fallback[key] || ''

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid gap-4 rounded-2xl border border-stroke-card-admin bg-surface-panel p-5"
    >
      <div>
        <Eyebrow variant="section" tone="accent">
          {isEnglish ? 'Acceptance email' : 'Correo de aceptación'}
        </Eyebrow>
        <h2 className="mt-1 mb-1 text-[24px] leading-none">
          {isEnglish ? 'Event details' : 'Datos del evento'}
        </h2>
        <p className="m-0 text-small font-extrabold opacity-70">
          {isEnglish
            ? 'Accepted volunteers receive this information by email. Empty fields show "Por confirmar".'
            : 'Las personas aceptadas reciben esta información por correo. Lo que dejes vacío aparece como "Por confirmar".'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 tablet:grid-cols-1">
        <FieldLabel>
          {isEnglish ? 'Date' : 'Fecha'}
          <TextInput
            variant="control"
            value={form.date}
            maxLength={120}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
            placeholder={placeholder('date') || 'Sábado 12 de diciembre de 2026'}
          />
        </FieldLabel>
        <FieldLabel>
          {isEnglish ? 'Time' : 'Hora'}
          <TextInput
            variant="control"
            value={form.time}
            maxLength={120}
            onChange={(event) => setForm({ ...form, time: event.target.value })}
            placeholder={placeholder('time') || '8:00 a 14:00 h'}
          />
        </FieldLabel>
        <FieldLabel>
          {isEnglish ? 'Place' : 'Lugar'}
          <TextInput
            variant="control"
            value={form.location}
            maxLength={200}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
            placeholder={placeholder('location') || 'Explanada del ITS Motul'}
          />
        </FieldLabel>
      </div>
      <FieldLabel>
        {isEnglish ? 'Instructions (optional)' : 'Indicaciones (opcional)'}
        <TextareaInput
          variant="control"
          value={form.details}
          maxLength={600}
          onChange={(event) => setForm({ ...form, details: event.target.value })}
          placeholder={
            placeholder('details') ||
            (isEnglish
              ? 'What to bring, meeting point…'
              : 'Qué llevar, punto de reunión, a quién buscar…')
          }
        />
      </FieldLabel>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={saving || !meta}>
          {saving
            ? isEnglish
              ? 'Saving…'
              : 'Guardando…'
            : isEnglish
              ? 'Save event details'
              : 'Guardar datos del evento'}
        </Button>
        {meta?.updatedAt && meta.updatedBy && (
          <small className="text-caption font-extrabold opacity-60">
            {isEnglish ? 'Last edited by' : 'Última edición:'} {meta.updatedBy} ·{' '}
            {new Date(meta.updatedAt).toLocaleString()}
          </small>
        )}
      </div>
      {message && (
        <p
          className={`m-0 rounded-xl p-3 text-small font-black ${message.type === 'error' ? 'bg-[#ffe2da] text-[#9e3b28]' : 'bg-[#dff3e9] text-[#237d59]'}`}
        >
          {message.text}
        </p>
      )}
    </form>
  )
}
