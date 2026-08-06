import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { useDebounce } from '@/hooks/useDebounce'

/**
 * Reads page/search/filters directly from the URL query string
 * (`?page=`, `?q=`, `?species=`, `?homeworld=`, `?film=`), so the view is
 * shareable and survives a refresh. Changing search or a filter resets the
 * page back to 1.
 */
export function useCharacterFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const search = searchParams.get('q') ?? ''
  const species = searchParams.get('species') ?? ''
  const homeworld = searchParams.get('homeworld') ?? ''
  const film = searchParams.get('film') ?? ''
  const debouncedSearch = useDebounce(search, 400)

  const update = useCallback(
    (changes: Record<string, string>) => {
      setSearchParams(
        (params) => {
          for (const [key, value] of Object.entries(changes)) {
            if (value) params.set(key, value)
            else params.delete(key)
          }
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (nextPage: number) =>
      update({ page: nextPage > 1 ? String(nextPage) : '' }),
    [update],
  )
  const setSearch = useCallback(
    (value: string) => update({ q: value, page: '' }),
    [update],
  )
  const setSpecies = useCallback(
    (value: string) => update({ species: value, page: '' }),
    [update],
  )
  const setHomeworld = useCallback(
    (value: string) => update({ homeworld: value, page: '' }),
    [update],
  )
  const setFilm = useCallback(
    (value: string) => update({ film: value, page: '' }),
    [update],
  )
  const clearFilters = useCallback(
    () => update({ species: '', homeworld: '', film: '', page: '' }),
    [update],
  )

  return {
    page,
    search,
    species,
    homeworld,
    film,
    debouncedSearch,
    isFiltered: Boolean(species || homeworld || film),
    setPage,
    setSearch,
    setSpecies,
    setHomeworld,
    setFilm,
    clearFilters,
  }
}
