import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast('You have been logged out')
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-space-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Star Wars Character Explorer home"
        >
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <span className="font-display text-lg font-bold tracking-wide text-slate-100">
            STAR<span className="text-indigo-400">WARS</span>
            <span className="ml-2 hidden text-xs font-medium uppercase tracking-[0.2em] text-slate-400 sm:inline">
              Character Explorer
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
              {user?.charAt(0).toUpperCase() ?? '?'}
            </span>
            {user ?? 'guest'}
          </span>
          <Button variant="ghost" onClick={handleLogout} aria-label="Log out">
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
