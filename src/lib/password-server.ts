import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto'

const HASH_PREFIX = 'pbkdf2'
const HASH_ITERATIONS = 150_000
const KEY_LENGTH = 32
const SALT_LENGTH = 16

export function isHashedPassword(storedPassword: string) {
  return typeof storedPassword === 'string' && storedPassword.startsWith(`${HASH_PREFIX}$`)
}

export function hashPassword(password: string) {
  const salt = randomBytes(SALT_LENGTH)
  const hash = pbkdf2Sync(password, salt, HASH_ITERATIONS, KEY_LENGTH, 'sha256')

  return [
    HASH_PREFIX,
    String(HASH_ITERATIONS),
    salt.toString('base64'),
    hash.toString('base64')
  ].join('$')
}

export function verifyPassword(password: string, storedPassword: string) {
  if (!isHashedPassword(storedPassword)) {
    return storedPassword === password
  }

  const [, iterationsValue, saltValue, hashValue] = storedPassword.split('$')
  const iterations = Number(iterationsValue)

  if (!Number.isFinite(iterations) || iterations <= 0 || !saltValue || !hashValue) {
    return false
  }

  const expected = Buffer.from(hashValue, 'base64')
  const actual = pbkdf2Sync(password, Buffer.from(saltValue, 'base64'), iterations, expected.length, 'sha256')

  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
