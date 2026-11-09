import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { ApiError, apiErrorResponse, requireAdmin } from '@/lib/server/auth'

export async function GET() {
  try {
    await requireAdmin()
    const result = await query<{ id: string; year: number }>(
      `SELECT id, year FROM donation_years ORDER BY year`
    )
    return NextResponse.json({ years: result.rows })
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json().catch(() => null)
    const year = Number((body as { year?: unknown })?.year)
    if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new ApiError(400, 'invalid_year')

    const result = await query<{ id: string; year: number }>(
      `INSERT INTO donation_years (year) VALUES ($1)
       ON CONFLICT (year) DO UPDATE SET year = EXCLUDED.year
       RETURNING id, year`,
      [year]
    )
    return NextResponse.json({ year: result.rows[0] }, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
