import { NextResponse } from 'next/server'

import { query, withTransaction } from '@/lib/db'
import { ApiError, apiErrorResponse, requireAdmin } from '@/lib/server/auth'
import { actorFromUser, getClientIp } from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'

interface DonationRow {
  created_at: Date
  croquette_amount: string
  croquette_kg: string
  croquette_unit: 'g' | 'kg'
  donor_career: string | null
  donor_email: string | null
  donor_first_name: string
  donor_id: string
  donor_is_its_motul: boolean
  donor_last_name: string
  donor_member_type: string | null
  donor_phone: string | null
  id: string
  year: number | null
}

function toKg(amount: number, unit: 'g' | 'kg') {
  return unit === 'g' ? amount / 1000 : amount
}

export async function GET(request: Request) {
  try {
    await requireAdmin()
    const url = new URL(request.url)
    const year = url.searchParams.get('year')
    const search = (url.searchParams.get('search') ?? '').trim()

    const values: unknown[] = []
    const conditions: string[] = ['true']

    if (year) {
      values.push(Number(year))
      conditions.push(`dy.year = $${values.length}`)
    }
    if (search) {
      values.push(`%${search}%`)
      conditions.push(
        `(d.first_name ILIKE $${values.length} OR d.last_name ILIKE $${values.length} OR d.email ILIKE $${values.length} OR d.phone ILIKE $${values.length})`
      )
    }

    const result = await query<DonationRow>(
      `SELECT dn.id, dn.croquette_amount, dn.croquette_unit, dn.croquette_kg, dn.created_at,
              d.id AS donor_id, d.first_name AS donor_first_name, d.last_name AS donor_last_name,
              d.is_its_motul AS donor_is_its_motul, d.member_type AS donor_member_type,
              d.career AS donor_career, d.email AS donor_email, d.phone AS donor_phone,
              dy.year
       FROM donations dn
       JOIN donors d ON d.id = dn.donor_id
       LEFT JOIN donation_years dy ON dy.id = dn.donation_year_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY dn.created_at DESC`,
      values
    )

    const donationIds = result.rows.map((row) => row.id)
    const itemsResult = donationIds.length
      ? await query<{
          custom_name: string | null
          donation_id: string
          id: string
          quantity: string
          type_name_en: string | null
          type_name_es: string | null
          type_slug: string | null
          unit: string | null
        }>(
          `SELECT di.id, di.donation_id, di.custom_name, di.quantity, di.unit,
                  dit.slug AS type_slug, dit.name_es AS type_name_es, dit.name_en AS type_name_en
           FROM donation_items di
           LEFT JOIN donation_item_types dit ON dit.id = di.item_type_id
           WHERE di.donation_id = ANY($1::uuid[])`,
          [donationIds]
        )
      : { rows: [] as { custom_name: string | null; donation_id: string; id: string; quantity: string; type_name_en: string | null; type_name_es: string | null; type_slug: string | null; unit: string | null }[] }

    const itemsByDonation = new Map<string, { custom_name: string | null; donation_id: string; id: string; quantity: string; type_name_en: string | null; type_name_es: string | null; type_slug: string | null; unit: string | null }[]>()
    for (const item of itemsResult.rows) {
      const list = itemsByDonation.get(item.donation_id) ?? []
      list.push(item)
      itemsByDonation.set(item.donation_id, list)
    }

    return NextResponse.json({
      donations: result.rows.map((row) => ({
        createdAt: new Date(row.created_at).toISOString(),
        croquetteAmount: Number(row.croquette_amount),
        croquetteKg: Number(row.croquette_kg),
        croquetteUnit: row.croquette_unit,
        donor: {
          career: row.donor_career,
          email: row.donor_email,
          firstName: row.donor_first_name,
          id: row.donor_id,
          isItsMotul: row.donor_is_its_motul,
          lastName: row.donor_last_name,
          memberType: row.donor_member_type,
          phone: row.donor_phone
        },
        id: row.id,
        items: (itemsByDonation.get(row.id) ?? []).map((item) => ({
          customName: item.custom_name,
          id: item.id,
          quantity: Number(item.quantity),
          type: item.type_slug,
          typeName: item.type_name_es,
          unit: item.unit
        })),
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
    const donorInput = (input.donor ?? {}) as Record<string, unknown>
    const firstName = String(donorInput.firstName ?? '').trim()
    const lastName = String(donorInput.lastName ?? '').trim()
    const isItsMotul = donorInput.isItsMotul === true
    const memberType = isItsMotul ? String(donorInput.memberType ?? '').trim() : null
    const career = isItsMotul && memberType === 'student' ? String(donorInput.career ?? '').trim() : null
    const email = typeof donorInput.email === 'string' ? donorInput.email.trim() : null
    const phone = typeof donorInput.phone === 'string' ? donorInput.phone.trim() : null

    if (!firstName || !lastName) throw new ApiError(400, 'name_required')
    if (isItsMotul && !['student', 'directive', 'general'].includes(memberType ?? '')) {
      throw new ApiError(400, 'invalid_member_type')
    }
    if (career && !['ISC', 'II', 'IE', 'IER', 'IEM'].includes(career)) {
      throw new ApiError(400, 'invalid_career')
    }

    const year = Number(input.year)
    if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new ApiError(400, 'invalid_year')

    const croquetteAmount = Number(input.croquetteAmount ?? 0)
    if (Number.isNaN(croquetteAmount) || croquetteAmount < 0) throw new ApiError(400, 'invalid_amount')
    const croquetteUnit = input.croquetteUnit === 'g' ? 'g' : 'kg'

    const items = Array.isArray(input.items) ? input.items : []

    const created = await withTransaction(async (client) => {
      const yearResult = await client.query<{ id: string }>(
        `INSERT INTO donation_years (year) VALUES ($1)
         ON CONFLICT (year) DO UPDATE SET year = EXCLUDED.year
         RETURNING id`,
        [year]
      )
      const donationYearId = yearResult.rows[0].id

      const donorResult = await client.query<{ id: string }>(
        `INSERT INTO donors (first_name, last_name, is_its_motul, member_type, career, email, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [firstName, lastName, isItsMotul, memberType, career, email, phone]
      )
      const donorId = donorResult.rows[0].id

      const donationResult = await client.query<{ id: string }>(
        `INSERT INTO donations (donor_id, donation_year_id, croquette_amount, croquette_unit, croquette_kg)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [donorId, donationYearId, croquetteAmount, croquetteUnit, toKg(croquetteAmount, croquetteUnit)]
      )
      const donationId = donationResult.rows[0].id

      for (const item of items) {
        if (!item || typeof item !== 'object') continue
        const itemInput = item as Record<string, unknown>
        const quantity = Number(itemInput.quantity ?? 0)
        if (Number.isNaN(quantity) || quantity <= 0) continue
        const unit = typeof itemInput.unit === 'string' ? itemInput.unit.trim() : null
        const customName = typeof itemInput.customName === 'string' ? itemInput.customName.trim() : null
        const typeSlug = typeof itemInput.type === 'string' ? itemInput.type.trim() : 'other'

        const typeResult = await client.query<{ id: string }>(
          `SELECT id FROM donation_item_types WHERE slug = $1`,
          [typeSlug || 'other']
        )
        const itemTypeId = typeResult.rows[0]?.id ?? null

        await client.query(
          `INSERT INTO donation_items (donation_id, item_type_id, custom_name, quantity, unit)
           VALUES ($1, $2, $3, $4, $5)`,
          [donationId, itemTypeId, customName, quantity, unit]
        )
      }

      await writeAudit(actorFromUser(admin), {
        action: 'donation.create',
        affectedUserName: `${firstName} ${lastName}`,
        description: `${admin.name} registró una donación de ${firstName} ${lastName}.`,
        ip: getClientIp(request),
        metadata: { croquetteAmount, croquetteUnit, itemCount: items.length, year }
      }, client)

      return donationId
    })

    return NextResponse.json({ id: created }, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
