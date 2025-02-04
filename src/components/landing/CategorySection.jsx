'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

/**
 * Composant pour afficher la section des catégories.
 * Utilise un carousel horizontal avec des cercles colorés.
 */
export function CategorySection() {
  // États pour gérer les données et le chargement
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Chargement des catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        // S'assurer que data est un tableau
        setCategories(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const scrollContainerRef = useRef(null)

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (loading) return <div className="py-12 text-center">Chargement...</div>

  if (categories.length === 0) {
    return <div className="py-12 text-center">Aucune catégorie disponible</div>
  }

  return (
    <section className="py-16 justify-center bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos Catégories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits frais et locaux, 
            soigneusement classés par catégories pour faciliter vos achats.
          </p>
        </motion.div>

        <div className="relative">
          {/* Boutons de navigation */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg hidden md:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg hidden md:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Container des catégories */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto itemms-center justify-centersnap-x snap-mandatory pb-6 px-4 md:px-0 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="flex-none w-[120px]"
              >
                <Link href={`/categories/${category.id}`}>
                  <div className="flex flex-col items-center group">
                    <div className="w-28 h-28 rounded-full bg-orange-100 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105 relative">
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        className="object-contain rounded-full p-1"
                        sizes="120px"
                      />
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-center text-gray-700 group-hover:text-orange-500 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
