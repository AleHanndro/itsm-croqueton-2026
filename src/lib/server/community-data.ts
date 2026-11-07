import { query } from '@/lib/db'
import { getAccountRestriction, expireOverdueBlocks } from '@/lib/server/blocks'
import { listNotifications } from '@/lib/server/notifications'
import { serializeUser } from '@/lib/server/serializers'
import type { DbUser, SessionUser } from '@/lib/server/types'

interface PostRow {
  author_email: string
  author_id: string
  author_name: string
  body: string
  created_at: Date
  id: string
  image: string | null
}

interface CommentRow {
  author_email: string
  author_name: string
  body: string
  id: string
  post_id: string
}

interface LikeRow {
  email: string
  post_id: string
}

interface ReviewRequestRow {
  author_email: string
  author_name: string
  body: string
  id: string
  image: string | null
  requested_at: Date
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(date)
}

function serializePosts(posts: PostRow[], comments: CommentRow[], likes: LikeRow[]) {
  const commentsByPost = new Map<string, CommentRow[]>()
  const likesByPost = new Map<string, string[]>()

  for (const comment of comments) {
    const list = commentsByPost.get(comment.post_id) ?? []
    list.push(comment)
    commentsByPost.set(comment.post_id, list)
  }

  for (const like of likes) {
    const list = likesByPost.get(like.post_id) ?? []
    list.push(like.email)
    likesByPost.set(like.post_id, list)
  }

  return posts.map((post) => ({
    author: post.author_name,
    authorEmail: post.author_email,
    body: post.body,
    comments: (commentsByPost.get(post.id) ?? []).map((comment) => ({
      author: comment.author_name,
      authorEmail: comment.author_email,
      body: comment.body,
      id: comment.id
    })),
    createdAt: formatDate(new Date(post.created_at)),
    createdAtIso: new Date(post.created_at).toISOString(),
    id: post.id,
    image: post.image ?? undefined,
    likedBy: likesByPost.get(post.id) ?? []
  }))
}

export async function loadPostsByAuthor(authorId: string) {
  const posts = await query<PostRow>(
    `SELECT p.id, p.body, p.image, p.created_at,
            u.id AS author_id, u.name AS author_name, u.email AS author_email
     FROM posts p
     JOIN users u ON u.id = p.author_id
     WHERE p.author_id = $1
     ORDER BY p.created_at DESC`,
    [authorId]
  )

  if (!posts.rowCount) return []

  const postIds = posts.rows.map((post) => post.id)
  const [comments, likes] = await Promise.all([
    query<CommentRow>(
      `SELECT c.id, c.post_id, c.body, u.name AS author_name, u.email AS author_email
       FROM post_comments c
       JOIN users u ON u.id = c.author_id
       WHERE c.post_id = ANY($1::uuid[])
       ORDER BY c.created_at`,
      [postIds]
    ),
    query<LikeRow>(
      `SELECT l.post_id, u.email
       FROM post_likes l
       JOIN users u ON u.id = l.user_id
       WHERE l.post_id = ANY($1::uuid[])`,
      [postIds]
    )
  ])

  return serializePosts(posts.rows, comments.rows, likes.rows)
}

export async function loadCommunityData(currentUser: SessionUser | null) {
  await expireOverdueBlocks()

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin'

  const [users, posts, comments, likes, follows, reviewRequests, accountCount] = await Promise.all([
    query<DbUser>('SELECT * FROM users ORDER BY created_at'),
    query<PostRow>(
      `SELECT p.id, p.body, p.image, p.created_at,
              u.id AS author_id, u.name AS author_name, u.email AS author_email
       FROM posts p
       JOIN users u ON u.id = p.author_id
       ORDER BY p.created_at DESC`
    ),
    query<CommentRow>(
      `SELECT c.id, c.post_id, c.body, u.name AS author_name, u.email AS author_email
       FROM post_comments c
       JOIN users u ON u.id = c.author_id
       ORDER BY c.created_at`
    ),
    query<LikeRow>(
      `SELECT l.post_id, u.email
       FROM post_likes l
       JOIN users u ON u.id = l.user_id`
    ),
    query<{ follower_email: string; followed_email: string }>(
      `SELECT follower.email AS follower_email, followed.email AS followed_email
       FROM follows f
       JOIN users follower ON follower.id = f.follower_id
       JOIN users followed ON followed.id = f.followed_id`
    ),
    isAdmin
      ? query<ReviewRequestRow>(
          `SELECT r.id, r.body, r.image, r.requested_at,
                  u.name AS author_name, u.email AS author_email
           FROM post_review_requests r
           JOIN users u ON u.id = r.author_id
           WHERE r.status = 'pending'
           ORDER BY r.requested_at`
        )
      : Promise.resolve({ rows: [] as ReviewRequestRow[], rowCount: 0 }),
    query<{ count: string }>('SELECT count(*)::text AS count FROM users')
  ])

  const profiles = Object.fromEntries(
    users.rows.map((user) => [
      user.email,
      serializeUser(user, { includePermissions: Boolean(isAdmin) })
    ])
  )

  const followsByEmail: Record<string, string[]> = {}
  for (const row of follows.rows) {
    followsByEmail[row.follower_email] = [
      ...(followsByEmail[row.follower_email] ?? []),
      row.followed_email
    ]
  }

  const block = currentUser ? await getAccountRestriction(currentUser.id) : null
  const notifications = currentUser ? await listNotifications(currentUser.id) : []

  return {
    accountCount: Number(accountCount.rows[0]?.count ?? 0),
    block,
    canInteract: !block,
    follows: followsByEmail,
    notifications,
    postReviewRequests: reviewRequests.rows.map((request) => ({
      author: request.author_name,
      authorEmail: request.author_email,
      body: request.body,
      id: request.id,
      image: request.image ?? undefined,
      requestedAt: new Date(request.requested_at).toISOString()
    })),
    posts: serializePosts(posts.rows, comments.rows, likes.rows),
    profiles,
    user: currentUser
  }
}
