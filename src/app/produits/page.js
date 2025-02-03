'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, ShoppingCart, X } from 'lucide-react'
import { Navigation } from '../../components/landing/Navigation'
import { Footer } from '../../components/landing/Footer'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../../components/ui/sheet"
import { Slider } from "../../components/ui/slider"
import { useCart } from '../../context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 }
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { addToCart } = useCart()

  // Charger les produits au montage du composant
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category_name)
    return matchesSearch && matchesPrice && matchesCategory
  })

  // Gestionnaire d'ajout au panier avec retour haptique sur mobile
  const handleAddToCart = (product) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50) // Vibration subtile sur mobile
    }
    addToCart(product, 1)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[30vh] md:h-[40vh] bg-gradient-to-r from-[#126803] to-green-700 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/dots.png')] opacity-10" />
          <motion.div 
            className="container mx-auto px-4 h-full flex items-center justify-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
                Découvrez Notre <span className="text-orange-500">Collection</span>
              </h1>
              <p className="text-sm md:text-lg text-white/90 px-4">
                Des produits frais et de qualité, sélectionnés avec soin pour vous
              </p>
            </div>
          </motion.div>

          {/* Éléments décoratifs */}
          <motion.div
            className="absolute -top-10 -right-10 w-24 md:w-40 h-24 md:h-40 opacity-30"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Image
              src="/fruit1.webp"
              alt="Décoration"
              width={160}
              height={160}
              className="w-full h-full object-contain"
            />
          </motion.div>
        </section>

        {/* Barre de recherche et filtres */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                {showMobileSearch ? (
                  <motion.div 
                    key="search"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex-grow flex items-center gap-2"
                  >
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Rechercher un produit..."
                        className="pl-10 pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setShowMobileSearch(false)}
                      className="md:hidden p-2 text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 w-full"
                  >
                    <button
                      onClick={() => setShowMobileSearch(true)}
                      className="md:hidden p-2 text-gray-500"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                    <div className="hidden md:flex relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Rechercher un produit..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Filter className="h-4 w-4" />
                          <span className="hidden md:inline">Filtres</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full sm:max-w-lg">
                        <SheetHeader>
                          <SheetTitle>Filtres</SheetTitle>
                        </SheetHeader>
                        <div className="py-6 space-y-6">
                          <div className="space-y-4">
                            <h3 className="font-medium">Prix</h3>
                            <Slider
                              defaultValue={[0, 10000]}
                              max={10000}
                              step={100}
                              value={priceRange}
                              onValueChange={setPriceRange}
                              className="mt-2"
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                              <span>{priceRange[0]} FCFA</span>
                              <span>{priceRange[1]} FCFA</span>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="font-medium">Catégories</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {['Fruits', 'Légumes', 'Viandes', 'Poissons', 'Épices'].map((category) => (
                                <label key={category} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCategories([...selectedCategories, category])
                                      } else {
                                        setSelectedCategories(selectedCategories.filter(c => c !== category))
                                      }
                                    }}
                                    className="rounded border-gray-300"
                                  />
                                  {category}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                          <SheetClose asChild>
                            <Button className="w-full">Appliquer les filtres</Button>
                          </SheetClose>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Grille de produits */}
        <div className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500" />
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={fadeInUp}
                  layout
                  className="touch-manipulation"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
                    <Link href={`/produits/${product.id}`} className="block relative pt-[100%]">
                      <Image
                        src={product.images?.[0]?.image_url || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      {product.discount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-orange-500">
                          -{product.discount}%
                        </Badge>
                      )}
                    </Link>
                    <div className="p-3 md:p-4 flex-grow flex flex-col">
                      <Link href={`/produits/${product.id}`}>
                        <h3 className="font-semibold mb-1 md:mb-2 group-hover:text-orange-500 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2 flex-grow">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-orange-600 text-sm md:text-base">
                          {product.price} FCFA
                        </span>
                        <Badge variant="outline" className="bg-green-50 text-xs">
                          {product.category_name}
                        </Badge>
                      </div>
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2 text-sm md:text-base py-1.5 md:py-2"
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(product)
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden md:inline">Ajouter au panier</span>
                        <span className="md:hidden">Ajouter</span>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
