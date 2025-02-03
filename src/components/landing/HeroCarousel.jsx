'use client'

import React, { useEffect, useCallback, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Composants pour les éléments décoratifs
const FloatingElements = () => (
  <>
    {/* Images flottantes */}
    <motion.div
      className="absolute -top-10 -right-10 w-32 h-32 z-10 rotate-12"
      animate={{
        y: [0, -20, 0],
        rotate: [12, -12, 12],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Image
        src="/tomato.png"
        alt=""
        width={128}
        height={128}
        className="w-full h-full object-contain opacity-30"
      />
    </motion.div>

    <motion.div
      className="absolute bottom-20 -left-10 w-40 h-40 z-10 -rotate-12"
      animate={{
        y: [0, 20, 0],
        rotate: [-12, 12, -12],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 8,
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
        className="w-full h-full object-contain opacity-30"
      />
    </motion.div>

    <motion.div
      className="absolute top-1/3 -right-5 w-24 h-24 z-10 rotate-45"
      animate={{
        x: [0, 20, 0],
        rotate: [45, -45, 45],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
    >
      <Image
        src="/leaf.png"
        alt=""
        width={96}
        height={96}
        className="w-full h-full object-contain opacity-20"
      />
    </motion.div>

    <motion.div
      className="absolute bottom-1/3 left-1/3 w-20 h-20 z-10 -rotate-90"
      animate={{
        y: [70,  74, 40],
        rotate: [-90, 0, -90],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 3
      }}
    >
      <Image
        src="/tomato.png"
        alt=""
        width={180}
        height={80}
        className="w-full h-full object-contain opacity-20"
      />
    </motion.div>

    {/* Points flottants */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-orange-200 opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  </>
)

const slides = [
  {
    id: 1,
    title: "Vos produits frais livrés en un clic",
    description: "Découvrez une nouvelle façon de faire vos courses. Produits locaux, frais et de qualité.",
    image: "/panier.png",
    cta: "Commander maintenant",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    textColor: "text-orange-600"
  },
  {
    id: 2,
    title: "Des produits locaux de qualité",
    description: "Soutenez les producteurs locaux tout en profitant de produits frais et de qualité.",
    image: "/local.png",
    cta: "Découvrir nos produits",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    textColor: "text-green-600"
  },
  {
    id: 3,
    title: "Livraison rapide et sécurisée",
    description: "Vos produits livrés en toute sécurité dans les meilleurs délais.",
    image: "/delivery.png",
    cta: "En savoir plus",
    bgColor: "bg-gradient-to-br from-orange-50 to-green-50",
    textColor: "text-orange-600"
  }
]

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 })
  const [currentSlide, setCurrentSlide] = useState(0)

  const autoplay = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  useEffect(() => {
    const timer = setInterval(autoplay, 5000)
    return () => clearInterval(timer)
  }, [autoplay])

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentSlide(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  return (
    <section className="relative min-h-screen font-outfit overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <FloatingElements />

      <div className="embla overflow-hidden h-screen" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className={`embla__slide flex-[0_0_100%] min-w-0 relative ${slide.bgColor}`}
            >
              <div className="container mx-auto px-4 h-screen flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 relative z-20"
                  >
                    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${slide.textColor}`}>
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                      {slide.description}
                    </p>
                    <div className="pt-4">
                      <Link href="/products">
                        <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700 group">
                          {slide.cta}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative hidden lg:block z-20"
                  >
                    <div className="relative">
                      <div className={`absolute -inset-4 ${slide.bgColor} rounded-full blur-3xl opacity-50`} />
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        width={600}
                        height={600}
                        className="object-contain relative z-10"
                        priority
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateurs de slide */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index 
                ? 'bg-orange-600' 
                : 'bg-orange-200 hover:bg-orange-300'
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
