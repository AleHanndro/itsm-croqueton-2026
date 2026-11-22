import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { apiErrorResponse, requireAdmin } from '@/lib/server/auth'
import { joinCapacity } from '@/lib/server/config'
import { serializeJoinRequest, type JoinRequestRow } from '@/lib/server/join-requests'
import { isMailerConfigured } from '@/lib/server/mailer'

interface EmailLogRow {
  created_at: Date
  error: string | null
  kind: string
  related_id: string
  status: string
}

export async function GET() {
  try {
    await requireAdmin()

    const result = await query<JoinRequestRow>(
      `SELECT jr.*, u.email AS decided_by_email
       FROM join_requests jr
       LEFT JOIN users u ON u.id = jr.decided_by
       ORDER BY jr.created_at DESC`
    )

    const ids = result.rows.map((row) => row.id)
    const emails = ids.length
      ? await query<EmailLogRow>(
          `SELECT related_id, kind, status, error, created_at
           FROM email_log
           WHERE related_id = ANY($1::uuid[])
           ORDER BY created_at DESC`,
          [ids]
        )
      : { rows: [] as EmailLogRow[] }

    const emailsByRequest = new Map<string, EmailLogRow[]>()
    for (const row of emails.rows) {
      const list = emailsByRequest.get(row.related_id) ?? []
      list.push(row)
      emailsByRequest.set(row.related_id, list)
    }

    const requests = result.rows.map((row) => ({
      ...serializeJoinRequest(row),
      emails: (emailsByRequest.get(row.id) ?? []).map((email) => ({
        createdAt: new Date(email.created_at).toISOString(),
        error: email.error,
        kind: email.kind,
        status: email.status
      }))
    }))

    return NextResponse.json({
      capacity: joinCapacity(),
      counts: {
        accepted: requests.filter((request) => request.status === 'accepted').length,
        rejected: requests.filter((request) => request.status === 'rejected').length,
        total: requests.length,
        waitlisted: requests.filter((request) => request.status === 'waitlisted').length
      },
      mailerConfigured: isMailerConfigured(),
      requests
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
