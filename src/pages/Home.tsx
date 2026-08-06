import { useState } from 'react'
import type { Character } from '@/types'
import { useCharacterFilters } from '@/hooks/useCharacterFilters'
import { useCharacterList } from '@/hooks/useCharacters'
import { SearchBar } from '@/components/characters/SearchBar'
import { Filters } from '@/components/characters/Filters'
import { CharacterGrid } from '@/components/characters/CharacterGrid'
import { CharacterModal } from '@/components/characters/CharacterModal'
import { Pagination } from '@/components/Pagination'

export default function Home() {
  const { page, totalPages, total, hasNext, hasPrevious, isFetching, isError } =
    useCharacterList()
  const { setPage } = useCharacterFilters()
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  )

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          Meet the <span className="text-indigo-400">Galaxy</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
          Browse every character in the Star Wars universe — search by name,
          filter by species, homeworld or film, and open a card for full
          details.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Filters />
        <SearchBar />
      </div>

      <div className="mb-8">
        <CharacterGrid onSelect={setSelectedCharacter} />
      </div>

      {!isError && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={total}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          isLoading={isFetching}
          onPageChange={handlePageChange}
        />
      )}

      <CharacterModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </main>
  )
}
