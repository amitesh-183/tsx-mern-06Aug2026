import { httpClient } from '@/api/httpClient'
import { mapFilm } from './mappers'
import type { Film, RawFilm } from '@/types'

/**
 * Fetches every film in a single request (the API returns the complete
 * collection as a plain JSON array, with no pagination envelope).
 * Used to build the film filter options and film counts.
 */
export async function getAllFilms(): Promise<Film[]> {
  const { data } = await httpClient.get<RawFilm[]>('/films')
  return data.map(mapFilm)
}
