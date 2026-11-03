'use client'

import { useEffect, useState } from 'react'

import AdminIcon from '@/components/admin-icon'
import AdminPostCard from '@/components/admin-post-card'
import AvatarPetEditor from '@/components/avatar-pet-editor'
import PetVisual from '@/components/pet-visual'
import { CareAvatar } from '@/components/ui'
import { useCommunity } from '@/context/app-context'

const settingsTabs = [
  { id: 'profile', label: 'Perfil', icon: 'user' },
  { id: 'pet', label: 'Mascota', icon: 'heart' },
  { id: 'avatar', label: 'Avatar', icon: 'edit' },
  { id: 'security', label: 'Seguridad', icon: 'review' }
]

function initials(name) {
  return String(name || '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

function Message({ message }) {
  if (!message.text) return null
  return (
    <small
      className={`admin-settings-message ${message.type === 'error' ? 'is-error' : 'is-success'}`}
      role="status"
    >
      {message.text}
    </small>
  )
}

export default function GuaubookProfilePanel({ user, myPosts, followers, following, onPublish }) {
  const { avatarConfig, petFurColor, updateProfile, updatePassword } = useCommunity()
  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [petName, setPetName] = useState(user?.petName ?? 'Chispita')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [personalMessage, setPersonalMessage] = useState({ type: '', text: '' })
  const [petMessage, setPetMessage] = useState({ type: '', text: '' })
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })
  const [socialView, setSocialView] = useState(null)
  const [socialQuery, setSocialQuery] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState('profile')

  useEffect(() => {
    if (!socialView && !settingsOpen) return
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setSocialView(null)
        setSettingsOpen(false)
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [socialView, settingsOpen])

  function openSocial(view) {
    setSocialQuery('')
    setSocialView(view)
  }
  function openSettings() {
    setPersonalMessage({ type: '', text: '' })
    setPetMessage({ type: '', text: '' })
    setPasswordMessage({ type: '', text: '' })
    setSettingsTab('profile')
    setSettingsOpen(true)
  }
  function savePersonal(event) {
    event.preventDefault()
    const result = updateProfile({ name, username, email })
    setPersonalMessage(
      result?.ok
        ? { type: 'success', text: 'Datos personales actualizados.' }
        : { type: 'error', text: result?.error || 'No se pudieron guardar los datos.' }
    )
  }
  function savePet(event) {
    event.preventDefault()
    const result = updateProfile({ petName })
    setPetMessage(
      result?.ok
        ? { type: 'success', text: 'Nombre de la mascota actualizado.' }
        : { type: 'error', text: result?.error || 'No se pudo guardar la mascota.' }
    )
  }
  function changePassword(event) {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: 'La nueva contraseña y su confirmación no coinciden.'
      })
      return
    }
    const result = updatePassword(currentPassword, newPassword)
    if (!result?.ok) {
      setPasswordMessage({
        type: 'error',
        text: result?.error || 'No se pudo cambiar la contraseña.'
      })
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' })
  }
  return (
    <div className="admin-profile-view">
      <section className="admin-panel admin-profile-hero">
        <div className="admin-profile-hero-body">
          <div className="admin-profile-hero-avatar">
            <CareAvatar {...avatarConfig} />
          </div>
          <div className="admin-profile-hero-info">
            <span className="chapter">Mi perfil</span>
            <h2>{user?.name}</h2>
            <p className="admin-profile-handle">@{user?.username}</p>
            <p>{user?.email}</p>
            <div className="admin-profile-hero-pet">
              <span className="admin-profile-hero-pet-visual">
                <PetVisual user={user} furColor={petFurColor} />
              </span>
              <div>
                <strong>{user?.petName || 'Chispita'}</strong>
                <small>{user?.petBio || 'Mascota de Croquetón'}</small>
              </div>
            </div>
          </div>
          <button
            className="admin-profile-edit-button"
            type="button"
            onClick={openSettings}
            aria-haspopup="dialog"
            aria-expanded={settingsOpen}
          >
            <AdminIcon type="edit" />
            <span>Editar perfil</span>
          </button>
        </div>
        <div className="admin-profile-stats">
          <div>
            <strong>{myPosts.length}</strong>
            <span>Publicaciones</span>
          </div>
          <button type="button" onClick={() => openSocial('followers')} aria-haspopup="dialog">
            <strong>{followers.length}</strong>
            <span>Seguidores</span>
          </button>
          <button type="button" onClick={() => openSocial('following')} aria-haspopup="dialog">
            <strong>{following.length}</strong>
            <span>Siguiendo</span>
          </button>
        </div>
      </section>

      <section className="admin-panel admin-profile-posts" id="mis-publicaciones">
        <div className="admin-panel-heading">
          <div>
            <span className="chapter">Mi actividad</span>
            <h2>Mis publicaciones</h2>
            <p>Solo las publicaciones que ya hiciste.</p>
          </div>
          <span className="admin-count">{myPosts.length}</span>
        </div>
        {myPosts.length ? (
          <div className="admin-post-grid">
            {myPosts.map((post) => (
              <AdminPostCard key={post.id} post={post} allowManage />
            ))}
          </div>
        ) : (
          <div className="admin-empty compact">
            <strong>Aún no has publicado nada</strong>
            <p>Cuando publiques algo, aparecerá aquí.</p>
          </div>
        )}
        <div className="admin-profile-posts-action">
          <button className="admin-approve" type="button" onClick={onPublish}>
            Publicar algo
          </button>
        </div>
      </section>

      {settingsOpen && (
        <div
          className="admin-settings-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSettingsOpen(false)
          }}
        >
          <section
            className="admin-settings-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-settings-title"
          >
            <div className="admin-settings-dialog-head">
              <div>
                <span className="chapter">Mi perfil</span>
                <h2 id="admin-settings-title">Editar perfil</h2>
                <p>Actualiza tus datos, tu avatar, tu mascota y tu contraseña.</p>
              </div>
              <button
                className="admin-settings-close"
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="admin-settings-tabs" role="tablist" aria-label="Secciones de edición">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`settings-tab-${tab.id}`}
                  className={`admin-settings-tab ${settingsTab === tab.id ? 'is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={settingsTab === tab.id}
                  aria-controls={`settings-panel-${tab.id}`}
                  onClick={() => setSettingsTab(tab.id)}
                >
                  <AdminIcon type={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="admin-settings-dialog-body">
              <div
                className="admin-settings-pane"
                id={`settings-panel-${settingsTab}`}
                role="tabpanel"
                aria-labelledby={`settings-tab-${settingsTab}`}
              >
                {settingsTab === 'profile' && (
                  <form className="admin-settings-card" onSubmit={savePersonal}>
                    <h3>Datos personales</h3>
                    <p>Así te verá la comunidad en GuauBook.</p>
                    <label>
                      Nombre completo
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        maxLength={60}
                      />
                    </label>
                    <label>
                      Nombre de usuario
                      <span className="admin-settings-prefix">
                        <span>@</span>
                        <input
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                          required
                          minLength={3}
                          maxLength={24}
                          pattern="[a-z0-9._]{3,24}"
                        />
                      </span>
                    </label>
                    <label>
                      Correo electrónico
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </label>
                    <button className="admin-approve" type="submit">
                      Guardar datos
                    </button>
                    <Message message={personalMessage} />
                  </form>
                )}

                {settingsTab === 'pet' && (
                  <form className="admin-settings-card" onSubmit={savePet}>
                    <h3>Mi mascota</h3>
                    <p>Ponle un nombre a tu mascota.</p>
                    <label>
                      Nombre de la mascota
                      <input
                        value={petName}
                        onChange={(event) => setPetName(event.target.value)}
                        required
                        maxLength={40}
                      />
                    </label>
                    <button className="admin-approve" type="submit">
                      Guardar mascota
                    </button>
                    <Message message={petMessage} />
                  </form>
                )}

                {settingsTab === 'avatar' && (
                  <section className="admin-settings-card admin-settings-avatar">
                    <h3>Avatar y mascota</h3>
                    <p>
                      Cambia la ropa, el cabello y los colores. Los cambios se guardan al instante.
                    </p>
                    <div className="admin-settings-avatar-preview">
                      <div className="admin-settings-avatar-stage">
                        <CareAvatar {...avatarConfig} />
                      </div>
                      <div className="admin-settings-avatar-pet">
                        <span className="admin-settings-avatar-pet-visual">
                          <PetVisual user={user} furColor={petFurColor} />
                        </span>
                        <span>
                          <small>Mascota</small>
                          <strong>{user?.petName || 'Chispita'}</strong>
                        </span>
                      </div>
                    </div>
                    <AvatarPetEditor />
                  </section>
                )}

                {settingsTab === 'security' && (
                  <div className="admin-settings-security">
                    <form className="admin-settings-card" onSubmit={changePassword}>
                      <h3>Contraseña</h3>
                      <p>Confirma tu contraseña actual antes de establecer una nueva.</p>
                      <label>
                        Contraseña actual
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(event) => setCurrentPassword(event.target.value)}
                          required
                          autoComplete="current-password"
                        />
                      </label>
                      <label>
                        Nueva contraseña
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(event) => setNewPassword(event.target.value)}
                          required
                          minLength={6}
                          autoComplete="new-password"
                        />
                      </label>
                      <label>
                        Confirmar nueva contraseña
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          required
                          minLength={6}
                          autoComplete="new-password"
                        />
                      </label>
                      <button className="admin-approve" type="submit">
                        Cambiar contraseña
                      </button>
                      <Message message={passwordMessage} />
                    </form>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {socialView && (
        <div
          className="admin-social-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSocialView(null)
          }}
        >
          <section
            className="admin-social-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-social-title"
          >
            <div className="admin-social-dialog-head">
              <div>
                <span className="chapter">Comunidad</span>
                <h2 id="admin-social-title">
                  {socialView === 'followers' ? 'Seguidores' : 'Siguiendo'}
                </h2>
                <p>{socialView === 'followers' ? followers.length : following.length} personas</p>
              </div>
              <button
                className="admin-social-close"
                type="button"
                onClick={() => setSocialView(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <label className="admin-social-search">
              <span>Buscar</span>
              <input
                value={socialQuery}
                onChange={(event) => setSocialQuery(event.target.value)}
                placeholder="Buscar por nombre o @usuario"
                autoFocus
              />
            </label>
            <div className="admin-social-dialog-list">
              {(() => {
                const people = socialView === 'followers' ? followers : following
                const query = socialQuery.trim().toLowerCase()
                const filtered = people.filter((person) =>
                  `${person.name} ${person.handle}`.toLowerCase().includes(query)
                )
                if (!filtered.length)
                  return (
                    <div className="admin-empty compact">
                      <strong>Sin resultados</strong>
                      <p>No encontramos personas con ese nombre o usuario.</p>
                    </div>
                  )
                return (
                  <ul>
                    {filtered.map((person) => (
                      <li key={person.handle}>
                        <span className="admin-social-avatar">{initials(person.name)}</span>
                        <div>
                          <strong>{person.name}</strong>
                          <small>{person.handle}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              })()}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
