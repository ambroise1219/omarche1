'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Search, Filter, Star, ShoppingCart } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { Separator } from '../ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../ui/sheet"
import Link from 'next/link'
import { useCart } from '../../context/CartContext'
import { fetchProducts, fetchCategories } from '@/utils/api'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function ProductSection() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 10000],
    sort: 'popular'
  })

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ])

        if (isMounted) {
          setProducts(productsData)
          setCategories([
            { id: 'all', name: 'Toutes les catégories' },
            ...categoriesData
          ])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.category === 'all' || product.category_id === filters.category) &&
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1]
    )
    .sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return b.popularity - a.popularity
      }
    })
    .slice(0, 8) // Limite à 8 produits pour la page d'accueil

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    addToCart(product, 1)
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Catégories</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={filters.category === category.id ? "secondary" : "ghost"}
              className="w-full justify-start text-sm"
              onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Prix</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            step={100}
            value={filters.priceRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{filters.priceRange[0]} FCFA</span>
            <span>{filters.priceRange[1]} FCFA</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Trier par</h3>
        <Select 
          value={filters.sort}
          onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Popularité</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
            <SelectItem value="name">Nom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500" />
      </div>
    )
  }

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Nos Produits</h2>
            <p className="text-gray-600 mt-2">Découvrez notre sélection de produits frais</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <FilterSidebar />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                <SheetClose asChild>
                  <Button className="w-full">Appliquer les filtres</Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <Select
                value={filters.sort}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popularité</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
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
                        onClick={(e) => handleAddToCart(e, product)}
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

            <div className="mt-8 text-center">
              <Link href="/produits">
                <Button variant="outline" size="lg">
                  Voir tous les produits
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
