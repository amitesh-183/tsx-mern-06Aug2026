import { createToken, decodeToken } from '@/utils/jwt'
import type { AuthSession } from '@/types'

export const MOCK_USERNAME = 'admin'
export const MOCK_PASSWORD = 'password'

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60 // 15 minutes
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days
const SESSION_KEY = 'sw_session'

/** Simulates the network latency of a real login/refresh request. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createSession(user: string): AuthSession {
  return {
    user,
    accessToken: createToken(user, ACCESS_TOKEN_TTL_SECONDS),
    refreshToken: createToken(user, REFRESH_TOKEN_TTL_SECONDS),
  }
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    return null
  }
}

function writeSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

/**
 * Mock JWT authentication service. It mimics a real backend:
 * - `login` validates the mock credentials and returns a short-lived access
 *   token plus a long-lived refresh token.
 * - `refresh` mints a fresh access token from a still-valid refresh token.
 *
 * No network requests are made. Tokens are persisted to localStorage; in
 * production the backend would sign them and the client would store them in
 * httpOnly cookies instead.
 */
export const authService = {
  /** Validates the mock credentials and returns a new session. */
  async login(username: string, password: string): Promise<AuthSession> {
    await delay(600)

    if (username !== MOCK_USERNAME || password !== MOCK_PASSWORD) {
      throw new Error('Invalid username or password')
    }

    const session = createSession(username)
    writeSession(session)
    return session
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY)
  },

  /** The persisted session, or null when signed out. */
  getSession(): AuthSession | null {
    return readSession()
  },

  /** Mints a fresh access token using the still-valid refresh token. */
  async refresh(): Promise<AuthSession> {
    await delay(300)

    const current = readSession()
    if (!current) throw new Error('Session expired')

    const refreshPayload = decodeToken(current.refreshToken)
    if (!refreshPayload || refreshPayload.exp * 1000 <= Date.now()) {
      throw new Error('Session expired')
    }

    const session = createSession(current.user)
    writeSession(session)
    return session
  },
}
