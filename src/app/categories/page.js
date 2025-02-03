'use client'

import { motion } from 'framer-motion'
import { Navigation } from '../../components/landing/Navigation'  
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    id: 1,
    name: 'Fruits',
    image: '/categories/fruits.jpg',
    productCount: 24
  },
  {
    id: 2,
    name: 'Légumes',
    image: '/categories/legumes.jpg',
    productCount: 32
  },
  {
    id: 3,
    name: 'Viandes',
    image: '/categories/viandes.jpg',
    productCount: 18
  },
  {
    id: 4,
    name: 'Poissons',
    image: '/categories/poissons.jpg',
    productCount: 15
  },
  {
    id: 5,
    name: 'Produits Laitiers',
    image: '/categories/laitiers.jpg',
    productCount: 28
  },
  {
    id: 6,
    name: 'Boissons',
    image: '/categories/boissons.jpg',
    productCount: 20
  }
]

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

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-green to-custom-green/90">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-paytone text-4xl md:text-5xl text-white mb-4">
            Nos Catégories
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Découvrez notre sélection de produits frais et locaux, soigneusement classés par catégories pour faciliter votre shopping
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="group relative"
            >
              <Link href={`/categories/${category.id}`}>
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10" />
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                    <h2 className="font-paytone text-2xl text-white">
                      {category.name}
                    </h2>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4 self-start">
                      <span className="text-white">
                        {category.productCount} produits
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
