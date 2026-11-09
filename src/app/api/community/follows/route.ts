import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import {
  ApiError,
  apiErrorResponse,
  normalizeEmail,
  requireUser
} from '@/lib/server/auth'
import { assertCanInteract } from '@/lib/server/blocks'
import type { DbUser } from '@/lib/server/types'

export async function POST(request: Request) {
  try {
    const user = await requireUser()
    await assertCanInteract(user.id)

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const targetEmail = normalizeEmail((body as { email?: unknown }).email)
    if (!targetEmail || targetEmail === user.email) throw new ApiError(400, 'invalid_target')

    const target = await query<DbUser>(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [targetEmail]
    )
    const targetUser = target.rows[0]
    if (!targetUser) throw new ApiError(404, 'user_not_found')

    const removed = await query(
      'DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2',
      [user.id, targetUser.id]
    )

    if (!removed.rowCount) {
      await query(
        `INSERT INTO follows (follower_id, followed_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [user.id, targetUser.id]
      )
    }

    return NextResponse.json({ following: !removed.rowCount, ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
