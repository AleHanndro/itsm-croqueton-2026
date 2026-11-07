import { createHash, randomBytes } from 'node:crypto'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { query } from '@/lib/db'
import { serializeSessionUser } from '@/lib/server/serializers'
import type { AdminPermission, DbUser, SessionUser } from '@/lib/server/types'

export const SESSION_COOKIE = 'croqueton_session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

export class ApiError extends Error {
  code: string
  meta?: Record<string, unknown>
  status: number

  constructor(status: number, code: string, message?: string, meta?: Record<string, unknown>) {
    super(message ?? code)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.meta = meta
  }
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.code, message: error.message, ...(error.meta ?? {}) },
      { status: error.status }
    )
  }

  console.error(error)
  return NextResponse.json({ error: 'internal_error' }, { status: 500 })
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const result = await query<DbUser>(
    `SELECT u.*
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1
       AND s.expires_at > now()
       AND u.is_active = true`,
    [hashToken(token)]
  )

  if (!result.rowCount) {
    cookieStore.delete(SESSION_COOKIE)
    return null
  }

  return serializeSessionUser(result.rows[0])
}

export async function requireUser() {
  const user = await getSessionUser()
  if (!user) throw new ApiError(401, 'no_session')
  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    throw new ApiError(403, 'admin_required')
  }
  return user
}

export async function requireSuperadmin() {
  const user = await requireUser()
  if (user.role !== 'superadmin') {
    throw new ApiError(403, 'superadmin_required')
  }
  return user
}

export function hasPermission(user: SessionUser, permission: AdminPermission) {
  return user.role === 'superadmin' || user.permissions[permission] === true
}

export async function requirePermission(permission: AdminPermission) {
  const user = await requireAdmin()
  if (!hasPermission(user, permission)) {
    throw new ApiError(403, 'permission_denied', undefined, { permission })
  }
  return user
}

export function canManageUsers(user: SessionUser) {
  return user.role === 'superadmin' || hasPermission(user, 'users.view')
}

export async function createSession(userId: string, request?: Request, remember = false) {
  const durationMs = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + durationMs)
  const ip = request ? getClientIp(request) : null
  const userAgent = request?.headers.get('user-agent') ?? null

  await query('DELETE FROM sessions WHERE expires_at <= now()')
  await query(
    `INSERT INTO sessions (user_id, token_hash, expires_at, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, hashToken(token), expiresAt, ip, userAgent]
  )

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    expires: expiresAt,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    await query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)])
  }

  cookieStore.delete(SESSION_COOKIE)
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || null

  return request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || null
}

export function actorFromUser(user: SessionUser) {
  return { id: user.id, name: user.name, username: user.username }
}

export function normalizeEmail(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

export function normalizeUsername(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
}

export function isUsername(value: string) {
  return /^[a-z0-9._]{3,24}$/.test(value)
}

export function usernameFromEmail(email: string) {
  const base = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '')
    .slice(0, 24)

  return base.length >= 3 ? base : `user${base || 'croqueton'}`.slice(0, 24)
}

export function hasUppercase(value: string) {
  return /[A-Z]/.test(value)
}

export function hasLowercase(value: string) {
  return /[a-z]/.test(value)
}

export function hasNumberOrSymbol(value: string) {
  return /[^A-Za-z]/.test(value)
}

export function isStrongPassword(value: string) {
  return (
    value.length >= 8 && hasUppercase(value) && hasLowercase(value) && hasNumberOrSymbol(value)
  )
}

export const MIN_PASSWORD_LENGTH = 8
