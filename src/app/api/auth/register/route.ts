import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import {
  ApiError,
  apiErrorResponse,
  createSession,
  isEmail,
  isStrongPassword,
  isUsername,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  usernameFromEmail
} from '@/lib/server/auth'
import { hashPassword } from '@/lib/password-server'
import { DEFAULT_AVATAR_CONFIG, serializeSessionUser } from '@/lib/server/serializers'
import type { DbUser } from '@/lib/server/types'

async function availableUsername(email: string) {
  const base = usernameFromEmail(email)
  let candidate = base

  for (let suffix = 1; suffix < 1000; suffix += 1) {
    const result = await query('SELECT 1 FROM users WHERE username = $1', [candidate])
    if (!result.rowCount && isUsername(candidate)) return candidate
    candidate = `${base}${suffix}`.slice(0, 24)
  }

  throw new ApiError(409, 'username_taken')
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const email = normalizeEmail((body as { email?: unknown }).email)
    const password = String((body as { password?: unknown }).password ?? '')
    const remember = (body as { remember?: unknown }).remember === true

    if (!isEmail(email)) throw new ApiError(400, 'email_invalid')
    if (password.length < MIN_PASSWORD_LENGTH) throw new ApiError(400, 'password_too_short')
    if (!isStrongPassword(password)) throw new ApiError(400, 'password_too_weak')

    const existing = await query('SELECT 1 FROM users WHERE email = $1', [email])
    if (existing.rowCount) throw new ApiError(409, 'email_taken')

    const username = await availableUsername(email)
    const result = await query<DbUser>(
      `INSERT INTO users
        (email, password_hash, name, username, role, avatar_config, pet_name)
       VALUES ($1, $2, $3, $4, 'user', $5, 'Chispita')
       RETURNING *`,
      [email, hashPassword(password), email.split('@')[0] || 'Croquetón', username, DEFAULT_AVATAR_CONFIG]
    )

    const user = serializeSessionUser(result.rows[0])
    await createSession(user.id, request, remember)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
