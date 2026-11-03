'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ChangeEvent, type FormEvent } from 'react'

import { Paw } from '@/assets/icons/paw'
import { EmptyStateCard } from '@/components/empty-state-card'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import {
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogViewport
} from '@/components/ui/dialog'
import { Eyebrow } from '@/components/ui/eyebrow'
import { FieldLabel, TextInput, TextareaInput } from '@/components/ui/field'
import { PetVisual, UserAvatar } from '@/components/user-visuals'
import { useNavigate } from '@/lib/navigation'
import {
  useCommunity,
  type CommunityError,
  type CommunityUser
} from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

const MAX_IMAGE_SIZE = 8 * 1024 * 1024
const MAX_IMAGE_DIMENSION = 720
const IMAGE_QUALITY = 0.82

type StatusMessage = { text: string; type: 'error' | 'success' } | null

const errorMessages: Record<CommunityError, { en: string; es: string }> = {
  current_password_incorrect: {
    en: 'The current password is not correct.',
    es: 'La contraseña actual no es correcta.'
  },
  email_invalid: {
    en: 'Write a valid email address.',
    es: 'Escribe un correo electrónico válido.'
  },
  email_taken: {
    en: 'That email address is already registered.',
    es: 'Ese correo electrónico ya está registrado.'
  },
  name_required: {
    en: 'Your full name cannot be empty.',
    es: 'Tu nombre completo no puede quedar vacío.'
  },
  no_session: {
    en: 'There is no active session.',
    es: 'No hay una sesión activa.'
  },
  password_same: {
    en: 'The new password must be different from the current one.',
    es: 'La nueva contraseña debe ser diferente a la actual.'
  },
  password_too_short: {
    en: 'The new password must have at least 6 characters.',
    es: 'La nueva contraseña debe tener al menos 6 caracteres.'
  },
  password_unavailable: {
    en: 'Password changes are not available in this browser.',
    es: 'El cambio de contraseña no está disponible en este navegador.'
  },
  pet_name_required: {
    en: "Your pet's name cannot be empty.",
    es: 'El nombre de tu mascota no puede quedar vacío.'
  },
  username_invalid: {
    en: 'The username must have 3 to 24 characters and use only letters, numbers, periods or underscores.',
    es: 'El nombre de usuario debe tener entre 3 y 24 caracteres y usar solo letras, números, puntos o guiones bajos.'
  },
  username_taken: {
    en: 'That username is already in use.',
    es: 'Ese nombre de usuario ya está en uso.'
  }
}

function errorText(code: CommunityError, isEnglish: boolean) {
  return isEnglish ? errorMessages[code].en : errorMessages[code].es
}

function imageErrorText(reason: 'invalid' | 'read' | 'too_large', isEnglish: boolean) {
  if (reason === 'invalid') {
    return isEnglish ? 'Choose an image file.' : 'Elige un archivo de imagen.'
  }

  if (reason === 'too_large') {
    return isEnglish
      ? 'The image is too large. Use one smaller than 8 MB.'
      : 'La imagen es muy grande. Usa una de menos de 8 MB.'
  }

  return isEnglish ? 'The image could not be read.' : 'No se pudo leer la imagen.'
}

function readImageFile(
  file: File | undefined,
  onLoad: (dataUrl: string) => void,
  onError: (reason: 'invalid' | 'read' | 'too_large') => void
) {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    onError('invalid')
    return
  }

  if (file.size > MAX_IMAGE_SIZE) {
    onError('too_large')
    return
  }

  const reader = new FileReader()

  reader.addEventListener('load', () => {
    if (typeof reader.result !== 'string') {
      onError('read')
      return
    }

    const image = new window.Image()

    image.addEventListener('load', () => {
      try {
        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext('2d')

        if (!context) {
          onError('read')
          return
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        onLoad(canvas.toDataURL('image/webp', IMAGE_QUALITY))
      } catch {
        onError('read')
      }
    })
    image.addEventListener('error', () => onError('read'))
    image.src = reader.result
  })
  reader.addEventListener('error', () => onError('read'))
  reader.readAsDataURL(file)
}

