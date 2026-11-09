import { NextResponse } from 'next/server'

import { query, withTransaction } from '@/lib/db'
import {
  ApiError,
  actorFromUser,
  apiErrorResponse,
  getClientIp,
  requirePermission
} from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'
import { createNotification } from '@/lib/server/notifications'
import type { DbUser } from '@/lib/server/types'

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requirePermission('users.unlock')
    const { id } = await context.params

    const targetResult = await query<DbUser>('SELECT * FROM users WHERE id = $1', [id])
    const target = targetResult.rows[0]
    if (!target) throw new ApiError(404, 'user_not_found')
    if (target.role !== 'user') throw new ApiError(400, 'not_a_user_account')

    await withTransaction(async (client) => {
      const blockResult = await client.query<{ id: string; status: 'active' | 'expired' }>(
        `SELECT id, status
         FROM user_blocks
         WHERE user_id = $1 AND status IN ('active', 'expired')
         ORDER BY created_at DESC
         LIMIT 1
         FOR UPDATE`,
        [target.id]
      )

      const block = blockResult.rows[0]
      if (!block) throw new ApiError(400, 'no_active_block')

      await client.query(
        `UPDATE user_blocks
         SET status = 'unlocked', unlocked_by = $1, unlocked_at = now()
         WHERE id = $2`,
        [admin.id, block.id]
      )
      await client.query(
        `UPDATE users SET account_status = 'active' WHERE id = $1`,
        [target.id]
      )

      await createNotification(
        {
          body: 'Tu cuenta fue desbloqueada. Ya puedes volver a publicar, comentar y reaccionar en GuauBook.',
          dedupeKey: `account-unblocked:${block.id}`,
          metadata: { blockId: block.id },
          relatedBlockId: block.id,
          title: 'Cuenta desbloqueada',
          type: 'account_unblocked',
          userId: target.id
        },
        client
      )

      await writeAudit(
        actorFromUser(admin),
        {
          action: 'user.unblock',
          affectedUserId: target.id,
          affectedUserName: target.name,
          description: `${admin.name} desbloqueó la cuenta de ${target.name}.`,
          ip: getClientIp(request),
          metadata: { blockId: block.id }
        },
        client
      )
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
