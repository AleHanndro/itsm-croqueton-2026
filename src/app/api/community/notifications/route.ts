import { NextResponse } from 'next/server'

import { apiErrorResponse, requireUser } from '@/lib/server/auth'
import { listNotifications } from '@/lib/server/notifications'

export async function GET() {
  try {
    const user = await requireUser()
    return NextResponse.json({ notifications: await listNotifications(user.id) })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
