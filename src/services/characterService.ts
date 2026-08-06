import { httpClient } from '@/api/httpClient'
import { mapCharacter } from './mappers'
import type { Character, RawCharacter } from '@/types'

/**
 * Fetches every character in a single request.
 *
 * The provided API (https://swapi.info) returns the whole collection as one
 * JSON array and ignores pagination/search query parameters, so no envelope
 * handling or paging loop is needed here. Pagination, search and filtering
 * are applied client-side by `useCharacters`.
 */
export async function getCharacters(): Promise<Character[]> {
  const { data } = await httpClient.get<RawCharacter[]>('/people')
  return data.map(mapCharacter)
}
