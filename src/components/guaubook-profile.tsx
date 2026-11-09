'use client'

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'

import { Paw } from '@/assets/icons/paw'
import {
  ColorSwatchGroup,
  CustomizerFieldset,
  TogglePillGroup
} from '@/components/customizer-controls'
import { EmptyStateCard } from '@/components/empty-state-card'
import { GuaubookComposer } from '@/components/guaubook-composer'
import { PostCard } from '@/components/post-card'
import { ProfileConnectionsDialog } from '@/components/profile-connections-dialog'
import { ProfileStats, ProfileSummaryCard } from '@/components/profile-summary'
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
import { followersOf, followingOf, getPostsByAuthor } from '@/lib/community'
import { readImageFile, type ImageFileError } from '@/lib/image-file'
import { useNavigate } from '@/lib/navigation'
import {
  useCommunity,
  type AvatarConfig,
  type CommunityError,
  type CommunityUser
} from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

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

function imageErrorText(reason: ImageFileError, isEnglish: boolean) {
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

function EditSection({
  eyebrow,
  title,
  description,
  children,
  className
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={
        className ?? 'grid gap-4 rounded-3xl border-4 border-ink bg-card p-4.5 phone:p-3.5'
      }
    >
      <div>
        <Eyebrow variant="section" tone="accent">
          {eyebrow}
        </Eyebrow>
        <h3 className="mt-1.5 mb-1 font-heading text-[26px] leading-none">{title}</h3>
        <p className="m-0 text-small font-extrabold opacity-65">{description}</p>
      </div>
      {children}
    </section>
  )
}

export function GuaubookProfilePage() {
  const { language } = useLanguage()
  const {
    user,
    posts,
    follows,
    profiles,
    petFurColor,
    updatePet,
    updateProfile,
    updatePassword,
    signOut
  } = useCommunity()
  const navigate = useNavigate()
  const isEnglish = language === 'en'

  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [avatarImage, setAvatarImage] = useState<string | null | undefined>(user?.avatarImage)
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | undefined>(user?.avatarConfig)
  const [petName, setPetName] = useState(user?.petName ?? '')
  const [petBio, setPetBio] = useState(user?.petBio ?? '')
  const [petPhoto, setPetPhoto] = useState<string | null | undefined>(user?.petPhoto)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [editMessage, setEditMessage] = useState<StatusMessage>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false)
  const [isPetEditorOpen, setIsPetEditorOpen] = useState(false)
  const [activeStat, setActiveStat] = useState<'posts' | 'followers' | 'following'>('posts')
  const [isFollowersOpen, setIsFollowersOpen] = useState(false)
  const [isFollowingOpen, setIsFollowingOpen] = useState(false)

  if (!user) return null

  const currentUser = user

  const userPosts = getPostsByAuthor(posts, profiles, user.email)
  const followingEmails = followingOf(follows, user.email)
  const followerEmails = followersOf(follows, user.email)

  const followerProfiles = followerEmails
    .map((email) => profiles[email])
    .filter((profile): profile is CommunityUser => Boolean(profile) && profile.isActive !== false)
  const followingProfiles = followingEmails
    .map((email) => profiles[email])
    .filter((profile): profile is CommunityUser => Boolean(profile) && profile.isActive !== false)

  const previewUser: CommunityUser = {
    ...user,
    avatarConfig: avatarConfig ?? user.avatarConfig,
    avatarImage: avatarImage ?? undefined,
    email,
    name,
    petName,
    petPhoto: petPhoto ?? undefined,
    username
  }

  async function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEditMessage(null)

    const wantsPasswordChange = Boolean(currentPassword || newPassword || confirmPassword)

    if (wantsPasswordChange) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setEditMessage({
          type: 'error',
          text: isEnglish
            ? 'Fill in all three password fields.'
            : 'Completa los tres campos de contraseña.'
        })
        return
      }

      if (newPassword !== confirmPassword) {
        setEditMessage({
          type: 'error',
          text: isEnglish
            ? 'The new password and its confirmation do not match.'
            : 'La nueva contraseña y su confirmación no coinciden.'
        })
        return
      }

      const passwordResult = await updatePassword(currentPassword, newPassword)

      if (!passwordResult.ok) {
        setEditMessage({ type: 'error', text: errorText(passwordResult.error, isEnglish) })
        return
      }
    }

    const result = updateProfile({
      avatarConfig: avatarConfig ?? currentUser.avatarConfig,
      avatarImage,
      email,
      name,
      petBio,
      petName,
      petPhoto,
      username
    })

    if (!result.ok) {
      setEditMessage({ type: 'error', text: errorText(result.error, isEnglish) })
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setEditMessage({
      type: 'success',
      text: isEnglish ? 'Information updated.' : 'Información actualizada correctamente.'
    })
  }

  function handleAvatarFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    readImageFile(
      file,
      (dataUrl) => {
        setAvatarImage(dataUrl)
        setEditMessage(null)
      },
      (reason) => {
        setEditMessage({ type: 'error', text: imageErrorText(reason, isEnglish) })
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
        setEditMessage(null)
      },
      (reason) => {
        setEditMessage({ type: 'error', text: imageErrorText(reason, isEnglish) })
      }
    )
    event.target.value = ''
  }

  function resetEditDraft() {
    if (!user) return

    setName(user.name)
    setUsername(user.username)
    setEmail(user.email)
    setAvatarImage(user.avatarImage)
    setAvatarConfig(user.avatarConfig)
    setPetName(user.petName)
    setPetBio(user.petBio)
    setPetPhoto(user.petPhoto)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setEditMessage(null)
    setIsAvatarEditorOpen(false)
    setIsPetEditorOpen(false)
  }

  function handleEditOpenChange(open: boolean) {
    if (open) resetEditDraft()
    setIsEditOpen(open)
    if (!open) setEditMessage(null)
  }

  function updateAvatarDraft(patch: Partial<AvatarConfig>) {
    setAvatarConfig((current) => ({ ...(current ?? currentUser.avatarConfig), ...patch }))
  }

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <Container as="section" className="pt-10 pb-27.5 tablet:pt-8.75 phone:pt-6 phone:pb-22.5">
      <div className="mb-5">
        <Eyebrow variant="section" tone="accent">
          {isEnglish ? 'My profile' : 'Mi perfil'}
        </Eyebrow>
        <h1 className="mt-2 mb-0 text-[clamp(42px,6vw,72px)] leading-[0.88]">{user.name}</h1>
      </div>

      <ProfileSummaryCard
        profile={previewUser}
        petFurColor={petFurColor}
        isEnglish={isEnglish}
        isOwner
        actions={
          <>
            <Button
              type="button"
              size="sm"
              className="w-full"
              onClick={() => handleEditOpenChange(true)}
            >
              {isEnglish ? 'Edit information' : 'Editar información'}
            </Button>
            <Button type="button" size="sm" className="w-full" onClick={handleSignOut}>
              {isEnglish ? 'Sign out' : 'Cerrar sesión'}
            </Button>
          </>
        }
      />

      <ProfileStats
        posts={userPosts.length}
        followers={followerEmails.length}
        following={followingEmails.length}
        activeStat={activeStat}
        isEnglish={isEnglish}
        onPosts={() => {
          setActiveStat('posts')
          document
            .getElementById('my-posts')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        onFollowers={() => {
          setActiveStat('followers')
          setIsFollowersOpen(true)
        }}
        onFollowing={() => {
          setActiveStat('following')
          setIsFollowingOpen(true)
        }}
      />

      <div className="mt-6">
        <GuaubookComposer />
      </div>

      <section id="my-posts" className="mt-5 grid scroll-mt-24 gap-5">
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
          <div className="grid gap-4 tablet:grid-cols-2 phone:grid-cols-1">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyStateCard
            title={isEnglish ? 'Do you want to post something?' : '¿Quieres publicar algo?'}
            description={
              isEnglish
                ? 'Share a photo, a story or a moment with the pack.'
                : 'Comparte una foto, una historia o un momento con la manada.'
            }
          />
        )}

        <span className="inline-flex items-center gap-1.5 text-small font-extrabold opacity-60">
          <Paw className="w-4" />
          {isEnglish ? 'Croquetón community' : 'Comunidad Croquetón'}
        </span>
      </section>

      <DialogRoot open={isEditOpen} onOpenChange={handleEditOpenChange}>
        <DialogPortal>
          <DialogViewport>
            <DialogPopup className="w-[min(960px,100%)]">
              <DialogClose />
              <DialogTitle>{isEnglish ? 'Edit information' : 'Editar información'}</DialogTitle>
              <form className="grid gap-5" onSubmit={handleEditSubmit}>
                <EditSection
                  eyebrow={isEnglish ? 'Avatar & pet' : 'Avatar y mascota'}
                  title={isEnglish ? 'Your look and your pet' : 'Tu look y tu mascota'}
                  description={
                    isEnglish
                      ? 'Update your avatar and pet photos, name and description in one place.'
                      : 'Actualiza el avatar, la foto, el nombre y la descripción de tu mascota en un solo lugar.'
                  }
                  className="grid gap-4 rounded-3xl border-4 border-ink bg-surface-warm p-4.5 phone:p-3.5"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 tablet:grid-cols-[1fr] phone:gap-3">
                    <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-ink bg-card p-3.5">
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
                        <Button
                          type="button"
                          variant="underline"
                          className="justify-self-start text-ink"
                          onClick={() => setIsAvatarEditorOpen((open) => !open)}
                        >
                          {isEnglish ? 'Edit avatar' : 'Editar avatar'}
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-ink bg-card p-3.5">
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
                        <Button
                          type="button"
                          variant="underline"
                          className="justify-self-start text-ink"
                          onClick={() => setIsPetEditorOpen((open) => !open)}
                        >
                          {isEnglish ? 'Edit pet' : 'Editar mascota'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isAvatarEditorOpen && (
                    <div className="grid gap-1 rounded-2xl border-2 border-ink bg-card p-3.5">
                      <CustomizerFieldset
                        legend={isEnglish ? 'Outfit type' : 'Tipo de ropa'}
                        className="border-t-0 pt-0"
                      >
                        <TogglePillGroup
                          value={previewUser.avatarConfig.outfit}
                          onValueChange={(value) =>
                            updateAvatarDraft({ outfit: value as AvatarConfig['outfit'] })
                          }
                          options={[
                            {
                              value: 'shirt',
                              label: isEnglish ? 'T-shirt and shorts' : 'Camiseta y shorts'
                            },
                            { value: 'dress', label: isEnglish ? 'Dress' : 'Vestido' },
                            { value: 'overalls', label: isEnglish ? 'Overalls' : 'Overol' }
                          ]}
                        />
                      </CustomizerFieldset>
                      <CustomizerFieldset legend={isEnglish ? 'Hair' : 'Cabello'}>
                        <TogglePillGroup
                          value={previewUser.avatarConfig.hair}
                          onValueChange={(value) =>
                            updateAvatarDraft({ hair: value as AvatarConfig['hair'] })
                          }
                          options={[
                            { value: 'none', label: isEnglish ? 'No hair' : 'Sin cabello' },
                            { value: 'short', label: isEnglish ? 'Short' : 'Corto' },
                            { value: 'long', label: isEnglish ? 'Long' : 'Largo' }
                          ]}
                        />
                      </CustomizerFieldset>
                      <CustomizerFieldset legend={isEnglish ? 'Fur color' : 'Color de pelaje'}>
                        <ColorSwatchGroup
                          value={previewUser.avatarConfig.furColor}
                          onValueChange={(color) => updateAvatarDraft({ furColor: color })}
                          options={[
                            { label: isEnglish ? 'Honey' : 'Miel', color: '#d98a4e' },
                            { label: isEnglish ? 'Cream' : 'Crema', color: '#efc88f' },
                            { label: 'Chocolate', color: '#805238' },
                            { label: isEnglish ? 'Gray' : 'Gris', color: '#8b929b' }
                          ]}
                        />
                      </CustomizerFieldset>
                      <CustomizerFieldset
                        legend={
                          previewUser.avatarConfig.outfit === 'dress'
                            ? isEnglish
                              ? 'Dress'
                              : 'Vestido'
                            : previewUser.avatarConfig.outfit === 'overalls'
                              ? isEnglish
                                ? 'Overalls'
                                : 'Overol'
                              : isEnglish
                                ? 'T-shirt'
                                : 'Camiseta'
                        }
                      >
                        <ColorSwatchGroup
                          value={previewUser.avatarConfig.shirtColor}
                          onValueChange={(color) => updateAvatarDraft({ shirtColor: color })}
                          options={[
                            { label: 'Coral', color: '#ef6547' },
                            { label: isEnglish ? 'Mustard' : 'Mostaza', color: '#e7b62d' },
                            { label: isEnglish ? 'Turquoise' : 'Turquesa', color: '#72bbba' },
                            { label: isEnglish ? 'Blue' : 'Azul', color: '#647fa1' }
                          ]}
                        />
                      </CustomizerFieldset>
                      <CustomizerFieldset
                        legend={
                          previewUser.avatarConfig.outfit === 'dress'
                            ? isEnglish
                              ? 'Dress detail'
                              : 'Detalle del vestido'
                            : previewUser.avatarConfig.outfit === 'overalls'
                              ? isEnglish
                                ? 'Inner T-shirt'
                                : 'Camiseta interior'
                              : 'Shorts'
                        }
                      >
                        <ColorSwatchGroup
                          value={previewUser.avatarConfig.shortsColor}
                          onValueChange={(color) => updateAvatarDraft({ shortsColor: color })}
                          options={[
                            { label: isEnglish ? 'Denim' : 'Mezclilla', color: '#647fa1' },
                            { label: 'Coral', color: '#ef6547' },
                            { label: isEnglish ? 'Olive' : 'Oliva', color: '#77845b' },
                            { label: isEnglish ? 'Cream' : 'Crema', color: '#e3d6bf' }
                          ]}
                        />
                      </CustomizerFieldset>
                      <CustomizerFieldset legend={isEnglish ? 'Sneakers' : 'Tenis'}>
                        <ColorSwatchGroup
                          value={previewUser.avatarConfig.shoesColor}
                          onValueChange={(color) => updateAvatarDraft({ shoesColor: color })}
                          options={[
                            { color: '#fff8df', label: isEnglish ? 'Cream' : 'Crema' },
                            { color: '#72bbba', label: isEnglish ? 'Turquoise' : 'Turquesa' },
                            { color: '#ef6547', label: 'Coral' }
                          ]}
                        />
                      </CustomizerFieldset>
                      <CustomizerFieldset legend={isEnglish ? 'Glasses' : 'Gafas'}>
                        <ColorSwatchGroup
                          value={previewUser.avatarConfig.glassesColor}
                          onValueChange={(color) => updateAvatarDraft({ glassesColor: color })}
                          options={[
                            {
                              color: '#202436',
                              label: isEnglish ? 'Dark blue' : 'Azul oscuro'
                            },
                            { color: '#ef6547', label: 'Coral' },
                            { color: '#4f83bd', label: isEnglish ? 'Blue' : 'Azul' }
                          ]}
                        />
                      </CustomizerFieldset>
                    </div>
                  )}

                  {isPetEditorOpen && (
                    <div className="rounded-2xl border-2 border-ink bg-card p-3.5">
                      <p className="m-0 mb-3 text-small font-extrabold opacity-65">
                        {isEnglish
                          ? "Choose your pet's fur color."
                          : 'Elige el color de pelaje de tu mascota.'}
                      </p>
                      <ColorSwatchGroup
                        value={petFurColor}
                        onValueChange={updatePet}
                        options={[
                          { color: '#efc88f', label: isEnglish ? 'Cream' : 'Crema' },
                          { color: '#d98a4e', label: isEnglish ? 'Honey' : 'Miel' },
                          { color: '#8b929b', label: isEnglish ? 'Gray' : 'Gris' }
                        ]}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 phone:grid-cols-1">
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
                    <FieldLabel className="col-span-full phone:col-1">
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
                  </div>
                </EditSection>

                <EditSection
                  eyebrow={isEnglish ? 'Personal information' : 'Información personal'}
                  title={isEnglish ? 'Edit my profile' : 'Editar mi perfil'}
                  description={
                    isEnglish
                      ? 'Update your name, username and email.'
                      : 'Actualiza tu nombre, usuario y correo.'
                  }
                >
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
                </EditSection>

                <EditSection
                  eyebrow={isEnglish ? 'Security' : 'Seguridad'}
                  title={isEnglish ? 'Change password' : 'Cambiar contraseña'}
                  description={
                    isEnglish
                      ? 'Confirm your current password before setting a new one.'
                      : 'Confirma tu contraseña actual antes de establecer una nueva.'
                  }
                >
                  <FieldLabel>
                    {isEnglish ? 'Current password' : 'Contraseña actual'}
                    <TextInput
                      variant="control"
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
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
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </FieldLabel>
                  </div>
                </EditSection>

                <StatusMessage message={editMessage} />

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="underline"
                    className="text-ink"
                    onClick={() => handleEditOpenChange(false)}
                  >
                    {isEnglish ? 'Cancel' : 'Cancelar'}
                  </Button>
                  <Button type="submit" size="sm">
                    {isEnglish ? 'Save information' : 'Guardar información'}
                  </Button>
                </div>
              </form>
            </DialogPopup>
          </DialogViewport>
        </DialogPortal>
      </DialogRoot>

      <ProfileConnectionsDialog
        open={isFollowersOpen}
        onOpenChange={setIsFollowersOpen}
        title={isEnglish ? 'Followers' : 'Seguidores'}
        connectionProfiles={followerProfiles}
        emptyText={isEnglish ? 'You do not have followers yet.' : 'Todavía no tienes seguidores.'}
      />

      <ProfileConnectionsDialog
        open={isFollowingOpen}
        onOpenChange={setIsFollowingOpen}
        title={isEnglish ? 'Following' : 'Siguiendo'}
        connectionProfiles={followingProfiles}
        emptyText={isEnglish ? 'You are not following anyone yet.' : 'Todavía no sigues a nadie.'}
      />
    </Container>
  )
}
