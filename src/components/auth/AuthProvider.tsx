import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '@/services/authService'
import { getTokenExpiry } from '@/utils/jwt'
import type { AuthContextValue, AuthSession } from '@/types'

const AuthContext = createContext<AuthContextValue | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

/**
 * Boots the session on mount and keeps it alive:
 * 1. Restores the persisted session, silently refreshing the access token if
 *    it has already expired.
 * 2. While the app is open, silently refreshes the access token shortly
 *    before it expires so the user is never logged out mid-session.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Restore the persisted session on first load.
  useEffect(() => {
    let cancelled = false

    async function restore() {
      let current = authService.getSession()
      if (!current) return

      const accessExpiry = getTokenExpiry(current.accessToken)
      if (!accessExpiry || accessExpiry <= Date.now()) {
        try {
          current = await authService.refresh()
        } catch {
          authService.logout()
          return
        }
      }
      if (!cancelled) setSession(current)
    }

    void restore().finally(() => {
      if (!cancelled) setIsInitialized(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Keep the access token fresh while the app is open.
  useEffect(() => {
    if (!session) return undefined

    const accessExpiry = getTokenExpiry(session.accessToken)
    if (!accessExpiry) return undefined

    const refreshInMs = Math.max(accessExpiry - Date.now() - 60_000, 0) // 1 min early
    const timer = setTimeout(() => {
      authService
        .refresh()
        .then(setSession)
        .catch(() => setSession(null))
    }, refreshInMs)

    return () => clearTimeout(timer)
  }, [session])

  const login = useCallback(async (username: string, password: string) => {
    setSession(await authService.login(username, password))
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setSession(null)
  }, [])

  if (!isInitialized) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-label="Restoring session"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-400" />
          <p className="text-sm text-slate-400">Restoring your session…</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{ user: session?.user ?? null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
