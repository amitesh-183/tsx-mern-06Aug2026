import { httpClient } from '@/api/httpClient'
import { mapSpecies } from './mappers'
import type { RawSpecies, Species } from '@/types'

/**
 * Fetches every species in a single request (the API returns the complete
 * collection as a plain JSON array, with no pagination envelope).
 * Used to resolve species names for card colors and the species filter.
 */
export async function getAllSpecies(): Promise<Species[]> {
  const { data } = await httpClient.get<RawSpecies[]>('/species')
  return data.map(mapSpecies)
}
