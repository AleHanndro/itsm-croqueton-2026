import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { ApiError, apiErrorResponse, requireSuperadmin } from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'
import { actorFromUser } from '@/lib/server/auth'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireSuperadmin()
    const { id } = await params

    if (id === actor.id) {
      throw new ApiError(400, 'cannot_delete_self')
    }

    const existing = await query<{ email: string; name: string; role: string }>(
      'SELECT email, name, role FROM users WHERE id = $1',
      [id]
    )

    if (!existing.rowCount) {
      throw new ApiError(404, 'user_not_found')
    }

    const target = existing.rows[0]

    if (target.role === 'superadmin') {
      const count = await query<{ count: string }>('SELECT count(*)::text AS count FROM users WHERE role = $1', ['superadmin'])
      if (Number(count.rows[0]?.count ?? 0) <= 1) {
        throw new ApiError(400, 'cannot_delete_last_superadmin')
      }
    }

    await query('DELETE FROM users WHERE id = $1', [id])

    await writeAudit(actorFromUser(actor), {
      action: 'user.delete',
      affectedUserId: id,
      affectedUserName: target.name,
      description: `${actor.name} eliminó al usuario ${target.name}.`,
      metadata: { email: target.email, role: target.role }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
