import { Spinner } from '@/components/ui/Spinner'

/**
 * Full-screen fallback shown while a lazily loaded route chunk is fetching.
 */
export function Loader() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      role="status"
      aria-label="Loading page"
    >
      <Spinner className="h-8 w-8 text-indigo-400" />
    </div>
  )
}
