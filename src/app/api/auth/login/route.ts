import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import {
  ApiError,
  actorFromUser,
  apiErrorResponse,
  createSession,
  getClientIp,
  normalizeEmail
} from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'
import { verifyPassword } from '@/lib/password-server'
import { serializeSessionUser } from '@/lib/server/serializers'
import type { DbUser } from '@/lib/server/types'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const email = normalizeEmail((body as { email?: unknown }).email)
    const password = String((body as { password?: unknown }).password ?? '')
    const remember = (body as { remember?: unknown }).remember === true

    const result = await query<DbUser>('SELECT * FROM users WHERE email = $1', [email])
    const row = result.rows[0]

    if (!row || !verifyPassword(password, row.password_hash)) {
      throw new ApiError(401, 'invalid_credentials')
    }

    if (!row.is_active) throw new ApiError(403, 'account_inactive')

    const user = serializeSessionUser(row)
    await createSession(user.id, request, remember)

    if (user.role === 'admin' || user.role === 'superadmin') {
      await writeAudit(actorFromUser(user), {
        action: 'auth.login',
        description: `${user.name} inició sesión en el panel administrativo.`,
        ip: getClientIp(request)
      })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
