import { useCharacterFilters } from '@/hooks/useCharacterFilters'

/**
 * Search input for partial character-name matching.
 * The value is debounced in `useCharacterFilters`.
 */
export function SearchBar() {
  const { search, setSearch } = useCharacterFilters()

  return (
    <div className="relative w-full sm:max-w-xs">
      <label htmlFor="character-search" className="sr-only">
        Search characters
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        id="character-search"
        type="search"
        role="searchbox"
        placeholder="Search by name… e.g. luk"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-indigo-400/60 focus:bg-white/10"
        autoComplete="off"
      />
      {search ? (
        <button
          type="button"
          onClick={() => setSearch('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-200"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}
