'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Composant pour afficher la section des catégories.
 * Utilise un carousel horizontal avec des cercles colorés.
 */
export function CategorySection() {
  // États pour gérer les données et le chargement
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Configuration du carousel Embla
  const [emblaRef] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    dragFree: true,
    containScroll: 'trimSnaps'
  })

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

  if (loading) return <div className="py-12 text-center">Chargement...</div>

  if (categories.length === 0) {
    return <div className="py-12 text-center">Aucune catégorie disponible</div>
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Titre de la section */}
        <motion.h2 
          className="text-2xl font-bold mb-8 text-center text-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Catégories
        </motion.h2>

        {/* Carousel des catégories */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 justify-center">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/categories/${category.id}`}
                className="flex-[0_0_auto]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-full aspect-square w-28 flex flex-col items-center justify-center p-4 bg-${category.color || 'orange'}-100 transition-transform hover:shadow-lg`}
                >
                  {/* Image de la catégorie */}
                  <div className="relative w-16 h-16 mb-2">
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover rounded-full"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  {/* Nom de la catégorie */}
                  <span className="text-sm font-medium text-gray-800 text-center">
                    {category.name}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
