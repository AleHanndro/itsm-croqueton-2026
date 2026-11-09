import { NextResponse } from 'next/server'

import { query, withTransaction } from '@/lib/db'
import {
  ApiError,
  actorFromUser,
  apiErrorResponse,
  getClientIp,
  requirePermission
} from '@/lib/server/auth'
import { assertCanInteract } from '@/lib/server/blocks'
import { writeAudit } from '@/lib/server/audit'
import { createNotification } from '@/lib/server/notifications'
import { serializeBlock } from '@/lib/server/serializers'
import type { DbUser } from '@/lib/server/types'

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requirePermission('users.block')
    await assertCanInteract(admin.id)
    const { id } = await context.params

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const reason = String((body as { reason?: unknown }).reason ?? '').trim()
    const notes = String((body as { notes?: unknown }).notes ?? '').trim()

    if (!reason) throw new ApiError(400, 'reason_required')

    const targetResult = await query<DbUser>('SELECT * FROM users WHERE id = $1', [id])
    const target = targetResult.rows[0]
    if (!target) throw new ApiError(404, 'user_not_found')
    if (target.role !== 'user') throw new ApiError(400, 'not_a_user_account')

    const block = await withTransaction(async (client) => {
      const existing = await client.query(
        `SELECT 1 FROM user_blocks
         WHERE user_id = $1 AND status IN ('active', 'expired')`,
        [target.id]
      )
      if (existing.rowCount) throw new ApiError(409, 'already_blocked')

      const inserted = await client.query<{
        created_at: Date
        ends_at: Date
        id: string
        notes: string
        reason: string
        starts_at: Date
        status: 'active' | 'expired' | 'unlocked'
      }>(
        `INSERT INTO user_blocks (user_id, admin_id, reason, notes, starts_at, ends_at)
         VALUES ($1, $2, $3, $4, now(), now() + interval '15 days')
         RETURNING id, reason, notes, starts_at, ends_at, status, created_at`,
        [target.id, admin.id, reason, notes]
      )

      const blockRow = inserted.rows[0]

      await client.query(
        `UPDATE users SET account_status = 'blocked' WHERE id = $1`,
        [target.id]
      )

      await createNotification(
        {
          body: `Tu cuenta fue bloqueada durante 15 días. Motivo: ${reason}. La restricción termina el ${new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(new Date(blockRow.ends_at))}.`,
          metadata: {
            blockId: blockRow.id,
            endsAt: new Date(blockRow.ends_at).toISOString(),
            reason
          },
          relatedBlockId: blockRow.id,
          title: 'Cuenta bloqueada temporalmente',
          type: 'account_blocked',
          userId: target.id
        },
        client
      )

      await writeAudit(
        actorFromUser(admin),
        {
          action: 'user.block',
          affectedUserId: target.id,
          affectedUserName: target.name,
          description: `${admin.name} bloqueó la cuenta de ${target.name} durante 15 días.`,
          ip: getClientIp(request),
          metadata: {
            blockId: blockRow.id,
            endsAt: new Date(blockRow.ends_at).toISOString(),
            notes,
            reason
          }
        },
        client
      )

      return serializeBlock(blockRow)
    })

    return NextResponse.json({ block }, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
