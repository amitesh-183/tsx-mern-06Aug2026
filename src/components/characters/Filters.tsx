import { useCharacterFilters } from '@/hooks/useCharacterFilters'
import { useLookups } from '@/hooks/useCharacters'
import type { SelectFieldProps } from '@/types'

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-initial">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-slate-400"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer rounded-xl border border-white/10 bg-space-800/80 px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors focus:border-indigo-400/60 sm:max-w-48"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

/**
 * Species / Homeworld / Film filters. They combine with the search box and
 * reset pagination whenever a filter changes.
 */
export function Filters() {
  const {
    species,
    homeworld,
    film,
    isFiltered,
    setSpecies,
    setHomeworld,
    setFilm,
    clearFilters,
  } = useCharacterFilters()
  const { speciesList, planets, films } = useLookups()

  return (
    <div className="glass flex flex-wrap items-end gap-3 rounded-2xl p-4">
      <SelectField
        id="filter-species"
        label="Species"
        value={species}
        options={speciesList.map((species) => ({
          value: species.url,
          label: species.name,
        }))}
        onChange={setSpecies}
      />
      <SelectField
        id="filter-homeworld"
        label="Homeworld"
        value={homeworld}
        options={planets.map((planet) => ({
          value: planet.url,
          label: planet.name,
        }))}
        onChange={setHomeworld}
      />
      <SelectField
        id="filter-film"
        label="Film"
        value={film}
        options={films
          .slice()
          // Show episodes in release/order-of-canon order.
          .sort((a, b) => a.episodeId - b.episodeId)
          .map((film) => ({
            value: film.url,
            label: `Episode ${film.episodeId} — ${film.title}`,
          }))}
        onChange={setFilm}
      />

      {isFiltered ? (
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-rose-500/20 hover:text-rose-200"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  )
}
