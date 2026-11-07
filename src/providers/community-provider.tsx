'use client'

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'

import { hashPassword, isHashedPassword, verifyPassword } from '@/lib/password'
import { useLanguage } from '@/providers/language-provider'

export interface AvatarConfig {
  furColor: string
  glassesColor: string
  hair: 'none' | 'short' | 'long'
  outfit: 'shirt' | 'dress' | 'overalls'
  shirtColor: string
  shoesColor: string
  shortsColor: string
}

export interface CommunityUser {
  accountStatus?: 'active' | 'blocked' | 'blocked_expired'
  avatarConfig: AvatarConfig
  avatarImage?: string
  createdAt?: string
  email: string
  isActive?: boolean
  name: string
  petBio: string
  petName: string
  petPhoto?: string
  role?: 'user' | 'admin' | 'superadmin'
  username: string
}

export interface PostComment {
  author: string
  authorEmail?: string
  body: string
  id: string
}

export interface CommunityPost {
  author: string
  authorEmail?: string
  body: string
  comments: PostComment[]
  createdAt: string
  createdAtIso?: string
  id: string
  image?: string
  likedBy: string[]
}

export interface PostReviewRequest {
  author: string
  authorEmail?: string
  body: string
  id: string
  requestedAt: string
}

export type CommunityError =
  | 'current_password_incorrect'
  | 'email_invalid'
  | 'email_taken'
  | 'name_required'
  | 'no_session'
  | 'password_same'
  | 'password_too_short'
  | 'password_unavailable'
  | 'pet_name_required'
  | 'username_invalid'
  | 'username_taken'

export type CommunityActionResult = { ok: true } | { error: CommunityError; ok: false }

export interface ProfilePatch {
  avatarConfig?: Partial<AvatarConfig>
  avatarImage?: string | null
  email?: string
  name?: string
  petBio?: string
  petName?: string
  petPhoto?: string | null
  username?: string
}

interface CommunityContextValue {
  accountCount: number
  addComment: (postId: string, body: string) => void
  addPost: (body: string, image?: string) => void
  adminDeletePost: (postId: string) => void
  approvePostReview: (requestId: string) => void
  createAccount: (email: string, nextPassword: string, remember?: boolean) => Promise<boolean>
  createAdmin: (input: {
    avatarImage?: string
    email: string
    isActive: boolean
    name: string
    password: string
    username: string
  }) => Promise<CommunityActionResult>
  deleteAdmin: (targetEmail: string) => CommunityActionResult
  deletePost: (postId: string) => void
  editPost: (postId: string, body: string) => void
  follows: Record<string, string[]>
  isFollowing: (targetEmail: string) => boolean
  isHydrated: boolean
  petFurColor: string
  postReviewRequests: PostReviewRequest[]
  posts: CommunityPost[]
  profiles: Record<string, CommunityUser>
  rejectPostReview: (requestId: string) => void
  requestPostReview: (body: string) => void
  signIn: (email: string, nextPassword: string, remember?: boolean) => Promise<boolean>
  signOut: () => void
  toggleFollow: (targetEmail: string) => void
  toggleLike: (postId: string) => void
  setAdminActive: (targetEmail: string, active: boolean) => CommunityActionResult
  updateAdmin: (
    targetEmail: string,
    patch: {
      avatarImage?: string | null
      email?: string
      isActive?: boolean
      name?: string
      username?: string
    }
  ) => CommunityActionResult
  updatePassword: (currentPassword: string, nextPassword: string) => Promise<CommunityActionResult>
  updatePet: (color: string) => void
  updateProfile: (value: string | ProfilePatch) => CommunityActionResult
  user: CommunityUser | null
}

const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  furColor: '#d98a4e',
  glassesColor: '#202436',
  hair: 'none',
  outfit: 'shirt',
  shirtColor: '#ef6547',
  shoesColor: '#fff8df',
  shortsColor: '#647fa1'
}

const DEFAULT_PET_NAME = 'Chispita'
const DEFAULT_ADMIN_EMAIL = 'admin@croqueton.mx'
const MIN_PASSWORD_LENGTH = 6

const CommunityContext = createContext<CommunityContextValue | null>(null)

