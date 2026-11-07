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
import { FieldLabel, TextInput, TextareaInput } from '@/components/ui/field'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

type DonorArticle = {
  customName?: string
  quantity: number
  type: string
  unit: string
}

type Donor = {
  career?: string | null
  email?: string | null
  firstName: string
  id: string
  isItsMotul: boolean
  lastName: string
  memberType?: string | null
  phone?: string | null
}

type DonationItem = {
  customName?: string | null
  id: string
  quantity: number
  type?: string | null
  typeName?: string | null
  unit?: string | null
}

type Donation = {
  createdAt: string
  croquetteAmount: number
  croquetteKg: number
  croquetteUnit: 'g' | 'kg'
  donor: Donor
  id: string
  items: DonationItem[]
  year?: number | null
}

type DonorForm = {
  articles: DonorArticle[]
  career: string
  croquetteAmount: string
  croquetteUnit: 'g' | 'kg'
  email: string
  firstName: string
  hasOtherArticles: boolean
  isItsMotul: boolean
  lastName: string
  memberType: 'student' | 'directive' | 'general'
  phone: string
}

const emptyForm: DonorForm = {
  articles: [],
  career: '',
  croquetteAmount: '',
  croquetteUnit: 'kg',
  email: '',
  firstName: '',
  hasOtherArticles: false,
  isItsMotul: false,
  lastName: '',
  memberType: 'student',
  phone: ''
}

