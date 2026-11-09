import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import {
  ApiError,
  actorFromUser,
  apiErrorResponse,
  getClientIp,
  isEmail,
  isUsername,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  normalizeUsername,
  requireSuperadmin
} from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'
import { hashPassword } from '@/lib/password-server'
import {
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_AVATAR_CONFIG,
  serializeUser
} from '@/lib/server/serializers'
import type { AdminPermissions, DbUser } from '@/lib/server/types'

const ALLOWED_PERMISSIONS = [
  'moderation.manage',
  'moderation.view',
  'users.block',
  'users.unlock',
  'users.view'
] as const

function sanitizePermissions(value: unknown, fallback: AdminPermissions = DEFAULT_ADMIN_PERMISSIONS) {
  const input =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return Object.fromEntries(
    ALLOWED_PERMISSIONS.map((key) => [key, input[key] === undefined ? fallback[key] === true : input[key] === true])
  )
}

export async function GET() {
  try {
    const user = await requireSuperadmin()

    const result = await query<DbUser>(
      `SELECT * FROM users WHERE role IN ('admin', 'superadmin') ORDER BY created_at`
    )

    return NextResponse.json({
      admins: result.rows.map((row) => serializeUser(row, { includePermissions: true }))
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireSuperadmin()
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const input = body as Record<string, unknown>
    const email = normalizeEmail(input.email)
    const name = String(input.name ?? '').trim()
    const username = normalizeUsername(input.username)
    const password = String(input.password ?? '')
    const isActive = input.isActive !== false
    const role = input.role === 'superadmin' ? 'superadmin' : 'admin'
    const avatarImage = typeof input.avatarImage === 'string' ? input.avatarImage : null
    const permissions = sanitizePermissions(input.permissions)

    if (!name) throw new ApiError(400, 'name_required')
    if (!isEmail(email)) throw new ApiError(400, 'email_invalid')
    if (!isUsername(username)) throw new ApiError(400, 'username_invalid')
    if (password.length < MIN_PASSWORD_LENGTH) throw new ApiError(400, 'password_too_short')

    const [emailTaken, usernameTaken] = await Promise.all([
      query('SELECT 1 FROM users WHERE email = $1', [email]),
      query('SELECT 1 FROM users WHERE username = $1', [username])
    ])

    if (emailTaken.rowCount) throw new ApiError(409, 'email_taken')
    if (usernameTaken.rowCount) throw new ApiError(409, 'username_taken')

    const result = await query<DbUser>(
      `INSERT INTO users
        (email, password_hash, name, username, role, is_active, permissions, avatar_config,
         avatar_image, pet_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Chispita')
       RETURNING *`,
      [
        email,
        hashPassword(password),
        name,
        username,
        role,
        isActive,
        JSON.stringify(permissions),
        DEFAULT_AVATAR_CONFIG,
        avatarImage
      ]
    )

    const created = result.rows[0]

    await writeAudit(actorFromUser(actor), {
      action: 'admin.create',
      affectedUserId: created.id,
      affectedUserName: created.name,
      description: `${actor.name} creó al administrador ${created.name}.`,
      ip: getClientIp(request),
      metadata: { email, permissions, role, username }
    })

    return NextResponse.json(
      { user: serializeUser(created, { includePermissions: true }) },
      { status: 201 }
    )
  } catch (error) {
    return apiErrorResponse(error)
  }
}
