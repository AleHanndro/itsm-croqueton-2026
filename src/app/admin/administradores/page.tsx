'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'

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
import { useCommunity, type CommunityError } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

const errorMessages: Record<CommunityError, { en: string; es: string }> = {
  current_password_incorrect: { en: 'The current password is not correct.', es: 'La contraseña actual no es correcta.' },
  email_invalid: { en: 'Write a valid email address.', es: 'Escribe un correo electrónico válido.' },
  email_taken: { en: 'That email address is already registered.', es: 'Ese correo electrónico ya está registrado.' },
  name_required: { en: "The full name cannot be empty.", es: 'El nombre completo no puede quedar vacío.' },
  no_session: { en: 'There is no active session.', es: 'No hay una sesión activa.' },
  password_same: { en: 'The new password must be different.', es: 'La nueva contraseña debe ser diferente.' },
  password_too_short: { en: 'The password must have at least 6 characters.', es: 'La contraseña debe tener al menos 6 caracteres.' },
  password_unavailable: { en: 'Password changes are not available.', es: 'El cambio de contraseña no está disponible.' },
  pet_name_required: { en: "The pet's name cannot be empty.", es: 'El nombre de la mascota no puede quedar vacío.' },
  username_invalid: { en: 'The username must have 3 to 24 characters.', es: 'El nombre de usuario debe tener entre 3 y 24 caracteres.' },
  username_taken: { en: 'That username is already in use.', es: 'Ese nombre de usuario ya está en uso.' }
}

type StatusMessage = { text: string; type: 'error' | 'success' } | null

type AdminForm = {
  avatarImage: string | null | undefined
  confirmPassword: string
  email: string
  isActive: boolean
  name: string
  password: string
  username: string
}

const emptyForm: AdminForm = {
  avatarImage: undefined,
  confirmPassword: '',
  email: '',
  isActive: true,
  name: '',
  password: '',
  username: ''
}

export default function AdministradoresPage() {
  const { language } = useLanguage()
  const {
    user,
    isHydrated,
    profiles,
    createAdmin,
    updateAdmin,
    setAdminActive,
    deleteAdmin
  } = useCommunity()
  const isEnglish = language === 'en'

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingEmail, setEditingEmail] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [form, setForm] = useState<AdminForm>(emptyForm)
  const [message, setMessage] = useState<StatusMessage>(null)

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

  const admins = Object.values(profiles).filter(
    (profile) => profile.role === 'admin' || profile.role === 'superadmin'
  )

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

  function openEdit(profile: (typeof admins)[number]) {
    setEditingEmail(profile.email)
    setForm({
      avatarImage: profile.avatarImage,
      confirmPassword: '',
      email: profile.email,
      isActive: profile.isActive ?? true,
      name: profile.name,
      password: '',
      username: profile.username
    })
    setMessage(null)
    setIsEditOpen(true)
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)

    if (form.password !== form.confirmPassword) {
      setMessage({
        type: 'error',
        text: isEnglish ? 'The passwords do not match.' : 'Las contraseñas no coinciden.'
      })
      return
    }

    const result = await createAdmin({
      avatarImage: form.avatarImage ?? undefined,
      email: form.email,
      isActive: form.isActive,
      name: form.name,
      password: form.password,
      username: form.username
    })

    if (!result.ok) {
      setMessage({
        type: 'error',
        text: errorMessages[result.error]?.[isEnglish ? 'en' : 'es'] ?? result.error
      })
      return
    }

    setForm(emptyForm)
    setIsCreateOpen(false)
    setMessage({
      type: 'success',
      text: isEnglish ? 'Administrator created.' : 'Administrador creado.'
    })
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingEmail) return
    setMessage(null)

    const result = updateAdmin(editingEmail, {
      avatarImage: form.avatarImage,
      email: form.email,
      isActive: form.isActive,
      name: form.name,
      username: form.username
    })

    if (!result.ok) {
      setMessage({
        type: 'error',
        text: errorMessages[result.error]?.[isEnglish ? 'en' : 'es'] ?? result.error
      })
      return
    }

    setIsEditOpen(false)
    setEditingEmail(null)
    setMessage({
      type: 'success',
      text: isEnglish ? 'Administrator updated.' : 'Administrador actualizado.'
    })
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
                ? 'Manage administrator accounts and permissions.'
                : 'Gestiona las cuentas y permisos de los administradores.'}
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
                <th className="px-4 py-3">{isEnglish ? 'Created' : 'Creado'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Status' : 'Estado'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Actions' : 'Acciones'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((profile) => (
                <tr key={profile.email} className="border-b border-stroke-divider last:border-0">
                  <td className="px-4 py-3">
                    <UserAvatar user={profile} className="size-10" />
                  </td>
                  <td className="px-4 py-3 font-black">{profile.name}</td>
                  <td className="px-4 py-3">@{profile.username}</td>
                  <td className="px-4 py-3">{profile.email}</td>
                  <td className="px-4 py-3">
                    {new Intl.DateTimeFormat(isEnglish ? 'en' : 'es', { dateStyle: 'medium' }).format(
                      new Date(profile.createdAt ?? '1970-01-01T00:00:00.000Z')
                    )}
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
                            onClick={() => setAdminActive(profile.email, profile.isActive === false)}
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
                            onClick={() => {
                              if (window.confirm(isEnglish ? 'Delete this administrator?' : '¿Eliminar este administrador?')) {
                                deleteAdmin(profile.email)
                              }
                            }}
                          >
                            {isEnglish ? 'Delete' : 'Eliminar'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAdmins.length === 0 && (
            <p className="p-4 text-small font-extrabold opacity-65">
              {isEnglish ? 'No administrators found.' : 'No se encontraron administradores.'}
            </p>
          )}
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
                    <TextInput type="password" variant="control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Confirm password' : 'Confirmar contraseña'}
                    <TextInput type="password" variant="control" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required minLength={6} />
                  </FieldLabel>
                  <FieldLabel>
                    {isEnglish ? 'Avatar' : 'Avatar'}
                    <input type="file" accept="image/*" onChange={handleAvatarFile} />
                  </FieldLabel>
                  <label className="flex items-center gap-2 text-small font-black">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    {isEnglish ? 'Active account' : 'Cuenta activa'}
                  </label>
                  <Button type="submit">{isEnglish ? 'Create administrator' : 'Crear administrador'}</Button>
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
                    {isEnglish ? 'Avatar' : 'Avatar'}
                    <input type="file" accept="image/*" onChange={handleAvatarFile} />
                  </FieldLabel>
                  <label className="flex items-center gap-2 text-small font-black">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    {isEnglish ? 'Active account' : 'Cuenta activa'}
                  </label>
                  <Button type="submit">{isEnglish ? 'Save changes' : 'Guardar cambios'}</Button>
                </form>
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>
      </Container>
    </AdminLayout>
  )
}
