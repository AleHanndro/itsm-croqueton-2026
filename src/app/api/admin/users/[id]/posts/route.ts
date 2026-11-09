import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { ApiError, apiErrorResponse, requirePermission } from '@/lib/server/auth'
import { loadPostsByAuthor } from '@/lib/server/community-data'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('users.view')
    const { id } = await context.params
    const user = await query('SELECT 1 FROM users WHERE id = $1', [id])
    if (!user.rowCount) throw new ApiError(404, 'user_not_found')

    return NextResponse.json({ posts: await loadPostsByAuthor(id) })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
