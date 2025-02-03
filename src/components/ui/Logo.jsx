'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Logo({ className = '' }) {
  return (
    <Link href="/" className={`relative ${className}`}>
      <motion.div 
        className="flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.div
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-custom-green font-paytone text-2xl leading-none">O</span>
          </motion.div>
        </div>
        <div className="flex items-baseline">
          <motion.span 
            className="text-2xl font-paytone text-white tracking-tight"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            marché
          </motion.span>
          <span className="text-white text-2xl font-paytone -ml-0.5">&apos;</span>
        </div>
      </motion.div>
    </Link>
  )
}
