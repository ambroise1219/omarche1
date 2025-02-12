'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'  
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { useCart } from '../../context/CartContext'  
import { ProductImageSlider } from '../product/ProductImageSlider' 
import { HeroProduct } from '../product/HeroProduct' 
import { Truck, ShoppingCart, Star, Clock, Shield, ChevronRight, QrCode, Phone, Gift, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Button
            onClick={() => window.history.back()}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Retourner aux produits
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <HeroProduct images={product?.images || []} />

      {/* Contenu principal */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[380px_1fr_1fr] gap-8">
            {/* Bannière promotionnelle verticale */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block space-y-6 rounded-xl bg-gradient-to-b from-orange-50 to-orange-100/80 p-6"
            >
             <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-6">Téléchargez notre application</h3>
                <p className="text-gray-600 mb-8">
                  Profitez d&apos;une expérience d&apos;achat optimale avec notre application mobile.
                  Disponible sur iOS et Android.
                </p>
                <div className="gap-4 items-center justify-center">
                  <Link href="#">
                    <Image
                      src="/appstore.png"
                      alt="Télécharger sur l'App Store"
                      width={200}
                      height={60}
                      className="h-[60px] w-auto hover:scale-105 transition-transform duration-300 mb-4"
                    />
                  </Link>
                  <Link href="#">
                    <Image
                      src="/playstore.png"
                      alt="Télécharger sur le Play Store"
                      width={200}
                      height={60}
                      className="h-[60px] w-auto hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>

              {/* Section Promotions */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-orange-700">Offres Spéciales</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <Gift className="w-8 h-8 mb-2 text-orange-500" />
                    <h4 className="font-semibold text-gray-800">-10% sur votre 1ère commande</h4>
                    <p className="text-sm text-orange-600">Code: BIENVENUE</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <Download className="w-8 h-8 mb-2 text-orange-500" />
                    <h4 className="font-semibold text-gray-800">Livraison gratuite</h4>
                    <p className="text-sm text-orange-600">Dès 10 000 FCFA</p>
                  </div>
                </div>
              </div>

              {/* Badge Confiance */}
              <div className="pt-4">
                <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                  <div className="font-semibold text-gray-800 mb-1">100% Sécurisé</div>
                  <p className="text-sm text-orange-600">Paiement & livraison sécurisés</p>
                </div>
              </div>
            </motion.div>

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
          <div className="max-w-4xl mx-auto space-y-16">
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

            {/* Nouvelle bannière promotionnelle horizontale */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              

              {/* Promo */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500/90 to-green-400/90 p-6 text-white">
                <div className="relative z-10">
                  <Gift className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2">-10% sur votre 1ère commande</h3>
                  <p className="text-sm text-white/80 mb-4">Pour toute nouvelle inscription</p>
                  <div className="inline-block bg-white/20 rounded-lg px-4 py-2">
                    <span className="font-mono text-lg">BIENVENUE</span>
                  </div>
                </div>
                <Image
                  src="/promo-bg.png"
                  alt="Promo"
                  width={150}
                  height={150}
                  className="absolute -right-10 -bottom-10 opacity-30"
                />
              </div>

              {/* Livraison */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/90 to-orange-400/90 p-6 text-white">
                <div className="relative z-10">
                  <Truck className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Livraison gratuite</h3>
                  <p className="text-white/80 mb-4">
                    Pour toute commande supérieure à 10 000 FCFA
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Livraison express sécurisée</span>
                  </div>
                </div>
                <Image
                  src="/delivery-bg.png"
                  alt="Livraison"
                  width={180}
                  height={180}
                  className="absolute -right-10 -bottom-10 opacity-30 rotate-12"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}