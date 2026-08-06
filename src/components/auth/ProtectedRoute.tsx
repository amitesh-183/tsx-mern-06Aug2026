import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './AuthProvider'

/**
 * Guards private routes. Unauthenticated users are redirected to the login
 * page, remembering where they were heading.
 */
export function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
