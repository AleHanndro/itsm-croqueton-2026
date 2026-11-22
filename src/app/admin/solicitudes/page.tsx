'use client'

import { useCallback, useEffect, useState } from 'react'

import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import {
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogViewport
} from '@/components/ui/dialog'
import { Eyebrow } from '@/components/ui/eyebrow'
import { TextInput } from '@/components/ui/field'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

type JoinStatus = 'accepted' | 'rejected' | 'waitlisted'

type JoinRequest = {
  acceptsCommitment: boolean
  age: number
  createdAt: string
  decidedAt: string | null
  decidedBy: string | null
  email: string
  emails: { createdAt: string; error: string | null; kind: string; status: string }[]
  hasAvailability: boolean
  id: string
  motivation: string
  name: string
  phone: string
  status: JoinStatus
}

type JoinRequestsResponse = {
  capacity: number
  counts: { accepted: number; rejected: number; total: number; waitlisted: number }
  mailerConfigured: boolean
  requests: JoinRequest[]
}

const STATUS_LABELS: Record<JoinStatus, { en: string; es: string }> = {
  accepted: { en: 'Accepted', es: 'Aceptada' },
  rejected: { en: 'Rejected', es: 'Rechazada' },
  waitlisted: { en: 'Waiting list', es: 'En espera' }
}

const STATUS_STYLES: Record<JoinStatus, string> = {
  accepted: 'bg-[#dff3e9] text-[#237d59]',
  rejected: 'bg-[#ffe2da] text-[#9e3b28]',
  waitlisted: 'bg-[#fff1c2] text-[#8b6500]'
}

const EMAIL_LABELS: Record<string, { en: string; es: string }> = {
  join_accepted: { en: 'Acceptance', es: 'Aceptación' },
  join_waitlisted: { en: 'Spots full', es: 'Cupo lleno' }
}

const EMAIL_STATUS_LABELS: Record<string, { en: string; es: string }> = {
  failed: { en: 'failed', es: 'falló' },
  sent: { en: 'sent', es: 'enviado' },
  skipped: { en: 'not sent (SMTP not configured)', es: 'no enviado (SMTP sin configurar)' }
}

const ERROR_MESSAGES: Record<string, { en: string; es: string }> = {
  already_registered: {
    en: 'This email already has another active application.',
    es: 'Este correo ya tiene otra solicitud activa.'
  },
  capacity_full: {
    en: 'All spots are taken. Free one before accepting someone else.',
    es: 'El cupo está lleno. Libera un lugar antes de aceptar a alguien más.'
  }
}

async function fetchJoinRequests() {
  const response = await fetch('/api/admin/join-requests', { cache: 'no-store' })
  if (!response.ok) throw new Error('request_failed')
  return (await response.json()) as JoinRequestsResponse
}

