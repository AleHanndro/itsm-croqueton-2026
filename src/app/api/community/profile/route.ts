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
  requireUser
} from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'
import { serializeSessionUser } from '@/lib/server/serializers'
import type { DbUser } from '@/lib/server/types'

export async function PATCH(request: Request) {
  try {
    const user = await requireUser()
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const patch = body as Record<string, unknown>
    const result = await query<DbUser>('SELECT * FROM users WHERE id = $1', [user.id])
    const current = result.rows[0]
    if (!current) throw new ApiError(401, 'no_session')

    const name = String(patch.name ?? current.name).trim()
    if (!name) throw new ApiError(400, 'name_required')

    const username = normalizeUsername(patch.username ?? current.username)
    if (!isUsername(username)) throw new ApiError(400, 'username_invalid')

    const email = normalizeEmail(patch.email ?? current.email)
    if (!isEmail(email)) throw new ApiError(400, 'email_invalid')

    const petName = String(patch.petName ?? current.pet_name).trim()
    if (!petName) throw new ApiError(400, 'pet_name_required')

    const petBio = String(patch.petBio ?? current.pet_bio).trim()

    const [usernameTaken, emailTaken] = await Promise.all([
      query('SELECT 1 FROM users WHERE username = $1 AND id <> $2', [username, user.id]),
      query('SELECT 1 FROM users WHERE email = $1 AND id <> $2', [email, user.id])
    ])

    if (usernameTaken.rowCount) throw new ApiError(409, 'username_taken')
    if (emailTaken.rowCount) throw new ApiError(409, 'email_taken')

    const avatarConfig =
      patch.avatarConfig && typeof patch.avatarConfig === 'object' && !Array.isArray(patch.avatarConfig)
        ? { ...(current.avatar_config ?? {}), ...(patch.avatarConfig as Record<string, unknown>) }
        : (current.avatar_config ?? {})

    const avatarImage = Object.hasOwn(patch, 'avatarImage')
      ? patch.avatarImage === null
        ? null
        : String(patch.avatarImage)
      : current.avatar_image

    const petPhoto = Object.hasOwn(patch, 'petPhoto')
      ? patch.petPhoto === null
        ? null
        : String(patch.petPhoto)
      : current.pet_photo

    const updated = await query<DbUser>(
      `UPDATE users
       SET name = $1, username = $2, email = $3, pet_name = $4, pet_bio = $5,
           avatar_config = $6, avatar_image = $7, pet_photo = $8
       WHERE id = $9
       RETURNING *`,
      [
        name,
        username,
        email,
        petName,
        petBio,
        JSON.stringify(avatarConfig),
        avatarImage,
        petPhoto,
        user.id
      ]
    )

    if (user.role === 'admin' || user.role === 'superadmin') {
      await writeAudit(actorFromUser(user), {
        action: 'profile.update',
        affectedUserId: user.id,
        affectedUserName: name,
        description: `${user.name} actualizó su perfil administrativo.`,
        ip: getClientIp(request)
      })
    }

    return NextResponse.json({ user: serializeSessionUser(updated.rows[0]) })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
