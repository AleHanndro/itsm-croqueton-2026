'use client'

import { useState } from 'react'

import { Paw } from '@/components/ui'
import { useCommunity } from '@/context/app-context'
import AdminIcon from '@/components/admin-icon'

function AdminGenerationsPage() {
  const { generationPhotos, addGenerationPhoto, deleteGenerationPhoto } = useCommunity()
  const [year, setYear] = useState('')
  const [label, setLabel] = useState('')
  const [image, setImage] = useState('')
  const [message, setMessage] = useState('')

  function selectImage(file) {
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') setImage(reader.result)
    })
    reader.readAsDataURL(file)
  }

  function upload(event) {
    event.preventDefault()
    if (!image) {
      setMessage('Selecciona una foto para subir.')
      return
    }
    const ok = addGenerationPhoto({ year: year.trim(), label: label.trim(), image })
    if (!ok) {
      setMessage('No se pudo guardar la foto.')
      return
    }
    setYear('')
    setLabel('')
    setImage('')
    setMessage('Foto de generación guardada.')
  }

  return (
    <section className="admin-main" id="generaciones">
      <div className="admin-welcome">
        <div>
          <span className="eyebrow">Generaciones</span>
          <h1>Fotos de croquetones.</h1>
          <p>Sube y administra las fotos grupales de cada generación Croquetón.</p>
        </div>
        <div className="admin-status">
          <span />
          <div>
            <strong>{generationPhotos.length} {generationPhotos.length === 1 ? 'foto' : 'fotos'}</strong>
            <small>Generaciones registradas</small>
          </div>
        </div>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="chapter">Nueva foto</span>
            <h2>Subir generación</h2>
            <p>Agrega la foto grupal de una generación.</p>
          </div>
          <span className="admin-count">+</span>
        </div>
        <form className="admin-post-composer-body" onSubmit={upload}>
          <div className="admin-form-grid">
            <label>
              <span>Año</span>
              <input
                inputMode="numeric"
                maxLength={4}
                placeholder="2026"
                value={year}
                onChange={(event) => setYear(event.target.value.replace(/\D/g, ''))}
              />
            </label>
            <label>
              <span>Etiqueta</span>
              <input
                placeholder="La manada fundadora"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
              />
            </label>
            <label>
              <span>Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => selectImage(event.target.files?.[0])}
              />
            </label>
          </div>
          {image && <img className="admin-post-preview" src={image} alt="Vista previa de la foto" />}
          <div className="admin-form-actions">
            <button className="admin-approve" type="submit">
              Subir foto
            </button>
          </div>
          {message && <small className="admin-post-notice" aria-live="polite">{message}</small>}
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="chapter">Galería</span>
            <h2>Generaciones</h2>
            <p>Fotos grupales publicadas por el equipo.</p>
          </div>
          <span className="admin-count">{generationPhotos.length}</span>
        </div>
        {generationPhotos.length ? (
          <div className="admin-guaubook-list">
            {generationPhotos.map((photo) => (
              <article key={photo.id} className="admin-guaubook-post">
                <div className="admin-guaubook-post-head">
                  <span className="post-avatar">
                    <Paw />
                  </span>
                  <div>
                    <strong>{photo.year ? `Generación ${photo.year}` : 'Generación'}</strong>
                    <small>{photo.label || 'Foto grupal'}</small>
                  </div>
                  <button
                    type="button"
                    className="admin-donation-delete"
                    onClick={() => deleteGenerationPhoto(photo.id)}
                  >
                    Eliminar
                  </button>
                </div>
                {photo.image && <img src={photo.image} alt={photo.label || 'Foto de generación'} />}
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty compact">
            <AdminIcon type="posts" />
            <strong>Sin fotos todavía</strong>
            <p>Sube la primera foto grupal de una generación.</p>
          </div>
        )}
      </section>
    </section>
  )
}

export default AdminGenerationsPage
