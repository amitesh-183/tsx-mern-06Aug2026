import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong flex flex-col items-center gap-4 rounded-3xl p-10 text-center shadow-2xl shadow-black/50">
        <p className="font-display text-6xl font-bold text-indigo-400">404</p>
        <h1 className="font-display text-xl font-bold text-slate-100">
          This is not the page you're looking for
        </h1>
        <p className="max-w-sm text-sm text-slate-400">
          Move along — the route you requested doesn't exist in this part of the
          galaxy.
        </p>
        <Link to="/" className="mt-2">
          <Button>Back to characters</Button>
        </Link>
      </div>
    </main>
  )
}
