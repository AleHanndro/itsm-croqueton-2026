import type { PoolClient } from 'pg'

import { pool } from '@/lib/db'

export interface NotificationInput {
  body: string
  dedupeKey?: string | null
  metadata?: Record<string, unknown>
  relatedBlockId?: string | null
  title: string
  type: string
  userId: string
}

export async function createNotification(
  input: NotificationInput,
  client: PoolClient | typeof pool = pool
) {
  await client.query(
    `INSERT INTO notifications
      (user_id, type, title, body, metadata, related_block_id, dedupe_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (dedupe_key) DO NOTHING`,
    [
      input.userId,
      input.type,
      input.title,
      input.body,
      JSON.stringify(input.metadata ?? {}),
      input.relatedBlockId ?? null,
      input.dedupeKey ?? null
    ]
  )
}

export interface SerializedNotification {
  body: string
  createdAt: string
  id: string
  metadata: Record<string, unknown>
  readAt: string | null
  title: string
  type: string
}

export function serializeNotification(row: {
  body: string
  created_at: Date
  id: string
  metadata: Record<string, unknown> | null
  read_at: Date | null
  title: string
  type: string
}): SerializedNotification {
  return {
    body: row.body,
    createdAt: new Date(row.created_at).toISOString(),
    id: row.id,
    metadata: row.metadata ?? {},
    readAt: row.read_at ? new Date(row.read_at).toISOString() : null,
    title: row.title,
    type: row.type
  }
}

export async function listNotifications(userId: string, limit = 50) {
  const result = await pool.query(
    `SELECT id, type, title, body, metadata, read_at, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  )

  return result.rows.map(serializeNotification)
}
