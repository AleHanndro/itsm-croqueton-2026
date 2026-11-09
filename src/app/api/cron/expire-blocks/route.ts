import { NextResponse } from 'next/server'

import { apiErrorResponse } from '@/lib/server/auth'
import { expireOverdueBlocks } from '@/lib/server/blocks'

export async function GET(request: Request) {
  try {
    const secret = process.env.CRON_SECRET
    const authorization = request.headers.get('authorization')
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null
    const queryToken = new URL(request.url).searchParams.get('secret')

    if (!secret || (token !== secret && queryToken !== secret)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const result = await expireOverdueBlocks()
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
