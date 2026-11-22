import { after, NextResponse } from 'next/server'

import { withTransaction } from '@/lib/db'
import { ApiError, apiErrorResponse, isEmail, normalizeEmail } from '@/lib/server/auth'
import {
  hasCapacity,
  lockJoinCapacity,
  sendJoinEmail,
  type JoinStatus
} from '@/lib/server/join-requests'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const input = body as Record<string, unknown>
    const name = String(input.name ?? '')
      .trim()
      .slice(0, 40)
    const age = Number(input.age)
    const email = normalizeEmail(input.email)
    const phone = String(input.phone ?? '').trim()
    const motivation = String(input.motivation ?? '')
      .trim()
      .slice(0, 400)
    const hasAvailability = input.hasAvailability === true
    const acceptsCommitment = input.acceptsCommitment === true

    if (
      !name ||
      !Number.isInteger(age) ||
      age < 18 ||
      age > 99 ||
      !isEmail(email) ||
      !/^[0-9+\-\s]{7,20}$/.test(phone) ||
      motivation.length < 20 ||
      !hasAvailability ||
      !acceptsCommitment
    ) {
      throw new ApiError(400, 'requirements_not_met')
    }

    const created = await withTransaction(async (client) => {
      await lockJoinCapacity(client)

      const existing = await client.query<{ status: JoinStatus }>(
        `SELECT status FROM join_requests
         WHERE email = $1 AND status IN ('accepted', 'waitlisted')
         LIMIT 1`,
        [email]
      )
      if (existing.rowCount) {
        throw new ApiError(409, 'already_registered', undefined, {
          status: existing.rows[0].status
        })
      }

      const status: JoinStatus = (await hasCapacity(client)) ? 'accepted' : 'waitlisted'
      const result = await client.query<{ id: string }>(
        `INSERT INTO join_requests
          (name, age, email, phone, motivation, has_availability, accepts_commitment, status, decided_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
         RETURNING id`,
        [name, age, email, phone, motivation, hasAvailability, acceptsCommitment, status]
      )
      return { id: result.rows[0].id, status }
    })

    after(() =>
      sendJoinEmail(
        { email, id: created.id, name },
        created.status === 'accepted' ? 'join_accepted' : 'join_waitlisted'
      )
    )

    return NextResponse.json({ status: created.status }, { status: 201 })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
