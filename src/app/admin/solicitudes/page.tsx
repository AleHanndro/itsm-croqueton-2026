'use client'

import { useEffect, useState, type FormEvent } from 'react'

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
import { FieldLabel, TextInput } from '@/components/ui/field'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

type JoinRequest = {
  acceptsCommitment: boolean
  age: number
  createdAt: string
  decidedAt: string | null
  decidedBy: string | null
  email: string
  hasAvailability: boolean
  history?: { decidedAt: string; decidedBy: string | null; status: string }[]
  id: string
  motivation: string
  name: string
  phone: string
  status: 'accepted' | 'pending' | 'rejected'
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  const stored = window.localStorage.getItem(key)
  if (!stored) return fallback
  try {
    return JSON.parse(stored) as T
  } catch {
    return fallback
  }
}

export default function SolicitudesPage() {
  const { language } = useLanguage()
  const { user, isHydrated } = useCommunity()
  const isEnglish = language === 'en'

  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [isHydratedLocal, setIsHydratedLocal] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'pending' | 'rejected'>('all')
  const [viewing, setViewing] = useState<JoinRequest | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ request: JoinRequest; status: JoinRequest['status'] } | null>(null)

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setRequests(readJson<JoinRequest[]>('croqueton-join-requests', []))
    setIsHydratedLocal(true)
  }, [])

  useEffect(() => {
    if (!isHydratedLocal) return
    window.localStorage.setItem('croqueton-join-requests', JSON.stringify(requests))
  }, [requests, isHydratedLocal])

  const filtered = requests.filter((request) => {
    const query = search.trim().toLowerCase()
    if (query && !request.name.toLowerCase().includes(query) && !request.email.toLowerCase().includes(query) && !request.phone.toLowerCase().includes(query)) {
      return false
    }
    if (statusFilter !== 'all' && request.status !== statusFilter) return false
    return true
  })

  const total = requests.length
  const pending = requests.filter((request) => request.status === 'pending').length
  const accepted = requests.filter((request) => request.status === 'accepted').length
  const rejected = requests.filter((request) => request.status === 'rejected').length

  function applyStatus(request: JoinRequest, status: JoinRequest['status']) {
    const now = new Date().toISOString()
    setRequests((current) =>
      current.map((item) => {
        if (item.id !== request.id) return item
        const history = item.history ?? []
        return {
          ...item,
          decidedAt: now,
          decidedBy: user?.email ?? null,
          history: [...history, { decidedAt: now, decidedBy: user?.email ?? null, status }],
          status
        }
      })
    )
    setConfirmAction(null)
    setViewing(null)
  }

  if (!isHydrated || !isHydratedLocal || !user) {
    return (
      <AdminLayout>
        <Container as="section" className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center">
          <p className="m-0 font-extrabold opacity-65">
            {isEnglish ? 'Loading requests…' : 'Cargando solicitudes…'}
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
            <Eyebrow>Solicitudes</Eyebrow>
            <h1 className="mt-1.5 mb-2 text-[clamp(40px,5vw,64px)] leading-[0.9]">
              {isEnglish ? 'Applications' : 'Solicitudes'}
            </h1>
            <p className="m-0 max-w-162.5 text-body-sm font-extrabold text-fg-admin-welcome">
              {isEnglish ? 'Review pack applications.' : 'Revisa las solicitudes de la manada.'}
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-4 gap-3 tablet:grid-cols-2 phone:grid-cols-2">
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">{isEnglish ? 'Total' : 'Total'}</small>
            <strong className="font-heading text-[28px]">{total}</strong>
          </div>
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">{isEnglish ? 'Pending' : 'Pendientes'}</small>
            <strong className="font-heading text-[28px]">{pending}</strong>
          </div>
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">{isEnglish ? 'Accepted' : 'Aceptadas'}</small>
            <strong className="font-heading text-[28px]">{accepted}</strong>
          </div>
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">{isEnglish ? 'Rejected' : 'Rechazadas'}</small>
            <strong className="font-heading text-[28px]">{rejected}</strong>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <TextInput
            variant="control"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={isEnglish ? 'Search by name, email or phone' : 'Buscar por nombre, correo o teléfono'}
          />
          <select
            className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
          >
            <option value="all">{isEnglish ? 'All' : 'Todas'}</option>
            <option value="pending">{isEnglish ? 'Pending' : 'Pendientes'}</option>
            <option value="accepted">{isEnglish ? 'Accepted' : 'Aceptadas'}</option>
            <option value="rejected">{isEnglish ? 'Rejected' : 'Rechazadas'}</option>
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
                      className={
                        request.status === 'accepted'
                          ? 'rounded-pill bg-[#dff3e9] px-2 py-1 text-micro font-black text-[#237d59]'
                          : request.status === 'rejected'
                            ? 'rounded-pill bg-[#ffe2da] px-2 py-1 text-micro font-black text-[#9e3b28]'
                            : 'rounded-pill bg-[#fff1c2] px-2 py-1 text-micro font-black text-[#8b6500]'
                      }
                    >
                      {request.status === 'accepted'
                        ? isEnglish
                          ? 'Accepted'
                          : 'Aceptada'
                        : request.status === 'rejected'
                          ? isEnglish
                            ? 'Rejected'
                            : 'Rechazada'
                          : isEnglish
                            ? 'Pending'
                            : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" className="text-caption font-black underline" onClick={() => setViewing(request)}>
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

        <DialogRoot open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>{isEnglish ? 'Application details' : 'Detalles de la solicitud'}</DialogTitle>
                {viewing && (
                  <div className="grid gap-3 text-small">
                    <p><strong>{isEnglish ? 'Name:' : 'Nombre:'}</strong> {viewing.name}</p>
                    <p><strong>{isEnglish ? 'Age:' : 'Edad:'}</strong> {viewing.age}</p>
                    <p><strong>{isEnglish ? 'Email:' : 'Correo:'}</strong> {viewing.email}</p>
                    <p><strong>{isEnglish ? 'Phone:' : 'Teléfono:'}</strong> {viewing.phone}</p>
                    <p><strong>{isEnglish ? 'Motivation:' : 'Motivación:'}</strong> {viewing.motivation}</p>
                    <p><strong>{isEnglish ? 'Available on event day:' : 'Disponibilidad el día del evento:'}</strong> {viewing.hasAvailability ? (isEnglish ? 'Yes' : 'Sí') : (isEnglish ? 'No' : 'No')}</p>
                    <p><strong>{isEnglish ? 'Team commitment:' : 'Compromiso de equipo:'}</strong> {viewing.acceptsCommitment ? (isEnglish ? 'Yes' : 'Sí') : (isEnglish ? 'No' : 'No')}</p>
                    <p><strong>{isEnglish ? 'Submitted:' : 'Enviada:'}</strong> {new Date(viewing.createdAt).toLocaleString()}</p>
                    <p><strong>{isEnglish ? 'Status:' : 'Estado:'}</strong> {viewing.status}</p>
                    {viewing.decidedBy && (
                      <p><strong>{isEnglish ? 'Resolved by:' : 'Resuelta por:'}</strong> {viewing.decidedBy} {viewing.decidedAt ? `(${new Date(viewing.decidedAt).toLocaleString()})` : ''}</p>
                    )}
                    {viewing.history && viewing.history.length > 0 && (
                      <div>
                        <strong>{isEnglish ? 'History:' : 'Historial:'}</strong>
                        <ul className="m-0 pl-5">
                          {viewing.history.map((item, index) => (
                            <li key={index}>{item.status} - {item.decidedBy ?? '-'} - {new Date(item.decidedAt).toLocaleString()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button type="button" onClick={() => setConfirmAction({ request: viewing, status: 'accepted' })}>
                        {isEnglish ? 'Accept' : 'Aceptar'}
                      </Button>
                      <Button type="button" onClick={() => setConfirmAction({ request: viewing, status: 'rejected' })}>
                        {isEnglish ? 'Reject' : 'Rechazar'}
                      </Button>
                      <Button type="button" onClick={() => setConfirmAction({ request: viewing, status: 'pending' })}>
                        {isEnglish ? 'Set pending' : 'Volver a pendiente'}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>

        <DialogRoot open={Boolean(confirmAction)} onOpenChange={(open) => !open && setConfirmAction(null)}>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>{isEnglish ? 'Confirm action' : 'Confirmar acción'}</DialogTitle>
                {confirmAction && (
                  <div className="grid gap-3">
                    <p className="text-small font-extrabold">
                      {isEnglish
                        ? `Change status to ${confirmAction.status}?`
                        : `¿Cambiar el estado a ${confirmAction.status}?`}
                    </p>
                    <div className="flex gap-2">
                      <Button type="button" onClick={() => applyStatus(confirmAction.request, confirmAction.status)}>
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