function readJson<T>(key: string, fallback: T): T {
  const stored = window.localStorage.getItem(key)
  if (!stored) return fallback

  try {
    return JSON.parse(stored) as T
  } catch {
    return fallback
  }
}

function usernameFromEmail(email: string) {
  const base = String(email || '')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '')
    .slice(0, 24)

  return base.length >= 3 ? base : `user${base || 'croqueton'}`.slice(0, 24)
}

function normalizeUser(raw?: Partial<CommunityUser> | null): CommunityUser {
  const email = String(raw?.email ?? '')
    .trim()
    .toLowerCase()
  const fallbackName = email.split('@')[0]?.replace(/[._-]/g, ' ') || 'Croquetón'
  const name = String(raw?.name || fallbackName).trim() || fallbackName
  const petName = String(raw?.petName || DEFAULT_PET_NAME).trim() || DEFAULT_PET_NAME
  const role = raw?.role ?? (email === DEFAULT_ADMIN_EMAIL ? 'superadmin' : 'user')
  const accountStatus = (raw as { accountStatus?: string } | null)?.accountStatus ?? 'active'

  return {
    accountStatus: accountStatus as CommunityUser['accountStatus'],
    avatarConfig: { ...DEFAULT_AVATAR_CONFIG, ...(raw?.avatarConfig ?? {}) },
    avatarImage: typeof raw?.avatarImage === 'string' ? raw.avatarImage : undefined,
    createdAt: raw?.createdAt || new Date().toISOString(),
    email,
    isActive: raw?.isActive ?? true,
    name,
    petBio: String(raw?.petBio || '').trim(),
    petName,
    petPhoto: typeof raw?.petPhoto === 'string' ? raw.petPhoto : undefined,
    role,
    username: String(raw?.username || usernameFromEmail(email)).toLowerCase()
  }
}

function normalizePost(raw: CommunityPost): CommunityPost {
  const comments = Array.isArray(raw.comments)
    ? raw.comments
        .filter((comment) => comment && typeof comment.body === 'string')
        .map((comment) => ({
          ...comment,
          author: String(comment.author || ''),
          authorEmail: typeof comment.authorEmail === 'string' ? comment.authorEmail : undefined,
          body: String(comment.body),
          id: String(comment.id || crypto.randomUUID())
        }))
    : []

  const likedBy = Array.isArray(raw.likedBy)
    ? Array.from(
        new Set(
          raw.likedBy
            .filter((email): email is string => typeof email === 'string')
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)
        )
      )
    : []

  return {
    ...raw,
    author: String(raw.author || ''),
    authorEmail:
      typeof raw.authorEmail === 'string' ? raw.authorEmail.trim().toLowerCase() : undefined,
    body: String(raw.body || ''),
    comments,
    createdAt: String(raw.createdAt || ''),
    createdAtIso:
      typeof raw.createdAtIso === 'string' && !Number.isNaN(Date.parse(raw.createdAtIso))
        ? raw.createdAtIso
        : undefined,
    id: String(raw.id || crypto.randomUUID()),
    image: typeof raw.image === 'string' ? raw.image : undefined,
    likedBy
  }
}

function normalizeFollows(raw: Record<string, string[]>): Record<string, string[]> {
  const normalized: Record<string, string[]> = {}

  for (const [followerEmail, followedEmails] of Object.entries(raw ?? {})) {
    if (!Array.isArray(followedEmails)) continue

    normalized[followerEmail.trim().toLowerCase()] = Array.from(
      new Set(
        followedEmails
          .filter((email): email is string => typeof email === 'string')
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean)
      )
    )
  }

  return normalized
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isUsername(value: string) {
  return /^[a-z0-9._]{3,24}$/.test(value)
}

