import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { apiErrorResponse } from '@/lib/server/auth'

interface MemberRow {
  croqueton_id: string
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
  year: string
}

export async function GET() {
  try {
    const croquetones = await query<CroquetonRow>(
      `SELECT id, generation_number, title, year, group_photo, description, created_at
       FROM croquetones
       ORDER BY generation_number`
    )

    const members = await query<MemberRow>(
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
        description: row.description,
        generationNumber: row.generation_number,
        groupPhoto: row.group_photo,
        id: row.id,
        members: (membersByCroqueton.get(row.id) ?? []).map((member) => ({
          id: member.id,
          name: member.full_name,
          order: member.display_order
        })),
        title: row.title,
        year: row.year
      }))
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
