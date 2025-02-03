'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight, Heart } from 'lucide-react'

export default function HeroCategory({ category }) {
  if (!category) return null

  return (
    <div className="relative w-full min-h-[70vh] bg-gradient-to-br from-custom-green to-custom-green/80">
      <div className="absolute inset-0">
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Image de la catégorie */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-1/2 aspect-square relative rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4">
              <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </motion.div>

          {/* Informations de la catégorie */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-orange-500">
                <ChevronRight className="w-5 h-5" />
                <span className="text-sm font-medium">Catégorie</span>
              </div>

              <h1 className="font-paytone text-4xl md:text-6xl text-white">
                {category.name}
              </h1>

              <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed">
                {category.description}
              </p>

              <div className="pt-6">
                <div className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-medium">
                  {category.products?.length || 0} produits disponibles
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
