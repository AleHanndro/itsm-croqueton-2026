import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { ApiError, apiErrorResponse, requireUser } from '@/lib/server/auth'
import { assertCanInteract } from '@/lib/server/blocks'

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser()
    await assertCanInteract(user.id)
    const { id } = await context.params

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const text = String((body as { body?: unknown }).body ?? '').trim()
    if (!text) throw new ApiError(400, 'empty_comment')
    if (text.length > 1000) throw new ApiError(400, 'comment_too_long')

    const post = await query('SELECT 1 FROM posts WHERE id = $1', [id])
    if (!post.rowCount) throw new ApiError(404, 'post_not_found')

    const result = await query<{ id: string }>(
      `INSERT INTO post_comments (post_id, author_id, body)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [id, user.id, text]
    )

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
