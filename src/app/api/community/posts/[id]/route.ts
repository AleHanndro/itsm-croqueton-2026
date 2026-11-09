import { NextResponse } from 'next/server'

import { assessPostRelevance } from '@/lib/content'
import { query } from '@/lib/db'
import { ApiError, apiErrorResponse, requireUser } from '@/lib/server/auth'
import { assertCanInteract } from '@/lib/server/blocks'

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser()
    await assertCanInteract(user.id)
    const { id } = await context.params

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const text = String((body as { body?: unknown }).body ?? '').trim()
    if (!text) throw new ApiError(400, 'empty_post')
    if (text.length > 5000) throw new ApiError(400, 'post_too_long')
    if (assessPostRelevance(text, false) !== 'approved') {
      throw new ApiError(400, 'post_requires_review')
    }

    const result = await query(
      `UPDATE posts
       SET body = $1
       WHERE id = $2 AND author_id = $3`,
      [text, id, user.id]
    )

    if (!result.rowCount) throw new ApiError(404, 'post_not_found')
    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser()
    await assertCanInteract(user.id)
    const { id } = await context.params

    const result = await query('DELETE FROM posts WHERE id = $1 AND author_id = $2', [
      id,
      user.id
    ])

    if (!result.rowCount) throw new ApiError(404, 'post_not_found')
    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
