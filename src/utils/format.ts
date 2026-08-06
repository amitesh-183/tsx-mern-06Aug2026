import { format, isValid } from 'date-fns'
import { tz } from '@date-fns/tz'

export const UNKNOWN = 'Unknown'

/** Always format dates in UTC so output is consistent for every user. */
const utc = tz('UTC')

/** Converts a value to a display string, falling back to "Unknown". */
export function orUnknown(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return UNKNOWN
  return String(value)
}

/**
 * Formats an ISO date string as "dd-MM-yyyy" in UTC.
 * e.g. "2014-12-24T22:48:36.311000Z" -> "24-12-2014"
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (!isValid(date)) return UNKNOWN
  return format(date, 'dd-MM-yyyy', { in: utc })
}

/**
 * Converts a height in centimeters to meters.
 * e.g. "172" -> "1.72 m"
 */
export function formatHeight(heightCm: string): string {
  const centimeters = Number(heightCm)
  if (!Number.isFinite(centimeters) || centimeters <= 0) return UNKNOWN
  const meters = (centimeters / 100).toFixed(2).replace(/\.00$/, '')
  return `${meters} m`
}

/**
 * Formats a mass in kilograms.
 * e.g. "77" -> "77 kg"
 */
export function formatMass(massKg: string): string {
  const mass = Number(massKg)
  if (!Number.isFinite(mass) || mass <= 0) return UNKNOWN
  return `${mass} kg`
}

/** Formats a film count. e.g. (4, "film") -> "4 films". */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`)
  return `${count} ${word}`
}
