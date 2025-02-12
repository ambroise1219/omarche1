'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { Button } from '../ui/button'
import { toast } from 'sonner'

export default function CategoryProductCard({ product }) {
  const { addToCart } = useCart()

  if (!product) return null

  // Vérifier et nettoyer les images et le prix
  const imageUrl = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images[0].image_url
    : '/placeholder.png';

  const formattedPrice = product.price 
    ? product.price.toLocaleString()
    : 'Prix non disponible';

  const handleAddToCart = (e) => {
    e.preventDefault() // Empêcher la navigation
    addToCart(product, 1)
    toast.success('Produit ajouté au panier')
  }

  // Vérifier l'ID avant de l'utiliser
  const productId = typeof product?.id === 'string' ? product.id : String(product?.id || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
    >
      <Link href={`/produits/${productId}`}> {/* Forcer la conversion en string */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              onClick={(e) => {
                e.preventDefault()
                toast.info('Fonctionnalité à venir')
              }}
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-xl mb-2 text-gray-800">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description || 'Aucune description disponible'}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-600 font-bold text-xl">
                {formattedPrice} {product.price ? 'FCFA' : ''}
              </p>
              <p className="text-sm text-gray-500">
                Stock: {product.stock || 0}
              </p>
            </div>
            <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
              Voir détails
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
