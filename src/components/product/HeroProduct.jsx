'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { Button } from '../ui/button'

export function HeroProduct({ product }) {
  return (
    <div className="relative w-full">
      <section className="relative h-[80vh] overflow-hidden bg-gradient-to-r from-[#126803] to-green-700">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0 bg-[url('/dots.png')] opacity-10" />
        
        <div className="container mx-auto h-full relative">
          <div className="grid grid-cols-2 h-full items-center gap-8">
            {/* Contenu texte */}
            <div className="space-y-6 z-10">
              <motion.div
                initial={{ opacity: 0, y: 200 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-6xl font-bold">
                  <span className="text-orange-500 font-handwriting">Méga</span>
                  <br />
                  <span className="text-white">PROMO</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/90 text-lg max-w-md"
              >
                Cette semaine uniquement, profitez de nos offres exceptionnelles
                sur une sélection de produits frais et locaux. Livraison gratuite
                dès 30 000 FCFA d'achat !
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-6"
              >
                <Button 
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  En profiter
                </Button>

                <div className="bg-orange-500/40 rounded-full px-6 py-3 text-white">
                  <span className="text-orange-500 font-bold text-2xl">-50%</span> sur tout
                </div>
              </motion.div>
            </div>

            {/* Image de produits */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-full flex items-center justify-center"
            >
              <div className="relative w-[500px] h-[400px]">
                <Image
                  src="/basket.png"
                  alt="Panier de légumes frais"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Éléments flottants */}
              <motion.div
                className="absolute -top-26 opacity-30 -right-10 w-32 h-32"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/tomato.png"
                  alt=""
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <motion.div
                className="absolute bottom-20  -left-10 w-40 h-40"
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -360, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Image
                  src="/leaf.png"
                  alt=""
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vague décorative */}
      <div className="absolute bottom-0 w-screen left-[50%] translate-x-[-50%] overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[120%] h-[60px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0L48 8.875C96 17.75 192 35.5 288 44.375C384 53.25 480 53.25 576 44.375C672 35.5 768 17.75 864 26.625C960 35.5 1056 71 1152 79.875C1248 88.75 1344 71 1392 62.125L1440 53.25V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  )
}
