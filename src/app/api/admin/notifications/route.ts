import { NextResponse } from 'next/server'

import { apiErrorResponse, requireAdmin } from '@/lib/server/auth'
import { listNotifications } from '@/lib/server/notifications'

export async function GET() {
  try {
    const admin = await requireAdmin()
    return NextResponse.json({ notifications: await listNotifications(admin.id) })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
