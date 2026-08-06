import axios from 'axios'

/**
 * Shared Axios instance for all SWAPI requests.
 * Components never talk to this directly — they go through the
 * dedicated services layer (see `src/services`).
 */
export const httpClient = axios.create({
  baseURL: 'https://swapi.info/api',
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
})
