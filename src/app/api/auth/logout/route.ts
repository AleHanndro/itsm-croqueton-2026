import { NextResponse } from 'next/server'

import {
  actorFromUser,
  apiErrorResponse,
  destroySession,
  getClientIp,
  getSessionUser
} from '@/lib/server/auth'
import { writeAudit } from '@/lib/server/audit'

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()

    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      await writeAudit(actorFromUser(user), {
        action: 'auth.logout',
        description: `${user.name} cerró sesión en el panel administrativo.`,
        ip: getClientIp(request)
      })
    }

    await destroySession()
    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
