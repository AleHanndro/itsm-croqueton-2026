import { NextResponse } from 'next/server'

import { assessPostRelevance } from '@/lib/content'
import { query } from '@/lib/db'
import { ApiError, apiErrorResponse, requireUser } from '@/lib/server/auth'
import { assertCanInteract } from '@/lib/server/blocks'

export async function POST(request: Request) {
  try {
    const user = await requireUser()
    await assertCanInteract(user.id)

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const text = String((body as { body?: unknown }).body ?? '').trim()
    const image = typeof (body as { image?: unknown }).image === 'string'
      ? (body as { image: string }).image
      : null

    if (!text && !image) throw new ApiError(400, 'empty_post')
    if (text.length > 5000) throw new ApiError(400, 'post_too_long')

    const relevance = assessPostRelevance(text, Boolean(image))

    if (relevance === 'blocked') throw new ApiError(400, 'post_blocked')

    if (relevance === 'review') {
      await query(
        `INSERT INTO post_review_requests (author_id, body, image)
         VALUES ($1, $2, $3)`,
        [user.id, text, image]
      )
      return NextResponse.json({ status: 'review' }, { status: 201 })
    }

    const result = await query<{ id: string }>(
      `INSERT INTO posts (author_id, body, image)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [user.id, text, image]
    )

    return NextResponse.json({ id: result.rows[0].id, status: 'published' }, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
