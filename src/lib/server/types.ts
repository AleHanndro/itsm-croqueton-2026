export type UserRole = 'user' | 'admin' | 'superadmin'

export type AccountStatus = 'active' | 'blocked' | 'blocked_expired'

export type AdminPermission =
  | 'audit.view'
  | 'moderation.manage'
  | 'moderation.view'
  | 'users.block'
  | 'users.unlock'
  | 'users.view'

export type AdminPermissions = Partial<Record<AdminPermission, boolean>> & Record<string, boolean>

export interface AvatarConfig {
  furColor: string
  glassesColor: string
  hair: 'none' | 'short' | 'long'
  outfit: 'shirt' | 'dress' | 'overalls'
  shirtColor: string
  shoesColor: string
  shortsColor: string
}

export interface DbUser {
  account_status: AccountStatus
  avatar_config: Partial<AvatarConfig> | null
  avatar_image: string | null
  created_at: Date
  email: string
  id: string
  is_active: boolean
  name: string
  password_hash: string
  permissions: AdminPermissions | null
  pet_bio: string
  pet_name: string
  pet_photo: string | null
  role: UserRole
  updated_at: Date
  username: string
}

export interface SerializedUser {
  accountStatus: AccountStatus
  avatarConfig: AvatarConfig
  avatarImage?: string
  createdAt: string
  email: string
  id: string
  isActive: boolean
  name: string
  permissions?: AdminPermissions
  petBio: string
  petName: string
  petPhoto?: string
  role: UserRole
  username: string
}

export interface AccountBlock {
  createdAt: string
  endsAt: string
  id: string
  notes: string
  reason: string
  startsAt: string
  status: 'active' | 'expired' | 'unlocked'
}

export interface SessionUser {
  accountStatus: AccountStatus
  avatarConfig: AvatarConfig
  avatarImage?: string
  createdAt: string
  email: string
  id: string
  isActive: boolean
  name: string
  permissions: AdminPermissions
  petBio: string
  petName: string
  petPhoto?: string
  role: UserRole
  username: string
}
