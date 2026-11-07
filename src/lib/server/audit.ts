import type { PoolClient } from 'pg'

import { pool } from '@/lib/db'

export interface AuditActor {
  id: string
  name: string
  username: string
}

export interface AuditInput {
  action: string
  affectedUserId?: string | null
  affectedUserName?: string | null
  description: string
  ip?: string | null
  metadata?: Record<string, unknown>
}

export async function writeAudit(
  actor: AuditActor | null,
  input: AuditInput,
  client: PoolClient | typeof pool = pool
) {
  await client.query(
    `INSERT INTO admin_audit_log
      (admin_id, admin_name, admin_username, action, description, affected_user_id,
       affected_user_name, ip, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      actor?.id ?? null,
      actor?.name ?? 'Sistema',
      actor?.username ?? 'sistema',
      input.action,
      input.description,
      input.affectedUserId ?? null,
      input.affectedUserName ?? null,
      input.ip ?? null,
      JSON.stringify(input.metadata ?? {})
    ]
  )
}
