import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { LocationState } from '@/types';

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'

  if (user) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!username.trim() || !password) {
      setError('Please enter both a username and a password.')
      return
    }

    setIsSubmitting(true)
    try {
      await login(username.trim(), password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch {
      setError('Invalid username or password. Try admin / password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glass-strong w-full max-w-sm rounded-3xl p-8 shadow-2xl shadow-black/50">
        <div className="mb-8 text-center">
          <img src="/favicon.svg" alt="" className="mx-auto mb-4 h-14 w-14" />
          <h1 className="font-display text-2xl font-bold text-slate-100">
            STAR<span className="text-indigo-400">WARS</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to explore the galaxy
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-400/60 focus:bg-white/10"
              placeholder="admin"
              aria-invalid={error ? true : undefined}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-400/60 focus:bg-white/10"
              placeholder="••••••••"
              aria-invalid={error ? true : undefined}
              required
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300"
            >
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Spinner className="text-white" /> Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Demo credentials — username:{' '}
          <code className="text-slate-300">admin</code>, password:{' '}
          <code className="text-slate-300">password</code>
        </p>
      </div>
    </main>
  )
}
