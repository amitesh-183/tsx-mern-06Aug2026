import { Button } from './Button'
import type { EmptyStateProps } from '@/types'

/** Centered placeholder used for errors and empty result sets. */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div
      className="glass mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl p-10 text-center"
      role="status"
    >
      {children ?? (
        <span className="text-5xl" aria-hidden="true">
          🛸
        </span>
      )}
      <h2 className="font-display text-xl font-bold text-slate-100">{title}</h2>
      {description ? (
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </div>
  )
}
