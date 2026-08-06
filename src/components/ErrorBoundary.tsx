import { Component, type ErrorInfo } from 'react'
import type { ErrorBoundaryProps, ErrorBoundaryState } from '@/types'

/**
 * Catches unexpected render errors so the app never crashes to a blank page.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo)
  }

  private handleReload = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="glass mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl p-10 text-center">
            <span className="text-5xl" aria-hidden="true">
              ⚠️
            </span>
            <h1 className="font-display text-xl font-bold text-slate-100">
              Something went wrong
            </h1>
            <p className="text-sm leading-relaxed text-slate-400">
              An unexpected error occurred. Try reloading the page, or head back
              to the character list.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:from-indigo-400 hover:to-purple-400"
              >
                Try again
              </button>
            </div>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
