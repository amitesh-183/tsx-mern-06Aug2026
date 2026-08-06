/**
 * A single skeleton card that mirrors the final character card layout.
 * Used while the character list is loading.
 */
export function SkeletonCard() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
      role="status"
      aria-label="Loading character"
    >
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="flex items-center gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}

/** A full grid of skeleton cards that mirrors the final grid layout. */
export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      aria-busy="true"
      aria-label="Loading characters"
    >
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}
