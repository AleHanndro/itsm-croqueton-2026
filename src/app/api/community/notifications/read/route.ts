import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { apiErrorResponse, requireUser } from '@/lib/server/auth'

export async function POST(request: Request) {
  try {
    const user = await requireUser()
    const body = await request.json().catch(() => null)
    const ids =
      body && typeof body === 'object' && Array.isArray((body as { ids?: unknown }).ids)
        ? ((body as { ids: unknown[] }).ids.filter((id): id is string => typeof id === 'string'))
        : []

    if (ids.length) {
      await query(
        `UPDATE notifications
         SET read_at = now()
         WHERE user_id = $1 AND id = ANY($2::uuid[]) AND read_at IS NULL`,
        [user.id, ids]
      )
    } else {
      await query('UPDATE notifications SET read_at = now() WHERE user_id = $1 AND read_at IS NULL', [
        user.id
      ])
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
