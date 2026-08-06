import type { JwtPayload } from '@/types'

function base64UrlEncode(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/**
 * Builds a JWT-format token (`header.payload.signature`). The signature is a
 * placeholder — in production a backend would sign the token with a secret
 * key. This is enough to demonstrate the real access/refresh token lifecycle.
 */
export function createToken(subject: string, expiresInSeconds: number): string {
  const now = Math.floor(Date.now() / 1000)
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = base64UrlEncode(
    JSON.stringify({ sub: subject, iat: now, exp: now + expiresInSeconds }),
  )
  const signature = base64UrlEncode(String(Math.random()).slice(2))
  return `${header}.${payload}.${signature}`
}

/** Decodes a JWT payload, returning null for malformed tokens. */
export function decodeToken(token: string): JwtPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload
  } catch {
    return null
  }
}

/** The token's expiry as epoch milliseconds, or null when invalid. */
export function getTokenExpiry(token: string): number | null {
  const payload = decodeToken(token)
  return payload ? payload.exp * 1000 : null
}
