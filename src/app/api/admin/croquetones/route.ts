import { NextResponse } from 'next/server'

import { query, withTransaction } from '@/lib/db'
import { ApiError, apiErrorResponse, requireAdmin } from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'
import { actorFromUser, getClientIp } from '@/lib/server/auth'

interface MemberRow {
  display_order: number
  full_name: string
  id: string
}

interface CroquetonRow {
  created_at: Date
  description: string | null
  generation_number: number
  group_photo: string | null
  id: string
  title: string
  updated_at: Date
  year: string
}

function serializeMembers(rows: MemberRow[]) {
  return rows
    .sort((a, b) => a.display_order - b.display_order)
    .map((row) => ({ id: row.id, name: row.full_name, order: row.display_order }))
}

export async function GET() {
  try {
    await requireAdmin()

    const croquetones = await query<CroquetonRow>(
      `SELECT id, generation_number, title, year, group_photo, description, created_at, updated_at
       FROM croquetones
       ORDER BY generation_number`
    )

    const members = await query<MemberRow & { croqueton_id: string }>(
      `SELECT id, croqueton_id, full_name, display_order
       FROM croqueton_members
       ORDER BY croqueton_id, display_order`
    )

    const membersByCroqueton = new Map<string, MemberRow[]>()
    for (const row of members.rows) {
      const list = membersByCroqueton.get(row.croqueton_id) ?? []
      list.push(row)
      membersByCroqueton.set(row.croqueton_id, list)
    }

    return NextResponse.json({
      croquetones: croquetones.rows.map((row) => ({
        createdAt: new Date(row.created_at).toISOString(),
        description: row.description,
        generationNumber: row.generation_number,
        groupPhoto: row.group_photo,
        id: row.id,
        members: serializeMembers(membersByCroqueton.get(row.id) ?? []),
        title: row.title,
        updatedAt: new Date(row.updated_at).toISOString(),
        year: row.year
      }))
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

    const input = body as Record<string, unknown>
    const generationNumber = Number(input.generationNumber)
    const title = String(input.title ?? '').trim()
    const year = String(input.year ?? '').trim()
    const description = typeof input.description === 'string' ? input.description.trim() : null
    const groupPhoto = typeof input.groupPhoto === 'string' ? input.groupPhoto : null
    const members = Array.isArray(input.members)
      ? input.members.map((value) => String(value).trim()).filter(Boolean)
      : []

    if (!Number.isInteger(generationNumber) || generationNumber <= 0) {
      throw new ApiError(400, 'invalid_generation_number')
    }
    if (!title) throw new ApiError(400, 'title_required')
    if (!year) throw new ApiError(400, 'year_required')

    const created = await withTransaction(async (client) => {
      const result = await client.query<CroquetonRow>(
        `INSERT INTO croquetones (generation_number, title, year, group_photo, description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, generation_number, title, year, group_photo, description, created_at, updated_at`,
        [generationNumber, title, year, groupPhoto, description]
      )
      const croqueton = result.rows[0]

      for (let index = 0; index < members.length; index += 1) {
        await client.query(
          `INSERT INTO croqueton_members (croqueton_id, full_name, display_order)
           VALUES ($1, $2, $3)
           ON CONFLICT (croqueton_id, full_name) DO NOTHING`,
          [croqueton.id, members[index], index]
        )
      }

      await writeAudit(actorFromUser(admin), {
        action: 'croqueton.create',
        affectedUserName: title,
        description: `${admin.name} creó la generación ${generationNumber} de Croquetones.`,
        ip: getClientIp(request),
        metadata: { generationNumber, memberCount: members.length, title, year }
      }, client)

      return croqueton
    })

    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
