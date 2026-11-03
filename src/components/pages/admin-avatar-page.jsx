'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'

import AvatarPetEditor from '@/components/avatar-pet-editor'
import PetVisual from '@/components/pet-visual'
import { CareAvatar } from '@/components/ui'
import { useCommunity } from '@/context/app-context'

function AdminAvatarPage() {
  const { user, avatarConfig, petFurColor, updateProfile } = useCommunity()
  const [name, setName] = useState(user?.name ?? '')
  const [message, setMessage] = useState('')
  useEffect(() => {
    setName(user?.name ?? '')
  }, [user?.name])
  const saveName = (event) => {
    event.preventDefault()
    const result = updateProfile({ name })
    if (!result?.ok) {
      setMessage(result?.error || 'No se pudo guardar el nombre.')
      return
    }
    setMessage('Nombre actualizado.')
  }
  return (
    <section className="admin-main" id="avatar-mascota">
      <div className="admin-welcome">
        <div>
          <span className="eyebrow">Perfil</span>
          <h1>Avatar y mascota.</h1>
          <p>Cambia la ropa, el cabello y los colores de tu avatar y de tu mascota.</p>
        </div>
        <div className="admin-status">
          <span />
          <div>
            <strong>Cambios al instante</strong>
            <small>Se guardan automáticamente en este dispositivo</small>
          </div>
        </div>
      </div>

      <div className="admin-avatar-grid">
        <section className="admin-panel admin-avatar-preview-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="chapter">Vista previa</span>
              <h2>{user?.name}</h2>
              <p>
                @{user?.username} · {user?.email}
              </p>
            </div>
          </div>
          <div className="admin-avatar-stage">
            <CareAvatar {...avatarConfig} />
          </div>
          <div className="admin-avatar-pet">
            <PetVisual user={user} furColor={petFurColor} />
            <span>Mascota · {user?.petName || 'Chispita'}</span>
          </div>
        </section>

        <section className="admin-panel admin-avatar-controls">
          <div className="admin-panel-heading">
            <div>
              <span className="chapter">Personalización</span>
              <h2>Tu look</h2>
              <p>Elige la ropa, el cabello y cada color.</p>
            </div>
          </div>
          <div className="admin-avatar-controls-body">
            <form className="admin-avatar-name" onSubmit={saveName}>
              <label htmlFor="admin-profile-name">Nombre</label>
              <div className="admin-avatar-name-row">
                <input
                  id="admin-profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <button type="submit">Guardar</button>
              </div>
              {message && (
                <small className="admin-avatar-message" role="status">
                  {message}
                </small>
              )}
            </form>
            <AvatarPetEditor />
          </div>
        </section>
      </div>
    </section>
  )
}
export default AdminAvatarPage