export default function SolicitudesPage() {
  const { language } = useLanguage()
  const { user, isHydrated } = useCommunity()
  const isEnglish = language === 'en'
  const t = (copy: { en: string; es: string }) => (isEnglish ? copy.en : copy.es)

  const [data, setData] = useState<JoinRequestsResponse | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | JoinStatus>('all')
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    request: JoinRequest
    status: JoinStatus
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  const load = useCallback(() => {
    fetchJoinRequests()
      .then((next) => {
        setData(next)
        setLoadError(false)
      })
      .catch(() => setLoadError(true))
  }, [])

  useEffect(() => {
    if (!isHydrated || !user) return
    load()
  }, [isHydrated, load, user])

  const requests = data?.requests ?? []
  const viewing = requests.find((request) => request.id === viewingId) ?? null

  const filtered = requests.filter((request) => {
    const query = search.trim().toLowerCase()
    if (
      query &&
      !request.name.toLowerCase().includes(query) &&
      !request.email.toLowerCase().includes(query) &&
      !request.phone.toLowerCase().includes(query)
    ) {
      return false
    }
    return statusFilter === 'all' || request.status === statusFilter
  })

  async function applyStatus(request: JoinRequest, status: JoinStatus) {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch(`/api/admin/join-requests/${request.id}`, {
        body: JSON.stringify({ status }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH'
      })
      const body = (await response.json().catch(() => ({}))) as {
        error?: string
        promoted?: { name: string }[]
      }
      if (!response.ok) {
        const known = body.error ? ERROR_MESSAGES[body.error] : undefined
        setMessage({
          text: known
            ? t(known)
            : isEnglish
              ? 'Could not update the application.'
              : 'No se pudo actualizar la solicitud.',
          type: 'error'
        })
        return
      }
      const promoted = body.promoted?.map((row) => row.name).join(', ')
      setMessage({
        text: promoted
          ? isEnglish
            ? `Updated. A spot opened up and ${promoted} was accepted from the waiting list (email sent).`
            : `Actualizada. Se liberó un lugar y ${promoted} pasó de la lista de espera a aceptada (se le envió el correo).`
          : isEnglish
            ? 'Application updated.'
            : 'Solicitud actualizada.',
        type: 'success'
      })
      load()
    } finally {
      setSaving(false)
      setConfirmAction(null)
    }
  }

  if (!isHydrated || !user || (!data && !loadError)) {
    return (
      <AdminLayout>
        <Container
          as="section"
          className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center"
        >
          <p className="m-0 font-extrabold opacity-65">
            {isEnglish ? 'Loading requests…' : 'Cargando solicitudes…'}
          </p>
        </Container>
      </AdminLayout>
    )
  }

  const counts = data?.counts ?? { accepted: 0, rejected: 0, total: 0, waitlisted: 0 }
  const capacity = data?.capacity ?? 35

  return (
    <AdminLayout>
      <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Solicitudes</Eyebrow>
            <h1 className="mt-1.5 mb-2 text-[clamp(40px,5vw,64px)] leading-[0.9]">
              {isEnglish ? 'Applications' : 'Solicitudes'}
            </h1>
            <p className="m-0 max-w-162.5 text-body-sm font-extrabold text-fg-admin-welcome">
              {isEnglish
                ? `Applications are accepted automatically while there are spots (${capacity} max). When someone accepted is rejected or moved to the waiting list, the oldest person waiting takes the spot and gets an email.`
                : `Las solicitudes se aceptan solas mientras haya cupo (${capacity} máximo). Si rechazas o mandas a espera a alguien aceptado, el lugar pasa a quien lleva más tiempo esperando y le llega su correo.`}
            </p>
          </div>
        </div>

        {loadError && (
          <p className="mb-5 rounded-2xl bg-[#ffe2da] p-4 text-small font-black text-[#9e3b28]">
            {isEnglish ? 'Could not load applications.' : 'No se pudieron cargar las solicitudes.'}
          </p>
        )}
        {data && !data.mailerConfigured && (
          <p className="mb-5 rounded-2xl bg-[#fff1c2] p-4 text-small font-black text-[#8b6500]">
            {isEnglish
              ? 'SMTP is not configured (SMTP_HOST), so emails are not being sent.'
              : 'El SMTP no está configurado (SMTP_HOST), así que no se están enviando correos.'}
          </p>
        )}
        {message && (
          <p
            className={`mb-5 rounded-2xl p-4 text-small font-black ${message.type === 'error' ? 'bg-[#ffe2da] text-[#9e3b28]' : 'bg-[#dff3e9] text-[#237d59]'}`}
          >
            {message.text}
          </p>
        )}

        <div className="mb-5 grid grid-cols-4 gap-3 tablet:grid-cols-2 phone:grid-cols-2">
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">Total</small>
            <strong className="font-heading text-[28px]">{counts.total}</strong>
          </div>
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">
              {isEnglish ? 'Accepted' : 'Aceptadas'}
            </small>
            <strong className="font-heading text-[28px]">
              {counts.accepted}/{capacity}
            </strong>
          </div>
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">
              {isEnglish ? 'Waiting list' : 'En espera'}
            </small>
            <strong className="font-heading text-[28px]">{counts.waitlisted}</strong>
          </div>
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">
              {isEnglish ? 'Rejected' : 'Rechazadas'}
            </small>
            <strong className="font-heading text-[28px]">{counts.rejected}</strong>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <TextInput
            variant="control"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              isEnglish ? 'Search by name, email or phone' : 'Buscar por nombre, correo o teléfono'
            }
          />
          <select
            className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
          >
            <option value="all">{isEnglish ? 'All' : 'Todas'}</option>
            <option value="accepted">{t(STATUS_LABELS.accepted)}</option>
            <option value="waitlisted">{t(STATUS_LABELS.waitlisted)}</option>
            <option value="rejected">{t(STATUS_LABELS.rejected)}</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stroke-card-admin bg-surface-panel">
          <table className="min-w-full text-small">
            <thead>
              <tr className="border-b border-stroke-divider text-left">
                <th className="px-4 py-3">{isEnglish ? 'Name' : 'Nombre'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Age' : 'Edad'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Email' : 'Correo'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Phone' : 'Teléfono'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Date' : 'Fecha de solicitud'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Status' : 'Estado'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Actions' : 'Acciones'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((request) => (
                <tr key={request.id} className="border-b border-stroke-divider last:border-0">
                  <td className="px-4 py-3 font-black">{request.name}</td>
                  <td className="px-4 py-3">{request.age}</td>
                  <td className="px-4 py-3">{request.email}</td>
                  <td className="px-4 py-3">{request.phone}</td>
                  <td className="px-4 py-3">{new Date(request.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-pill px-2 py-1 text-micro font-black ${STATUS_STYLES[request.status]}`}
                    >
                      {t(STATUS_LABELS[request.status])}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-caption font-black underline"
                      onClick={() => setViewingId(request.id)}
                    >
                      {isEnglish ? 'View' : 'Ver'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-4 text-small font-extrabold opacity-65">
              {isEnglish ? 'No requests found.' : 'No se encontraron solicitudes.'}
            </p>
          )}
        </div>

        <DialogRoot open={Boolean(viewing)} onOpenChange={(open) => !open && setViewingId(null)}>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>
                  {isEnglish ? 'Application details' : 'Detalles de la solicitud'}
                </DialogTitle>
                {viewing && (
                  <div className="grid gap-3 text-small">
                    <p>
                      <strong>{isEnglish ? 'Name:' : 'Nombre:'}</strong> {viewing.name}
                    </p>
                    <p>
                      <strong>{isEnglish ? 'Age:' : 'Edad:'}</strong> {viewing.age}
                    </p>
                    <p>
                      <strong>{isEnglish ? 'Email:' : 'Correo:'}</strong> {viewing.email}
                    </p>
                    <p>
                      <strong>{isEnglish ? 'Phone:' : 'Teléfono:'}</strong> {viewing.phone}
                    </p>
                    <p>
                      <strong>{isEnglish ? 'Motivation:' : 'Motivación:'}</strong>{' '}
                      {viewing.motivation}
                    </p>
                    <p>
                      <strong>{isEnglish ? 'Submitted:' : 'Enviada:'}</strong>{' '}
                      {new Date(viewing.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>{isEnglish ? 'Status:' : 'Estado:'}</strong>{' '}
                      {t(STATUS_LABELS[viewing.status])}
                      {viewing.decidedAt
                        ? ` · ${viewing.decidedBy ?? (isEnglish ? 'automatic' : 'automático')} (${new Date(viewing.decidedAt).toLocaleString()})`
                        : ''}
                    </p>
                    <div>
                      <strong>{isEnglish ? 'Emails:' : 'Correos:'}</strong>
                      {viewing.emails.length ? (
                        <ul className="m-0 pl-5">
                          {viewing.emails.map((email, index) => (
                            <li key={index}>
                              {t(EMAIL_LABELS[email.kind] ?? { en: email.kind, es: email.kind })} —{' '}
                              {t(
                                EMAIL_STATUS_LABELS[email.status] ?? {
                                  en: email.status,
                                  es: email.status
                                }
                              )}{' '}
                              ({new Date(email.createdAt).toLocaleString()})
                              {email.error && email.status === 'failed' ? `: ${email.error}` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span> —</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {viewing.status !== 'accepted' && (
                        <Button
                          type="button"
                          onClick={() => setConfirmAction({ request: viewing, status: 'accepted' })}
                        >
                          {isEnglish ? 'Accept' : 'Aceptar'}
                        </Button>
                      )}
                      {viewing.status !== 'waitlisted' && (
                        <Button
                          type="button"
                          onClick={() =>
                            setConfirmAction({ request: viewing, status: 'waitlisted' })
                          }
                        >
                          {isEnglish ? 'Move to waiting list' : 'Mover a lista de espera'}
                        </Button>
                      )}
                      {viewing.status !== 'rejected' && (
                        <Button
                          type="button"
                          onClick={() => setConfirmAction({ request: viewing, status: 'rejected' })}
                        >
                          {isEnglish ? 'Reject' : 'Rechazar'}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>

        <DialogRoot
          open={Boolean(confirmAction)}
          onOpenChange={(open) => !open && setConfirmAction(null)}
        >
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>{isEnglish ? 'Confirm action' : 'Confirmar acción'}</DialogTitle>
                {confirmAction && (
                  <div className="grid gap-3">
                    <p className="text-small font-extrabold">
                      {isEnglish
                        ? `Change ${confirmAction.request.name}'s status to "${STATUS_LABELS[confirmAction.status].en}"?`
                        : `¿Cambiar el estado de ${confirmAction.request.name} a "${STATUS_LABELS[confirmAction.status].es}"?`}
                      {confirmAction.status === 'accepted' &&
                        (isEnglish
                          ? ' They will receive the acceptance email.'
                          : ' Recibirá el correo de aceptación.')}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        disabled={saving}
                        onClick={() => applyStatus(confirmAction.request, confirmAction.status)}
                      >
                        {isEnglish ? 'Confirm' : 'Confirmar'}
                      </Button>
                      <Button type="button" onClick={() => setConfirmAction(null)}>
                        {isEnglish ? 'Cancel' : 'Cancelar'}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>
      </Container>
    </AdminLayout>
  )
}
