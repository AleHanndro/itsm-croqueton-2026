'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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
import { UserAvatar } from '@/components/user-visuals'
import { useLanguage } from '@/providers/language-provider'

interface AdminUserBlock {
  endsAt: string
  id: string
  notes: string
  reason: string
  startsAt: string
  status: 'active' | 'expired' | 'unlocked'
}

interface AdminUser {
  avatarConfig: Record<string, unknown>
  avatarImage?: string
  block: AdminUserBlock | null
  createdAt: string
  email: string
  id: string
  name: string
  postCount: number
  status: 'active' | 'blocked' | 'blocked_expired' | 'inactive'
  username: string
}

interface AdminPost {
  author: string
  authorEmail?: string
  body: string
  comments: { author: string; body: string; id: string }[]
  createdAt: string
  id: string
  image?: string
  likedBy: string[]
}

const STATUS_LABELS: Record<AdminUser['status'], { en: string; es: string }> = {
  active: { en: 'Active', es: 'Activa' },
  blocked: { en: 'Temporarily blocked', es: 'Bloqueada temporalmente' },
  blocked_expired: { en: 'Expired block pending review', es: 'Bloqueo vencido pendiente de revisión' },
  inactive: { en: 'Inactive', es: 'Inactiva' }
}

export default function UsuariosPage() {
  const { language } = useLanguage()
  const isEnglish = language === 'en'
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | AdminUser['status']>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canBlock, setCanBlock] = useState(false)
  const [canUnlock, setCanUnlock] = useState(false)
  const [blockTarget, setBlockTarget] = useState<AdminUser | null>(null)
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [postsTarget, setPostsTarget] = useState<AdminUser | null>(null)
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [postsLoading, setPostsLoading] = useState(false)

  async function loadUsers() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
        status: statusFilter
      })
      const response = await fetch(`/api/admin/users?${params.toString()}`)
      if (!response.ok) throw new Error('request_failed')
      const data = (await response.json()) as {
        page: number
        pageSize: number
        total: number
        users: AdminUser[]
      }
      setUsers(data.users)
      setTotal(data.total)
    } catch {
      setError(isEnglish ? 'Could not load users.' : 'No se pudieron cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }

    /* eslint-disable-next-line react-hooks/set-state-in-effect */
  useEffect(() => {
    void fetch('/api/auth/session')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const permissions = data?.user?.permissions ?? {}
        setCanBlock(Boolean(permissions['users.block']))
        setCanUnlock(Boolean(permissions['users.unlock']))
      })
      .catch(() => {})
  }, [])

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadUsers()
  }, [page, search, statusFilter])
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleBlock() {
    if (!blockTarget || !reason.trim()) return
    setSubmitting(true)
    try {
      const response = await fetch(`/api/admin/users/${blockTarget.id}/block`, {
        body: JSON.stringify({ notes, reason }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      })
      if (!response.ok) throw new Error('block_failed')
      setBlockTarget(null)
      setReason('')
      setNotes('')
      await loadUsers()
    } catch {
      setError(isEnglish ? 'Could not block the account.' : 'No se pudo bloquear la cuenta.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUnlock(user: AdminUser) {
    if (!window.confirm(isEnglish ? 'Unlock this account?' : '¿Desbloquear esta cuenta?')) return
    try {
      const response = await fetch(`/api/admin/users/${user.id}/unblock`, { method: 'POST' })
      if (!response.ok) throw new Error('unlock_failed')
      await loadUsers()
    } catch {
      setError(isEnglish ? 'Could not unlock the account.' : 'No se pudo desbloquear la cuenta.')
    }
  }

  async function openPosts(user: AdminUser) {
    setPostsTarget(user)
    setPostsLoading(true)
    setPosts([])
    try {
      const response = await fetch(`/api/admin/users/${user.id}/posts`)
      if (!response.ok) throw new Error('posts_failed')
      const data = (await response.json()) as { posts: AdminPost[] }
      setPosts(data.posts)
    } catch {
      setPosts([])
    } finally {
      setPostsLoading(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <AdminLayout>
      <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Usuarios</Eyebrow>
            <h1 className="mt-1.5 mb-2 text-[clamp(40px,5vw,64px)] leading-[0.9]">
              {isEnglish ? 'Users' : 'Usuarios'}
            </h1>
            <p className="m-0 max-w-162.5 text-body-sm font-extrabold text-fg-admin-welcome">
              {isEnglish
                ? 'Review and manage registered accounts.'
                : 'Consulta y administra las cuentas registradas.'}
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <TextInput
            variant="control"
            value={search}
            onChange={(event) => {
              setPage(1)
              setSearch(event.target.value)
            }}
            placeholder={isEnglish ? 'Search by name, username or email' : 'Buscar por nombre, usuario o correo'}
          />
          <select
            className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
            value={statusFilter}
            onChange={(event) => {
              setPage(1)
              setStatusFilter(event.target.value as 'all' | AdminUser['status'])
            }}
          >
            <option value="all">{isEnglish ? 'All statuses' : 'Todos los estados'}</option>
            <option value="active">{isEnglish ? 'Active' : 'Activas'}</option>
            <option value="blocked">{isEnglish ? 'Temporarily blocked' : 'Bloqueadas temporalmente'}</option>
            <option value="blocked_expired">
              {isEnglish ? 'Expired block pending review' : 'Bloqueo vencido pendiente de revisión'}
            </option>
            <option value="inactive">{isEnglish ? 'Inactive' : 'Inactivas'}</option>
          </select>
        </div>

        {error && <p className="mb-4 text-small font-extrabold text-[#9e3b28]">{error}</p>}

        <div className="overflow-x-auto rounded-2xl border border-stroke-card-admin bg-surface-panel">
          <table className="min-w-full text-small">
            <thead>
              <tr className="border-b border-stroke-divider text-left">
                <th className="px-4 py-3">{isEnglish ? 'Avatar' : 'Avatar'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Name' : 'Nombre'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Username' : 'Usuario'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Email' : 'Correo'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Registered' : 'Registro'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Posts' : 'Publicaciones'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Status' : 'Estado'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Actions' : 'Acciones'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6" colSpan={8}>
                    {isEnglish ? 'Loading…' : 'Cargando…'}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-4 py-6" colSpan={8}>
                    {isEnglish ? 'No users found.' : 'No se encontraron usuarios.'}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-stroke-divider last:border-0">
                    <td className="px-4 py-3">
                      <UserAvatar
                        user={
                          {
                            avatarConfig: user.avatarConfig as never,
                            avatarImage: user.avatarImage,
                            name: user.name,
                            petName: '',
                            username: user.username
                          } as never
                        }
                        className="size-10"
                      />
                    </td>
                    <td className="px-4 py-3 font-black">{user.name}</td>
                    <td className="px-4 py-3">@{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      {new Intl.DateTimeFormat(isEnglish ? 'en' : 'es', {
                        dateStyle: 'medium'
                      }).format(new Date(user.createdAt))}
                    </td>
                    <td className="px-4 py-3">{user.postCount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          user.status === 'active'
                            ? 'font-black text-[#2f6b45]'
                            : user.status === 'blocked'
                              ? 'font-black text-[#9e3b28]'
                              : 'font-black text-[#7a7e89]'
                        }
                      >
                        {STATUS_LABELS[user.status][isEnglish ? 'en' : 'es']}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          className="text-caption font-black underline"
                          href={`/usuarios/${user.username}`}
                          target="_blank"
                        >
                          {isEnglish ? 'Profile' : 'Perfil'}
                        </Link>
                        <button
                          type="button"
                          className="text-caption font-black underline"
                          onClick={() => void openPosts(user)}
                        >
                          {isEnglish ? 'Posts' : 'Publicaciones'}
                        </button>
                        {user.status === 'blocked_expired' && canUnlock && (
                          <button
                            type="button"
                            className="text-caption font-black text-[#2f6b45] underline"
                            onClick={() => void handleUnlock(user)}
                          >
                            {isEnglish ? 'Unlock account' : 'Desbloquear cuenta'}
                          </button>
                        )}
                        {user.status === 'blocked' && canUnlock && (
                          <button
                            type="button"
                            className="text-caption font-black text-[#2f6b45] underline"
                            onClick={() => void handleUnlock(user)}
                          >
                            {isEnglish ? 'Unlock account' : 'Desbloquear cuenta'}
                          </button>
                        )}
                        {user.status === 'active' && canBlock && (
                          <button
                            type="button"
                            className="text-caption font-black text-[#9e3b28] underline"
                            onClick={() => {
                              setBlockTarget(user)
                              setReason('')
                              setNotes('')
                            }}
                          >
                            {isEnglish ? 'Block for 15 days' : 'Bloquear cuenta por 15 días'}
                          </button>
                        )}
                      </div>
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

        <DialogRoot open={Boolean(blockTarget)} onOpenChange={(open) => !open && setBlockTarget(null)}>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>
                  {isEnglish ? 'Block account for 15 days' : 'Bloquear cuenta por 15 días'}
                </DialogTitle>
                {blockTarget && (
                  <div className="grid gap-3">
                    <p className="m-0 text-small font-extrabold">
                      {isEnglish ? 'User:' : 'Usuario:'} {blockTarget.name} (@{blockTarget.username})
                    </p>
                    <FieldLabel>
                      {isEnglish ? 'Reason' : 'Motivo del bloqueo'}
                      <TextInput
                        variant="control"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        required
                      />
                    </FieldLabel>
                    <FieldLabel>
                      {isEnglish ? 'Notes' : 'Descripción u observaciones'}
                      <TextareaInput
                        variant="control"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                      />
                    </FieldLabel>
                    <p className="m-0 text-small font-extrabold opacity-65">
                      {isEnglish
                        ? 'Starts now and ends in 15 natural days.'
                        : 'Inicia ahora y termina en 15 días naturales.'}
                    </p>
                    <Button type="button" onClick={() => void handleBlock()} disabled={submitting || !reason.trim()}>
                      {submitting
                        ? isEnglish
                          ? 'Saving…'
                          : 'Guardando…'
                        : isEnglish
                          ? 'Confirm block'
                          : 'Confirmar bloqueo'}
                    </Button>
                  </div>
                )}
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>

        <DialogRoot open={Boolean(postsTarget)} onOpenChange={(open) => !open && setPostsTarget(null)}>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>
                  {isEnglish ? 'User posts' : 'Publicaciones del usuario'}
                </DialogTitle>
                {postsTarget && (
                  <div className="grid gap-3">
                    <p className="m-0 text-small font-extrabold">
                      {postsTarget.name} (@{postsTarget.username})
                    </p>
                    {postsLoading ? (
                      <p className="m-0 text-small font-extrabold opacity-65">
                        {isEnglish ? 'Loading…' : 'Cargando…'}
                      </p>
                    ) : posts.length === 0 ? (
                      <p className="m-0 text-small font-extrabold opacity-65">
                        {isEnglish ? 'No posts found.' : 'No se encontraron publicaciones.'}
                      </p>
                    ) : (
                      <div className="grid gap-3">
                        {posts.map((post) => (
                          <article
                            key={post.id}
                            className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-3"
                          >
                            <p className="m-0 whitespace-pre-wrap text-small font-bold">{post.body || (isEnglish ? 'Image post' : 'Publicación con imagen')}</p>
                            <small className="mt-2 block text-caption font-extrabold opacity-60">
                              {new Intl.DateTimeFormat(isEnglish ? 'en' : 'es', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              }).format(new Date(post.createdAt))}
                            </small>
                          </article>
                        ))}
                      </div>
                    )}
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
