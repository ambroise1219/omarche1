'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Search, Filter, Star } from 'lucide-react'
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
} from "../ui/sheet"
import Link from 'next/link'

/**
 * Composant pour afficher la section des produits.
 */
export function ProductSection() {
  // États pour gérer les données et le chargement
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // État pour gérer les filtres
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 10000], // Prix en FCFA
    sort: 'popular'
  })

  /**
   * Chargement des données depuis l'API.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chargement parallèle des produits et catégories
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ])
        
        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json()
        ])

        setProducts(productsData)
        // Ajout de l'option "Toutes les catégories" en première position
        setCategories([
          { id: 'all', name: 'Toutes les catégories' },
          ...categoriesData.map(cat => ({
            id: cat.id.toString(),
            name: cat.name
          }))
        ])
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  /**
   * Filtrage et tri des produits.
   */
  const filteredProducts = products
    .filter(product => 
      // Filtre par nom
      product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      // Filtre par catégorie
      (filters.category === 'all' || product.category_id.toString() === filters.category) &&
      // Filtre par prix
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1]
    )
    .sort((a, b) => {
      // Tri des produits
      switch (filters.sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default: // 'popular'
          return b.popularity - a.popularity
      }
    })

  /**
   * Formatage des prix en FCFA.
   * @param {number} price Prix à formater
   * @returns {string} Prix formaté
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  /**
   * Composant pour la barre latérale des filtres.
   */
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Filtres par catégorie */}
      <div>
        <h3 className="font-medium mb-4">Catégories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={filters.category === category.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Filtre par prix */}
      <div>
        <h3 className="font-medium mb-4">Prix</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 100000]}
            max={100000}
            step={1000}
            value={filters.priceRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Options de tri */}
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

  if (loading) return <div className="py-16 text-center">Chargement...</div>

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* En-tête avec titre et bouton filtres mobile */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Nos Produits</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <div className="mt-8">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtres - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Liste des produits */}
          <div className="flex-1">
            {/* Barre de recherche */}
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Rechercher un produit..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="max-w-md"
              />
            </div>

            {/* Grille des produits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link href={`/produits/${product.id}`} key={product.id}>
                  <Card className="overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
                    <div className="relative aspect-square">
                      <Image
                        src={product.images[0]?.image_url || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                      {product.discount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-orange-500 text-white">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg group-hover:text-orange-500 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-orange-600">
                          {formatPrice(product.price)}
                        </p>
                        {product.old_price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.old_price)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < product.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
