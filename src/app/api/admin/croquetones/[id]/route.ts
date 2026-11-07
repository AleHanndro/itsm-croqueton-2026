import { NextResponse } from 'next/server'

import { query, withTransaction } from '@/lib/db'
import {
  ApiError,
  actorFromUser,
  apiErrorResponse,
  getClientIp,
  requireAdmin
} from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'

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

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await context.params

    const result = await query<CroquetonRow>(
      `SELECT id, generation_number, title, year, group_photo, description, created_at, updated_at
       FROM croquetones WHERE id = $1`,
      [id]
    )
    const croqueton = result.rows[0]
    if (!croqueton) throw new ApiError(404, 'croqueton_not_found')

    const members = await query<MemberRow>(
      `SELECT id, full_name, display_order FROM croqueton_members WHERE croqueton_id = $1 ORDER BY display_order`,
      [id]
    )

    return NextResponse.json({
      croqueton: {
        createdAt: new Date(croqueton.created_at).toISOString(),
        description: croqueton.description,
        generationNumber: croqueton.generation_number,
        groupPhoto: croqueton.group_photo,
        id: croqueton.id,
        members: members.rows.map((row) => ({ id: row.id, name: row.full_name, order: row.display_order })),
        title: croqueton.title,
        updatedAt: new Date(croqueton.updated_at).toISOString(),
        year: croqueton.year
      }
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await context.params
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const input = body as Record<string, unknown>
    const title = input.title !== undefined ? String(input.title).trim() : undefined
    const year = input.year !== undefined ? String(input.year).trim() : undefined
    const description = input.description !== undefined
      ? (typeof input.description === 'string' ? input.description.trim() : null)
      : undefined
    const groupPhoto = input.groupPhoto !== undefined
      ? (typeof input.groupPhoto === 'string' ? input.groupPhoto : null)
      : undefined
    const members = Array.isArray(input.members)
      ? input.members.map((value) => String(value).trim()).filter(Boolean)
      : undefined
    const generationNumber = input.generationNumber !== undefined ? Number(input.generationNumber) : undefined

    await withTransaction(async (client) => {
      const current = await client.query<CroquetonRow>(
        `SELECT id, generation_number, title FROM croquetones WHERE id = $1`,
        [id]
      )
      if (!current.rowCount) throw new ApiError(404, 'croqueton_not_found')

      const fields: string[] = []
      const values: unknown[] = []
      let index = 1

      if (generationNumber !== undefined) {
        if (!Number.isInteger(generationNumber) || generationNumber <= 0) throw new ApiError(400, 'invalid_generation_number')
        fields.push(`generation_number = $${index++}`)
        values.push(generationNumber)
      }
      if (title !== undefined) {
        if (!title) throw new ApiError(400, 'title_required')
        fields.push(`title = $${index++}`)
        values.push(title)
      }
      if (year !== undefined) {
        if (!year) throw new ApiError(400, 'year_required')
        fields.push(`year = $${index++}`)
        values.push(year)
      }
      if (description !== undefined) {
        fields.push(`description = $${index++}`)
        values.push(description)
      }
      if (groupPhoto !== undefined) {
        fields.push(`group_photo = $${index++}`)
        values.push(groupPhoto)
      }

      if (fields.length) {
        values.push(id)
        await client.query(
          `UPDATE croquetones SET ${fields.join(', ')}, updated_at = now() WHERE id = $${index}`,
          values
        )
      }

      if (members !== undefined) {
        await client.query('DELETE FROM croqueton_members WHERE croqueton_id = $1', [id])
        for (let order = 0; order < members.length; order += 1) {
          await client.query(
            `INSERT INTO croqueton_members (croqueton_id, full_name, display_order)
             VALUES ($1, $2, $3)
             ON CONFLICT (croqueton_id, full_name) DO NOTHING`,
            [id, members[order], order]
          )
        }
      }

      await writeAudit(actorFromUser(admin), {
        action: 'croqueton.update',
        affectedUserName: title ?? current.rows[0].title,
        description: `${admin.name} actualizó la generación ${current.rows[0].generation_number} de Croquetones.`,
        ip: getClientIp(request),
        metadata: { generationNumber: generationNumber ?? current.rows[0].generation_number, memberCount: members?.length }
      }, client)
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await context.params

    await withTransaction(async (client) => {
      const current = await client.query<{ generation_number: number; title: string }>(
        `SELECT generation_number, title FROM croquetones WHERE id = $1`,
        [id]
      )
      if (!current.rowCount) throw new ApiError(404, 'croqueton_not_found')

      await client.query('DELETE FROM croquetones WHERE id = $1', [id])

      await writeAudit(actorFromUser(admin), {
        action: 'croqueton.delete',
        affectedUserName: current.rows[0].title,
        description: `${admin.name} eliminó la generación ${current.rows[0].generation_number} de Croquetones.`,
        ip: getClientIp(request),
        metadata: { generationNumber: current.rows[0].generation_number }
      }, client)
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
