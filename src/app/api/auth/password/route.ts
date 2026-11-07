import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import {
  ApiError,
  actorFromUser,
  apiErrorResponse,
  getClientIp,
  MIN_PASSWORD_LENGTH,
  requireUser
} from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'
import { hashPassword, verifyPassword } from '@/lib/password-server'
import type { DbUser } from '@/lib/server/types'

export async function PATCH(request: Request) {
  try {
    const user = await requireUser()
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const currentPassword = String((body as { currentPassword?: unknown }).currentPassword ?? '')
    const nextPassword = String((body as { nextPassword?: unknown }).nextPassword ?? '')

    if (nextPassword.length < MIN_PASSWORD_LENGTH) throw new ApiError(400, 'password_too_short')
    if (nextPassword === currentPassword) throw new ApiError(400, 'password_same')

    const result = await query<DbUser>('SELECT * FROM users WHERE id = $1', [user.id])
    const row = result.rows[0]
    if (!row) throw new ApiError(401, 'no_session')

    if (!verifyPassword(currentPassword, row.password_hash)) {
      throw new ApiError(400, 'current_password_incorrect')
    }

    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      hashPassword(nextPassword),
      user.id
    ])

    if (user.role === 'admin' || user.role === 'superadmin') {
      await writeAudit(actorFromUser(user), {
        action: 'auth.password_change',
        description: `${user.name} cambió su contraseña.`,
        ip: getClientIp(request)
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
