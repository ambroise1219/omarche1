'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, delay: 0.2 }
  }
}

export function HeroProduct({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= parseInt(product.stock)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    addToCart(product, quantity)
  }

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="w-full lg:w-1/2">
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="show"
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={product.images[selectedImage]?.image_url || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
              {product.discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-orange-500">
                  -{product.discount}%
                </Badge>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <motion.div 
                variants={contentVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-4 gap-2 mt-4"
              >
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-md overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-orange-500' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 25vw, 10vw"
                    />
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Content Section */}
          <motion.div 
            variants={contentVariants}
            initial="hidden"
            animate="show"
            className="w-full lg:w-1/2 flex flex-col"
          >
            <div className="flex flex-col space-y-4">
              <div>
                <Badge variant="outline" className="mb-2 bg-green-50">
                  {product.category_name}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                <p className="text-gray-600 mt-2 text-lg">{product.description}</p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-orange-600">
                  {product.price} FCFA
                </span>
                {product.old_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.old_price} FCFA
                  </span>
                )}
              </div>

              <div className="space-y-6 py-6 border-y border-gray-200">
                {/* Stock Status */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Disponibilité:</p>
                  <p className={`font-medium ${parseInt(product.stock) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseInt(product.stock) > 0 ? 'En stock' : 'Rupture de stock'}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Quantité:</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="h-10 w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= parseInt(product.stock)}
                        className="h-10 w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.stock} unités disponibles
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2"
                onClick={handleAddToCart}
                disabled={parseInt(product.stock) <= 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Ajouter au panier
              </Button>

              {/* Additional Info */}
              <div className="mt-8 space-y-4 text-sm text-gray-600">
                <p>✓ Produit frais</p>
                <p>✓ Livraison disponible</p>
                <p>✓ Paiement sécurisé</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
