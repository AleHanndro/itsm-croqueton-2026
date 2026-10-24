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

import { useLanguage } from '@/providers/language-provider'

export interface CommunityUser {
  email: string
  name: string
}

export interface PostComment {
  author: string
  body: string
  id: string
}

export interface CommunityPost {
  author: string
  authorEmail?: string
  body: string
  comments: PostComment[]
  createdAt: string
  id: string
  image?: string
  likedBy: string[]
}

export interface PostReviewRequest {
  author: string
  body: string
  id: string
  requestedAt: string
}

interface CommunityContextValue {
  accountCount: number
  addComment: (postId: string, body: string) => void
  addPost: (body: string, image?: string) => void
  adminDeletePost: (postId: string) => void
  approvePostReview: (requestId: string) => void
  createAccount: (email: string, nextPassword: string) => boolean
  deletePost: (postId: string) => void
  editPost: (postId: string, body: string) => void
  petFurColor: string
  postReviewRequests: PostReviewRequest[]
  posts: CommunityPost[]
  rejectPostReview: (requestId: string) => void
  requestPostReview: (body: string) => void
  signIn: (email: string, nextPassword: string) => boolean
  signOut: () => void
  toggleLike: (postId: string) => void
  updatePassword: (nextPassword: string) => void
  updatePet: (color: string) => void
  updateProfile: (name: string) => void
  user: CommunityUser | null
}

const CommunityContext = createContext<CommunityContextValue | null>(null)

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const [user, setUser] = useState<CommunityUser | null>(null)
  const [accounts, setAccounts] = useState<Record<string, string>>({
    'admin@croqueton.mx': 'croqueton2026'
  })
  const [petFurColor, setPetFurColor] = useState('#efc88f')
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [postReviewRequests, setPostReviewRequests] = useState<PostReviewRequest[]>([])

  useEffect(() => {
    const savedUser = window.localStorage.getItem('croqueton-user')
    if (savedUser) setUser(JSON.parse(savedUser))

    const savedAccounts = window.localStorage.getItem('croqueton-accounts')
    if (savedAccounts) setAccounts((current) => ({ ...current, ...JSON.parse(savedAccounts) }))

    const savedPetFurColor = window.localStorage.getItem('croqueton-pet-color')
    if (savedPetFurColor) setPetFurColor(savedPetFurColor)

    const savedPosts = window.localStorage.getItem('croqueton-posts')
    if (savedPosts) setPosts(JSON.parse(savedPosts))

    const savedRequests = window.localStorage.getItem('croqueton-post-review-requests')
    if (savedRequests) setPostReviewRequests(JSON.parse(savedRequests))
  }, [])

  useEffect(() => {
    window.localStorage.setItem('croqueton-user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    window.localStorage.setItem('croqueton-accounts', JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    window.localStorage.setItem('croqueton-pet-color', petFurColor)
  }, [petFurColor])

  useEffect(() => {
    window.localStorage.setItem('croqueton-posts', JSON.stringify(posts))
  }, [posts])

  useEffect(() => {
    window.localStorage.setItem(
      'croqueton-post-review-requests',
      JSON.stringify(postReviewRequests)
    )
  }, [postReviewRequests])

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
      petFurColor,
      posts,
      postReviewRequests,
      accountCount: Object.keys(accounts).length,
      signIn: (email, nextPassword) => {
        const normalizedEmail = email.trim().toLowerCase()
        if (accounts[normalizedEmail] !== nextPassword) return false
        setUser({
          email: normalizedEmail,
          name: normalizedEmail.split('@')[0].replace(/[._-]/g, ' ') || 'Croquetón'
        })
        return true
      },
      createAccount: (email, nextPassword) => {
        const normalizedEmail = email.trim().toLowerCase()
        if (accounts[normalizedEmail] || nextPassword.length < 6) return false
        setAccounts((current) => ({ ...current, [normalizedEmail]: nextPassword }))
        setUser({
          email: normalizedEmail,
          name: normalizedEmail.split('@')[0].replace(/[._-]/g, ' ') || 'Croquetón'
        })
        return true
      },
      signOut: () => setUser(null),
      updateProfile: (name) => {
        const nextName = name.trim()
        if (!nextName || !user) return
        setPosts((current) =>
          current.map((post) => {
            const isOwner = post.authorEmail
              ? post.authorEmail === user.email
              : post.author === user.name
            return isOwner ? { ...post, author: nextName, authorEmail: user.email } : post
          })
        )
        setUser((current) => (current ? { ...current, name: nextName } : current))
      },
      updatePassword: (nextPassword) => {
        if (user) setAccounts((current) => ({ ...current, [user.email]: nextPassword }))
      },
      updatePet: setPetFurColor,
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
            body,
            requestedAt: new Date().toISOString()
          }
        ])
      },
      approvePostReview: (requestId) => {
        if (user?.email !== 'admin@croqueton.mx') return
        const request = postReviewRequests.find((item) => item.id === requestId)
        if (!request) return
        setPosts((current) => [
          {
            id: crypto.randomUUID(),
            author: request.author,
            body: request.body,
            createdAt: formatDate(),
            likedBy: [],
            comments: []
          },
          ...current
        ])
        setPostReviewRequests((current) => current.filter((item) => item.id !== requestId))
      },
      rejectPostReview: (requestId) => {
        if (user?.email === 'admin@croqueton.mx')
          setPostReviewRequests((current) => current.filter((item) => item.id !== requestId))
      },
      adminDeletePost: (postId) => {
        if (user?.email === 'admin@croqueton.mx')
          setPosts((current) => current.filter((post) => post.id !== postId))
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
    }),
    [accounts, formatDate, petFurColor, postReviewRequests, posts, user]
  )

  return <CommunityContext value={value}>{children}</CommunityContext>
}

export function useCommunity() {
  const community = use(CommunityContext)
  if (!community) throw new Error('Community provider is missing')
  return community
}
