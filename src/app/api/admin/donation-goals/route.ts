import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { ApiError, apiErrorResponse, requireAdmin } from '@/lib/server/auth'

export async function GET() {
  try {
    await requireAdmin()
    const result = await query<{ campaign_year: number | null; goal_kg: string; id: string; is_public: boolean; name: string }>(
      `SELECT id, name, goal_kg::text AS goal_kg, is_public, campaign_year
       FROM donation_goals
       ORDER BY created_at`
    )
    return NextResponse.json({ goals: result.rows })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const input = body as Record<string, unknown>
    const id = String(input.id ?? '').trim()
    if (!id) throw new ApiError(400, 'goal_id_required')

    const fields: string[] = []
    const values: unknown[] = []
    let index = 1

    if (input.goalKg !== undefined) {
      const goalKg = Number(input.goalKg)
      if (Number.isNaN(goalKg) || goalKg <= 0) throw new ApiError(400, 'invalid_goal')
      fields.push(`goal_kg = $${index++}`)
      values.push(goalKg)
    }
    if (input.isPublic !== undefined) {
      fields.push(`is_public = $${index++}`)
      values.push(input.isPublic === true)
    }
    if (input.name !== undefined) {
      fields.push(`name = $${index++}`)
      values.push(String(input.name).trim())
    }

    if (!fields.length) throw new ApiError(400, 'no_changes')

    values.push(id)
    await query(
      `UPDATE donation_goals SET ${fields.join(', ')}, updated_at = now() WHERE id = $${index}`,
      values
    )
    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
