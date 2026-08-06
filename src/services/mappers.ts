import { getIdFromUrl, toHttps, toHttpsOrNull } from '@/utils/idFromUrl'
import type {
  Character,
  Film,
  Planet,
  RawCharacter,
  RawFilm,
  RawPlanet,
  RawSpecies,
  Species,
} from '@/types'

export function mapCharacter(raw: RawCharacter): Character {
  return {
    id: getIdFromUrl(raw.url) ?? 0,
    name: raw.name,
    height: raw.height,
    mass: raw.mass,
    hairColor: raw.hair_color,
    skinColor: raw.skin_color,
    eyeColor: raw.eye_color,
    birthYear: raw.birth_year,
    gender: raw.gender,
    homeworld: toHttps(raw.homeworld),
    films: raw.films.map(toHttps),
    species: raw.species.map(toHttps),
    vehicles: raw.vehicles.map(toHttps),
    starships: raw.starships.map(toHttps),
    created: raw.created,
    edited: raw.edited,
    url: toHttps(raw.url),
  }
}

export function mapPlanet(raw: RawPlanet): Planet {
  return {
    id: getIdFromUrl(raw.url) ?? 0,
    name: raw.name,
    rotationPeriod: raw.rotation_period,
    orbitalPeriod: raw.orbital_period,
    diameter: raw.diameter,
    climate: raw.climate,
    gravity: raw.gravity,
    terrain: raw.terrain,
    surfaceWater: raw.surface_water,
    population: raw.population,
    residents: raw.residents.map(toHttps),
    films: raw.films.map(toHttps),
    created: raw.created,
    edited: raw.edited,
    url: toHttps(raw.url),
  }
}

export function mapSpecies(raw: RawSpecies): Species {
  return {
    id: getIdFromUrl(raw.url) ?? 0,
    name: raw.name,
    classification: raw.classification,
    designation: raw.designation,
    averageHeight: raw.average_height,
    skinColors: raw.skin_colors,
    hairColors: raw.hair_colors,
    eyeColors: raw.eye_colors,
    averageLifespan: raw.average_lifespan,
    homeworld: toHttpsOrNull(raw.homeworld),
    language: raw.language,
    people: raw.people.map(toHttps),
    films: raw.films.map(toHttps),
    created: raw.created,
    edited: raw.edited,
    url: toHttps(raw.url),
  }
}

export function mapFilm(raw: RawFilm): Film {
  return {
    id: getIdFromUrl(raw.url) ?? 0,
    title: raw.title,
    episodeId: raw.episode_id,
    openingCrawl: raw.opening_crawl,
    director: raw.director,
    producer: raw.producer,
    releaseDate: raw.release_date,
    characters: raw.characters.map(toHttps),
    planets: raw.planets.map(toHttps),
    starships: raw.starships.map(toHttps),
    vehicles: raw.vehicles.map(toHttps),
    species: raw.species.map(toHttps),
    created: raw.created,
    edited: raw.edited,
    url: toHttps(raw.url),
  }
}
