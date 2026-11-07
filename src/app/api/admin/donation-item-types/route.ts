import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { apiErrorResponse, requireAdmin } from '@/lib/server/auth'

export async function GET() {
  try {
    await requireAdmin()
    const result = await query<{ id: string; name_en: string; name_es: string; slug: string }>(
      `SELECT id, slug, name_es, name_en FROM donation_item_types ORDER BY name_es`
    )
    return NextResponse.json({ types: result.rows })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
