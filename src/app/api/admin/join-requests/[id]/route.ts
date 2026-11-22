import { after, NextResponse } from 'next/server'

import { withTransaction } from '@/lib/db'
import { writeAudit } from '@/lib/server/audit'
import {
  ApiError,
  actorFromUser,
  apiErrorResponse,
  getClientIp,
  requireAdmin
} from '@/lib/server/auth'
import { joinCapacity } from '@/lib/server/config'
import {
  hasCapacity,
  lockJoinCapacity,
  promoteFromWaitlist,
  sendJoinEmail,
  type JoinRequestRow,
  type JoinStatus
} from '@/lib/server/join-requests'

const STATUS_LABELS: Record<JoinStatus, string> = {
  accepted: 'aceptada',
  rejected: 'rechazada',
  waitlisted: 'en lista de espera'
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await context.params
    const body = (await request.json().catch(() => null)) as { status?: unknown } | null
    const status = body?.status
    if (status !== 'accepted' && status !== 'rejected' && status !== 'waitlisted') {
      throw new ApiError(400, 'invalid_status')
    }

    const outcome = await withTransaction(async (client) => {
      await lockJoinCapacity(client)

      const current = await client.query<JoinRequestRow>(
        'SELECT * FROM join_requests WHERE id = $1 FOR UPDATE',
        [id]
      )
      const target = current.rows[0]
      if (!target) throw new ApiError(404, 'request_not_found')
      if (target.status === status) return { promoted: [], target, wasAccepted: false }

      if (status === 'accepted' && !(await hasCapacity(client))) {
        throw new ApiError(409, 'capacity_full', undefined, { capacity: joinCapacity() })
      }

      if (status !== 'rejected') {
        // Si la persona tiene otra solicitud activa con el mismo correo, no la duplicamos.
        const duplicate = await client.query(
          `SELECT 1 FROM join_requests
           WHERE email = $1 AND id <> $2 AND status IN ('accepted', 'waitlisted')`,
          [target.email, id]
        )
        if (duplicate.rowCount) throw new ApiError(409, 'already_registered')
      }

      await client.query(
        `UPDATE join_requests SET status = $1, decided_at = now(), decided_by = $2 WHERE id = $3`,
        [status, admin.id, id]
      )

      // Si se liberó un lugar, lo ocupa quien lleva más tiempo esperando.
      const promoted = target.status === 'accepted' ? await promoteFromWaitlist(client, id) : []

      await writeAudit(
        actorFromUser(admin),
        {
          action: 'join_request.status',
          affectedUserName: target.name,
          description: `${admin.name} marcó la solicitud de ${target.name} como ${STATUS_LABELS[status]}.${
            promoted.length
              ? ` Se liberó un lugar y pasó a aceptada: ${promoted.map((row) => row.name).join(', ')}.`
              : ''
          }`,
          ip: getClientIp(request),
          metadata: { from: target.status, promoted: promoted.map((row) => row.id), to: status }
        },
        client
      )

      return { promoted, target, wasAccepted: status === 'accepted' }
    })

    after(async () => {
      if (outcome.wasAccepted) await sendJoinEmail(outcome.target, 'join_accepted')
      for (const row of outcome.promoted) await sendJoinEmail(row, 'join_accepted')
    })

    return NextResponse.json({
      ok: true,
      promoted: outcome.promoted.map((row) => ({ id: row.id, name: row.name }))
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
