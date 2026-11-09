import type {
  AccountBlock,
  AdminPermissions,
  AvatarConfig,
  DbUser,
  SerializedUser,
  SessionUser
} from '@/lib/server/types'

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  furColor: '#d98a4e',
  glassesColor: '#202436',
  hair: 'none',
  outfit: 'shirt',
  shirtColor: '#ef6547',
  shoesColor: '#fff8df',
  shortsColor: '#647fa1'
}

export const DEFAULT_ADMIN_PERMISSIONS: AdminPermissions = {
  'moderation.manage': true,
  'moderation.view': true,
  'users.block': false,
  'users.unlock': false,
  'users.view': true
}

export function normalizePermissions(value: unknown): AdminPermissions {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key.length > 0)
      .map(([key, enabled]) => [key, enabled === true])
  )
}

export function serializeUser(
  user: DbUser,
  options: { includeAdminFields?: boolean; includePermissions?: boolean } = {}
): SerializedUser {
  const permissions = normalizePermissions(user.permissions)
  const canSeeAdminFields =
    options.includeAdminFields || user.role === 'superadmin' || user.role === 'admin'

  return {
    accountStatus: user.account_status,
    avatarConfig: { ...DEFAULT_AVATAR_CONFIG, ...(user.avatar_config ?? {}) },
    avatarImage: user.avatar_image ?? undefined,
    createdAt: new Date(user.created_at).toISOString(),
    email: user.email,
    id: user.id,
    isActive: user.is_active,
    name: user.name,
    ...(options.includePermissions && canSeeAdminFields ? { permissions } : {}),
    petBio: user.pet_bio,
    petName: user.pet_name,
    petPhoto: user.pet_photo ?? undefined,
    role: user.role,
    username: user.username
  }
}

export function serializeSessionUser(user: DbUser): SessionUser {
  const serialized = serializeUser(user, { includePermissions: true })

  return {
    ...serialized,
    permissions: normalizePermissions(user.permissions)
  }
}

export function serializeBlock(row: {
  created_at: Date
  ends_at: Date
  id: string
  notes: string
  reason: string
  starts_at: Date
  status: 'active' | 'expired' | 'unlocked'
}): AccountBlock {
  return {
    createdAt: new Date(row.created_at).toISOString(),
    endsAt: new Date(row.ends_at).toISOString(),
    id: row.id,
    notes: row.notes,
    reason: row.reason,
    startsAt: new Date(row.starts_at).toISOString(),
    status: row.status
  }
}