const ARTICLE_TYPES = [
  { label: 'Juguetes', slug: 'toys' },
  { label: 'Sobres de alimento', slug: 'sachets' },
  { label: 'Accesorios', slug: 'accessories' },
  { label: 'Camas', slug: 'beds' },
  { label: 'Cobijas', slug: 'blankets' },
  { label: 'Correas', slug: 'leashes' },
  { label: 'Platos para mascotas / Trastes', slug: 'bowls' },
  { label: 'Otros', slug: 'other' }
]

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function DonadoresAdminPage() {
  const { language } = useLanguage()
  const { user, isHydrated } = useCommunity()
  const isEnglish = language === 'en'

  const [years, setYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isYearOpen, setIsYearOpen] = useState(false)
  const [newYear, setNewYear] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewingRecord, setViewingRecord] = useState<Donation | null>(null)
  const [form, setForm] = useState<DonorForm>(emptyForm)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
  const [saving, setSaving] = useState(false)

  async function loadYears() {
    const response = await fetch('/api/admin/donation-years')
    if (!response.ok) return
    const data = (await response.json()) as { years: { id: string; year: number }[] }
    const list = data.years.map((item) => item.year).sort((a, b) => a - b)
    setYears(list)
    if (list.length && !selectedYear) setSelectedYear(list.includes(new Date().getFullYear()) ? new Date().getFullYear() : list[0])
  }

  async function loadDonations() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedYear) params.set('year', String(selectedYear))
      if (search.trim()) params.set('search', search.trim())
      const response = await fetch(`/api/admin/donations?${params.toString()}`)
      if (!response.ok) throw new Error('request_failed')
      const data = (await response.json()) as { donations: Donation[] }
      setDonations(data.donations)
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not load donations.' : 'No se pudieron cargar las donaciones.' })
    } finally {
      setLoading(false)
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadYears()
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (selectedYear) void loadDonations()
  }, [selectedYear, search])
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleAddYear(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const year = Number(newYear)
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      setMessage({ type: 'error', text: isEnglish ? 'Enter a valid year.' : 'Ingresa un año válido.' })
      return
    }
    try {
      const response = await fetch('/api/admin/donation-years', {
        body: JSON.stringify({ year }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      })
      if (!response.ok) throw new Error('request_failed')
      await loadYears()
      setSelectedYear(year)
      setNewYear('')
      setIsYearOpen(false)
      setMessage({ type: 'success', text: isEnglish ? 'Year added.' : 'Año agregado.' })
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not add year.' : 'No se pudo agregar el año.' })
    }
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setMessage(null)
    setIsFormOpen(true)
  }

  function openEdit(donation: Donation) {
    setEditingId(donation.id)
    setForm({
      articles: donation.items.map((item) => ({
        customName: item.customName ?? '',
        quantity: item.quantity,
        type: item.type ?? 'other',
        unit: item.unit ?? 'unidad'
      })),
      career: donation.donor.career ?? '',
      croquetteAmount: String(donation.croquetteAmount),
      croquetteUnit: donation.croquetteUnit,
      email: donation.donor.email ?? '',
      firstName: donation.donor.firstName,
      hasOtherArticles: donation.items.length > 0,
      isItsMotul: donation.donor.isItsMotul,
      lastName: donation.donor.lastName,
      memberType: (donation.donor.memberType as DonorForm['memberType']) ?? 'student',
      phone: donation.donor.phone ?? ''
    })
    setMessage(null)
    setIsFormOpen(true)
  }

  function validateForm() {
    if (!form.firstName.trim() || !form.lastName.trim()) return isEnglish ? 'Name and last name are required.' : 'Nombre y apellido son obligatorios.'
    if (form.email.trim() && !isEmail(form.email.trim())) return isEnglish ? 'Enter a valid email.' : 'Ingresa un correo válido.'
    if (!/^[0-9+\-\s]{7,20}$/.test(form.phone.trim())) return isEnglish ? 'Enter a valid phone number.' : 'Ingresa un teléfono válido.'
    const amount = Number(form.croquetteAmount)
    if (Number.isNaN(amount) || amount < 0) return isEnglish ? 'Enter a valid croquette amount.' : 'Ingresa una cantidad válida de croquetas.'
    if (form.isItsMotul && form.memberType === 'student' && !form.career.trim()) return isEnglish ? 'Select a career.' : 'Selecciona una carrera.'
    if (form.hasOtherArticles) {
      for (const article of form.articles) {
        if (!article.type) return isEnglish ? 'Select an article type.' : 'Selecciona un tipo de artículo.'
        if (article.type === 'other' && !article.customName?.trim()) return isEnglish ? 'Write the article name.' : 'Escribe el nombre del artículo.'
        if (Number(article.quantity) <= 0) return isEnglish ? 'Enter a valid quantity.' : 'Ingresa una cantidad válida.'
      }
    }
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const error = validateForm()
    if (error) {
      setMessage({ type: 'error', text: error })
      return
    }

    const payload = {
      croquetteAmount: Number(form.croquetteAmount || 0),
      croquetteUnit: form.croquetteUnit,
      donor: {
        career: form.isItsMotul && form.memberType === 'student' ? form.career : null,
        email: form.email.trim() || null,
        firstName: form.firstName.trim(),
        isItsMotul: form.isItsMotul,
        lastName: form.lastName.trim(),
        memberType: form.isItsMotul ? form.memberType : null,
        phone: form.phone.trim() || null
      },
      items: form.hasOtherArticles
        ? form.articles.map((article) => ({
            customName: article.type === 'other' ? article.customName?.trim() || null : null,
            quantity: Number(article.quantity),
            type: article.type,
            unit: article.unit
          }))
        : [],
      year: selectedYear
    }

    setSaving(true)
    try {
      const response = await fetch(
        editingId ? `/api/admin/donations/${editingId}` : '/api/admin/donations',
        {
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
          method: editingId ? 'PATCH' : 'POST'
        }
      )
      if (!response.ok) throw new Error('request_failed')

      setMessage({ type: 'success', text: editingId ? (isEnglish ? 'Donation updated.' : 'Donación actualizada.') : (isEnglish ? 'Donation registered.' : 'Donación registrada.') })
      setIsFormOpen(false)
      setEditingId(null)
      setForm(emptyForm)
      await loadDonations()
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not save donation.' : 'No se pudo guardar la donación.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(isEnglish ? 'Delete this donation?' : '¿Eliminar esta donación?')) return
    try {
      const response = await fetch(`/api/admin/donations/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('request_failed')
      setMessage({ type: 'success', text: isEnglish ? 'Donation deleted.' : 'Donación eliminada.' })
      await loadDonations()
    } catch {
      setMessage({ type: 'error', text: isEnglish ? 'Could not delete donation.' : 'No se pudo eliminar la donación.' })
    }
  }

  function addArticle() {
    setForm((current) => ({
      ...current,
      articles: [...current.articles, { customName: '', quantity: 1, type: 'toys', unit: 'unidad' }]
    }))
  }

  function updateArticle(index: number, patch: Partial<DonorArticle>) {
    setForm((current) => ({
      ...current,
      articles: current.articles.map((article, i) => (i === index ? { ...article, ...patch } : article))
    }))
  }

  function removeArticle(index: number) {
    setForm((current) => ({
      ...current,
      articles: current.articles.filter((_, i) => i !== index)
    }))
  }

  const yearRecords = donations

  const filteredRecords = yearRecords.filter((record) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      record.donor.firstName.toLowerCase().includes(query) ||
      record.donor.lastName.toLowerCase().includes(query) ||
      (record.donor.email ?? '').toLowerCase().includes(query) ||
      (record.donor.phone ?? '').toLowerCase().includes(query)
    )
  })

  const totalDonors = donations.length
  const totalKg = donations.reduce((total, record) => total + record.croquetteKg, 0)
  const totalArticles = donations.reduce(
    (total, record) => total + record.items.reduce((sum, article) => sum + (Number(article.quantity) || 0), 0),
    0
  )
  const itsCount = donations.filter((record) => record.donor.isItsMotul).length
  const externalCount = donations.filter((record) => !record.donor.isItsMotul).length

  if (!isHydrated || !user) {
    return (
      <AdminLayout>
        <Container as="section" className="grid min-h-[60vh] content-center justify-items-center gap-3 text-center">
          <p className="m-0 font-extrabold opacity-65">
            {isEnglish ? 'Loading donors…' : 'Cargando donadores…'}
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
            <Eyebrow>Donadores</Eyebrow>
            <h1 className="mt-1.5 mb-2 text-[clamp(40px,5vw,64px)] leading-[0.9]">
              {isEnglish ? 'Donors' : 'Donadores'}
            </h1>
            <p className="m-0 max-w-162.5 text-body-sm font-extrabold text-fg-admin-welcome">
              {isEnglish ? 'Manage donations received by Croquetón.' : 'Gestiona las donaciones recibidas por Croquetón.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => setIsYearOpen(true)}>
              {isEnglish ? '+ Add year' : '+ Añadir año'}
            </Button>
            <Button type="button" onClick={openCreate}>
              {isEnglish ? '+ Register donation' : '+ Registrar donación'}
            </Button>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <select
            className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <TextInput
            variant="control"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={isEnglish ? 'Search by name, email or phone' : 'Buscar por nombre, correo o teléfono'}
          />
        </div>

        <section className="mb-6 grid grid-cols-5 gap-3 tablet:grid-cols-3 phone:grid-cols-2">
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">{isEnglish ? 'Donors' : 'Donadores'}</small>
            <strong className="font-heading text-[28px]">{totalDonors}</strong>
          </div>
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">{isEnglish ? 'Croquettes (kg)' : 'Croquetas (kg)'}</small>
            <strong className="font-heading text-[28px]">{totalKg.toFixed(3)}</strong>
          </div>
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">{isEnglish ? 'Articles' : 'Artículos'}</small>
            <strong className="font-heading text-[28px]">{totalArticles}</strong>
          </div>
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">ITS Motul</small>
            <strong className="font-heading text-[28px]">{itsCount}</strong>
          </div>
          <div className="rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
            <small className="block text-micro font-black uppercase opacity-60">{isEnglish ? 'External' : 'Externos'}</small>
            <strong className="font-heading text-[28px]">{externalCount}</strong>
          </div>
        </section>

        {message && (
          <p className={message.type === 'error' ? 'mb-4 text-small font-extrabold text-[#9e3b28]' : 'mb-4 text-small font-extrabold text-[#2f6b45]'}>
            {message.text}
          </p>
        )}

        <div className="overflow-x-auto rounded-2xl border border-stroke-card-admin bg-surface-panel">
          <table className="min-w-full text-small">
            <thead>
              <tr className="border-b border-stroke-divider text-left">
                <th className="px-4 py-3">{isEnglish ? 'Donor' : 'Donador'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Type' : 'Tipo'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Email' : 'Correo electrónico'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Phone' : 'Teléfono'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Croquettes' : 'Croquetas'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Other articles' : 'Otros artículos'}</th>
                <th className="px-4 py-3">{isEnglish ? 'Date' : 'Fecha'}</th>
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
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td className="px-4 py-6" colSpan={8}>
                    {isEnglish ? 'No donations found.' : 'No se encontraron donaciones.'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-stroke-divider last:border-0">
                    <td className="px-4 py-3 font-black">{record.donor.firstName} {record.donor.lastName}</td>
                    <td className="px-4 py-3">
                      {record.donor.isItsMotul
                        ? `ITS Motul - ${record.donor.memberType ?? ''}${record.donor.career ? ` - ${record.donor.career}` : ''}`
                        : (isEnglish ? 'External donor' : 'Donador externo')}
                    </td>
                    <td className="px-4 py-3">{record.donor.email ?? '—'}</td>
                    <td className="px-4 py-3">{record.donor.phone ?? '—'}</td>
                    <td className="px-4 py-3">{record.croquetteAmount} {record.croquetteUnit}</td>
                    <td className="px-4 py-3">
                      {record.items.length
                        ? record.items.map((article) => `${article.quantity} ${article.typeName ?? article.type ?? article.customName ?? ''}`).join(', ')
                        : '—'}
                    </td>
                    <td className="px-4 py-3">{new Date(record.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="text-caption font-black underline" onClick={() => setViewingRecord(record)}>
                          {isEnglish ? 'View' : 'Ver'}
                        </button>
                        <button type="button" className="text-caption font-black underline" onClick={() => openEdit(record)}>
                          {isEnglish ? 'Edit' : 'Editar'}
                        </button>
                        <button
                          type="button"
                          className="text-caption font-black text-[#9e3b28] underline"
                          onClick={() => void handleDelete(record.id)}
                        >
                          {isEnglish ? 'Delete' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <DialogRoot open={isYearOpen} onOpenChange={setIsYearOpen}>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>{isEnglish ? 'Add year' : 'Añadir año'}</DialogTitle>
                <form className="grid gap-3" onSubmit={handleAddYear}>
                  <FieldLabel>
                    {isEnglish ? 'Year' : 'Año'}
                    <TextInput
                      variant="control"
                      value={newYear}
                      onChange={(event) => setNewYear(event.target.value)}
                      placeholder="2026"
                      required
                    />
                  </FieldLabel>
                  <Button type="submit">{isEnglish ? 'Add year' : 'Añadir año'}</Button>
                </form>
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>

        <DialogRoot open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>
                  {editingId
                    ? isEnglish
                      ? 'Edit donation'
                      : 'Editar donación'
                    : isEnglish
                      ? 'Register donation'
                      : 'Registrar donación'}
                </DialogTitle>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-3 phone:grid-cols-1">
                    <FieldLabel>
                      {isEnglish ? 'First name' : 'Nombre'}
                      <TextInput variant="control" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                    </FieldLabel>
                    <FieldLabel>
                      {isEnglish ? 'Last name' : 'Apellido'}
                      <TextInput variant="control" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                    </FieldLabel>
                  </div>

                  <FieldLabel>
                    {isEnglish ? 'Belongs to ITS Motul?' : '¿Pertenece al ITS Motul?'}
                    <select
                      className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
                      value={form.isItsMotul ? 'yes' : 'no'}
                      onChange={(e) => setForm({ ...form, isItsMotul: e.target.value === 'yes' })}
                    >
                      <option value="no">{isEnglish ? 'No' : 'No'}</option>
                      <option value="yes">{isEnglish ? 'Yes' : 'Sí'}</option>
                    </select>
                  </FieldLabel>

                  {form.isItsMotul && (
                    <FieldLabel>
                      {isEnglish ? 'ITS Motul member type' : 'Tipo de integrante del ITS Motul'}
                      <select
                        className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
                        value={form.memberType}
                        onChange={(e) => setForm({ ...form, memberType: e.target.value as DonorForm['memberType'] })}
                        required
                      >
                        <option value="student">{isEnglish ? 'Student' : 'Estudiante'}</option>
                        <option value="directive">{isEnglish ? 'Directive' : 'Directivo'}</option>
                        <option value="general">{isEnglish ? 'General administration' : 'Administración general'}</option>
                      </select>
                    </FieldLabel>
                  )}

                  {form.isItsMotul && form.memberType === 'student' && (
                    <FieldLabel>
                      {isEnglish ? 'Career' : 'Carrera'}
                      <select
                        className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
                        value={form.career}
                        onChange={(e) => setForm({ ...form, career: e.target.value })}
                        required
                      >
                        <option value="">{isEnglish ? 'Select a career' : 'Selecciona una carrera'}</option>
                        <option value="ISC">ISC</option>
                        <option value="II">II</option>
                        <option value="IER">IER</option>
                        <option value="IE">IE</option>
                        <option value="IEM">IEM</option>
                      </select>
                    </FieldLabel>
                  )}

                  <div className="grid grid-cols-2 gap-3 phone:grid-cols-1">
                    <FieldLabel>
                      {isEnglish ? 'Email' : 'Correo electrónico'}
                      <TextInput type="email" variant="control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </FieldLabel>
                    <FieldLabel>
                      {isEnglish ? 'Phone' : 'Teléfono'}
                      <TextInput variant="control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                    </FieldLabel>
                  </div>

                  <div>
                    <Eyebrow variant="section" tone="accent">
                      {isEnglish ? 'Croquette donation' : 'Donación de croquetas'}
                    </Eyebrow>
                    <div className="mt-2 grid grid-cols-2 gap-3 phone:grid-cols-1">
                      <FieldLabel>
                        {isEnglish ? 'Amount' : 'Cantidad'}
                        <TextInput type="number" step="0.01" variant="control" value={form.croquetteAmount} onChange={(e) => setForm({ ...form, croquetteAmount: e.target.value })} required />
                      </FieldLabel>
                      <FieldLabel>
                        {isEnglish ? 'Unit' : 'Unidad de medida'}
                        <select
                          className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
                          value={form.croquetteUnit}
                          onChange={(e) => setForm({ ...form, croquetteUnit: e.target.value as 'g' | 'kg' })}
                        >
                          <option value="kg">{isEnglish ? 'Kilograms (kg)' : 'Kilogramos (kg)'}</option>
                          <option value="g">{isEnglish ? 'Grams (g)' : 'Gramos (g)'}</option>
                        </select>
                      </FieldLabel>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-small font-black">
                    <input
                      type="checkbox"
                      checked={form.hasOtherArticles}
                      onChange={(e) => setForm({ ...form, hasOtherArticles: e.target.checked })}
                    />
                    {isEnglish ? 'Donate other articles?' : '¿Desea donar otros artículos?'}
                  </label>

                  {form.hasOtherArticles && (
                    <div className="grid gap-3 rounded-2xl border border-stroke-card-admin bg-surface-panel p-4">
                      <Eyebrow variant="section" tone="accent">
                        {isEnglish ? 'Other donated articles' : 'Otros artículos donados'}
                      </Eyebrow>
                      {form.articles.map((article, index) => (
                        <div key={index} className="grid gap-2 rounded-xl border border-stroke-divider p-3">
                          <FieldLabel>
                            {isEnglish ? 'Article type' : 'Tipo de artículo'}
                            <select
                              className="rounded-control border border-stroke bg-card px-3 py-2 text-small font-black"
                              value={article.type}
                              onChange={(e) => updateArticle(index, { type: e.target.value })}
                            >
                              {ARTICLE_TYPES.map((type) => (
                                <option key={type.slug} value={type.slug}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </FieldLabel>
                          {article.type === 'other' && (
                            <FieldLabel>
                              {isEnglish ? 'Article name' : 'Nombre del artículo'}
                              <TextInput
                                variant="control"
                                value={article.customName ?? ''}
                                onChange={(e) => updateArticle(index, { customName: e.target.value })}
                              />
                            </FieldLabel>
                          )}
                          <div className="grid grid-cols-2 gap-2 phone:grid-cols-1">
                            <FieldLabel>
                              {isEnglish ? 'Quantity' : 'Cantidad'}
                              <TextInput
                                type="number"
                                step="0.01"
                                variant="control"
                                value={article.quantity}
                                onChange={(e) => updateArticle(index, { quantity: Number(e.target.value) })}
                              />
                            </FieldLabel>
                            <FieldLabel>
                              {isEnglish ? 'Unit / presentation' : 'Unidad o presentación'}
                              <TextInput
                                variant="control"
                                value={article.unit}
                                onChange={(e) => updateArticle(index, { unit: e.target.value })}
                              />
                            </FieldLabel>
                          </div>
                          <button
                            type="button"
                            className="text-caption font-black text-[#9e3b28] underline"
                            onClick={() => removeArticle(index)}
                          >
                            {isEnglish ? 'Remove article' : 'Quitar artículo'}
                          </button>
                        </div>
                      ))}
                      <Button type="button" onClick={addArticle}>
                        {isEnglish ? '+ Add another article' : '+ Agregar otro artículo'}
                      </Button>
                    </div>
                  )}

                  <Button type="submit" disabled={saving}>
                    {saving ? (isEnglish ? 'Saving…' : 'Guardando…') : (isEnglish ? 'Submit donation' : 'Enviar donación')}
                  </Button>
                </form>
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>

        <DialogRoot open={Boolean(viewingRecord)} onOpenChange={(open) => !open && setViewingRecord(null)}>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup>
                <DialogClose />
                <DialogTitle>{isEnglish ? 'Donation details' : 'Detalles de la donación'}</DialogTitle>
                {viewingRecord && (
                  <div className="grid gap-2 text-small">
                    <p><strong>{isEnglish ? 'Donor:' : 'Donador:'}</strong> {viewingRecord.donor.firstName} {viewingRecord.donor.lastName}</p>
                    <p><strong>{isEnglish ? 'Type:' : 'Tipo:'}</strong> {viewingRecord.donor.isItsMotul ? `ITS Motul - ${viewingRecord.donor.memberType}${viewingRecord.donor.career ? ` - ${viewingRecord.donor.career}` : ''}` : (isEnglish ? 'External donor' : 'Donador externo')}</p>
                    <p><strong>{isEnglish ? 'Email:' : 'Correo:'}</strong> {viewingRecord.donor.email ?? '—'}</p>
                    <p><strong>{isEnglish ? 'Phone:' : 'Teléfono:'}</strong> {viewingRecord.donor.phone ?? '—'}</p>
                    <p><strong>{isEnglish ? 'Croquettes:' : 'Croquetas:'}</strong> {viewingRecord.croquetteAmount} {viewingRecord.croquetteUnit}</p>
                    {viewingRecord.items.length > 0 && (
                      <div>
                        <strong>{isEnglish ? 'Other articles:' : 'Otros artículos:'}</strong>
                        <ul className="m-0 pl-5">
                          {viewingRecord.items.map((article, index) => (
                            <li key={index}>{article.quantity} {article.typeName ?? article.type ?? article.customName ?? ''} {article.unit ? `(${article.unit})` : ''}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p><strong>{isEnglish ? 'Date:' : 'Fecha:'}</strong> {new Date(viewingRecord.createdAt).toLocaleDateString()}</p>
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
