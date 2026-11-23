import { NextResponse } from 'next/server'

import { query } from '@/lib/db'

export async function GET() {
  const result = await query<{ first_name: string; last_name: string; year: number | null }>(
    `SELECT DISTINCT d.first_name, d.last_name, dy.year
     FROM donations dn
     JOIN donors d ON d.id = dn.donor_id
     LEFT JOIN donation_years dy ON dy.id = dn.donation_year_id
     ORDER BY dy.year DESC NULLS LAST, d.last_name, d.first_name`
  )

  return NextResponse.json({
    donors: result.rows.map((row) => ({
      firstName: row.first_name,
      lastName: row.last_name,
      year: row.year
    }))
  })
}
