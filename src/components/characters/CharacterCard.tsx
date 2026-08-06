import { motion } from 'motion/react'
import type { CharacterCardProps } from '@/types'
import { getRandomImage } from '@/utils/getRandomImage'
import { speciesColor } from '@/utils/speciesColor'

/**
 * Responsive character card with a stable Picsum image, a species-colored
 * tint and a hover animation.
 */
export function CharacterCard({
  character,
  speciesName,
  onSelect,
}: CharacterCardProps) {
  const theme = speciesColor(speciesName)

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(character)}
      aria-label={`Open details for ${character.name}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 text-left ${theme.cardBg} backdrop-blur-md transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400`}
      whileHover={{ scale: 1.03, y: -4, rotate: 0.6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)' }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5">
        <img
          src={getRandomImage(character.id)}
          alt={`Portrait of ${character.name}`}
          decoding="async"
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-display text-base font-bold leading-tight text-slate-100">
          {character.name}
        </h3>
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${theme.badge}`}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: theme.glow }}
          />
          {speciesName ?? 'Unknown'}
        </span>
      </div>

      {/* Hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px ${theme.glow}55, 0 0 40px ${theme.glow}33`,
        }}
      />
    </motion.button>
  )
}
