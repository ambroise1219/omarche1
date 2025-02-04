'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'  
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { useCart } from '../../context/CartContext'  
import { ProductImageSlider } from './ProductImageSlider'
import { HeroProduct } from  './HeroProduct'
import { Truck, ShoppingCart, Star, Clock, Shield, ChevronRight } from 'lucide-react'

export default function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  return (
    <div className="w-full">
      {/* Hero Carousel */}
      <HeroProduct images={product?.images || []} />

      {/* Contenu principal */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images du produit */}
            <div>
              <ProductImageSlider images={product?.images || []} />
            </div>

            {/* Informations produit */}
            <div className="space-y-8">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < (product?.rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      ({product?.reviews || 0} avis)
                    </span>
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {product?.name}
                    </h1>
                    <Badge variant="outline" className="text-orange-500 border-orange-500">
                      {product?.category_name}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-4xl font-bold text-orange-600">
                      {product?.price?.toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Stock disponible : {product?.stock} unités
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-center bg-gray-50 rounded-lg p-2 w-32">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-orange-500 hover:bg-transparent"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-medium text-lg">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-orange-500 hover:bg-transparent"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>

                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Ajouter au panier
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 space-y-3 hover:shadow-lg transition-shadow">
                  <Truck className="h-8 w-8 text-orange-500" />
                  <h3 className="font-semibold text-lg">Livraison rapide</h3>
                  <p className="text-sm text-gray-600">
                    Livraison en 24-48h partout dans la ville
                  </p>
                </Card>
                <Card className="p-6 space-y-3 hover:shadow-lg transition-shadow">
                  <Shield className="h-8 w-8 text-orange-500" />
                  <h3 className="font-semibold text-lg">Garantie qualité</h3>
                  <p className="text-sm text-gray-600">
                    Produits frais garantis à la livraison
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informations supplémentaires */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Informations détaillées
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-orange-500" />
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product?.description}
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Livraison
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span>Livraison express disponible</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span>Suivi en temps réel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span>Emballage sécurisé</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}