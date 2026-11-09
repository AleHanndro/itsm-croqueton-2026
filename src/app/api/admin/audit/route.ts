import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import {
  ApiError,
  actorFromUser,
  apiErrorResponse,
  getClientIp,
  requireAdmin,
  requireSuperadmin
} from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'

interface AuditRow {
  action: string
  admin_name: string
  admin_username: string
  affected_user_name: string | null
  created_at: Date
  description: string
  id: string
  ip: string | null
  metadata: Record<string, unknown> | null
}

function serializeAudit(row: AuditRow) {
  return {
    action: row.action,
    adminName: row.admin_name,
    adminUsername: row.admin_username,
    affectedUserName: row.affected_user_name,
    createdAt: new Date(row.created_at).toISOString(),
    description: row.description,
    id: row.id,
    ip: row.ip,
    metadata: row.metadata ?? {}
  }
}

export async function GET(request: Request) {
  try {
    await requireSuperadmin()

    const url = new URL(request.url)
    const search = (url.searchParams.get('search') ?? '').trim()
    const action = (url.searchParams.get('action') ?? '').trim()
    const from = (url.searchParams.get('from') ?? '').trim()
    const to = (url.searchParams.get('to') ?? '').trim()
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)
    const pageSize = Math.min(50, Math.max(5, Number(url.searchParams.get('pageSize') ?? 15) || 15))
    const offset = (page - 1) * pageSize

    const values: unknown[] = []
    const conditions: string[] = ['true']

    if (search) {
      values.push(`%${search}%`)
      conditions.push(
        `(admin_name ILIKE $${values.length} OR admin_username ILIKE $${values.length} OR description ILIKE $${values.length} OR affected_user_name ILIKE $${values.length})`
      )
    }

    if (action) {
      values.push(action)
      conditions.push(`action = $${values.length}`)
    }

    if (from && !Number.isNaN(Date.parse(from))) {
      values.push(new Date(from).toISOString())
      conditions.push(`created_at >= $${values.length}::timestamptz`)
    }

    if (to && !Number.isNaN(Date.parse(to))) {
      values.push(new Date(to).toISOString())
      conditions.push(`created_at <= $${values.length}::timestamptz`)
    }

    values.push(pageSize, offset)
    const result = await query<AuditRow & { total_count: number }>(
      `SELECT id, admin_name, admin_username, action, description, affected_user_name,
              ip, metadata, created_at, count(*) OVER()::int AS total_count
       FROM admin_audit_log
       WHERE ${conditions.join(' AND ')}
       ORDER BY created_at DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    )

    return NextResponse.json({
      events: result.rows.map(serializeAudit),
      page,
      pageSize,
      total: result.rows[0]?.total_count ?? 0
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const action = String((body as { action?: unknown }).action ?? '').trim()
    const description = String((body as { description?: unknown }).description ?? '').trim()

    if (!/^(donor|request)\./.test(action)) throw new ApiError(400, 'invalid_action')
    if (!description) throw new ApiError(400, 'description_required')

    const metadata =
      (body as { metadata?: unknown }).metadata &&
      typeof (body as { metadata?: unknown }).metadata === 'object'
        ? ((body as { metadata: Record<string, unknown> }).metadata ?? {})
        : {}

    await writeAudit(actorFromUser(admin), {
      action,
      description,
      ip: getClientIp(request),
      metadata
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
