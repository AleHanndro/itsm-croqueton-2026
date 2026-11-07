import type { CommunityPost, CommunityUser, PostComment } from '@/providers/community-provider'

type Profiles = Record<string, CommunityUser>
type Follows = Record<string, string[]>

export function postTimestamp(post: CommunityPost) {
  if (post.createdAtIso) {
    const timestamp = Date.parse(post.createdAtIso)
    if (!Number.isNaN(timestamp)) return timestamp
  }

  const timestamp = Date.parse(post.createdAt)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function sortPostsNewestFirst(posts: CommunityPost[]) {
  return [...posts].sort((left, right) => postTimestamp(right) - postTimestamp(left))
}

export function getCommunityFeed(posts: CommunityPost[]) {
  return sortPostsNewestFirst(posts)
}

export function getFollowingFeed(
  posts: CommunityPost[],
  follows: Follows,
  email: string,
  profiles: Profiles
) {
  const followedEmails = new Set(followingOf(follows, email))

  return sortPostsNewestFirst(
    posts.filter((post) => {
      const authorEmail =
        post.authorEmail?.trim().toLowerCase() ?? profileForPost(post, profiles)?.email
      return !!authorEmail && followedEmails.has(authorEmail)
    })
  )
}

export function isPostOwnedBy(post: CommunityPost, email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  return !!post.authorEmail && post.authorEmail.trim().toLowerCase() === normalizedEmail
}

export function profileForPost(post: CommunityPost, profiles: Profiles) {
  if (post.authorEmail) {
    const profile = profiles[post.authorEmail.trim().toLowerCase()]
    if (profile) return profile
  }

  const matches = Object.values(profiles).filter((profile) => profile.name === post.author)
  return matches.length === 1 ? matches[0] : null
}

export function profileForComment(comment: PostComment, profiles: Profiles) {
  if (comment.authorEmail) {
    return profiles[comment.authorEmail.trim().toLowerCase()] ?? null
  }

  const matches = Object.values(profiles).filter((profile) => profile.name === comment.author)
  return matches.length === 1 ? matches[0] : null
}

export function findProfileByUsername(profiles: Profiles, username: string) {
  const normalizedUsername = username.trim().toLowerCase().replace(/^@/, '')
  if (!normalizedUsername) return null

  return (
    Object.values(profiles).find(
      (profile) =>
        profile.isActive !== false && profile.username.trim().toLowerCase() === normalizedUsername
    ) ?? null
  )
}

export function profilePath(username: string) {
  return `/usuarios/${encodeURIComponent(username.trim().toLowerCase())}`
}

export function followingOf(follows: Follows, email: string) {
  return follows[email.trim().toLowerCase()] ?? []
}

export function followersOf(follows: Follows, email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  return Object.entries(follows)
    .filter(([followerEmail, followedEmails]) => {
      return followerEmail !== normalizedEmail && followedEmails.includes(normalizedEmail)
    })
    .map(([followerEmail]) => followerEmail)
}

export function getPostsByAuthor(posts: CommunityPost[], profiles: Profiles, email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const author = profiles[normalizedEmail]

  return sortPostsNewestFirst(
    posts.filter((post) => {
      if (post.authorEmail) {
        return post.authorEmail.trim().toLowerCase() === normalizedEmail
      }

      if (!author) return false

      const matchingProfiles = Object.values(profiles).filter(
        (profile) => profile.name === post.author
      )
      return matchingProfiles.length === 1 && matchingProfiles[0].email === normalizedEmail
    })
  )
}

export function countPostsByAuthor(posts: CommunityPost[], profiles: Profiles, email: string) {
  return getPostsByAuthor(posts, profiles, email).length
}

export function formatPostDate(
  post: CommunityPost,
  language: string,
  options: { includeTime?: boolean } = {}
) {
  const locale = language === 'en' ? 'en' : 'es'
  const iso = post.createdAtIso

  if (iso) {
    const date = new Date(iso)
    if (!Number.isNaN(date.getTime())) {
      try {
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'medium',
          ...(options.includeTime ? { timeStyle: 'short' } : {})
        }).format(date)
      } catch {}
    }
  }

  return post.createdAt
}

export const OPEN_COMPOSER_EVENT = 'guaubook:open-composer'
