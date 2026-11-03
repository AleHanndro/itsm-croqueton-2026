/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext({ language: 'es', setLanguage: () => void 0 })
const ThemeContext = createContext({ theme: 'light', setTheme: () => void 0 })
const CommunityContext = createContext(null)
const defaultAvatarConfig = {
  furColor: '#d98a4e',
  shirtColor: '#ef6547',
  shortsColor: '#647fa1',
  shoesColor: '#fff8df',
  glassesColor: '#202436',
  outfit: 'shirt',
  hair: 'none'
}
const defaultAccounts = { 'admin@croqueton.mx': 'croqueton2026' }
const defaultAdmins = ['admin@croqueton.mx']
function usernameFromEmail(email) {
  const base = String(email || '')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '')
    .slice(0, 24)
  return base.length >= 3 ? base : `user${base || 'croqueton'}`.slice(0, 24)
}
function normalizeUser(raw) {
  if (!raw) return null
  const email = String(raw.email || '')
    .trim()
    .toLowerCase()
  return {
    name: String(raw.name || email.split('@')[0] || 'Croqueton').trim(),
    username: String(raw.username || usernameFromEmail(email)).toLowerCase(),
    email,
    petName: String(raw.petName || 'Chispita').trim(),
    petBio: String(raw.petBio || '').trim(),
    petPhoto: raw.petPhoto || null,
    avatarConfig: { ...defaultAvatarConfig, ...(raw.avatarConfig || {}) },
    petFurColor: raw.petFurColor || '#efc88f'
  }
}
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
function isUsername(value) {
  return /^[a-z0-9._]{3,24}$/.test(value)
}
function useLanguage() {
  return useContext(LanguageContext)
}
function useTheme() {
  return useContext(ThemeContext)
}
function useCommunity() {
  const community = useContext(CommunityContext)
  if (!community) throw new Error('Community provider is missing')
  return community
}

