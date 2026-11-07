import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { ApiError, apiErrorResponse, requireUser } from '@/lib/server/auth'
import { assertCanInteract } from '@/lib/server/blocks'

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser()
    await assertCanInteract(user.id)
    const { id } = await context.params

    const post = await query('SELECT 1 FROM posts WHERE id = $1', [id])
    if (!post.rowCount) throw new ApiError(404, 'post_not_found')

    const removed = await query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [
      id,
      user.id
    ])

    if (!removed.rowCount) {
      await query(
        `INSERT INTO post_likes (post_id, user_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [id, user.id]
      )
    }

    return NextResponse.json({ ok: true, liked: !removed.rowCount })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
