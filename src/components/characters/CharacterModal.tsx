import type { CharacterModalProps } from '@/types'
import { Modal } from '@/components/modal/Modal'
import { HomeworldInfo } from './HomeworldInfo'
import { useLookups } from '@/hooks/useCharacters'
import { speciesColor } from '@/utils/speciesColor'
import {
  formatDate,
  formatHeight,
  formatMass,
  orUnknown,
  pluralize,
} from '@/utils/format'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-semibold text-slate-100">
        {value}
      </dd>
    </div>
  )
}

/**
 * Character details modal. Shows height (m), mass (kg), birth year, created
 * date (dd-MM-yyyy), film count, and homeworld information.
 */
export function CharacterModal({ character, onClose }: CharacterModalProps) {
  const { speciesMap } = useLookups()

  const speciesUrl = character?.species[0]
  const speciesName = speciesUrl ? speciesMap.get(speciesUrl) : undefined
  const theme = speciesColor(speciesName)

  return (
    <Modal
      isOpen={character !== null}
      onClose={onClose}
      labelledBy="character-modal-title"
    >
      {character ? (
        <article>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-widest ${theme.text}`}
              >
                {speciesName ?? 'Unknown'} · {orUnknown(character.gender)}
              </p>
              <h2
                id="character-modal-title"
                className="mt-1 font-display text-2xl font-bold text-slate-100"
              >
                {character.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close character details"
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-400"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Details
          </h3>
          <dl className="rounded-2xl border border-white/5 bg-white/5 px-4">
            <DetailRow label="Height" value={formatHeight(character.height)} />
            <DetailRow label="Mass" value={formatMass(character.mass)} />
            <DetailRow
              label="Birth year"
              value={orUnknown(character.birthYear)}
            />
            <DetailRow label="Created" value={formatDate(character.created)} />
            <DetailRow
              label="Films"
              value={pluralize(character.films.length, 'film')}
            />
          </dl>

          <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Homeworld
          </h3>
          <div className="rounded-2xl border border-white/5 bg-white/5 px-4">
            <HomeworldInfo homeworldUrl={character.homeworld} />
          </div>
        </article>
      ) : null}
    </Modal>
  )
}
