import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Login from '@/pages/Login'
import { authService } from '@/services/authService'
import { createToken, decodeToken } from '@/utils/jwt'

function renderWithAuth(initialEntry: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Character Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('auth', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('redirects unauthenticated users away from protected routes', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )

    expect(await screen.findByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('logs in with valid credentials and redirects home', async () => {
    const user = userEvent.setup()
    renderWithAuth('/login')

    await user.type(await screen.findByLabelText(/username/i), 'admin')
    await user.type(screen.getByLabelText(/password/i), 'password')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Character Home')).toBeInTheDocument()
  })

  it('shows an error for invalid credentials', async () => {
    const user = userEvent.setup()
    renderWithAuth('/login')

    await user.type(await screen.findByLabelText(/username/i), 'admin')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(
      await screen.findByText(/invalid username or password/i),
    ).toBeInTheDocument()
  })

  it('issues JWTs and silently refreshes the access token', async () => {
    const session = await authService.login('admin', 'password')
    expect(session.user).toBe('admin')
    expect(decodeToken(session.accessToken)?.sub).toBe('admin')
    expect(decodeToken(session.refreshToken)?.sub).toBe('admin')
    expect(authService.getSession()).not.toBeNull()

    const refreshed = await authService.refresh()
    expect(decodeToken(refreshed.accessToken)?.sub).toBe('admin')
    expect(refreshed.accessToken).not.toBe(session.accessToken)

    authService.logout()
    expect(authService.getSession()).toBeNull()
  })

  it('rejects invalid credentials', async () => {
    await expect(authService.login('admin', 'nope')).rejects.toThrow(
      /invalid username or password/i,
    )
  })

  it('rejects refresh without a valid session', async () => {
    await expect(authService.refresh()).rejects.toThrow(/session expired/i)
  })

  it('rejects refresh when the refresh token has expired', async () => {
    const expired = createToken('admin', -60) // already past expiry
    localStorage.setItem(
      'sw_session',
      JSON.stringify({
        user: 'admin',
        accessToken: expired,
        refreshToken: expired,
      }),
    )
    await expect(authService.refresh()).rejects.toThrow(/session expired/i)
  })
})