function StatusMessage({ message }: { message: StatusMessage }) {
  if (!message) return <span className="block min-h-4.5" aria-live="polite" />

  return (
    <small
      role="status"
      aria-live="polite"
      className={
        message.type === 'error'
          ? 'block min-h-4.5 text-small font-extrabold text-[#9e3b28]'
          : 'block min-h-4.5 text-small font-extrabold text-[#2f6b45]'
      }
    >
      {message.text}
    </small>
  )
}

function ProfileStat({
  label,
  value,
  onClick,
  active
}: {
  label: string
  value: number
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'rounded-2xl border-3 border-ink bg-brand px-3 py-2.5 text-center shadow-[3px_3px_0_var(--ink-faint)]'
          : 'rounded-2xl border-3 border-ink bg-card px-3 py-2.5 text-center transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--ink-faint)]'
      }
    >
      <strong className="block font-heading text-[clamp(24px,4vw,34px)] leading-none">
        {value}
      </strong>
      <span className="mt-1 block text-caption font-extrabold opacity-65 phone:text-micro">
        {label}
      </span>
    </button>
  )
}

function ImagePicker({
  accept = 'image/*',
  buttonLabel,
  disabled,
  hasImage,
  onFile,
  onRemove,
  removeLabel
}: {
  accept?: string
  buttonLabel: string
  disabled?: boolean
  hasImage: boolean
  onFile: (event: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
  removeLabel: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="cursor-(--paw-cursor) rounded-pill border-2 border-ink bg-brand px-3 py-1.5 text-caption font-black">
        <input
          type="file"
          accept={accept}
          className="absolute size-px opacity-0"
          onChange={onFile}
          disabled={disabled}
        />
        {buttonLabel}
      </label>
      {hasImage && (
        <button
          type="button"
          className="rounded-pill border-2 border-ink bg-card px-3 py-1.5 text-caption font-black"
          onClick={onRemove}
        >
          {removeLabel}
        </button>
      )}
    </div>
  )
}

export function GuaubookProfilePage() {
  const { language } = useLanguage()
  const { user, posts, follows, profiles, petFurColor, updateProfile, updatePassword, signOut } =
    useCommunity()
  const navigate = useNavigate()
  const pathname = usePathname()
  const isEnglish = language === 'en'
  const backHref = pathname.startsWith('/admin') ? '/admin/guaubook' : '/guaubook'

  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [avatarImage, setAvatarImage] = useState<string | null | undefined>(user?.avatarImage)
  const [petName, setPetName] = useState(user?.petName ?? '')
  const [petBio, setPetBio] = useState(user?.petBio ?? '')
  const [petPhoto, setPetPhoto] = useState<string | null | undefined>(user?.petPhoto)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [personalMessage, setPersonalMessage] = useState<StatusMessage>(null)
  const [petMessage, setPetMessage] = useState<StatusMessage>(null)
  const [passwordMessage, setPasswordMessage] = useState<StatusMessage>(null)
  const [activeStat, setActiveStat] = useState<'posts' | 'followers' | 'following'>('posts')
  const [isFollowersOpen, setIsFollowersOpen] = useState(false)
  const [isFollowingOpen, setIsFollowingOpen] = useState(false)
  const [followerSearch, setFollowerSearch] = useState('')
  const [followingSearch, setFollowingSearch] = useState('')

  if (!user) return null

  const userPosts = posts.filter((post) =>
    post.authorEmail ? post.authorEmail === user.email : post.author === user.name
  )
  const followingEmails = follows[user.email] ?? []
  const followerEmails = Object.entries(follows)
    .filter(([followerEmail, followedEmails]) => {
      return followerEmail !== user.email && followedEmails.includes(user.email)
    })
    .map(([followerEmail]) => followerEmail)

  const followerProfiles = followerEmails
    .map((email) => profiles[email])
    .filter((profile): profile is CommunityUser => Boolean(profile))
  const followingProfiles = followingEmails
    .map((email) => profiles[email])
    .filter((profile): profile is CommunityUser => Boolean(profile))

  const filteredFollowers = followerProfiles.filter((profile) => {
    const query = followerSearch.trim().toLowerCase()
    if (!query) return true
    return (
      profile.name.toLowerCase().includes(query) ||
      profile.username.toLowerCase().includes(query)
    )
  })
  const filteredFollowing = followingProfiles.filter((profile) => {
    const query = followingSearch.trim().toLowerCase()
    if (!query) return true
    return (
      profile.name.toLowerCase().includes(query) ||
      profile.username.toLowerCase().includes(query)
    )
  })

  const previewUser: CommunityUser = {
    ...user,
    avatarImage: avatarImage ?? undefined,
    email,
    name,
    petName,
    petPhoto: petPhoto ?? undefined,
    username
  }

  function handlePersonalSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = updateProfile({ avatarImage, email, name, username })

    setPersonalMessage(
      result.ok
        ? {
            type: 'success',
            text: isEnglish ? 'Profile updated.' : 'Perfil actualizado.'
          }
        : { type: 'error', text: errorText(result.error, isEnglish) }
    )
  }

  function handlePetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = updateProfile({ petBio, petName, petPhoto })

    setPetMessage(
      result.ok
        ? {
            type: 'success',
            text: isEnglish ? 'Pet information updated.' : 'Información de tu mascota actualizada.'
          }
        : { type: 'error', text: errorText(result.error, isEnglish) }
    )
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: isEnglish
          ? 'The new password and its confirmation do not match.'
          : 'La nueva contraseña y su confirmación no coinciden.'
      })
      return
    }

    const result = await updatePassword(currentPassword, newPassword)

    if (!result.ok) {
      setPasswordMessage({ type: 'error', text: errorText(result.error, isEnglish) })
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordMessage({
      type: 'success',
      text: isEnglish ? 'Password changed successfully.' : 'Contraseña actualizada correctamente.'
    })
  }

  function handleAvatarFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    readImageFile(
      file,
      (dataUrl) => {
        setAvatarImage(dataUrl)
        setPersonalMessage(null)
      },
      (reason) => {
        setPersonalMessage({ type: 'error', text: imageErrorText(reason, isEnglish) })
      }
    )
    event.target.value = ''
  }

  function handlePetFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    readImageFile(
      file,
      (dataUrl) => {
        setPetPhoto(dataUrl)
        setPetMessage(null)
      },
      (reason) => {
        setPetMessage({ type: 'error', text: imageErrorText(reason, isEnglish) })
      }
    )
    event.target.value = ''
  }

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button type="button" size="sm" render={<Link href={backHref} />}>
          {isEnglish ? 'Back to GuauBook' : 'Volver a GuauBook'}
        </Button>
      </div>
      <div className="mb-5">
        <Eyebrow variant="section" tone="accent">
          {isEnglish ? 'My profile' : 'Mi perfil'}
        </Eyebrow>
        <h1 className="mt-2 mb-0 text-[clamp(42px,6vw,72px)] leading-[0.88]">
          {user.name}
        </h1>
      </div>

      <section className="grid grid-cols-[132px_minmax(0,1fr)_auto] items-center gap-6 rounded-3xl border-4 border-ink bg-surface-warm p-5.5 shadow-card tablet:grid-cols-[120px_minmax(0,1fr)] phone:grid-cols-[1fr] phone:justify-items-center phone:gap-4 phone:p-4.5 phone:text-center">
        <UserAvatar
          user={previewUser}
          className="size-32 flex-none shadow-[4px_4px_0_var(--ink-faint)] tablet:size-28 phone:size-26"
        />
        <div className="min-w-0">
          <Eyebrow>{isEnglish ? 'Account' : 'Cuenta'}</Eyebrow>
          <h2 className="m-0 mt-1.5 text-[clamp(38px,5vw,58px)] leading-[0.9] break-words phone:text-[clamp(34px,11vw,44px)]">
            {user.name}
          </h2>
          <p className="mt-1 mb-1 text-small font-black opacity-65">@{user.username}</p>
          <p className="m-0 text-small font-extrabold break-all opacity-65">{user.email}</p>
          <div className="mt-3 inline-flex max-w-full items-center gap-2.5 rounded-pill border-2 border-ink bg-card px-3 py-1.5 text-left phone:max-w-full">
            <span className="size-10 flex-none overflow-hidden rounded-circle border-2 border-ink bg-brand">
              <PetVisual
                user={previewUser}
                furColor={petFurColor}
                className="size-full object-cover"
              />
            </span>
            <span className="min-w-0">
              <span className="block text-micro font-black tracking-label uppercase opacity-60">
                {isEnglish ? 'My pet' : 'Mi mascota'}
              </span>
              <strong className="block truncate text-small leading-tight">{user.petName}</strong>
              {user.petBio && (
                <span className="block max-w-70 truncate text-micro font-extrabold opacity-60 phone:max-w-full">
                  {user.petBio}
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="grid justify-items-end gap-2.5 tablet:col-span-full tablet:grid-cols-2 tablet:justify-items-stretch phone:col-auto phone:w-full phone:grid-cols-1">
          <Button type="button" size="sm" className="w-full" onClick={handleSignOut}>
            {isEnglish ? 'Sign out' : 'Cerrar sesión'}
          </Button>
          <Button
            type="button"
            variant="underline"
            className="w-full text-center text-ink"
            render={<Link href="/avatar-mascota" />}
          >
            {isEnglish ? 'Avatar & pet studio' : 'Estudio de avatar y mascota'}
          </Button>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-3 gap-3 phone:gap-2">
        <ProfileStat
          value={userPosts.length}
          label={isEnglish ? 'Posts' : 'Publicaciones'}
          active={activeStat === 'posts'}
          onClick={() => {
            setActiveStat('posts')
            document.getElementById('my-posts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        />
        <ProfileStat
          value={followerEmails.length}
          label={isEnglish ? 'Followers' : 'Seguidores'}
          active={activeStat === 'followers'}
          onClick={() => {
            setActiveStat('followers')
            setIsFollowersOpen(true)
          }}
        />
        <ProfileStat
          value={followingEmails.length}
          label={isEnglish ? 'Following' : 'Siguiendo'}
          active={activeStat === 'following'}
          onClick={() => {
            setActiveStat('following')
            setIsFollowingOpen(true)
          }}
        />
      </div>

      <div className="mt-6 grid grid-cols-[minmax(320px,0.85fr)_minmax(0,1fr)] items-start gap-8 tablet:grid-cols-[1fr] tablet:gap-7 phone:gap-5">
        <div className="grid gap-5">
          <form
            className="grid gap-4 rounded-3xl border-4 border-ink bg-card p-5.5 shadow-card phone:p-4"
            onSubmit={handlePersonalSubmit}
          >
            <div>
              <Eyebrow variant="section" tone="accent">
                {isEnglish ? 'Personal information' : 'Información personal'}
              </Eyebrow>
              <h3 className="mt-1.5 mb-1 font-heading text-[28px] leading-none">
                {isEnglish ? 'Edit my profile' : 'Editar mi perfil'}
              </h3>
              <p className="m-0 text-small font-extrabold opacity-65">
                {isEnglish
                  ? 'Update your name, username, email and avatar.'
                  : 'Actualiza tu nombre, usuario, correo y avatar.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-ink bg-surface-warm p-3.5">
              <UserAvatar user={previewUser} className="size-20 flex-none phone:size-18" />
              <div className="grid min-w-0 gap-1.5">
                <strong className="font-heading text-[20px]">
                  {isEnglish ? 'Avatar' : 'Avatar'}
                </strong>
                <small className="font-extrabold opacity-65">
                  {isEnglish
                    ? 'Upload a photo for your profile.'
                    : 'Sube una foto para tu perfil.'}
                </small>
                <ImagePicker
                  buttonLabel={isEnglish ? 'Choose image' : 'Elegir imagen'}
                  hasImage={!!(avatarImage || previewUser.avatarImage)}
                  onFile={handleAvatarFile}
                  onRemove={() => setAvatarImage(null)}
                  removeLabel={isEnglish ? 'Remove' : 'Quitar'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 phone:grid-cols-1">
              <FieldLabel>
                {isEnglish ? 'Full name' : 'Nombre completo'}
                <TextInput
                  variant="control"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={60}
                  autoComplete="name"
                />
              </FieldLabel>
              <FieldLabel>
                {isEnglish ? 'Username' : 'Nombre de usuario'}
                <TextInput
                  variant="control"
                  value={username}
                  onChange={(event) => setUsername(event.target.value.toLowerCase())}
                  required
                  minLength={3}
                  maxLength={24}
                  pattern="[a-z0-9._]{3,24}"
                  autoComplete="username"
                />
              </FieldLabel>
              <FieldLabel className="col-span-full phone:col-1">
                {isEnglish ? 'Email' : 'Correo electrónico'}
                <TextInput
                  variant="control"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                />
              </FieldLabel>
            </div>

            <div>
              <Button type="submit" size="sm">
                {isEnglish ? 'Save profile' : 'Guardar perfil'}
              </Button>
            </div>
            <StatusMessage message={personalMessage} />
          </form>

          <form
            className="grid gap-4 rounded-3xl border-4 border-ink bg-card p-5.5 shadow-card phone:p-4"
            onSubmit={handlePetSubmit}
          >
            <div>
              <Eyebrow variant="section" tone="accent">
                {isEnglish ? 'My pet' : 'Mi mascota'}
              </Eyebrow>
              <h3 className="mt-1.5 mb-1 font-heading text-[28px] leading-none">
                {isEnglish ? 'Edit pet information' : 'Editar información de mi mascota'}
              </h3>
              <p className="m-0 text-small font-extrabold opacity-65">
                {isEnglish
                  ? 'Change your pet photo, name and description.'
                  : 'Cambia la foto, el nombre y la descripción de tu mascota.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-ink bg-surface-warm p-3.5">
              <span className="size-20 flex-none overflow-hidden rounded-circle border-3 border-ink bg-brand phone:size-18">
                <PetVisual
                  user={previewUser}
                  furColor={petFurColor}
                  className="size-full object-cover"
                />
              </span>
              <div className="grid min-w-0 gap-1.5">
                <strong className="font-heading text-[20px]">
                  {isEnglish ? "My pet's photo" : 'Foto de mi mascota'}
                </strong>
                <small className="font-extrabold opacity-65">
                  {isEnglish
                    ? 'Upload a photo of your pet.'
                    : 'Sube una fotografía de tu mascota.'}
                </small>
                <ImagePicker
                  buttonLabel={isEnglish ? 'Choose image' : 'Elegir imagen'}
                  hasImage={!!(petPhoto || previewUser.petPhoto)}
                  onFile={handlePetFile}
                  onRemove={() => setPetPhoto(null)}
                  removeLabel={isEnglish ? 'Remove' : 'Quitar'}
                />
              </div>
            </div>

            <FieldLabel>
              {isEnglish ? "Pet's name" : 'Nombre de la mascota'}
              <TextInput
                variant="control"
                value={petName}
                onChange={(event) => setPetName(event.target.value)}
                required
                maxLength={40}
              />
            </FieldLabel>
            <FieldLabel>
              {isEnglish ? 'Pet description' : 'Descripción de la mascota'}
              <TextareaInput
                variant="control"
                value={petBio}
                onChange={(event) => setPetBio(event.target.value)}
                maxLength={180}
                placeholder={
                  isEnglish
                    ? 'Breed, personality, favorite snack…'
                    : 'Raza, personalidad, su snack favorito…'
                }
              />
            </FieldLabel>

            <div>
              <Button type="submit" size="sm">
                {isEnglish ? 'Save pet' : 'Guardar mascota'}
              </Button>
            </div>
            <StatusMessage message={petMessage} />
          </form>

          <form
            className="grid gap-4 rounded-3xl border-4 border-ink bg-card p-5.5 shadow-card phone:p-4"
            onSubmit={handlePasswordSubmit}
          >
            <div>
              <Eyebrow variant="section" tone="accent">
                {isEnglish ? 'Security' : 'Seguridad'}
              </Eyebrow>
              <h3 className="mt-1.5 mb-1 font-heading text-[28px] leading-none">
                {isEnglish ? 'Change password' : 'Cambiar contraseña'}
              </h3>
              <p className="m-0 text-small font-extrabold opacity-65">
                {isEnglish
                  ? 'Confirm your current password before setting a new one.'
                  : 'Confirma tu contraseña actual antes de establecer una nueva.'}
              </p>
            </div>

            <FieldLabel>
              {isEnglish ? 'Current password' : 'Contraseña actual'}
              <TextInput
                variant="control"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                autoComplete="current-password"
              />
            </FieldLabel>
            <div className="grid grid-cols-2 gap-4 phone:grid-cols-1">
              <FieldLabel>
                {isEnglish ? 'New password' : 'Nueva contraseña'}
                <TextInput
                  variant="control"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </FieldLabel>
              <FieldLabel>
                {isEnglish ? 'Confirm new password' : 'Confirmar nueva contraseña'}
                <TextInput
                  variant="control"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </FieldLabel>
            </div>

            <div>
              <Button type="submit" size="sm">
                {isEnglish ? 'Update password' : 'Actualizar contraseña'}
              </Button>
            </div>
            <StatusMessage message={passwordMessage} />
          </form>
        </div>

        <section id="my-posts" className="grid gap-5 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow variant="section" tone="accent">
                {isEnglish ? 'My activity' : 'Mi actividad'}
              </Eyebrow>
              <h2 className="mt-1.5 mb-0 font-heading text-[clamp(28px,4vw,40px)] leading-[0.95]">
                {isEnglish ? 'My posts' : 'Mis publicaciones'}
              </h2>
              <p className="mt-1.5 mb-0 text-small font-extrabold opacity-65">
                {isEnglish
                  ? 'Only the posts you have created appear here.'
                  : 'Aquí solo aparecen las publicaciones que tú hiciste.'}
              </p>
            </div>
            <span className="rounded-pill border-2 border-ink bg-brand px-3 py-1 font-heading text-[20px] font-black">
              {userPosts.length}
            </span>
          </div>

          {userPosts.length ? (
            <div className="grid gap-4">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyStateCard
              title={
                isEnglish
                  ? 'Your first post will appear here.'
                  : 'Tu primera publicación aparecerá aquí.'
              }
              description={
                isEnglish
                  ? 'Share a photo or a story with the pack.'
                  : 'Comparte una foto o una historia con la manada.'
              }
            />
          )}

          <span className="inline-flex items-center gap-1.5 text-small font-extrabold opacity-60">
            <Paw className="w-4" />
            {isEnglish ? 'Croquetón community' : 'Comunidad Croquetón'}
          </span>
        </section>
      </div>

      <DialogRoot open={isFollowersOpen} onOpenChange={setIsFollowersOpen}>
        <DialogPortal>
          <DialogViewport>
            <DialogPopup>
              <DialogClose />
              <DialogTitle>{isEnglish ? 'Followers' : 'Seguidores'}</DialogTitle>
              <TextInput
                variant="control"
                value={followerSearch}
                onChange={(event) => setFollowerSearch(event.target.value)}
                placeholder={isEnglish ? 'Search by name or username' : 'Buscar por nombre o usuario'}
              />
              <div className="mt-4 grid gap-3">
                {filteredFollowers.length ? (
                  filteredFollowers.map((profile) => (
                    <div
                      key={profile.email}
                      className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-surface-warm p-3"
                    >
                      <UserAvatar user={profile} className="size-12 flex-none" />
                      <div className="min-w-0">
                        <strong className="block truncate font-heading text-[18px]">{profile.name}</strong>
                        <span className="block truncate text-small font-extrabold opacity-65">
                          @{profile.username}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="m-0 font-extrabold opacity-65">
                    {isEnglish
                      ? 'You do not have followers yet.'
                      : 'Todavía no tienes seguidores.'}
                  </p>
                )}
              </div>
            </DialogPopup>
          </DialogViewport>
        </DialogPortal>
      </DialogRoot>

      <DialogRoot open={isFollowingOpen} onOpenChange={setIsFollowingOpen}>
        <DialogPortal>
          <DialogViewport>
            <DialogPopup>
              <DialogClose />
              <DialogTitle>{isEnglish ? 'Following' : 'Siguiendo'}</DialogTitle>
              <TextInput
                variant="control"
                value={followingSearch}
                onChange={(event) => setFollowingSearch(event.target.value)}
                placeholder={isEnglish ? 'Search by name or username' : 'Buscar por nombre o usuario'}
              />
              <div className="mt-4 grid gap-3">
                {filteredFollowing.length ? (
                  filteredFollowing.map((profile) => (
                    <div
                      key={profile.email}
                      className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-surface-warm p-3"
                    >
                      <UserAvatar user={profile} className="size-12 flex-none" />
                      <div className="min-w-0">
                        <strong className="block truncate font-heading text-[18px]">{profile.name}</strong>
                        <span className="block truncate text-small font-extrabold opacity-65">
                          @{profile.username}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="m-0 font-extrabold opacity-65">
                    {isEnglish
                      ? 'You are not following anyone yet.'
                      : 'Todavía no sigues a nadie.'}
                  </p>
                )}
              </div>
            </DialogPopup>
          </DialogViewport>
        </DialogPortal>
      </DialogRoot>
    </Container>
  )
}
