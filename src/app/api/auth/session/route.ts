import { NextResponse } from 'next/server'

import { apiErrorResponse, getSessionUser } from '@/lib/server/auth'

export async function GET() {
  try {
    return NextResponse.json({ user: await getSessionUser() })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
