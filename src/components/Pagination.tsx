import { Button } from './ui/Button'
import { pluralize } from '@/utils/format'
import type { PaginationProps } from '@/types'

/**
 * Previous / Next pagination with a current page indicator.
 * Both buttons are disabled at the edges of the result set.
 */
export function Pagination({
  page,
  totalPages,
  totalItems,
  hasNext,
  hasPrevious,
  isLoading,
  onPageChange,
}: PaginationProps) {
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * 10 + 1
  const rangeEnd = Math.min(page * 10, totalItems)

  return (
    <nav
      className="glass flex flex-col items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:flex-row sm:px-6"
      aria-label="Pagination"
    >
      <p className="text-sm text-slate-400" aria-live="polite">
        Showing{' '}
        <span className="font-semibold text-slate-200">
          {rangeStart}–{rangeEnd}
        </span>{' '}
        of {pluralize(totalItems, 'character')}
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious || isLoading}
          aria-label="Previous page"
        >
          <span aria-hidden="true">←</span> Previous
        </Button>

        <span
          className="min-w-20 text-center text-sm font-semibold text-slate-200"
          aria-live="polite"
          aria-label={`Page ${page} of ${totalPages}`}
        >
          Page {page} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext || isLoading}
          aria-label="Next page"
        >
          Next <span aria-hidden="true">→</span>
        </Button>
      </div>
    </nav>
  )
}
