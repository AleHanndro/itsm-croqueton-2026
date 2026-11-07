import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { apiErrorResponse, requirePermission } from '@/lib/server/auth'
import { expireOverdueBlocks } from '@/lib/server/blocks'
import { serializeBlock, serializeUser } from '@/lib/server/serializers'
import type { DbUser } from '@/lib/server/types'

interface AdminUserRow extends DbUser {
  block_created_at: Date | null
  block_ends_at: Date | null
  block_id: string | null
  block_notes: string | null
  block_reason: string | null
  block_record_status: 'active' | 'expired' | 'unlocked' | null
  block_starts_at: Date | null
  post_count: number
}

type StatusFilter = 'all' | 'active' | 'blocked' | 'blocked_expired' | 'inactive'

function effectiveStatus(row: AdminUserRow): Exclude<StatusFilter, 'all'> {
  if (!row.is_active) return 'inactive'
  if (row.block_record_status === 'active' && row.block_ends_at && row.block_ends_at > new Date()) {
    return 'blocked'
  }
  if (
    row.block_record_status === 'expired' ||
    (row.block_record_status === 'active' && row.block_ends_at && row.block_ends_at <= new Date())
  ) {
    return 'blocked_expired'
  }
  return 'active'
}

function statusClause(status: StatusFilter) {
  switch (status) {
    case 'active':
      return `u.is_active = true AND (lb.id IS NULL OR lb.status = 'unlocked')`
    case 'blocked':
      return `u.is_active = true AND lb.status = 'active' AND lb.ends_at > now()`
    case 'blocked_expired':
      return `u.is_active = true AND (lb.status = 'expired' OR (lb.status = 'active' AND lb.ends_at <= now()))`
    case 'inactive':
      return `u.is_active = false`
    default:
      return 'true'
  }
}

export async function GET(request: Request) {
  try {
    await requirePermission('users.view')
    await expireOverdueBlocks()

    const url = new URL(request.url)
    const search = (url.searchParams.get('search') ?? '').trim()
    const statusValue = (url.searchParams.get('status') ?? 'all') as StatusFilter
    const status: StatusFilter = ['all', 'active', 'blocked', 'blocked_expired', 'inactive'].includes(
      statusValue
    )
      ? statusValue
      : 'all'
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)
    const pageSize = Math.min(50, Math.max(5, Number(url.searchParams.get('pageSize') ?? 10) || 10))
    const offset = (page - 1) * pageSize
    const searchPattern = `%${search}%`

    const values: unknown[] = []
    const conditions: string[] = []

    if (search) {
      values.push(searchPattern)
      conditions.push(
        `(u.name ILIKE $${values.length} OR u.username ILIKE $${values.length} OR u.email ILIKE $${values.length})`
      )
    }

    conditions.push(statusClause(status))

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    values.push(pageSize, offset)
    const limitParam = `$${values.length - 1}`
    const offsetParam = `$${values.length}`

    const result = await query<AdminUserRow & { total_count: number }>(
      `WITH latest_block AS (
         SELECT DISTINCT ON (user_id)
           id, user_id, reason, notes, starts_at, ends_at, status, created_at
         FROM user_blocks
         ORDER BY user_id, created_at DESC
       ), post_counts AS (
         SELECT author_id, count(*)::int AS post_count
         FROM posts
         GROUP BY author_id
       )
       SELECT u.*,
              COALESCE(pc.post_count, 0)::int AS post_count,
              lb.id AS block_id,
              lb.reason AS block_reason,
              lb.notes AS block_notes,
              lb.starts_at AS block_starts_at,
              lb.ends_at AS block_ends_at,
              lb.status AS block_record_status,
              lb.created_at AS block_created_at,
              count(*) OVER()::int AS total_count
       FROM users u
       LEFT JOIN latest_block lb ON lb.user_id = u.id
       LEFT JOIN post_counts pc ON pc.author_id = u.id
       ${where}
       ORDER BY u.created_at DESC
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      values
    )

    const users = result.rows.map((row) => {
      const profile = serializeUser(row)
      return {
        ...profile,
        block:
          row.block_id && row.block_created_at && row.block_starts_at && row.block_ends_at && row.block_record_status
            ? serializeBlock({
                created_at: row.block_created_at,
                ends_at: row.block_ends_at,
                id: row.block_id,
                notes: row.block_notes ?? '',
                reason: row.block_reason ?? '',
                starts_at: row.block_starts_at,
                status: row.block_record_status
              })
            : null,
        postCount: row.post_count,
        status: effectiveStatus(row)
      }
    })

    return NextResponse.json({
      page,
      pageSize,
      total: result.rows[0]?.total_count ?? 0,
      users
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
