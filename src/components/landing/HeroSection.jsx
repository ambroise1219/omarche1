import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="pt-32 pb-16">
      <motion.div 
        className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-green-600 text-transparent bg-clip-text">
              Des produits frais et locaux, livrés chez vous
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Commandez vos produits agricoles et vivriers en quelques clics, 
            suivez votre livraison en temps réel et payez à la réception !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Télécharger l&apos;App
              <ArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Commander maintenant
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <motion.div 
            className="relative w-full aspect-square"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image
              src="/images/hero-basket.png"
              alt="Panier de produits frais"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
