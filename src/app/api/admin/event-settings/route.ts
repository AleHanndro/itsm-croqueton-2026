import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { writeAudit } from '@/lib/server/audit'
import {
  ApiError,
  actorFromUser,
  apiErrorResponse,
  getClientIp,
  requireAdmin
} from '@/lib/server/auth'
import { eventInfo } from '@/lib/server/config'
import { EVENT_FIELD_LIMITS, getEventSettings } from '@/lib/server/event-settings'

async function respond() {
  const row = await getEventSettings()
  const fallback = eventInfo()
  return NextResponse.json({
    // Lo que se muestra en el correo si un campo se deja vacío.
    fallback: {
      date: fallback.date,
      details: fallback.details,
      location: fallback.location,
      time: fallback.time
    },
    settings: {
      date: row?.event_date ?? '',
      details: row?.details ?? '',
      location: row?.location ?? '',
      time: row?.event_time ?? ''
    },
    updatedAt: row ? new Date(row.updated_at).toISOString() : null,
    updatedBy: row?.updated_by_email ?? null
  })
}

export async function GET() {
  try {
    await requireAdmin()
    return await respond()
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin()
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
    if (!body || typeof body !== 'object') throw new ApiError(400, 'invalid_json')

    const field = (key: keyof typeof EVENT_FIELD_LIMITS) => {
      const value = typeof body[key] === 'string' ? (body[key] as string).trim() : ''
      if (value.length > EVENT_FIELD_LIMITS[key]) {
        throw new ApiError(400, 'field_too_long', undefined, { field: key })
      }
      return value
    }

    const date = field('date')
    const time = field('time')
    const location = field('location')
    const details = field('details')

    await query(
      `INSERT INTO event_settings (id, event_date, event_time, location, details, updated_by)
       VALUES (1, $1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE
         SET event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time,
             location = EXCLUDED.location, details = EXCLUDED.details,
             updated_by = EXCLUDED.updated_by`,
      [date, time, location, details, admin.id]
    )

    await writeAudit(actorFromUser(admin), {
      action: 'event_settings.update',
      description: `${admin.name} actualizó los datos del evento (fecha, hora y lugar).`,
      ip: getClientIp(request),
      metadata: { date, details, location, time }
    })

    return await respond()
  } catch (error) {
    return apiErrorResponse(error)
  }
}
