/**
 * Extracts the trailing numeric id from a SWAPI resource URL.
 * e.g. "https://swapi.info/api/people/1/" -> 1
 */
export function getIdFromUrl(url: string): number | null {
  const match = url.match(/(\d+)\/?$/)
  return match ? Number(match[1]) : null
}

/**
 * Normalizes a resource URL to `https://`, preventing mixed-content blocking
 * on HTTPS deployments (Vercel / Netlify).
 */
export function toHttps(url: string): string {
  return url.replace(/^http:\/\//i, 'https://')
}

/**
 * Null-safe variant of `toHttps`. Some resources (e.g. the Droid species)
 * have no homeworld and return `null`.
 */
export function toHttpsOrNull(url: string | null): string | null {
  return url ? toHttps(url) : null
}
