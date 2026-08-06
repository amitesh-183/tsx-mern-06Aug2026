import type { CharacterGridProps } from '@/types'
import { useLookups, useCharacterList } from '@/hooks/useCharacters'
import { CharacterCard } from './CharacterCard'
import { SkeletonGrid } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

/** Loading, empty, error, and success states for the character list. */
export function CharacterGrid({ onSelect }: CharacterGridProps) {
  const { speciesMap } = useLookups()
  const { characters, isLoading, isError, errorMessage, retry } =
    useCharacterList()

  if (isError) {
    return (
      <EmptyState
        title="Unable to reach the galaxy"
        description={
          errorMessage ??
          'The Star Wars API could not be reached. Please check your connection and try again.'
        }
        actionLabel="Try again"
        onAction={retry}
      >
        <span className="text-5xl" aria-hidden="true">
          🌌
        </span>
      </EmptyState>
    )
  }

  if (!isLoading && characters.length === 0) {
    return (
      <EmptyState
        title="No characters found"
        description="Try adjusting your search term or clearing the active filters."
      >
        <span className="text-5xl" aria-hidden="true">
          🔭
        </span>
      </EmptyState>
    )
  }

  if (isLoading) {
    return <SkeletonGrid count={8} />
  }

  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Characters"
    >
      {characters.map((character) => {
        // A character has 0..1 species; use the first for theming.
        const speciesUrl = character.species[0]
        const speciesName = speciesUrl ? speciesMap.get(speciesUrl) : undefined
        return (
          <CharacterCard
            key={character.url}
            character={character}
            speciesName={speciesName}
            onSelect={onSelect}
          />
        )
      })}
    </div>
  )
}
