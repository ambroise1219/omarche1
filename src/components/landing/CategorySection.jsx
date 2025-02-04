'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { fetchCategories } from '@/utils/api'

/**
 * Composant pour afficher la section des catégories.
 * Utilise un carousel horizontal avec des cercles colorés.
 */
export function CategorySection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef(null)

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        if (isMounted) {
          setCategories(data.slice(0, 8)) // On prend les 8 premières catégories
        }
      } catch (error) {
        console.error('Erreur:', error)
        toast.error("Impossible de charger les catégories")
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <section className=" bg-white">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-4 pb-4 px-2 scrollbar-hide">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-none w-20">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-3 w-14 mt-2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="lg:text-3xl font-bold mb-4 text-xl">Nos Catégories</h2>
          <p className="text-gray-600 max-w-2xl lg:text-md text-sm mx-auto">
            Découvrez notre sélection de produits frais et locaux
          </p>
        </div>

        <div className="relative">
          {/* Boutons de navigation (visibles uniquement sur desktop) */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg hidden md:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg hidden md:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Container avec scroll horizontal sur mobile */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 px-2 md:gap-6 md:px-0 md:flex-wrap md:justify-center scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-none w-20 md:w-28 md:flex-initial"
              >
                <Link href={`/categories/${category.id}`}>
                  <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105 relative">
                      <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-colors" />
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        className="object-cover p-0.5"
                      />
                    </div>
                    <h3 className="mt-2 md:mt-3 text-xs md:text-sm font-medium text-center text-gray-700 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/categories">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm bg-orange-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
            >
              Voir toutes les catégories
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}
