/**
 * Cache of random seeds keyed by character id.
 * Each character's image stays stable for the lifetime of the page (no image
 * churn while filtering, searching or paging), but a full page reload re-rolls
 * the seeds so the user gets a fresh random picture.
 */
const seedCache = new Map<number, string>()

/**
 * Returns a Picsum image URL for a character. The seed is random per page
 * load and cached per character id.
 */
export function getRandomImage(characterId: number): string {
  let seed = seedCache.get(characterId)
  if (!seed) {
    seed = Math.random().toString(36).slice(2, 10)
    seedCache.set(characterId, seed)
  }
  return `https://picsum.photos/seed/sw-${seed}/400/500`
}
