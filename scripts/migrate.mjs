import { readdir, readFile } from 'node:fs/promises'
import { pbkdf2Sync, randomBytes } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Pool } from 'pg'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const migrationsDir = path.join(root, 'db', 'migrations')

for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(path.join(root, file))
  } catch {}
}

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is required. Copy .env.example to .env.local and configure it.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
})

function hashPassword(password) {
  const iterations = 150000
  const salt = randomBytes(16)
  const hash = pbkdf2Sync(password, salt, iterations, 32, 'sha256')
  return ['pbkdf2', String(iterations), salt.toString('base64'), hash.toString('base64')].join('$')
}

function usernameFromEmail(email) {
  const base = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '')
    .slice(0, 24)
  return base.length >= 3 ? base : `user${base || 'croqueton'}`.slice(0, 24)
}

async function migrate(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort()

  for (const file of files) {
    const applied = await client.query('SELECT 1 FROM schema_migrations WHERE version = $1', [file])
    if (applied.rowCount) {
      console.log(`skip ${file}`)
      continue
    }

    const sql = await readFile(path.join(migrationsDir, file), 'utf8')
    await client.query('BEGIN')
    try {
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file])
      await client.query('COMMIT')
      console.log(`applied ${file}`)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  }
}

async function seedSuperadmin(client) {
  const email = (process.env.SUPERADMIN_EMAIL || 'admin@croqueton.mx').trim().toLowerCase()
  const password = process.env.SUPERADMIN_PASSWORD || 'croqueton2026'
  const name = process.env.SUPERADMIN_NAME || 'Admin Croquetón'
  const username = usernameFromEmail(email)
  const permissions = {
    'moderation.manage': true,
    'moderation.view': true,
    'users.block': true,
    'users.unlock': true,
    'users.view': true
  }
  const avatarConfig = {
    furColor: '#d98a4e',
    glassesColor: '#202436',
    hair: 'none',
    outfit: 'shirt',
    shirtColor: '#ef6547',
    shoesColor: '#fff8df',
    shortsColor: '#647fa1'
  }

  const existing = await client.query('SELECT id, role FROM users WHERE email = $1', [email])

  if (existing.rowCount) {
    if (existing.rows[0].role !== 'superadmin') {
      await client.query(
        "UPDATE users SET role = 'superadmin', is_active = true, permissions = $2 WHERE email = $1",
        [email, permissions]
      )
      console.log(`promoted ${email} to superadmin`)
    } else {
      console.log(`superadmin ${email} already exists`)
    }
    return
  }

  await client.query(
    `INSERT INTO users
      (email, password_hash, name, username, role, is_active, permissions, avatar_config, pet_name)
     VALUES ($1, $2, $3, $4, 'superadmin', true, $5, $6, 'Chispita')`,
    [email, hashPassword(password), name, username, permissions, avatarConfig]
  )
  console.log(`seeded superadmin ${email}`)
}

const client = await pool.connect()

try {
  await migrate(client)
  await seedSuperadmin(client)
} finally {
  client.release()
  await pool.end()
}
