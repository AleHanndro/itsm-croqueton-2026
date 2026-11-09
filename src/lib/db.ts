import { Pool, type PoolClient, type QueryResultRow } from 'pg'

const globalForPostgres = globalThis as unknown as {
  croquetonPool?: Pool
}

function createPool() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured')
  }

  return new Pool({
    connectionString,
    max: 10,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  })
}

export const pool = globalForPostgres.croquetonPool ?? createPool()

if (process.env.NODE_ENV !== 'production') {
  globalForPostgres.croquetonPool = pool
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: readonly unknown[] = []
) {
  return pool.query<T>(text, values as unknown[])
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
