'use client'

import { useEffect, useState } from 'react'

import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { FieldLabel, TextInput } from '@/components/ui/field'
import { useLanguage } from '@/providers/language-provider'

interface AuditEvent {
  action: string
  adminName: string
  adminUsername: string
  affectedUserName: string | null
  createdAt: string
  description: string
  id: string
  ip: string | null
  metadata: Record<string, unknown>
}

export default function BitacoraPage() {
  const { language } = useLanguage()
  const isEnglish = language === 'en'
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(15)
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [detail, setDetail] = useState<AuditEvent | null>(null)

  async function loadEvents() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        action,
        from,
        page: String(page),
        pageSize: String(pageSize),
        search,
        to
      })
      const response = await fetch(`/api/admin/audit?${params.toString()}`)
      if (response.status === 403) {
        setAllowed(false)
        return
      }
      if (!response.ok) throw new Error('request_failed')
      const data = (await response.json()) as {
        events: AuditEvent[]
        total: number
      }
      setEvents(data.events)
      setTotal(data.total)
      setAllowed(true)
    } catch {
      setError(isEnglish ? 'Could not load audit log.' : 'No se pudo cargar la bitácora.')
    } finally {
      setLoading(false)
    }
  }

    /* eslint-disable-next-line react-hooks/set-state-in-effect */
  useEffect(() => {
    void fetch('/api/auth/session')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        setAllowed(data?.user?.role === 'superadmin')
      })
      .catch(() => setAllowed(false))
  }, [])

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (allowed === false) {
      setLoading(false)
      return
    }
    if (allowed === true) void loadEvents()
  }, [allowed, page, search, action, from, to])
  /* eslint-enable react-hooks/set-state-in-effect */

  if (allowed === false) {
    return (
      <AdminLayout>
        <Container as="section" className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center">
          <p className="m-0 font-extrabold opacity-65">
            {isEnglish ? 'Access restricted.' : 'Acceso restringido.'}
          </p>
        </Container>
      </AdminLayout>
    )
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <AdminLayout>
      <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
        <div className="mb-6">
          <Eyebrow>Bitácora</Eyebrow>
          <h1 className="mt-1.5 mb-2 text-[clamp(40px,5vw,64px)] leading-[0.9]">
            {isEnglish ? 'Audit log' : 'Bitácora'}
          </h1>
          <p className="m-0 max-w-162.5 text-body-sm font-extrabold text-fg-admin-welcome">
            {isEnglish
              ? 'Read-only record of administrative activity.'
              : 'Registro de solo lectura de la actividad administrativa.'}
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <TextInput
            variant="control"
            value={search}
            onChange={(event) => {
              setPage(1)
              setSearch(event.target.value)
            }}
            placeholder={isEnglish ? 'Search by administrator or description' : 'Buscar por administrador o descripción'}
          />
          <TextInput
            variant="control"
            value={action}
            onChange={(event) => {
              setPage(1)
              setAction(event.target.value)
            }}
            placeholder={isEnglish ? 'Filter by action (e.g. user.block)' : 'Filtrar por acción (ej. user.block)'}
          />
          <input
            type="date"
            className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
            value={from}
            onChange={(event) => {
              setPage(1)
              setFrom(event.target.value)
            }}
          />
          <input
            type="date"
            className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
            value={to}
            onChange={(event) => {
              setPage(1)
              setTo(event.target.value)
            }}
          />
        </div>

        {error && <p className="mb-4 text-small font-extrabold text-[#9e3b28]">{error}</p>}

        <div className="overflow-x-auto rounded-2xl border border-stroke-card-admin bg-surface-panel">
          <table className="min-w-full text-small">
            <thead>
              <tr className="border-b border-stroke-divider text-left">
                <th className="px-4 py-3">{isEnglish ? 'Date & time' : 'Fecha y hora'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Administrator' : 'Administrador'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Action' : 'Acción'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Description' : 'Descripción'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Affected user' : 'Usuario afectado'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Details' : 'Detalles'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6" colSpan={6}>
                    {isEnglish ? 'Loading…' : 'Cargando…'}
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td className="px-4 py-6" colSpan={6}>
                    {isEnglish ? 'No records found.' : 'No se encontraron registros.'}
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-b border-stroke-divider last:border-0">
                    <td className="px-4 py-3">
                      {new Intl.DateTimeFormat(isEnglish ? 'en' : 'es', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      }).format(new Date(event.createdAt))}
                    </td>
                    <td className="px-4 py-3">
                      <strong className="block font-black">{event.adminName}</strong>
                      <small className="block opacity-60">@{event.adminUsername}</small>
                    </td>
                    <td className="px-4 py-3 font-black">{event.action}</td>
                    <td className="px-4 py-3">{event.description}</td>
                    <td className="px-4 py-3">{event.affectedUserName ?? '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-caption font-black underline"
                        onClick={() => setDetail(event)}
                      >
                        {isEnglish ? 'View' : 'Consultar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="underline"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            {isEnglish ? 'Previous' : 'Anterior'}
          </Button>
          <span className="text-small font-black">
            {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="underline"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            {isEnglish ? 'Next' : 'Siguiente'}
          </Button>
        </div>

        {detail && (
          <div className="mt-6 rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="m-0 text-[20px] font-black">{isEnglish ? 'Details' : 'Detalles'}</h2>
              <button
                type="button"
                className="text-caption font-black underline"
                onClick={() => setDetail(null)}
              >
                {isEnglish ? 'Close' : 'Cerrar'}
              </button>
            </div>
            <dl className="grid gap-2 text-small">
              <div>
                <dt className="font-black">{isEnglish ? 'Date & time' : 'Fecha y hora'}</dt>
                <dd className="m-0">
                  {new Intl.DateTimeFormat(isEnglish ? 'en' : 'es', {
                    dateStyle: 'full',
                    timeStyle: 'medium'
                  }).format(new Date(detail.createdAt))}
                </dd>
              </div>
              <div>
                <dt className="font-black">{isEnglish ? 'Administrator' : 'Administrador'}</dt>
                <dd className="m-0">
                  {detail.adminName} (@{detail.adminUsername})
                </dd>
              </div>
              <div>
                <dt className="font-black">{isEnglish ? 'IP' : 'Dirección IP'}</dt>
                <dd className="m-0">{detail.ip ?? '—'}</dd>
              </div>
              <div>
                <dt className="font-black">{isEnglish ? 'Metadata' : 'Información adicional'}</dt>
                <dd className="m-0 whitespace-pre-wrap font-mono text-caption">
                  {JSON.stringify(detail.metadata ?? {}, null, 2)}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Container>
    </AdminLayout>
  )
}