function AppProviders({ children }) {
  const [isHydrated, setIsHydrated] = useState(false)
  const [language, setLanguage] = useState('es')
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)
  const [sessionPersistence, setSessionPersistence] = useState('local')
  const [accounts, setAccounts] = useState(defaultAccounts)
  const [admins, setAdmins] = useState(defaultAdmins)
  const [profiles, setProfiles] = useState({})
  const [usernames, setUsernames] = useState({ admin: 'admin@croqueton.mx' })
  const [petFurColor, setPetFurColor] = useState('#efc88f')
  const [avatarConfig, setAvatarConfig] = useState(defaultAvatarConfig)
  const [posts, setPosts] = useState([])
  const [postReviewRequests, setPostReviewRequests] = useState([])
  const [joinApplications, setJoinApplications] = useState([])
  const [donationYears, setDonationYears] = useState([])
  const [adminLogs, setAdminLogs] = useState([])
  const [generationPhotos, setGenerationPhotos] = useState([])
  const [follows, setFollows] = useState({})

  useEffect(() => {
    const savedLanguage = readStorage('croqueton-language')
    if (savedLanguage === 'en' || savedLanguage === 'maya' || savedLanguage === 'es')
      setLanguage(savedLanguage)

    const savedTheme = readStorage('croqueton-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme)
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')

    const savedAccounts = readStorage('croqueton-accounts')
    let nextAccounts = defaultAccounts
    if (savedAccounts) {
      try {
        nextAccounts = { ...defaultAccounts, ...JSON.parse(savedAccounts) }
      } catch {
        nextAccounts = defaultAccounts
      }
      setAccounts(nextAccounts)
    }

    const savedAdmins = readStorage('croqueton-admins')
    if (savedAdmins) {
      try {
        const parsedAdmins = JSON.parse(savedAdmins)
        if (Array.isArray(parsedAdmins)) {
          setAdmins([...new Set([...defaultAdmins, ...parsedAdmins.map((email) => String(email).toLowerCase())])])
        }
      } catch {}
    }

    let nextProfiles = {}
    const savedProfiles = readStorage('croqueton-profiles')
    if (savedProfiles) {
      try {
        nextProfiles = JSON.parse(savedProfiles)
      } catch {
        nextProfiles = {}
      }
    }
    for (const email of Object.keys(nextAccounts)) {
      const key = email.toLowerCase()
      nextProfiles[key] = normalizeUser(nextProfiles[key] || { email: key })
    }

    const savedPetFurColor = readStorage('croqueton-pet-color')
    const savedAvatarConfig = readStorage('croqueton-avatar')
    let savedUser = readStorage('croqueton-user')
    let restoreFromSession = false
    if (!savedUser && typeof window !== 'undefined') {
      savedUser = window.sessionStorage.getItem('croqueton-user')
      restoreFromSession = !!savedUser
    }
    if (restoreFromSession) setSessionPersistence('session')
    let normalizedUser = null
    if (savedUser) {
      try {
        normalizedUser = normalizeUser(JSON.parse(savedUser))
      } catch {
        normalizedUser = null
      }
    }
    if (normalizedUser) {
      if (savedPetFurColor) normalizedUser.petFurColor = savedPetFurColor
      if (savedAvatarConfig) {
        try {
          normalizedUser.avatarConfig = {
            ...normalizedUser.avatarConfig,
            ...JSON.parse(savedAvatarConfig)
          }
        } catch {}
      }
      nextProfiles[normalizedUser.email] = normalizedUser
      setUser(normalizedUser)
      setPetFurColor(normalizedUser.petFurColor)
      setAvatarConfig(normalizedUser.avatarConfig)
    } else {
      if (savedPetFurColor) setPetFurColor(savedPetFurColor)
      if (savedAvatarConfig) {
        try {
          setAvatarConfig((current) => ({ ...current, ...JSON.parse(savedAvatarConfig) }))
        } catch {}
      }
    }
    setProfiles(nextProfiles)

    let nextUsernames = {}
    const savedUsernames = readStorage('croqueton-usernames')
    if (savedUsernames) {
      try {
        nextUsernames = JSON.parse(savedUsernames)
      } catch {
        nextUsernames = {}
      }
    }
    for (const email of Object.keys(nextAccounts)) {
      const profile = nextProfiles[email]
      const username = profile?.username || usernameFromEmail(email)
      if (!nextUsernames[username]) nextUsernames[username] = email
    }
    setUsernames(nextUsernames)

    const savedPosts = readStorage('croqueton-posts')
    if (savedPosts) setPosts(JSON.parse(savedPosts))

    const savedRequests = readStorage('croqueton-post-review-requests')
    if (savedRequests) setPostReviewRequests(JSON.parse(savedRequests))

    const savedJoinApplications = readStorage('croqueton-join-applications')
    if (savedJoinApplications) setJoinApplications(JSON.parse(savedJoinApplications))

    const savedDonationYears = readStorage('croqueton-donation-years')
    if (savedDonationYears) setDonationYears(JSON.parse(savedDonationYears))

    const savedGenerationPhotos = readStorage('croqueton-generation-photos')
    if (savedGenerationPhotos) {
      try {
        const parsedPhotos = JSON.parse(savedGenerationPhotos)
        if (Array.isArray(parsedPhotos)) setGenerationPhotos(parsedPhotos)
      } catch {}
    }

    const savedFollows = readStorage('croqueton-follows')
    if (savedFollows) {
      try {
        const parsedFollows = JSON.parse(savedFollows)
        if (parsedFollows && typeof parsedFollows === 'object') setFollows(parsedFollows)
      } catch {}
    }

    const savedAdminLogs = readStorage('croqueton-admin-logs')
    if (savedAdminLogs) {
      try {
        const parsedLogs = JSON.parse(savedAdminLogs)
        if (Array.isArray(parsedLogs)) setAdminLogs(parsedLogs)
      } catch {}
    }

    setIsHydrated(true)
  }, [])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-language', language)
    document.documentElement.lang = language === 'maya' ? 'yua' : language
  }, [language, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    if (!user) {
      window.localStorage.removeItem('croqueton-user')
      window.sessionStorage.removeItem('croqueton-user')
      return
    }
    if (sessionPersistence === 'session') {
      window.localStorage.removeItem('croqueton-user')
      window.sessionStorage.setItem('croqueton-user', JSON.stringify(user))
      return
    }
    window.sessionStorage.removeItem('croqueton-user')
    window.localStorage.setItem('croqueton-user', JSON.stringify(user))
  }, [user, isHydrated, sessionPersistence])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-accounts', JSON.stringify(accounts))
  }, [accounts, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-admins', JSON.stringify(admins))
  }, [admins, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-profiles', JSON.stringify(profiles))
  }, [profiles, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-usernames', JSON.stringify(usernames))
  }, [usernames, isHydrated])
  useEffect(() => {
    if (!isHydrated || !user) return
    setProfiles((current) => {
      if (current[user.email] === user) return current
      return { ...current, [user.email]: user }
    })
  }, [user, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-pet-color', petFurColor)
  }, [petFurColor, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-avatar', JSON.stringify(avatarConfig))
  }, [avatarConfig, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-posts', JSON.stringify(posts))
  }, [posts, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem(
      'croqueton-post-review-requests',
      JSON.stringify(postReviewRequests)
    )
  }, [postReviewRequests, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-join-applications', JSON.stringify(joinApplications))
  }, [joinApplications, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-donation-years', JSON.stringify(donationYears))
  }, [donationYears, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-admin-logs', JSON.stringify(adminLogs))
  }, [adminLogs, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-generation-photos', JSON.stringify(generationPhotos))
  }, [generationPhotos, isHydrated])
  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-follows', JSON.stringify(follows))
  }, [follows, isHydrated])
  const isAdmin = !!user && admins.includes(user.email)
  const logAdminAction = (type, detail) => {
    if (!isAdmin) return
    setAdminLogs((current) =>
      [
        {
          id: crypto.randomUUID(),
          type,
          detail,
          actor: user.name,
          actorEmail: user.email,
          createdAt: /* @__PURE__ */ new Date().toISOString()
        },
        ...current
      ].slice(0, 250)
    )
  }
  const community = {
    user,
    petFurColor,
    avatarConfig,
    posts,
    postReviewRequests,
    joinApplications,
    donationYears,
    adminLogs,
    generationPhotos,
    follows,
    admins,
    profiles,
    isAdmin,
    accountCount: Object.keys(accounts).length,
    signIn: (email, nextPassword, remember = true) => {
      const normalizedEmail = email.trim().toLowerCase()
      if (accounts[normalizedEmail] !== nextPassword) return false
      const profile = normalizeUser(profiles[normalizedEmail] || { email: normalizedEmail })
      setSessionPersistence(remember ? 'local' : 'session')
      setUser(profile)
      setPetFurColor(profile.petFurColor)
      setAvatarConfig(profile.avatarConfig)
      setProfiles((current) => ({ ...current, [normalizedEmail]: profile }))
      setUsernames((current) =>
        current[profile.username] === normalizedEmail
          ? current
          : { ...current, [profile.username]: normalizedEmail }
      )
      return true
    },
    createAccount: (email, nextPassword, remember = true) => {
      const normalizedEmail = email.trim().toLowerCase()
      if (accounts[normalizedEmail] || nextPassword.length < 6) return false
      const baseProfile = normalizeUser({ email: normalizedEmail })
      let username = baseProfile.username
      let suffix = 1
      while (usernames[username] && usernames[username] !== normalizedEmail) {
        username = `${baseProfile.username}${suffix++}`.slice(0, 24)
      }
      const profile = { ...baseProfile, username }
      setAccounts((current) => ({ ...current, [normalizedEmail]: nextPassword }))
      setProfiles((current) => ({ ...current, [normalizedEmail]: profile }))
      setUsernames((current) => ({ ...current, [username]: normalizedEmail }))
      setSessionPersistence(remember ? 'local' : 'session')
      setUser(profile)
      setPetFurColor(profile.petFurColor)
      setAvatarConfig(profile.avatarConfig)
      return true
    },
    signOut: () => setUser(null),
    updateProfile: (value) => {
      if (!user) return { ok: false, error: 'No hay una sesión activa.' }
      const patch = typeof value === 'string' ? { name: value } : value || {}
      const nextName = String(patch.name ?? user.name).trim()
      if (!nextName) return { ok: false, error: 'El nombre completo no puede estar vacío.' }
      const nextUsername = String(patch.username ?? user.username)
        .trim()
        .toLowerCase()
        .replace(/^@/, '')
      if (!isUsername(nextUsername))
        return {
          ok: false,
          error:
            'El nombre de usuario debe tener entre 3 y 24 caracteres y solo puede usar letras, números, punto o guion bajo.'
        }
      const nextEmail = String(patch.email ?? user.email)
        .trim()
        .toLowerCase()
      if (!isEmail(nextEmail)) return { ok: false, error: 'Escribe un correo electrónico válido.' }
      const nextPetName = String(patch.petName ?? user.petName ?? 'Chispita').trim()
      if (!nextPetName) return { ok: false, error: 'El nombre de la mascota no puede estar vacío.' }
      const nextPetBio = String(patch.petBio ?? user.petBio ?? '').trim()
      const nextPetPhoto = patch.petPhoto !== undefined ? patch.petPhoto : (user.petPhoto ?? null)
      const usernameOwner = usernames[nextUsername]
      if (usernameOwner && usernameOwner !== user.email)
        return { ok: false, error: 'Ese nombre de usuario ya está en uso.' }
      if (nextEmail !== user.email && accounts[nextEmail])
        return { ok: false, error: 'Ese correo electrónico ya está registrado.' }
      const nextUser = {
        ...user,
        name: nextName,
        username: nextUsername,
        email: nextEmail,
        petName: nextPetName,
        petBio: nextPetBio,
        petPhoto: nextPetPhoto
      }
      if (nextEmail !== user.email) {
        setAccounts((current) => {
          const next = { ...current }
          next[nextEmail] = next[user.email]
          delete next[user.email]
          return next
        })
        setProfiles((current) => {
          const next = { ...current }
          delete next[user.email]
          next[nextEmail] = nextUser
          return next
        })
      } else {
        setProfiles((current) => ({ ...current, [user.email]: nextUser }))
      }
      setUsernames((current) => {
        const next = { ...current }
        if (user.username && next[user.username] === user.email) delete next[user.username]
        next[nextUsername] = nextEmail
        return next
      })
      setPosts((current) =>
        current.map((post) => {
          const isOwner = post.authorEmail
            ? post.authorEmail === user.email
            : post.author === user.name
          return isOwner ? { ...post, author: nextName, authorEmail: nextEmail } : post
        })
      )
      setUser(nextUser)
      return { ok: true }
    },
    updatePassword: (currentPassword, nextPassword) => {
      if (!user) return { ok: false, error: 'No hay una sesión activa.' }
      if (accounts[user.email] !== currentPassword)
        return { ok: false, error: 'La contraseña actual no es correcta.' }
      if (String(nextPassword).length < 6)
        return { ok: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' }
      if (nextPassword === currentPassword)
        return { ok: false, error: 'La nueva contraseña debe ser diferente a la actual.' }
      setAccounts((current) => ({ ...current, [user.email]: nextPassword }))
      return { ok: true }
    },
    updatePet: (color) => {
      setPetFurColor(color)
      setUser((current) => (current ? { ...current, petFurColor: color } : current))
    },
    updateAvatar: (patch) => {
      const next = { ...avatarConfig, ...patch }
      setAvatarConfig(next)
      setUser((current) => (current ? { ...current, avatarConfig: next } : current))
    },
    addPost: (body, image) =>
      setPosts((current) =>
        user
          ? [
              {
                id: crypto.randomUUID(),
                author: user.name,
                authorEmail: user.email,
                body,
                image,
                createdAt: new Intl.DateTimeFormat(language === 'en' ? 'en' : 'es', {
                  dateStyle: 'medium'
                }).format(/* @__PURE__ */ new Date()),
                likedBy: [],
                comments: []
              },
              ...current
            ]
          : current
      ),
    requestPostReview: (body, image) => {
      if (!user) return
      setPostReviewRequests((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          author: user.name,
          authorEmail: user.email,
          body,
          image: image || null,
          requestedAt: /* @__PURE__ */ new Date().toISOString()
        }
      ])
    },
    approvePostReview: (requestId) => {
      if (!isAdmin) return
      const request = postReviewRequests.find((item) => item.id === requestId)
      if (!request) return
      setPosts((current) => [
        {
          id: crypto.randomUUID(),
          author: request.author,
          authorEmail: request.authorEmail || null,
          body: request.body,
          image: request.image || undefined,
          createdAt: new Intl.DateTimeFormat(language === 'en' ? 'en' : 'es', {
            dateStyle: 'medium'
          }).format(/* @__PURE__ */ new Date()),
          likedBy: [],
          comments: []
        },
        ...current
      ])
      setPostReviewRequests((current) => current.filter((item) => item.id !== requestId))
      logAdminAction('post-approved', `Aprobó la publicación de ${request.author}.`)
    },
    rejectPostReview: (requestId) => {
      if (!isAdmin) return
      const request = postReviewRequests.find((item) => item.id === requestId)
      if (!request) return
      setPostReviewRequests((current) => current.filter((item) => item.id !== requestId))
      logAdminAction('post-rejected', `Rechazó la publicación de ${request.author}.`)
    },
    adminDeletePost: (postId) => {
      if (!isAdmin) return
      const post = posts.find((item) => item.id === postId)
      if (!post) return
      setPosts((current) => current.filter((item) => item.id !== postId))
      logAdminAction('post-deleted', `Eliminó la publicación de ${post.author}.`)
    },
    createAdmin: ({ name, email, password }) => {
      if (!isAdmin)
        return { ok: false, error: 'Solo un administrador puede crear más administradores.' }
      const normalizedEmail = String(email || '')
        .trim()
        .toLowerCase()
      if (!isEmail(normalizedEmail))
        return { ok: false, error: 'Escribe un correo electrónico válido.' }
      if (accounts[normalizedEmail])
        return { ok: false, error: 'Ya existe una cuenta con ese correo electrónico.' }
      if (String(password || '').length < 6)
        return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
      const baseProfile = normalizeUser({ email: normalizedEmail, name })
      let username = baseProfile.username
      let suffix = 1
      while (usernames[username] && usernames[username] !== normalizedEmail) {
        username = `${baseProfile.username}${suffix++}`.slice(0, 24)
      }
      const profile = { ...baseProfile, username }
      setAccounts((current) => ({ ...current, [normalizedEmail]: password }))
      setProfiles((current) => ({ ...current, [normalizedEmail]: profile }))
      setUsernames((current) => ({ ...current, [username]: normalizedEmail }))
      setAdmins((current) =>
        current.includes(normalizedEmail) ? current : [...current, normalizedEmail]
      )
      logAdminAction('admin-created', `Creó la cuenta de administrador ${normalizedEmail}.`)
      return { ok: true }
    },
    removeAdmin: (email) => {
      if (!isAdmin) return { ok: false, error: 'Solo un administrador puede hacer este cambio.' }
      const normalizedEmail = String(email || '')
        .trim()
        .toLowerCase()
      if (normalizedEmail === 'admin@croqueton.mx')
        return { ok: false, error: 'No puedes quitar el acceso al administrador principal.' }
      if (normalizedEmail === user.email)
        return { ok: false, error: 'No puedes quitarte el acceso a ti mismo.' }
      if (!admins.includes(normalizedEmail))
        return { ok: false, error: 'Ese correo no es administrador.' }
      if (admins.length <= 1)
        return { ok: false, error: 'Debe quedar al menos un administrador.' }
      setAdmins((current) => current.filter((item) => item !== normalizedEmail))
      logAdminAction('admin-removed', `Retiró el acceso de administrador a ${normalizedEmail}.`)
      return { ok: true }
    },
    submitJoinApplication: (application) => {
      const record = {
        id: crypto.randomUUID(),
        name: String(application?.name || '').trim(),
        email: String(application?.email || '')
          .trim()
          .toLowerCase(),
        age: Number(application?.age) || 0,
        motivation: String(application?.motivation || '').trim(),
        hasAvailability: !!application?.hasAvailability,
        acceptsCommitment: !!application?.acceptsCommitment,
        status: 'pending',
        createdAt: /* @__PURE__ */ new Date().toISOString()
      }
      if (
        !record.name ||
        !isEmail(record.email) ||
        record.age < 18 ||
        record.motivation.length < 20 ||
        !record.hasAvailability ||
        !record.acceptsCommitment
      )
        return { ok: false, error: 'La solicitud no cumple con los requisitos.' }
      setJoinApplications((current) => [record, ...current])
      return { ok: true }
    },
    approveJoinApplication: (applicationId) => {
      if (!isAdmin) return
      const application = joinApplications.find((item) => item.id === applicationId)
      if (!application) return
      setJoinApplications((current) =>
        current.map((item) =>
          item.id === applicationId ? { ...item, status: 'approved' } : item
        )
      )
      logAdminAction('application-approved', `Aprobó la solicitud de ${application.name}.`)
    },
    rejectJoinApplication: (applicationId) => {
      if (!isAdmin) return
      const application = joinApplications.find((item) => item.id === applicationId)
      if (!application) return
      setJoinApplications((current) =>
        current.map((item) =>
          item.id === applicationId ? { ...item, status: 'rejected' } : item
        )
      )
      logAdminAction('application-rejected', `Rechazó la solicitud de ${application.name}.`)
    },
    addDonationYear: (year) => {
      if (!isAdmin) return false
      const normalizedYear = String(year).trim()
      if (!/^\d{4}$/.test(normalizedYear)) return false
      if (donationYears.some((item) => item.year === normalizedYear)) return false
      setDonationYears((current) =>
        current.some((item) => item.year === normalizedYear)
          ? current
          : [...current, { year: normalizedYear, donations: [] }].sort((a, b) =>
              b.year.localeCompare(a.year)
            )
      )
      logAdminAction('donation-year-added', `Agregó el año ${normalizedYear} a donaciones.`)
      return true
    },
    addDonation: (year, donation) => {
      if (!isAdmin) return
      setDonationYears((current) =>
        current.map((item) =>
          item.year !== year
            ? item
            : {
                ...item,
                donations: [
                  {
                    id: crypto.randomUUID(),
                    createdAt: /* @__PURE__ */ new Date().toISOString(),
                    ...donation
                  },
                  ...item.donations
                ]
              }
        )
      )
      const donorName =
        [donation?.firstName, donation?.lastName].filter(Boolean).join(' ') || 'un donador'
      logAdminAction('donation-added', `Registró una donación de ${donorName} (${year}).`)
    },
    deleteDonation: (year, donationId) => {
      if (!isAdmin) return
      const yearRecord = donationYears.find((item) => item.year === year)
      const donation = yearRecord?.donations.find((item) => item.id === donationId)
      if (!donation) return
      setDonationYears((current) =>
        current.map((item) =>
          item.year !== year
            ? item
            : {
                ...item,
                donations: item.donations.filter((entry) => entry.id !== donationId)
              }
        )
      )
      const donorName =
        [donation.firstName, donation.lastName].filter(Boolean).join(' ') || 'un donador'
      logAdminAction('donation-deleted', `Eliminó la donación de ${donorName} (${year}).`)
    },
    addGenerationPhoto: (photo) => {
      if (!isAdmin) return false
      const record = {
        id: crypto.randomUUID(),
        year: String(photo?.year || '').trim(),
        label: String(photo?.label || '').trim(),
        image: photo?.image,
        createdAt: /* @__PURE__ */ new Date().toISOString()
      }
      if (!record.image) return false
      setGenerationPhotos((current) => [record, ...current])
      logAdminAction('generation-photo-added', `Agregó una foto de generación${record.year ? ` ${record.year}` : ''}.`)
      return true
    },
    deleteGenerationPhoto: (photoId) => {
      if (!isAdmin) return
      const photo = generationPhotos.find((item) => item.id === photoId)
      if (!photo) return
      setGenerationPhotos((current) => current.filter((item) => item.id !== photoId))
      logAdminAction('generation-photo-deleted', `Eliminó una foto de generación${photo.year ? ` ${photo.year}` : ''}.`)
    },
    toggleFollow: (targetEmail) => {
      if (!user) return
      const target = String(targetEmail || '').trim().toLowerCase()
      if (!target || target === user.email) return
      setFollows((current) => {
        const currentList = current[user.email] || []
        const nextList = currentList.includes(target)
          ? currentList.filter((email) => email !== target)
          : [...currentList, target]
        return { ...current, [user.email]: nextList }
      })
    },
    editPost: (postId, body) => {
      if (!user) return
      setPosts((current) =>
        current.map((post) => {
          const isOwner = post.authorEmail
            ? post.authorEmail === user.email
            : post.author === user.name
          return post.id === postId && isOwner ? { ...post, body } : post
        })
      )
    },
    deletePost: (postId) => {
      if (!user) return
      setPosts((current) =>
        current.filter((post) => {
          const isOwner = post.authorEmail
            ? post.authorEmail === user.email
            : post.author === user.name
          return post.id !== postId || !isOwner
        })
      )
    },
    toggleLike: (postId) => {
      if (!user) return
      setPosts((current) =>
        current.map((post) =>
          post.id !== postId
            ? post
            : {
                ...post,
                likedBy: post.likedBy.includes(user.email)
                  ? post.likedBy.filter((email) => email !== user.email)
                  : [...post.likedBy, user.email]
              }
        )
      )
    },
    addComment: (postId, body) => {
      if (!user) return
      setPosts((current) =>
        current.map((post) =>
          post.id !== postId
            ? post
            : {
                ...post,
                comments: [...post.comments, { id: crypto.randomUUID(), author: user.name, body }]
              }
        )
      )
    }
  }
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <CommunityContext.Provider value={community}>{children}</CommunityContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  )
}

function readStorage(key) {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(key)
}

export { LanguageContext, ThemeContext, CommunityContext, useLanguage, useTheme, useCommunity }
export default AppProviders
