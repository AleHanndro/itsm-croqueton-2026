import type { PoolClient } from 'pg'

import { joinCapacity } from '@/lib/server/config'
import { joinAcceptedEmail, joinWaitlistedEmail } from '@/lib/server/email-templates'
import { sendEmail } from '@/lib/server/mailer'

export type JoinStatus = 'accepted' | 'rejected' | 'waitlisted'

export interface JoinRequestRow {
  accepts_commitment: boolean
  age: number
  created_at: Date
  decided_at: Date | null
  decided_by: string | null
  decided_by_email?: string | null
  email: string
  has_availability: boolean
  id: string
  motivation: string
  name: string
  phone: string
  status: JoinStatus
}

export function serializeJoinRequest(row: JoinRequestRow) {
  return {
    acceptsCommitment: row.accepts_commitment,
    age: row.age,
    createdAt: new Date(row.created_at).toISOString(),
    decidedAt: row.decided_at ? new Date(row.decided_at).toISOString() : null,
    decidedBy: row.decided_by_email ?? null,
    email: row.email,
    hasAvailability: row.has_availability,
    id: row.id,
    motivation: row.motivation,
    name: row.name,
    phone: row.phone,
    status: row.status
  }
}

/**
 * Serializa todo lo que toca el cupo: dos solicitudes simultáneas no pueden quedarse
 * con el último lugar. Se libera al terminar la transacción.
 */
export async function lockJoinCapacity(client: PoolClient) {
  await client.query(`SELECT pg_advisory_xact_lock(hashtext('croqueton.join_requests'))`)
}

export async function countAccepted(client: PoolClient) {
  const result = await client.query<{ count: string }>(
    `SELECT count(*)::text AS count FROM join_requests WHERE status = 'accepted'`
  )
  return Number(result.rows[0]?.count ?? 0)
}

export async function hasCapacity(client: PoolClient) {
  return (await countAccepted(client)) < joinCapacity()
}

/**
 * Sube a "aceptado" a los más antiguos de la lista de espera mientras haya cupo.
 * Devuelve los promovidos para enviarles el correo después del commit.
 */
export async function promoteFromWaitlist(client: PoolClient, excludeId?: string) {
  const free = joinCapacity() - (await countAccepted(client))
  if (free <= 0) return []

  const result = await client.query<Pick<JoinRequestRow, 'email' | 'id' | 'name'>>(
    `UPDATE join_requests SET status = 'accepted', decided_at = now(), decided_by = NULL
     WHERE id IN (
       SELECT id FROM join_requests
       WHERE status = 'waitlisted' AND ($2::uuid IS NULL OR id <> $2::uuid)
       ORDER BY created_at
       LIMIT $1
     )
     RETURNING id, name, email`,
    [free, excludeId ?? null]
  )
  return result.rows
}

export async function sendJoinEmail(
  request: Pick<JoinRequestRow, 'email' | 'id' | 'name'>,
  kind: 'join_accepted' | 'join_waitlisted'
) {
  const template =
    kind === 'join_accepted'
      ? joinAcceptedEmail({ name: request.name })
      : joinWaitlistedEmail({ name: request.name })
  await sendEmail({ ...template, kind, relatedId: request.id, to: request.email })
}
