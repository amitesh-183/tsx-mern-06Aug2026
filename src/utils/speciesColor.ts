import type { SpeciesTheme } from '@/types'

const THEMES: Record<string, SpeciesTheme> = {
  Human: {
    glow: '#3b82f6',
    cardBg: 'bg-blue-500/10',
    badge: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
    text: 'text-blue-300',
  },
  Droid: {
    glow: '#9ca3af',
    cardBg: 'bg-slate-400/10',
    badge: 'bg-slate-400/20 text-slate-200 border-slate-400/40',
    text: 'text-slate-300',
  },
  Wookiee: {
    glow: '#b45309',
    cardBg: 'bg-amber-700/15',
    badge: 'bg-amber-700/25 text-amber-200 border-amber-500/40',
    text: 'text-amber-300',
  },
  Ewok: {
    glow: '#22c55e',
    cardBg: 'bg-emerald-500/10',
    badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    text: 'text-emerald-300',
  },
}

const UNKNOWN_THEME: SpeciesTheme = {
  glow: '#a855f7',
  cardBg: 'bg-purple-500/10',
  badge: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
  text: 'text-purple-300',
}

/**
 * Maps a species name to a color theme.
 * Human -> Blue, Droid -> Gray, Wookiee -> Brown, Ewok -> Green, else Purple.
 */
export function speciesColor(speciesName?: string | null): SpeciesTheme {
  if (!speciesName) return UNKNOWN_THEME
  return THEMES[speciesName] ?? UNKNOWN_THEME
}
