import type { PoolClient } from 'pg'

import { query, withTransaction } from '@/lib/db'
import { ApiError } from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'
import { createNotification } from '@/lib/server/notifications'
import { serializeBlock } from '@/lib/server/serializers'
import type { AccountBlock } from '@/lib/server/types'

interface BlockRow {
  created_at: Date
  ends_at: Date
  id: string
  notes: string
  reason: string
  starts_at: Date
  status: 'active' | 'expired' | 'unlocked'
}

export async function getLatestBlock(userId: string): Promise<AccountBlock | null> {
  const result = await query<BlockRow>(
    `SELECT id, reason, notes, starts_at, ends_at, status, created_at
     FROM user_blocks
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  )

  return result.rowCount ? serializeBlock(result.rows[0]) : null
}

export async function getAccountRestriction(userId: string): Promise<AccountBlock | null> {
  const result = await query<BlockRow>(
    `SELECT id, reason, notes, starts_at, ends_at, status, created_at
     FROM user_blocks
     WHERE user_id = $1 AND status IN ('active', 'expired')
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  )

  return result.rowCount ? serializeBlock(result.rows[0]) : null
}

export async function assertCanInteract(userId: string) {
  const block = await getAccountRestriction(userId)

  if (block) {
    throw new ApiError(403, 'account_blocked', 'Account is blocked', { block })
  }
}

async function notifyAdminsOfExpiredBlock(
  client: PoolClient,
  block: BlockRow,
  user: { email: string; id: string; name: string }
) {
  const admins = await client.query<{ id: string }>(
    `SELECT id
     FROM users
     WHERE is_active = true
       AND (
         role = 'superadmin'
         OR (
           role = 'admin'
           AND (
             COALESCE((permissions->>'users.view')::boolean, false)
             OR COALESCE((permissions->>'users.unlock')::boolean, false)
           )
         )
       )`,
    []
  )

  for (const admin of admins.rows) {
    await createNotification(
      {
        body: `${user.name} (@${user.email}) terminó su bloqueo de 15 días. Revisa la cuenta para desbloquearla.`,
        dedupeKey: `block-expired-admin:${block.id}:${admin.id}`,
        metadata: {
          blockId: block.id,
          userEmail: user.email,
          userId: user.id,
          userName: user.name
        },
        relatedBlockId: block.id,
        title: 'Bloqueo vencido pendiente de revisión',
        type: 'admin_block_expired',
        userId: admin.id
      },
      client
    )
  }
}

export async function expireOverdueBlocks() {
  return withTransaction(async (client) => {
    const expired = await client.query<
      BlockRow & { user_email: string; user_id: string; user_name: string }
    >(
      `SELECT b.id, b.reason, b.notes, b.starts_at, b.ends_at, b.status, b.created_at,
              u.id AS user_id, u.name AS user_name, u.email AS user_email
       FROM user_blocks b
       JOIN users u ON u.id = b.user_id
       WHERE b.status = 'active' AND b.ends_at <= now()
       ORDER BY b.ends_at
       FOR UPDATE OF b SKIP LOCKED`,
      []
    )

    for (const block of expired.rows) {
      await client.query(
        `UPDATE user_blocks
         SET status = 'expired'
         WHERE id = $1 AND status = 'active'`,
        [block.id]
      )
      await client.query(
        `UPDATE users
         SET account_status = 'blocked_expired'
         WHERE id = $1 AND account_status = 'blocked'`,
        [block.user_id]
      )
      await createNotification(
        {
          body: 'Tu bloqueo de 15 días terminó. La cuenta sigue restringida hasta que un administrador la revise y la desbloquee.',
          dedupeKey: `block-expired-user:${block.id}`,
          metadata: { blockId: block.id },
          relatedBlockId: block.id,
          title: 'Bloqueo vencido, revisión pendiente',
          type: 'account_block_expired',
          userId: block.user_id
        },
        client
      )
      await notifyAdminsOfExpiredBlock(client, block, {
        email: block.user_email,
        id: block.user_id,
        name: block.user_name
      })
      await writeAudit(
        null,
        {
          action: 'user.block_expired',
          affectedUserId: block.user_id,
          affectedUserName: block.user_name,
          description: `El bloqueo de ${block.user_name} venció y quedó pendiente de revisión administrativa.`,
          metadata: {
            blockId: block.id,
            endsAt: new Date(block.ends_at).toISOString(),
            reason: block.reason
          }
        },
        client
      )
    }

    return { expired: expired.rowCount ?? 0 }
  })
}