function isUsernameTaken(
  profiles: Record<string, CommunityUser>,
  username: string,
  currentEmail: string
) {
  return Object.values(profiles).some(
    (profile) => profile.email !== currentEmail && profile.username === username
  )
}

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const [isHydrated, setIsHydrated] = useState(false)
  const [isAccountStorageReady, setIsAccountStorageReady] = useState(false)
  const [user, setUser] = useState<CommunityUser | null>(null)
  const [accounts, setAccounts] = useState<Record<string, string>>({
    [DEFAULT_ADMIN_EMAIL]: 'croqueton2026'
  })
  const [profiles, setProfiles] = useState<Record<string, CommunityUser>>({})
  const [follows, setFollows] = useState<Record<string, string[]>>({})
  const [petFurColor, setPetFurColor] = useState('#efc88f')
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [postReviewRequests, setPostReviewRequests] = useState<PostReviewRequest[]>([])

  useEffect(() => {
    const savedAccounts = readJson<Record<string, string>>('croqueton-accounts', {})
    const nextAccounts = { [DEFAULT_ADMIN_EMAIL]: 'croqueton2026', ...savedAccounts }

    const migrateLegacyPasswords = async () => {
      try {
        const entries = await Promise.all(
          Object.entries(nextAccounts).map(async ([email, storedPassword]) => {
            const password = isHashedPassword(storedPassword)
              ? storedPassword
              : await hashPassword(storedPassword)

            return [email, password] as const
          })
        )

        setAccounts((current) => {
          const merged = { ...current }

          for (const [email, hashedPassword] of entries) {
            if (Object.hasOwn(current, email) && !isHashedPassword(current[email])) {
              merged[email] = hashedPassword
            }
          }

          return merged
        })
      } finally {
        setIsAccountStorageReady(true)
      }
    }

    const savedProfiles = readJson<Record<string, CommunityUser>>('croqueton-profiles', {})
    const nextProfiles: Record<string, CommunityUser> = {}

    for (const [email, profile] of Object.entries(savedProfiles)) {
      const normalized = normalizeUser({ ...profile, email })
      nextProfiles[normalized.email] = normalized
    }

    for (const email of Object.keys(nextAccounts)) {
      const normalizedEmail = email.trim().toLowerCase()
      nextProfiles[normalizedEmail] = normalizeUser({
        ...(nextProfiles[normalizedEmail] ?? {}),
        email: normalizedEmail
      })
    }

    const savedUser = readJson<CommunityUser | null>('croqueton-user', null)
    const normalizedUser = savedUser ? normalizeUser(savedUser) : null

    if (normalizedUser) nextProfiles[normalizedUser.email] = normalizedUser

    const savedPetFurColor = window.localStorage.getItem('croqueton-pet-color')
    const savedFollows = readJson<Record<string, string[]>>('croqueton-follows', {})
    const nextFollows = normalizeFollows(savedFollows)
    const savedPosts = readJson<CommunityPost[]>('croqueton-posts', [])
    const nextPosts = Array.isArray(savedPosts) ? savedPosts.map(normalizePost) : []
    const savedRequests = readJson<PostReviewRequest[]>('croqueton-post-review-requests', [])

    /* eslint-disable react-hooks/set-state-in-effect -- Hydrating client-only state from localStorage. */
    setAccounts(nextAccounts)
    setProfiles(nextProfiles)
    setFollows(nextFollows)
    setPetFurColor(savedPetFurColor || '#efc88f')
    setPosts(nextPosts)
    setPostReviewRequests(Array.isArray(savedRequests) ? savedRequests : [])
    setUser(normalizedUser)
    setIsHydrated(true)
    /* eslint-enable react-hooks/set-state-in-effect */

    void fetch('/api/auth/session')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.user) {
          const sessionUser = normalizeUser(data.user)
          setUser(sessionUser)
          setProfiles((current) => ({ ...current, [sessionUser.email]: sessionUser }))
        }
      })
      .catch(() => {})

    void migrateLegacyPasswords().catch(() => setIsAccountStorageReady(true))
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-user', JSON.stringify(user))
  }, [isHydrated, user])

  useEffect(() => {
    if (!isHydrated || !isAccountStorageReady) return
    window.localStorage.setItem('croqueton-accounts', JSON.stringify(accounts))
  }, [accounts, isAccountStorageReady, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-profiles', JSON.stringify(profiles))
  }, [isHydrated, profiles])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-follows', JSON.stringify(follows))
  }, [follows, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-pet-color', petFurColor)
  }, [isHydrated, petFurColor])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem('croqueton-posts', JSON.stringify(posts))
  }, [isHydrated, posts])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem(
      'croqueton-post-review-requests',
      JSON.stringify(postReviewRequests)
    )
  }, [isHydrated, postReviewRequests])

  const formatDate = useCallback(
    () =>
      new Intl.DateTimeFormat(language, {
        dateStyle: 'medium'
      }).format(new Date()),
    [language]
  )

  const value = useMemo<CommunityContextValue>(
    () => ({
      user,
      isHydrated,
      petFurColor,
      posts,
      postReviewRequests,
      follows,
      profiles,
      accountCount: Object.keys(accounts).length,
      signIn: async (email, nextPassword, remember = false) => {
        const normalizedEmail = email.trim().toLowerCase()

        try {
          const response = await fetch('/api/auth/login', {
            body: JSON.stringify({ email: normalizedEmail, password: nextPassword, remember }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
          })

          if (response.ok) {
            const data = (await response.json()) as { user?: Record<string, unknown> }
            if (data.user) {
              const profile = normalizeUser(data.user as Partial<CommunityUser>)
              setUser(profile)
              setProfiles((current) => ({ ...current, [profile.email]: profile }))
              window.localStorage.setItem('croqueton-user', JSON.stringify(profile))
              return true
            }
          }
          return false
        } catch {
          const storedPassword = accounts[normalizedEmail]

          if (!storedPassword) return false

          let passwordMatches = false

          try {
            passwordMatches = await verifyPassword(nextPassword, storedPassword)
          } catch {
            return false
          }

          if (!passwordMatches) return false

          const profile = normalizeUser(
            profiles[normalizedEmail] ?? {
              email: normalizedEmail
            }
          )

          if (profile.isActive === false) return false

          window.localStorage.setItem('croqueton-user', JSON.stringify(profile))
          setUser(profile)
          setProfiles((current) => ({ ...current, [normalizedEmail]: profile }))
          return true
        }
      },
      createAccount: async (email, nextPassword, remember = false) => {
        const normalizedEmail = email.trim().toLowerCase()

        if (!isEmail(normalizedEmail) || nextPassword.length < MIN_PASSWORD_LENGTH) return false

        try {
          const response = await fetch('/api/auth/register', {
            body: JSON.stringify({ email: normalizedEmail, password: nextPassword, remember }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
          })

          if (!response.ok) return false

          const data = (await response.json()) as { user?: Record<string, unknown> }
          if (!data.user) return false

          const profile = normalizeUser(data.user as Partial<CommunityUser>)
          setUser(profile)
          setProfiles((current) => ({ ...current, [profile.email]: profile }))
          window.localStorage.setItem('croqueton-user', JSON.stringify(profile))
          return true
        } catch {
          if (accounts[normalizedEmail]) return false

          const baseProfile = normalizeUser({ email: normalizedEmail })
          let username = baseProfile.username
          let suffix = 1

          while (isUsernameTaken(profiles, username, normalizedEmail)) {
            username = `${baseProfile.username}${suffix++}`.slice(0, 24)
          }

          const profile = { ...baseProfile, username }
          let hashedPassword = ''

          try {
            hashedPassword = await hashPassword(nextPassword)
          } catch {
            return false
          }

          window.localStorage.setItem('croqueton-user', JSON.stringify(profile))
          setAccounts((current) => ({ ...current, [normalizedEmail]: hashedPassword }))
          setProfiles((current) => ({ ...current, [normalizedEmail]: profile }))
          setUser(profile)
          return true
        }
      },
      signOut: () => {
        window.localStorage.removeItem('croqueton-user')
        setUser(null)
        void fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
      },
      updateProfile: (value) => {
        if (!user) return { ok: false, error: 'no_session' }

        const patch = typeof value === 'string' ? { name: value } : value
        const nextName = String(patch.name ?? user.name).trim()
        if (!nextName) return { ok: false, error: 'name_required' }

        const nextUsername = String(patch.username ?? user.username)
          .trim()
          .toLowerCase()
          .replace(/^@/, '')
        if (!isUsername(nextUsername)) return { ok: false, error: 'username_invalid' }

        const nextEmail = String(patch.email ?? user.email)
          .trim()
          .toLowerCase()
        if (!isEmail(nextEmail)) return { ok: false, error: 'email_invalid' }

        const nextPetName = String(patch.petName ?? user.petName).trim()
        if (!nextPetName) return { ok: false, error: 'pet_name_required' }

        if (isUsernameTaken(profiles, nextUsername, user.email)) {
          return { ok: false, error: 'username_taken' }
        }

        if (nextEmail !== user.email && accounts[nextEmail]) {
          return { ok: false, error: 'email_taken' }
        }

        const nextUser: CommunityUser = {
          ...user,
          avatarConfig: patch.avatarConfig
            ? { ...user.avatarConfig, ...patch.avatarConfig }
            : user.avatarConfig,
          avatarImage:
            patch.avatarImage === null ? undefined : (patch.avatarImage ?? user.avatarImage),
          email: nextEmail,
          name: nextName,
          petBio: String(patch.petBio ?? user.petBio).trim(),
          petName: nextPetName,
          petPhoto: patch.petPhoto === null ? undefined : (patch.petPhoto ?? user.petPhoto),
          username: nextUsername
        }

        if (nextEmail !== user.email) {
          setAccounts((current) => {
            const next = { ...current }
            const currentPassword = next[user.email]

            if (currentPassword) next[nextEmail] = currentPassword
            delete next[user.email]
            return next
          })

          setProfiles((current) => {
            const next = { ...current }
            delete next[user.email]
            next[nextEmail] = nextUser
            return next
          })

          setFollows((current) => {
            const next: Record<string, string[]> = {}

            for (const [followerEmail, followedEmails] of Object.entries(current)) {
              const nextFollowerEmail = followerEmail === user.email ? nextEmail : followerEmail
              next[nextFollowerEmail] = followedEmails.map((followedEmail) =>
                followedEmail === user.email ? nextEmail : followedEmail
              )
            }

            return next
          })
        } else {
          setProfiles((current) => ({ ...current, [nextEmail]: nextUser }))
        }

        setPosts((current) =>
          current.map((post) => {
            const isOwner = post.authorEmail === user.email
            const comments = post.comments.map((comment) => {
              const isCommentOwner = comment.authorEmail === user.email

              return isCommentOwner
                ? { ...comment, author: nextName, authorEmail: nextEmail }
                : comment
            })

            return {
              ...post,
              ...(isOwner ? { author: nextName, authorEmail: nextEmail } : {}),
              comments
            }
          })
        )

        setPostReviewRequests((current) =>
          current.map((request) =>
            request.authorEmail === user.email
              ? { ...request, author: nextName, authorEmail: nextEmail }
              : request
          )
        )

        setUser(nextUser)
        return { ok: true }
      },
      updatePassword: async (currentPassword, nextPassword) => {
        if (!user) return { ok: false, error: 'no_session' }

        const storedPassword = accounts[user.email]
        if (!storedPassword) return { ok: false, error: 'no_session' }

        let passwordMatches = false

        try {
          passwordMatches = await verifyPassword(currentPassword, storedPassword)
        } catch {
          return { ok: false, error: 'password_unavailable' }
        }

        if (!passwordMatches) return { ok: false, error: 'current_password_incorrect' }

        if (String(nextPassword).length < MIN_PASSWORD_LENGTH) {
          return { ok: false, error: 'password_too_short' }
        }

        if (nextPassword === currentPassword) {
          return { ok: false, error: 'password_same' }
        }

        let hashedPassword = ''

        try {
          hashedPassword = await hashPassword(nextPassword)
        } catch {
          return { ok: false, error: 'password_unavailable' }
        }

        setAccounts((current) => ({ ...current, [user.email]: hashedPassword }))
        return { ok: true }
      },
      createAdmin: async (input) => {
        if (!user || user.role !== 'superadmin') return { ok: false, error: 'no_session' }

        const normalizedEmail = input.email.trim().toLowerCase()
        const nextName = input.name.trim()
        const nextUsername = input.username.trim().toLowerCase().replace(/^@/, '')

        if (!nextName) return { ok: false, error: 'name_required' }
        if (!isEmail(normalizedEmail)) return { ok: false, error: 'email_invalid' }
        if (!isUsername(nextUsername)) return { ok: false, error: 'username_invalid' }
        if (input.password.length < MIN_PASSWORD_LENGTH) {
          return { ok: false, error: 'password_too_short' }
        }
        if (accounts[normalizedEmail]) return { ok: false, error: 'email_taken' }
        if (isUsernameTaken(profiles, nextUsername, normalizedEmail)) {
          return { ok: false, error: 'username_taken' }
        }

        let hashedPassword = ''
        try {
          hashedPassword = await hashPassword(input.password)
        } catch {
          return { ok: false, error: 'password_unavailable' }
        }

        const adminProfile = normalizeUser({
          avatarImage: input.avatarImage,
          createdAt: new Date().toISOString(),
          email: normalizedEmail,
          isActive: input.isActive,
          name: nextName,
          petName: DEFAULT_PET_NAME,
          role: 'admin',
          username: nextUsername
        })

        setAccounts((current) => ({ ...current, [normalizedEmail]: hashedPassword }))
        setProfiles((current) => ({ ...current, [normalizedEmail]: adminProfile }))
        return { ok: true }
      },
      deleteAdmin: (targetEmail) => {
        if (!user || user.role !== 'superadmin') return { ok: false, error: 'no_session' }

        const normalizedTarget = targetEmail.trim().toLowerCase()
        const targetProfile = profiles[normalizedTarget]

        if (!targetProfile || targetProfile.role !== 'admin') {
          return { ok: false, error: 'no_session' }
        }

        setAccounts((current) => {
          const next = { ...current }
          delete next[normalizedTarget]
          return next
        })
        setProfiles((current) => {
          const next = { ...current }
          delete next[normalizedTarget]
          return next
        })
        setFollows((current) => {
          const next: Record<string, string[]> = {}
          for (const [followerEmail, followedEmails] of Object.entries(current)) {
            if (followerEmail === normalizedTarget) continue
            next[followerEmail] = followedEmails.filter((email) => email !== normalizedTarget)
          }
          return next
        })
        return { ok: true }
      },
      setAdminActive: (targetEmail, active) => {
        if (!user || user.role !== 'superadmin') return { ok: false, error: 'no_session' }

        const normalizedTarget = targetEmail.trim().toLowerCase()
        const targetProfile = profiles[normalizedTarget]

        if (!targetProfile || targetProfile.role !== 'admin') {
          return { ok: false, error: 'no_session' }
        }

        setProfiles((current) => ({
          ...current,
          [normalizedTarget]: { ...targetProfile, isActive: active }
        }))
        return { ok: true }
      },
      updateAdmin: (targetEmail, patch) => {
        if (!user || user.role !== 'superadmin') return { ok: false, error: 'no_session' }

        const normalizedTarget = targetEmail.trim().toLowerCase()
        const targetProfile = profiles[normalizedTarget]

        if (!targetProfile || targetProfile.role !== 'admin') {
          return { ok: false, error: 'no_session' }
        }

        const nextName = String(patch.name ?? targetProfile.name).trim()
        if (!nextName) return { ok: false, error: 'name_required' }

        const nextUsername = String(patch.username ?? targetProfile.username)
          .trim()
          .toLowerCase()
          .replace(/^@/, '')
        if (!isUsername(nextUsername)) return { ok: false, error: 'username_invalid' }
        if (isUsernameTaken(profiles, nextUsername, normalizedTarget)) {
          return { ok: false, error: 'username_taken' }
        }

        const nextEmail = String(patch.email ?? targetProfile.email)
          .trim()
          .toLowerCase()
        if (!isEmail(nextEmail)) return { ok: false, error: 'email_invalid' }
        if (nextEmail !== normalizedTarget && accounts[nextEmail]) {
          return { ok: false, error: 'email_taken' }
        }

        const nextProfile: CommunityUser = {
          ...targetProfile,
          avatarImage:
            patch.avatarImage === null
              ? undefined
              : (patch.avatarImage ?? targetProfile.avatarImage),
          email: nextEmail,
          isActive: patch.isActive ?? targetProfile.isActive,
          name: nextName,
          username: nextUsername
        }

        if (nextEmail !== normalizedTarget) {
          setAccounts((current) => {
            const next = { ...current }
            const currentPassword = next[normalizedTarget]
            if (currentPassword) next[nextEmail] = currentPassword
            delete next[normalizedTarget]
            return next
          })

          setProfiles((current) => {
            const next = { ...current }
            delete next[normalizedTarget]
            next[nextEmail] = nextProfile
            return next
          })

          setFollows((current) => {
            const next: Record<string, string[]> = {}
            for (const [followerEmail, followedEmails] of Object.entries(current)) {
              const nextFollowerEmail =
                followerEmail === normalizedTarget ? nextEmail : followerEmail
              next[nextFollowerEmail] = followedEmails.map((followedEmail) =>
                followedEmail === normalizedTarget ? nextEmail : followedEmail
              )
            }
            return next
          })

          setPosts((current) =>
            current.map((post) => {
              const isOwner = post.authorEmail === normalizedTarget
              const comments = post.comments.map((comment) => {
                const isCommentOwner = comment.authorEmail === normalizedTarget
                return isCommentOwner
                  ? { ...comment, author: nextName, authorEmail: nextEmail }
                  : comment
              })
              return {
                ...post,
                ...(isOwner ? { author: nextName, authorEmail: nextEmail } : {}),
                comments
              }
            })
          )
        } else {
          setProfiles((current) => ({ ...current, [nextEmail]: nextProfile }))
        }

        return { ok: true }
      },
      updatePet: setPetFurColor,
      toggleFollow: (targetEmail) => {
        if (!user) return

        const normalizedTarget = targetEmail.trim().toLowerCase()
        const targetProfile = profiles[normalizedTarget]
        if (
          !normalizedTarget ||
          normalizedTarget === user.email ||
          !targetProfile ||
          targetProfile.isActive === false
        ) {
          return
        }

        setFollows((current) => {
          const currentFollowing = current[user.email] ?? []
          const nextFollowing = currentFollowing.includes(normalizedTarget)
            ? currentFollowing.filter((email) => email !== normalizedTarget)
            : Array.from(new Set([...currentFollowing, normalizedTarget]))

          return { ...current, [user.email]: nextFollowing }
        })
      },
      isFollowing: (targetEmail) =>
        !!user && (follows[user.email] ?? []).includes(targetEmail.trim().toLowerCase()),
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
                  createdAt: formatDate(),
                  createdAtIso: new Date().toISOString(),
                  likedBy: [],
                  comments: []
                },
                ...current
              ]
            : current
        ),
      requestPostReview: (body) => {
        if (!user) return
        setPostReviewRequests((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            author: user.name,
            authorEmail: user.email,
            body,
            requestedAt: new Date().toISOString()
          }
        ])
      },
      approvePostReview: (requestId) => {
        if (user?.role !== 'admin' && user?.role !== 'superadmin') return
        const request = postReviewRequests.find((item) => item.id === requestId)
        if (!request) return
        setPosts((current) => [
          {
            id: crypto.randomUUID(),
            author: request.author,
            authorEmail: request.authorEmail,
            body: request.body,
            createdAt: formatDate(),
            createdAtIso: new Date().toISOString(),
            likedBy: [],
            comments: []
          },
          ...current
        ])
        setPostReviewRequests((current) => current.filter((item) => item.id !== requestId))
      },
      rejectPostReview: (requestId) => {
        if (user?.role === 'admin' || user?.role === 'superadmin')
          setPostReviewRequests((current) => current.filter((item) => item.id !== requestId))
      },
      adminDeletePost: (postId) => {
        if (user?.role === 'admin' || user?.role === 'superadmin')
          setPosts((current) => current.filter((post) => post.id !== postId))
      },
      editPost: (postId, body) => {
        if (!user) return
        setPosts((current) =>
          current.map((post) => {
            const isOwner = post.authorEmail === user.email
            return post.id === postId && isOwner ? { ...post, body } : post
          })
        )
      },
      deletePost: (postId) => {
        if (!user) return
        setPosts((current) =>
          current.filter((post) => {
            const isOwner = post.authorEmail === user.email
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
                  comments: [
                    ...post.comments,
                    {
                      id: crypto.randomUUID(),
                      author: user.name,
                      authorEmail: user.email,
                      body
                    }
                  ]
                }
          )
        )
      }
    }),
    [
      accounts,
      follows,
      formatDate,
      isHydrated,
      petFurColor,
      postReviewRequests,
      posts,
      profiles,
      user
    ]
  )

  return <CommunityContext value={value}>{children}</CommunityContext>
}

export function useCommunity() {
  const community = use(CommunityContext)
  if (!community) throw new Error('Community provider is missing')
  return community
}
