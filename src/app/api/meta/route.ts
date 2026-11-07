import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { apiErrorResponse } from '@/lib/server/auth'

export async function GET() {
  try {
    const goalResult = await query<{ goal_kg: string }>(
      `SELECT goal_kg::text AS goal_kg
       FROM donation_goals
       WHERE is_public = true
       ORDER BY created_at
       LIMIT 1`
    )
    const goalKg = Number(goalResult.rows[0]?.goal_kg ?? 1000)

    const totalResult = await query<{ total: string }>(
      `SELECT COALESCE(SUM(croquette_kg), 0)::text AS total FROM donations`
    )
    const collectedKg = Number(totalResult.rows[0]?.total ?? 0)

    return NextResponse.json({
      collectedKg,
      goalKg,
      progress: goalKg > 0 ? Math.min(100, (collectedKg / goalKg) * 100) : 0,
      remainingKg: Math.max(0, goalKg - collectedKg)
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
