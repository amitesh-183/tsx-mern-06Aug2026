import { httpClient } from '@/api/httpClient'
import { mapPlanet } from './mappers'
import type { Planet, RawPlanet } from '@/types'

/**
 * Fetches a planet (homeworld) by its full API URL.
 */
export async function getPlanet(url: string): Promise<Planet> {
  const { data } = await httpClient.get<RawPlanet>(url)
  return mapPlanet(data)
}

/**
 * Fetches every planet in a single request (the API returns the complete
 * collection as a plain JSON array, with no pagination envelope).
 * Used to build the homeworld filter options.
 */
export async function getAllPlanets(): Promise<Planet[]> {
  const { data } = await httpClient.get<RawPlanet[]>('/planets')
  return data.map(mapPlanet)
}
