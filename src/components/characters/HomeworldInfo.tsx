import { usePlanetQuery } from '@/hooks/useCharacters'
import { orUnknown, pluralize } from '@/utils/format'
import type { HomeworldInfoProps } from '@/types'

function SkeletonRow() {
  return <div className="skeleton h-4 w-24 rounded-full" />
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-semibold text-slate-100">
        {value}
      </dd>
    </div>
  )
}

/**
 * Fetches and displays a character's homeworld (name, terrain, climate,
 * resident count). Every field falls back to "Unknown".
 */
export function HomeworldInfo({ homeworldUrl }: HomeworldInfoProps) {
  const { data: planet, isLoading } = usePlanetQuery(homeworldUrl)

  if (isLoading) {
    return (
      <dl className="divide-y divide-white/5">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </dl>
    )
  }

  return (
    <dl className="divide-y divide-white/5">
      <InfoRow label="Name" value={orUnknown(planet?.name)} />
      <InfoRow label="Terrain" value={orUnknown(planet?.terrain)} />
      <InfoRow label="Climate" value={orUnknown(planet?.climate)} />
      <InfoRow
        label="Residents"
        value={
          planet && planet.residents.length > 0
            ? pluralize(planet.residents.length, 'resident')
            : 'Unknown'
        }
      />
    </dl>
  )
}
