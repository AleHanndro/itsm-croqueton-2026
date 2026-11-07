import { NextResponse } from 'next/server'

import { apiErrorResponse, getSessionUser } from '@/lib/server/auth'
import { loadCommunityData } from '@/lib/server/community-data'

export async function GET() {
  try {
    const user = await getSessionUser()
    return NextResponse.json(await loadCommunityData(user))
  } catch (error) {
    return apiErrorResponse(error)
  }
}
