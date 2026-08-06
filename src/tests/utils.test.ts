import { describe, expect, it } from 'vitest'
import {
  formatDate,
  formatHeight,
  formatMass,
  orUnknown,
  pluralize,
} from '@/utils/format'
import { speciesColor } from '@/utils/speciesColor'
import { getRandomImage } from '@/utils/getRandomImage'
import { getIdFromUrl } from '@/utils/idFromUrl'
import { createToken, decodeToken, getTokenExpiry } from '@/utils/jwt'

describe('format utils', () => {
  it('formats ISO dates as dd-MM-yyyy', () => {
    expect(formatDate('2014-12-24T22:48:36.898000Z')).toBe('24-12-2014')
  })

  it('returns Unknown for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('Unknown')
  })

  it('converts centimeters to meters', () => {
    expect(formatHeight('172')).toBe('1.72 m')
    expect(formatHeight('200')).toBe('2 m')
  })

  it('returns Unknown for unknown heights', () => {
    expect(formatHeight('unknown')).toBe('Unknown')
    expect(formatHeight('0')).toBe('Unknown')
  })

  it('formats mass in kilograms', () => {
    expect(formatMass('77')).toBe('77 kg')
  })

  it('returns Unknown for unknown masses', () => {
    expect(formatMass('unknown')).toBe('Unknown')
  })

  it('pluralizes counts', () => {
    expect(pluralize(4, 'film')).toBe('4 films')
    expect(pluralize(1, 'film')).toBe('1 film')
  })

  it('falls back to Unknown for empty values', () => {
    expect(orUnknown('')).toBe('Unknown')
    expect(orUnknown(null)).toBe('Unknown')
    expect(orUnknown('19BBY')).toBe('19BBY')
  })
})

describe('speciesColor', () => {
  it('maps known species to their themes', () => {
    expect(speciesColor('Human').glow).toBe('#3b82f6')
    expect(speciesColor('Droid').glow).toBe('#9ca3af')
    expect(speciesColor('Wookiee').glow).toBe('#b45309')
    expect(speciesColor('Ewok').glow).toBe('#22c55e')
  })

  it('uses purple for unknown species', () => {
    expect(speciesColor('Unknown').glow).toBe('#a855f7')
    expect(speciesColor(undefined).glow).toBe('#a855f7')
    expect(speciesColor('Wookie').glow).toBe('#a855f7')
  })
})

describe('getRandomImage', () => {
  it('produces a random picsum URL per character', () => {
    const url = getRandomImage(1)
    expect(url).toMatch(
      /^https:\/\/picsum\.photos\/seed\/sw-[a-z0-9]+\/400\/500$/,
    )
  })

  it('keeps the same image for a character within a session', () => {
    const first = getRandomImage(1)
    const second = getRandomImage(1)
    expect(second).toBe(first)
  })
})

describe('getIdFromUrl', () => {
  it('extracts the trailing id from a SWAPI url', () => {
    expect(getIdFromUrl('https://swapi.dev/api/people/1/')).toBe(1)
    expect(getIdFromUrl('https://swapi.dev/api/planets/2/')).toBe(2)
    expect(getIdFromUrl('nope')).toBe(null)
  })
})

describe('jwt', () => {
  it('creates a three-part token that decodes to its payload', () => {
    const token = createToken('admin', 3600)
    expect(token.split('.')).toHaveLength(3)
    expect(decodeToken(token)).toEqual(
      expect.objectContaining({ sub: 'admin', exp: expect.any(Number) }),
    )
  })

  it('exposes the expiry in milliseconds', () => {
    const token = createToken('admin', 3600)
    const expiry = getTokenExpiry(token)
    expect(expiry).toBeGreaterThan(Date.now())
    expect(getTokenExpiry('garbage')).toBeNull()
  })

  it('returns null for malformed tokens', () => {
    expect(decodeToken('garbage')).toBeNull()
    expect(decodeToken('a.b')).toBeNull()
  })
})
