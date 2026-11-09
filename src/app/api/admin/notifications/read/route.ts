import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { apiErrorResponse, requireAdmin } from '@/lib/server/auth'

export async function POST() {
  try {
    const admin = await requireAdmin()
    await query('UPDATE notifications SET read_at = now() WHERE user_id = $1 AND read_at IS NULL', [
      admin.id
    ])
    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
