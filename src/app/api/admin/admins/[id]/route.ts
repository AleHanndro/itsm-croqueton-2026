import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import {
  ApiError,
  actorFromUser,
  apiErrorResponse,
  getClientIp,
  isEmail,
  isUsername,
  normalizeEmail,
  normalizeUsername,
  requireSuperadmin
} from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'
import { serializeUser } from '@/lib/server/serializers'
import type { DbUser } from '@/lib/server/types'

const ALLOWED_PERMISSIONS = [
  'moderation.manage',
  'moderation.view',
  'users.block',
  'users.unlock',
  'users.view'
] as const

function sanitizePermissions(value: unknown, fallback: Record<string, boolean>) {
  const input =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return Object.fromEntries(
    ALLOWED_PERMISSIONS.map((key) => [key, input[key] === undefined ? fallback[key] === true : input[key] === true])
  )
}

async function loadAdmin(id: string) {
  const result = await query<DbUser>('SELECT * FROM users WHERE id = $1', [id])
  const admin = result.rows[0]
  if (!admin) throw new ApiError(404, 'admin_not_found')
  if (admin.role !== 'admin') throw new ApiError(400, 'not_an_admin_account')
  return admin
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireSuperadmin()
    const { id } = await context.params
    const current = await loadAdmin(id)

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')
    const patch = body as Record<string, unknown>

    const name = String(patch.name ?? current.name).trim()
    const username = normalizeUsername(patch.username ?? current.username)
    const email = normalizeEmail(patch.email ?? current.email)
    const isActive = typeof patch.isActive === 'boolean' ? patch.isActive : current.is_active
    const role =
      patch.role === 'admin' || patch.role === 'superadmin' || patch.role === 'user'
        ? patch.role
        : current.role
    const avatarImage = Object.hasOwn(patch, 'avatarImage')
      ? patch.avatarImage === null
        ? null
        : String(patch.avatarImage)
      : current.avatar_image
    const permissions =
      role === 'superadmin'
        ? {
            'moderation.manage': true,
            'moderation.view': true,
            'users.block': true,
            'users.unlock': true,
            'users.view': true
          }
        : sanitizePermissions(
            patch.permissions,
            (current.permissions ?? {}) as Record<string, boolean>
          )

    if (!name) throw new ApiError(400, 'name_required')
    if (!isEmail(email)) throw new ApiError(400, 'email_invalid')
    if (!isUsername(username)) throw new ApiError(400, 'username_invalid')

    const [emailTaken, usernameTaken] = await Promise.all([
      query('SELECT 1 FROM users WHERE email = $1 AND id <> $2', [email, id]),
      query('SELECT 1 FROM users WHERE username = $1 AND id <> $2', [username, id])
    ])

    if (emailTaken.rowCount) throw new ApiError(409, 'email_taken')
    if (usernameTaken.rowCount) throw new ApiError(409, 'username_taken')

    const effectiveActive = role === 'user' ? false : isActive

    const result = await query<DbUser>(
      `UPDATE users
       SET name = $1, username = $2, email = $3, role = $4, is_active = $5, avatar_image = $6,
           permissions = $7
       WHERE id = $8
       RETURNING *`,
      [name, username, email, role, effectiveActive, avatarImage, JSON.stringify(permissions), id]
    )

    if (!effectiveActive) {
      await query('DELETE FROM sessions WHERE user_id = $1', [id])
    }

    await writeAudit(actorFromUser(actor), {
      action: 'admin.update',
      affectedUserId: id,
      affectedUserName: result.rows[0].name,
      description: `${actor.name} actualizó al administrador ${result.rows[0].name}.`,
      ip: getClientIp(request),
      metadata: { email, isActive: effectiveActive, permissions, role, username }
    })

    return NextResponse.json({
      user: serializeUser(result.rows[0], { includePermissions: true })
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireSuperadmin()
    const { id } = await context.params
    const current = await loadAdmin(id)

    await writeAudit(actorFromUser(actor), {
      action: 'admin.delete',
      affectedUserId: id,
      affectedUserName: current.name,
      description: `${actor.name} eliminó al administrador ${current.name}.`,
      ip: getClientIp(request),
      metadata: { email: current.email, username: current.username }
    })

    await query('DELETE FROM users WHERE id = $1', [id])

    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
