import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Character, CharacterListResult, Lookups } from '@/types'
import { getCharacters } from '@/services/characterService'
import { getAllFilms } from '@/services/filmService'
import { getAllPlanets, getPlanet } from '@/services/homeworldService'
import { getAllSpecies } from '@/services/speciesService'
import { useCharacterFilters } from '@/hooks/useCharacterFilters'

export const PAGE_SIZE = 10

function useCharactersQuery() {
  return useQuery({
    queryKey: ['characters'],
    queryFn: getCharacters,
  })
}

function useSpeciesQuery() {
  return useQuery({
    queryKey: ['species'],
    queryFn: getAllSpecies,
  })
}

function usePlanetsQuery() {
  return useQuery({
    queryKey: ['planets'],
    queryFn: getAllPlanets,
  })
}

function useFilmsQuery() {
  return useQuery({
    queryKey: ['films'],
    queryFn: getAllFilms,
  })
}

/** A single planet (homeworld), fetched by URL when the modal is open. */
export function usePlanetQuery(url: string) {
  return useQuery({
    queryKey: ['planet', url],
    queryFn: () => getPlanet(url),
  })
}

function matchesFilters(
  character: Character,
  {
    search,
    species,
    homeworld,
    film,
  }: {
    search: string
    species: string
    homeworld: string
    film: string
  },
): boolean {
  if (search && !character.name.toLowerCase().includes(search.toLowerCase())) {
    return false
  }
  if (species && !character.species.includes(species)) return false
  if (homeworld && character.homeworld !== homeworld) return false
  if (film && !character.films.includes(film)) return false
  return true
}

/**
 * Fetches the full character collection (the API has no server-side
 * pagination/search) and applies search, filters and pagination client-side.
 */
export function useCharacterList(): CharacterListResult {
  const charactersQuery = useCharactersQuery()
  const { page, debouncedSearch, species, homeworld, film, isFiltered } =
    useCharacterFilters()

  return useMemo(() => {
    const filtered = (charactersQuery.data ?? []).filter((character) =>
      matchesFilters(character, {
        search: debouncedSearch,
        species,
        homeworld,
        film,
      }),
    )

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const clampedPage = Math.min(page, totalPages)
    const characters = filtered.slice(
      (clampedPage - 1) * PAGE_SIZE,
      clampedPage * PAGE_SIZE,
    )

    return {
      page: clampedPage,
      characters,
      total: filtered.length,
      totalPages,
      hasNext: clampedPage < totalPages,
      hasPrevious: clampedPage > 1,
      isFiltered,
      isLoading: charactersQuery.isPending,
      isFetching: charactersQuery.isFetching,
      isError: charactersQuery.isError,
      errorMessage:
        charactersQuery.error instanceof Error
          ? charactersQuery.error.message
          : undefined,
      retry: charactersQuery.refetch,
    }
  }, [
    charactersQuery,
    page,
    debouncedSearch,
    species,
    homeworld,
    film,
    isFiltered,
  ])
}

/** Shared lookups used by the filters, cards and the details modal. */
export function useLookups(): Lookups {
  const speciesQuery = useSpeciesQuery()
  const planetsQuery = usePlanetsQuery()
  const filmsQuery = useFilmsQuery()

  const speciesMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const species of speciesQuery.data ?? []) {
      map.set(species.url, species.name)
    }
    return map
  }, [speciesQuery.data])

  return {
    speciesList: speciesQuery.data ?? [],
    speciesMap,
    planets: planetsQuery.data ?? [],
    films: filmsQuery.data ?? [],
  }
}
