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

function toKg(amount: number, unit: 'g' | 'kg') {
  return unit === 'g' ? amount / 1000 : amount
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await context.params
    const result = await query<{ donor_id: string }>('SELECT donor_id FROM donations WHERE id = $1', [id])
    if (!result.rowCount) throw new ApiError(404, 'donation_not_found')
    return NextResponse.json({ ok: true })
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

    await withTransaction(async (client) => {
      const current = await client.query<{ donor_id: string; id: string }>(
        `SELECT id, donor_id FROM donations WHERE id = $1 FOR UPDATE`,
        [id]
      )
      if (!current.rowCount) throw new ApiError(404, 'donation_not_found')
      const donorId = current.rows[0].donor_id

      if (input.donor && typeof input.donor === 'object') {
        const donorInput = input.donor as Record<string, unknown>
        const firstName = String(donorInput.firstName ?? '').trim()
        const lastName = String(donorInput.lastName ?? '').trim()
        const isItsMotul = donorInput.isItsMotul === true
        const memberType = isItsMotul ? String(donorInput.memberType ?? '').trim() || null : null
        const career = isItsMotul && memberType === 'student' ? String(donorInput.career ?? '').trim() || null : null
        const email = typeof donorInput.email === 'string' ? donorInput.email.trim() : null
        const phone = typeof donorInput.phone === 'string' ? donorInput.phone.trim() : null

        if (!firstName || !lastName) throw new ApiError(400, 'name_required')
        await client.query(
          `UPDATE donors
           SET first_name = $1, last_name = $2, is_its_motul = $3, member_type = $4,
               career = $5, email = $6, phone = $7, updated_at = now()
           WHERE id = $8`,
          [firstName, lastName, isItsMotul, memberType, career, email, phone, donorId]
        )
      }

      const fields: string[] = []
      const values: unknown[] = []
      let index = 1

      if (input.year !== undefined) {
        const year = Number(input.year)
        if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new ApiError(400, 'invalid_year')
        const yearResult = await client.query<{ id: string }>(
          `INSERT INTO donation_years (year) VALUES ($1)
           ON CONFLICT (year) DO UPDATE SET year = EXCLUDED.year
           RETURNING id`,
          [year]
        )
        fields.push(`donation_year_id = $${index++}`)
        values.push(yearResult.rows[0].id)
      }

      if (input.croquetteAmount !== undefined) {
        const amount = Number(input.croquetteAmount)
        if (Number.isNaN(amount) || amount < 0) throw new ApiError(400, 'invalid_amount')
        const unit = input.croquetteUnit === 'g' ? 'g' : 'kg'
        fields.push(`croquette_amount = $${index++}`)
        values.push(amount)
        fields.push(`croquette_unit = $${index++}`)
        values.push(unit)
        fields.push(`croquette_kg = $${index++}`)
        values.push(toKg(amount, unit))
      }

      if (fields.length) {
        values.push(id)
        await client.query(
          `UPDATE donations SET ${fields.join(', ')}, updated_at = now() WHERE id = $${index}`,
          values
        )
      }

      if (Array.isArray(input.items)) {
        await client.query('DELETE FROM donation_items WHERE donation_id = $1', [id])
        for (const item of input.items) {
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
            [id, itemTypeId, customName, quantity, unit]
          )
        }
      }

      await writeAudit(actorFromUser(admin), {
        action: 'donation.update',
        affectedUserName: 'donation',
        description: `${admin.name} actualizó una donación.`,
        ip: getClientIp(request),
        metadata: { donationId: id }
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
      const current = await client.query<{ id: string }>('SELECT id FROM donations WHERE id = $1', [id])
      if (!current.rowCount) throw new ApiError(404, 'donation_not_found')

      await client.query('DELETE FROM donations WHERE id = $1', [id])

      await writeAudit(actorFromUser(admin), {
        action: 'donation.delete',
        description: `${admin.name} eliminó una donación.`,
        ip: getClientIp(request),
        metadata: { donationId: id }
      }, client)
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
