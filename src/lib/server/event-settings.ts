import { query } from '@/lib/db'
import { eventInfo, type EventInfo } from '@/lib/server/config'

export interface EventSettingsRow {
  details: string
  event_date: string
  event_time: string
  location: string
  updated_at: Date
  updated_by_email: string | null
}

export const EVENT_FIELD_LIMITS = { date: 120, details: 600, location: 200, time: 120 } as const

/** Lo que está guardado en la base, sin mezclar con las variables de entorno. */
export async function getEventSettings() {
  const result = await query<EventSettingsRow>(
    `SELECT es.event_date, es.event_time, es.location, es.details, es.updated_at,
            u.email AS updated_by_email
     FROM event_settings es
     LEFT JOIN users u ON u.id = es.updated_by
     WHERE es.id = 1`
  )
  return result.rows[0] ?? null
}

/**
 * Datos del evento para los correos: lo que el admin guardó en el panel y, para los
 * campos vacíos, las variables EVENT_* (y al final "Por confirmar").
 */
export async function loadEventInfo(): Promise<EventInfo> {
  const fallback = eventInfo()
  try {
    const row = await getEventSettings()
    if (!row) return fallback
    return {
      date: row.event_date.trim() || fallback.date,
      details: row.details.trim() || fallback.details,
      location: row.location.trim() || fallback.location,
      name: fallback.name,
      time: row.event_time.trim() || fallback.time
    }
  } catch (error) {
    console.error('[event-settings] no se pudieron leer los datos del evento', error)
    return fallback
  }
}
