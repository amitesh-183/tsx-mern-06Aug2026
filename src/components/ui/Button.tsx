import { motion } from 'motion/react'
import type { ButtonProps, Variant } from '@/types'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-purple-400',
  ghost: 'bg-white/5 text-slate-200 hover:bg-white/10',
  outline:
    'border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/25',
  danger: 'bg-rose-500/90 text-white hover:bg-rose-500',
}

const disabledClasses =
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-indigo-500 disabled:hover:to-purple-500'

export function Button({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  disabled = false,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
