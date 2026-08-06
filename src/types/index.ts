import type { ReactNode } from 'react'

/** ISO 8601 date string returned by the API (e.g. `"2014-12-09T13:50:51.644Z"`). */
export type IsoDate = string

/**
 * ---- SWAPI domain types ----
 */

/** A person in the Star Wars universe. */
export interface Character {
  id: number
  name: string
  /** Height in centimeters, as a numeric string (e.g. `"172"`), or `"unknown"`. */
  height: string
  /** Mass in kilograms, as a numeric string (e.g. `"77"`), or `"unknown"`. */
  mass: string
  hairColor: string
  skinColor: string
  eyeColor: string
  /** SWAPI era reference (e.g. `"19BBY"`). */
  birthYear: string
  gender: string
  /** Homeworld planet URL. */
  homeworld: string
  /** URLs of the films the character appears in. */
  films: string[]
  /** URLs of the character's species — may be empty. */
  species: string[]
  vehicles: string[]
  starships: string[]
  created: IsoDate
  edited: IsoDate
  url: string
}

/** A planet, used as a character's homeworld. */
export interface Planet {
  id: number
  name: string
  rotationPeriod: string
  orbitalPeriod: string
  diameter: string
  climate: string
  gravity: string
  terrain: string
  surfaceWater: string
  population: string
  /** URLs of the characters that live here. */
  residents: string[]
  films: string[]
  created: IsoDate
  edited: IsoDate
  url: string
}

/** A species, used to theme character cards and modal badges. */
export interface Species {
  id: number
  name: string
  classification: string
  designation: string
  averageHeight: string
  skinColors: string
  hairColors: string
  eyeColors: string
  averageLifespan: string
  homeworld: string | null
  language: string
  people: string[]
  films: string[]
  created: IsoDate
  edited: IsoDate
  url: string
}

/** A Star Wars film, used as a filter and to count appearances. */
export interface Film {
  id: number
  title: string
  episodeId: number
  openingCrawl: string
  director: string
  producer: string
  releaseDate: string
  characters: string[]
  planets: string[]
  starships: string[]
  vehicles: string[]
  species: string[]
  created: IsoDate
  edited: IsoDate
  url: string
}

/** Normalized error shape surfaced by the API layer. */
export interface ApiError {
  message: string
  status?: number
}

/**
 * ---- Raw API payloads (snake_case, exactly as returned by SWAPI) ----
 */

export interface RawCharacter {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  homeworld: string
  films: string[]
  species: string[]
  vehicles: string[]
  starships: string[]
  created: string
  edited: string
  url: string
}

export interface RawPlanet {
  name: string
  rotation_period: string
  orbital_period: string
  diameter: string
  climate: string
  gravity: string
  terrain: string
  surface_water: string
  population: string
  residents: string[]
  films: string[]
  created: string
  edited: string
  url: string
}

export interface RawSpecies {
  name: string
  classification: string
  designation: string
  average_height: string
  skin_colors: string
  hair_colors: string
  eye_colors: string
  average_lifespan: string
  homeworld: string | null
  language: string
  people: string[]
  films: string[]
  created: string
  edited: string
  url: string
}

export interface RawFilm {
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: string
  characters: string[]
  planets: string[]
  starships: string[]
  vehicles: string[]
  species: string[]
  created: string
  edited: string
  url: string
}

/**
 * ---- Auth ----
 */

/** A signed-in session: the user plus the access/refresh JWT pair. */
export interface AuthSession {
  user: string
  accessToken: string
  refreshToken: string
}

/** Decoded JWT payload (subject, issued-at and expiry timestamps). */
export interface JwtPayload {
  sub: string
  iat: number
  exp: number
}

/**
 * ---- Hooks ----
 */

/** Everything `useCharacterList` exposes to the page and grid. */
export interface CharacterListResult {
  page: number
  characters: Character[]
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  isFiltered: boolean
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  errorMessage?: string
  retry: () => void
}

/** Shared lookups used by the filters, cards, and the details modal. */
export interface Lookups {
  speciesList: Species[]
  speciesMap: Map<string, string>
  planets: Planet[]
  films: Film[]
}

/**
 * ---- Theme ----
 */

/** Color theme derived from a character's species. */
export interface SpeciesTheme {
  /** Hex color used for hover glow / decorative elements. */
  glow: string
  /** Tailwind classes for the card background tint. */
  cardBg: string
  /** Tailwind classes for the species badge. */
  badge: string
  /** Tailwind classes for text accents. */
  text: string
}

/**
 * ---- UI component props ----
 */

export type Variant = 'primary' | 'ghost' | 'outline' | 'danger'

export interface ButtonProps {
  variant?: Variant
  className?: string
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  'aria-label'?: string
}

export interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  labelledBy?: string
  children: ReactNode
}

export interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrevious: boolean
  isLoading: boolean
  onPageChange: (page: number) => void
}

export interface ErrorBoundaryProps {
  children: ReactNode
}

export interface ErrorBoundaryState {
  hasError: boolean
}

export interface CharacterGridProps {
  onSelect: (character: Character) => void
}

export interface CharacterModalProps {
  character: Character | null
  onClose: () => void
}

export interface CharacterCardProps {
  character: Character
  speciesName?: string
  onSelect: (character: Character) => void
}

export interface HomeworldInfoProps {
  homeworldUrl: string
}

export interface SelectFieldProps {
  id: string
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

/**
 * ---- Misc ----
 */

/** `location.state` carried to the login page after a redirect. */
export interface LocationState {
  from?: { pathname?: string }
}

/** Auth context exposed to consumers via `useAuth`. */
export interface AuthContextValue {
  /** The logged-in username, or null when signed out. */
  user: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}
