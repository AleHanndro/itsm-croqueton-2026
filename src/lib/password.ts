const HASH_PREFIX = 'pbkdf2'
const HASH_ITERATIONS = 150_000
const KEY_LENGTH = 32
const SALT_LENGTH = 16

function toBase64(bytes: Uint8Array) {
  let binary = ''

  for (const byte of bytes) binary += String.fromCharCode(byte)

  return window.btoa(binary)
}

function fromBase64(value: string) {
  const binary = window.atob(value)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    KEY_LENGTH * 8
  )

  return new Uint8Array(bits)
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  let difference = left.length ^ right.length

  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    difference |= left[index] ^ right[index]
  }

  return difference === 0
}

export function isHashedPassword(storedPassword: string) {
  return typeof storedPassword === 'string' && storedPassword.startsWith(`${HASH_PREFIX}$`)
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  const hash = await deriveKey(password, salt, HASH_ITERATIONS)

  return [HASH_PREFIX, String(HASH_ITERATIONS), toBase64(salt), toBase64(hash)].join('$')
}

export async function verifyPassword(password: string, storedPassword: string) {
  if (!isHashedPassword(storedPassword)) return storedPassword === password

  const [, iterationsValue, saltValue, hashValue] = storedPassword.split('$')
  const iterations = Number(iterationsValue)

  if (!Number.isFinite(iterations) || iterations <= 0 || !saltValue || !hashValue) return false

  const hash = await deriveKey(password, fromBase64(saltValue), iterations)

  return constantTimeEqual(hash, fromBase64(hashValue))
}
