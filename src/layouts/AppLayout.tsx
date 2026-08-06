import { Outlet, useLocation } from 'react-router'
import { motion } from 'motion/react'
import { Navbar } from '@/components/Navbar'

/**
 * Shared layout for authenticated pages: starfield background, sticky navbar
 * and a subtle page transition keyed on the current path.
 */
export function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen">
      <div className="starfield" aria-hidden="true" />
      <Navbar />
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.div>
    </div>
  )
}
