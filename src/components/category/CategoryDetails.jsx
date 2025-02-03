'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
}

export default function CategoryDetails({ category }) {
  if (!category) return null

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de la catégorie */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-72 rounded-2xl overflow-hidden mb-12 shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16">
            <h1 className="font-paytone text-4xl md:text-6xl text-white mb-6">
              {category.name}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl font-light">
              {category.description}
            </p>
          </div>
        </motion.div>

        {/* Grille des produits */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {category.products?.map((product) => (
            <Link href={`/produits/${product.id}`} key={product.id}>
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={product.images[0]?.image_url || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <ShoppingCart className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2 text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-orange-600 font-bold text-xl">
                        {product.price.toLocaleString()} FCFA
                      </p>
                      <p className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </p>
                    </div>
                    <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                      Voir détails
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  )
}