'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

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
import { UserAvatar } from '@/components/user-visuals'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

type AdminUser = {
  avatarImage?: string
  avatarConfig?: Record<string, unknown>
  createdAt: string
  email: string
  id: string
  isActive: boolean
  name: string
  permissions?: Record<string, boolean>
  role: 'admin' | 'superadmin' | 'user'
  username: string
}

const emptyForm = {
  avatarImage: undefined as string | null | undefined,
  email: '',
  isActive: true,
  name: '',
  password: '',
  role: 'admin' as 'admin' | 'superadmin',
  username: ''
}

export default function AdministradoresPage() {
  const { language } = useLanguage()
  const { user, isHydrated } = useCommunity()
  const isEnglish = language === 'en'

  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
  const [saving, setSaving] = useState(false)

  async function loadAdmins() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/admins')
      if (!response.ok) throw new Error('request_failed')
      const data = (await response.json()) as { admins: AdminUser[] }
      setAdmins(data.admins)
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not load administrators.' : 'No se pudieron cargar los administradores.' })
    } finally {
      setLoading(false)
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadAdmins()
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const filteredAdmins = admins.filter((profile) => {
    const query = search.trim().toLowerCase()
    if (query && !profile.name.toLowerCase().includes(query) &&
        !profile.username.toLowerCase().includes(query) &&
        !profile.email.toLowerCase().includes(query)) {
      return false
    }
    if (statusFilter === 'active' && profile.isActive === false) return false
    if (statusFilter === 'inactive' && profile.isActive !== false) return false
    return true
  })

  function openCreate() {
    setForm(emptyForm)
    setMessage(null)
    setIsCreateOpen(true)
  }

  function openEdit(profile: AdminUser) {
    setEditingId(profile.id)
    setForm({
      avatarImage: profile.avatarImage,
      email: profile.email,
      isActive: profile.isActive,
      name: profile.name,
      password: '',
      role: profile.role === 'superadmin' ? 'superadmin' : 'admin',
      username: profile.username
    })
    setMessage(null)
    setIsEditOpen(true)
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    if (!/^[a-z0-9._]{3,24}$/.test(form.username.trim().toLowerCase())) {
      setMessage({ type: 'error', text: isEnglish ? 'Username must have 3 to 24 characters: lowercase letters, numbers, dots or underscores.' : 'El nombre de usuario debe tener de 3 a 24 caracteres: minúsculas, números, puntos o guiones bajos.' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setMessage({ type: 'error', text: isEnglish ? 'Enter a valid email address.' : 'Introduce un correo electrónico válido.' })
      return
    }
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[^A-Za-z]/.test(form.password)) {
      setMessage({ type: 'error', text: isEnglish ? 'Password must have at least 8 characters, one uppercase, one lowercase and one number or symbol.' : 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número o símbolo.' })
      return
    }

    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/admins', {
        body: JSON.stringify({
          avatarImage: form.avatarImage,
          email: form.email,
          isActive: form.isActive,
          name: form.name,
          password: form.password,
          role: form.role,
          username: form.username
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || 'request_failed')
      }
      setIsCreateOpen(false)
      setForm(emptyForm)
      setMessage({ type: 'success', text: isEnglish ? 'Administrator created.' : 'Administrador creado.' })
      await loadAdmins()
    } catch (error) {
      const detail = error instanceof Error ? error.message : ''
      setMessage({ type: 'error', text: isEnglish ? `Could not create administrator. ${detail}` : `No se pudo crear el administrador. ${detail}` })
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingId) return
    if (saving) return
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch(`/api/admin/admins/${editingId}`, {
        body: JSON.stringify({
          avatarImage: form.avatarImage,
          email: form.email,
          isActive: form.isActive,
          name: form.name,
          role: form.role,
          username: form.username
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH'
      })
      if (!response.ok) throw new Error('request_failed')
      setIsEditOpen(false)
      setEditingId(null)
      setMessage({ type: 'success', text: isEnglish ? 'Administrator updated.' : 'Administrador actualizado.' })
      await loadAdmins()
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not update administrator.' : 'No se pudo actualizar el administrador.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleSetActive(id: string, active: boolean) {
    try {
      const response = await fetch(`/api/admin/admins/${id}`, {
        body: JSON.stringify({ isActive: active }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH'
      })
      if (!response.ok) throw new Error('request_failed')
      await loadAdmins()
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not update status.' : 'No se pudo actualizar el estado.' })
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(isEnglish ? 'Delete this administrator?' : '¿Eliminar este administrador?')) return
    try {
      const response = await fetch(`/api/admin/admins/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('request_failed')
      setMessage({ type: 'success', text: isEnglish ? 'Administrator deleted.' : 'Administrador eliminado.' })
      await loadAdmins()
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not delete administrator.' : 'No se pudo eliminar el administrador.' })
    }
  }

  function handleAvatarFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        setForm((current) => ({ ...current, avatarImage: reader.result as string }))
      }
    })
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  if (!isHydrated || !user) {
    return (
      <AdminLayout>
        <Container as="section" className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center">
          <p className="m-0 font-extrabold opacity-65">
            {isEnglish ? 'Checking your session…' : 'Verificando tu sesión…'}
          </p>
        </Container>
      </AdminLayout>
    )
  }

  if (user.role !== 'superadmin') {
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

  return (
    <AdminLayout>
      <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Administradores</Eyebrow>
            <h1 className="mt-1.5 mb-2 text-[clamp(40px,5vw,64px)] leading-[0.9]">
              {isEnglish ? 'Administrators' : 'Administradores'}
            </h1>
            <p className="m-0 max-w-162.5 text-body-sm font-extrabold text-fg-admin-welcome">
              {isEnglish
                ? 'Manage administrator accounts, types and access.'
                : 'Gestiona las cuentas, tipos y accesos de los administradores.'}
            </p>
          </div>
          <Button type="button" onClick={openCreate}>
            {isEnglish ? '+ Create administrator' : '+ Crear administrador'}
          </Button>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <TextInput
            variant="control"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={isEnglish ? 'Search by name, username or email' : 'Buscar por nombre, usuario o correo'}
          />
          <select
            className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | 'active' | 'inactive')}
          >
            <option value="all">{isEnglish ? 'All statuses' : 'Todos los estados'}</option>
            <option value="active">{isEnglish ? 'Active' : 'Activos'}</option>
            <option value="inactive">{isEnglish ? 'Inactive' : 'Inactivos'}</option>
          </select>
        </div>

        {message && (
          <p
            className={
              message.type === 'error'
                ? 'mb-4 text-small font-extrabold text-[#9e3b28]'
                : 'mb-4 text-small font-extrabold text-[#2f6b45]'
            }
          >
            {message.text}
          </p>
        )}

        <div className="overflow-x-auto rounded-2xl border border-stroke-card-admin bg-surface-panel">
          <table className="min-w-full text-small">
            <thead>
              <tr className="border-b border-stroke-divider text-left">
                <th className="px-4 py-3">{isEnglish ? 'Avatar' : 'Avatar'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Name' : 'Nombre'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Username' : 'Usuario'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Email' : 'Correo'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Type' : 'Tipo'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Status' : 'Estado'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Actions' : 'Acciones'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6" colSpan={7}>
                    {isEnglish ? 'Loading…' : 'Cargando…'}
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td className="px-4 py-6" colSpan={7}>
                    {isEnglish ? 'No administrators found.' : 'No se encontraron administradores.'}
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((profile) => (
                  <tr key={profile.id} className="border-b border-stroke-divider last:border-0">
                    <td className="px-4 py-3">
                      <UserAvatar
                        user={{
                          avatarConfig: (profile.avatarConfig as never) ?? {},
                          avatarImage: profile.avatarImage,
                          name: profile.name,
                          petName: '',
                          username: profile.username
                        } as never}
                        className="size-10"
                      />
                    </td>
                    <td className="px-4 py-3 font-black">{profile.name}</td>
                    <td className="px-4 py-3">@{profile.username}</td>
                    <td className="px-4 py-3">{profile.email}</td>
                    <td className="px-4 py-3">
                      {profile.role === 'superadmin'
                        ? isEnglish
                          ? 'Superadmin'
                          : 'Superadministrador'
                        : profile.role === 'admin'
                          ? isEnglish
                            ? 'Administrator'
                            : 'Administrador'
                          : isEnglish
                            ? 'User'
                            : 'Usuario'}
                    </td>
                    <td className="px-4 py-3">
                      {profile.isActive === false
                        ? isEnglish
                          ? 'Inactive'
                          : 'Inactivo'
                        : isEnglish
                          ? 'Active'
                          : 'Activo'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {profile.role === 'superadmin' ? (
                          <span className="font-black opacity-60">
                            {isEnglish ? 'Principal' : 'Principal'}
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="text-caption font-black underline"
                              onClick={() => openEdit(profile)}
                            >
                              {isEnglish ? 'Edit' : 'Editar'}
                            </button>
                            <button
                              type="button"
                              className="text-caption font-black underline"
                              onClick={() => void handleSetActive(profile.id, profile.isActive === false)}
                            >
                              {profile.isActive === false
                                ? isEnglish
                                  ? 'Activate'
                                  : 'Activar'
                                : isEnglish
                                  ? 'Deactivate'
                                  : 'Desactivar'}
                            </button>
                            <button
                              type="button"
                              className="text-caption font-black text-[#9e3b28] underline"
                              onClick={() => void handleDelete(profile.id)}
                            >
                              {isEnglish ? 'Delete' : 'Eliminar'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <DialogRoot open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>{isEnglish ? 'Create administrator' : 'Crear administrador'}</DialogTitle>
                <form className="grid gap-3" onSubmit={handleCreate}>
                  <FieldLabel>
                    {isEnglish ? 'Full name' : 'Nombre completo'}
                    <TextInput variant="control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Username' : 'Nombre de usuario'}
                    <TextInput variant="control" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} required />
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Email' : 'Correo electrónico'}
                    <TextInput type="email" variant="control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Password' : 'Contraseña'}
                    <TextInput type="password" variant="control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Type' : 'Tipo'}
                    <select
                      className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value as 'admin' | 'superadmin' })}
                    >
                      <option value="admin">{isEnglish ? 'Administrator' : 'Administrador'}</option>
                      <option value="superadmin">{isEnglish ? 'Superadmin' : 'Superadministrador'}</option>
                    </select>
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Avatar' : 'Avatar'}
                    <input type="file" accept="image/*" onChange={handleAvatarFile} />
                  </FieldLabel>
                  <label className="flex items-center gap-2 text-small font-black">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    {isEnglish ? 'Active account' : 'Cuenta activa'}
                  </label>
                  <Button type="submit" disabled={saving}>
                    {saving ? (isEnglish ? 'Saving…' : 'Guardando…') : isEnglish ? 'Create administrator' : 'Crear administrador'}
                  </Button>
                </form>
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>

        <DialogRoot open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>{isEnglish ? 'Edit administrator' : 'Editar administrador'}</DialogTitle>
                <form className="grid gap-3" onSubmit={handleEdit}>
                  <FieldLabel>
                    {isEnglish ? 'Full name' : 'Nombre completo'}
                    <TextInput variant="control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Username' : 'Nombre de usuario'}
                    <TextInput variant="control" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} required />
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Email' : 'Correo electrónico'}
                    <TextInput type="email" variant="control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Type' : 'Tipo'}
                    <select
                      className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value as 'admin' | 'superadmin' })}
                    >
                      <option value="admin">{isEnglish ? 'Administrator' : 'Administrador'}</option>
                      <option value="superadmin">{isEnglish ? 'Superadmin' : 'Superadministrador'}</option>
                      <option value="user">{isEnglish ? 'Remove access (user)' : 'Quitar acceso (usuario)'}</option>
                    </select>
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Avatar' : 'Avatar'}
                    <input type="file" accept="image/*" onChange={handleAvatarFile} />
                  </FieldLabel>
                  <label className="flex items-center gap-2 text-small font-black">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    {isEnglish ? 'Active account' : 'Cuenta activa'}
                  </label>
                  <Button type="submit" disabled={saving}>
                    {saving ? (isEnglish ? 'Saving…' : 'Guardando…') : isEnglish ? 'Save changes' : 'Guardar cambios'}
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
