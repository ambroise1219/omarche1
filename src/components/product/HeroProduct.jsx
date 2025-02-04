'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useCart } from '@/context/CartContext'

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

  // Si pas de produit, afficher la bannière promotionnelle
  if (!product) {
    return (
      <section className="relative bg-gradient-to-r from-[#126803] pt-28 to-green-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/dots.png')] opacity-10" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[40vh]">
            {/* Texte promotionnel */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white space-y-4"
            >
              <h1 className="text-3xl md:text-5xl font-bold">
                Offres Spéciales <span className="text-orange-500">du Jour</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Découvrez notre sélection de produits frais à des prix imbattables.
                Profitez de réductions exceptionnelles sur nos fruits et légumes de saison !
              </p>
              <div className="flex gap-4">
                <Badge className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 text-lg">
                  -20%
                </Badge>
                <Badge className="bg-white text-green-700 px-4 py-2 text-lg">
                  Offre Limitée
                </Badge>
              </div>
            </motion.div>

            {/* Image du panier */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[300px] md:h-[400px]"
            >
              <Image
                src="/basket.png"
                alt="Panier de fruits frais"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  // Si un produit est fourni, afficher les détails du produit
  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="w-full lg:w-1/2">
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                show: { 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.5 }
                }
              }}
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
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.5, delay: 0.2 }
                  }
                }}
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
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, delay: 0.2 }
              }
            }}
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