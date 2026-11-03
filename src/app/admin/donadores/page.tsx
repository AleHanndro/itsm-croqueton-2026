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

type DonorRecord = {
  articles: DonorArticle[]
  createdAt: string
  croquetteAmount: number
  croquetteUnit: 'g' | 'kg'
  email: string
  firstName: string
  id: string
  isItsMotul: boolean
  lastName: string
  memberType?: 'student' | 'directive' | 'general'
  phone: string
  year: number
}

type DonorForm = {
  articles: DonorArticle[]
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
  'Trastes',
  'Juguetes',
  'Sobres de alimento',
  'Accesorios',
  'Camas',
  'Cobijas',
  'Correas',
  'Platos para mascotas',
  'Otros'
]

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

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function DonadoresAdminPage() {
  const { language } = useLanguage()
  const { user, isHydrated } = useCommunity()
  const isEnglish = language === 'en'

  const [currentYear, setCurrentYear] = useState(0)
  const [years, setYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [records, setRecords] = useState<DonorRecord[]>([])
  const [isHydratedLocal, setIsHydratedLocal] = useState(false)
  const [search, setSearch] = useState('')
  const [isYearOpen, setIsYearOpen] = useState(false)
  const [newYear, setNewYear] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewingRecord, setViewingRecord] = useState<DonorRecord | null>(null)
  const [form, setForm] = useState<DonorForm>(emptyForm)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  useEffect(() => {
    const year = new Date().getFullYear()
    setCurrentYear(year)
    const savedYears = readJson<number[]>('croqueton-donor-years', [])
    const savedRecords = readJson<DonorRecord[]>('croqueton-donors', [])
    const nextYears = savedYears.length ? savedYears : [year]
    setYears(nextYears)
    setRecords(savedRecords)
    setSelectedYear(nextYears.includes(year) ? year : nextYears[0])
    setIsHydratedLocal(true)
  }, [])

  useEffect(() => {
    if (!isHydratedLocal) return
    window.localStorage.setItem('croqueton-donor-years', JSON.stringify(years))
  }, [years, isHydratedLocal])

  useEffect(() => {
    if (!isHydratedLocal) return
    window.localStorage.setItem('croqueton-donors', JSON.stringify(records))
  }, [records, isHydratedLocal])

  const yearRecords = records.filter((record) => record.year === selectedYear)

  const filteredRecords = yearRecords.filter((record) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      record.firstName.toLowerCase().includes(query) ||
      record.lastName.toLowerCase().includes(query) ||
      record.email.toLowerCase().includes(query) ||
      record.phone.toLowerCase().includes(query)
    )
  })

  const totalDonors = yearRecords.length
  const totalKg = yearRecords.reduce((total, record) => {
    const amount =
      record.croquetteUnit === 'g' ? record.croquetteAmount / 1000 : record.croquetteAmount
    return total + amount
  }, 0)
  const totalArticles = yearRecords.reduce(
    (total, record) =>
      total + record.articles.reduce((sum, article) => sum + (Number(article.quantity) || 0), 0),
    0
  )
  const itsCount = yearRecords.filter((record) => record.isItsMotul).length
  const externalCount = yearRecords.filter((record) => !record.isItsMotul).length

  function handleAddYear(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const year = Number(newYear)
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      setMessage({ type: 'error', text: isEnglish ? 'Enter a valid year.' : 'Ingresa un año válido.' })
      return
    }
    if (years.includes(year)) {
      setMessage({ type: 'error', text: isEnglish ? 'That year already exists.' : 'Ese año ya existe.' })
      return
    }
    setYears((current) => [...current, year].sort((a, b) => a - b))
    setSelectedYear(year)
    setNewYear('')
    setIsYearOpen(false)
    setMessage({ type: 'success', text: isEnglish ? 'Year added.' : 'Año agregado.' })
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setMessage(null)
    setIsFormOpen(true)
  }

  function openEdit(record: DonorRecord) {
    setEditingId(record.id)
    setForm({
      articles: record.articles,
      croquetteAmount: String(record.croquetteAmount),
      croquetteUnit: record.croquetteUnit,
      email: record.email,
      firstName: record.firstName,
      hasOtherArticles: record.articles.length > 0,
      isItsMotul: record.isItsMotul,
      lastName: record.lastName,
      memberType: record.memberType ?? 'student',
      phone: record.phone
    })
    setMessage(null)
    setIsFormOpen(true)
  }

  function validateForm() {
    if (!form.firstName.trim() || !form.lastName.trim()) return isEnglish ? 'Name and last name are required.' : 'Nombre y apellido son obligatorios.'
    if (!isEmail(form.email.trim())) return isEnglish ? 'Enter a valid email.' : 'Ingresa un correo válido.'
    if (!/^[0-9+\-\s]{7,20}$/.test(form.phone.trim())) return isEnglish ? 'Enter a valid phone number.' : 'Ingresa un teléfono válido.'
    const amount = Number(form.croquetteAmount)
    if (Number.isNaN(amount) || amount < 0) return isEnglish ? 'Enter a valid croquette amount.' : 'Ingresa una cantidad válida de croquetas.'
    if (form.hasOtherArticles) {
      for (const article of form.articles) {
        if (!article.type) return isEnglish ? 'Select an article type.' : 'Selecciona un tipo de artículo.'
        if (article.type === 'Otros' && !article.customName?.trim()) return isEnglish ? 'Write the article name.' : 'Escribe el nombre del artículo.'
        if (Number(article.quantity) <= 0) return isEnglish ? 'Enter a valid quantity.' : 'Ingresa una cantidad válida.'
      }
    }
    return null
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const error = validateForm()
    if (error) {
      setMessage({ type: 'error', text: error })
      return
    }

    const record: DonorRecord = {
      articles: form.hasOtherArticles ? form.articles : [],
      createdAt: editingId
        ? records.find((item) => item.id === editingId)?.createdAt ?? new Date().toISOString()
        : new Date().toISOString(),
      croquetteAmount: Number(form.croquetteAmount || 0),
      croquetteUnit: form.croquetteUnit,
      email: form.email.trim(),
      firstName: form.firstName.trim(),
      id: editingId ?? crypto.randomUUID(),
      isItsMotul: form.isItsMotul,
      lastName: form.lastName.trim(),
      memberType: form.isItsMotul ? form.memberType : undefined,
      phone: form.phone.trim(),
      year: selectedYear
    }

    if (editingId) {
      setRecords((current) => current.map((item) => (item.id === editingId ? record : item)))
      setMessage({ type: 'success', text: isEnglish ? 'Donation updated.' : 'Donación actualizada.' })
    } else {
      setRecords((current) => [record, ...current])
      setMessage({ type: 'success', text: isEnglish ? 'Donation registered.' : 'Donación registrada.' })
    }

    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function handleDelete(id: string) {
    if (!window.confirm(isEnglish ? 'Delete this donation?' : '¿Eliminar esta donación?')) return
    setRecords((current) => current.filter((record) => record.id !== id))
    setMessage({ type: 'success', text: isEnglish ? 'Donation deleted.' : 'Donación eliminada.' })
  }

  function addArticle() {
    setForm((current) => ({
      ...current,
      articles: [...current.articles, { customName: '', quantity: 1, type: 'Juguetes', unit: 'unidad' }]
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

  if (!isHydrated || !isHydratedLocal || !user) {
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
            <strong className="font-heading text-[28px]">{totalKg.toFixed(2)}</strong>
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
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-stroke-divider last:border-0">
                  <td className="px-4 py-3 font-black">{record.firstName} {record.lastName}</td>
                  <td className="px-4 py-3">
                    {record.isItsMotul
                      ? isEnglish
                        ? `ITS Motul - ${record.memberType}`
                        : `ITS Motul - ${record.memberType}`
                      : isEnglish
                        ? 'External donor'
                        : 'Donador externo'}
                  </td>
                  <td className="px-4 py-3">{record.email}</td>
                  <td className="px-4 py-3">{record.phone}</td>
                  <td className="px-4 py-3">{record.croquetteAmount} {record.croquetteUnit}</td>
                  <td className="px-4 py-3">
                    {record.articles.length
                      ? record.articles.map((article) => `${article.quantity} ${article.type === 'Otros' ? article.customName : article.type}`).join(', ')
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
                        onClick={() => handleDelete(record.id)}
                      >
                        {isEnglish ? 'Delete' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRecords.length === 0 && (
            <p className="p-4 text-small font-extrabold opacity-65">
              {isEnglish ? 'No donations found for this year.' : 'No se encontraron donaciones para este año.'}
            </p>
          )}
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

                  <div className="grid grid-cols-2 gap-3 phone:grid-cols-1">
                    <FieldLabel>
                      {isEnglish ? 'Email' : 'Correo electrónico'}
                      <TextInput type="email" variant="control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
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
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </FieldLabel>
                          {article.type === 'Otros' && (
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

                  <Button type="submit">
                    {isEnglish ? 'Submit donation' : 'Enviar donación'}
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
                  <p><strong>{isEnglish ? 'Donor:' : 'Donador:'}</strong> {viewingRecord.firstName} {viewingRecord.lastName}</p>
                  <p><strong>{isEnglish ? 'Type:' : 'Tipo:'}</strong> {viewingRecord.isItsMotul ? `ITS Motul - ${viewingRecord.memberType}` : (isEnglish ? 'External donor' : 'Donador externo')}</p>
                  <p><strong>{isEnglish ? 'Email:' : 'Correo:'}</strong> {viewingRecord.email}</p>
                  <p><strong>{isEnglish ? 'Phone:' : 'Teléfono:'}</strong> {viewingRecord.phone}</p>
                  <p><strong>{isEnglish ? 'Croquettes:' : 'Croquetas:'}</strong> {viewingRecord.croquetteAmount} {viewingRecord.croquetteUnit}</p>
                  {viewingRecord.articles.length > 0 && (
                    <div>
                      <strong>{isEnglish ? 'Other articles:' : 'Otros artículos:'}</strong>
                      <ul className="m-0 pl-5">
                        {viewingRecord.articles.map((article, index) => (
                          <li key={index}>{article.quantity} {article.type === 'Otros' ? article.customName : article.type} {article.unit ? `(${article.unit})` : ''}</li>
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
