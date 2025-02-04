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
    {/* Images flottantes - Masquées sur mobile, visibles sur desktop */}
    <motion.div
      className="absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 z-10 rotate-12 hidden md:block"
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
      className="absolute bottom-20 -left-10 w-32 md:w-40 h-32 md:h-40 z-10 -rotate-12 hidden md:block"
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
      className="absolute top-1/3 -right-5 w-20 md:w-24 h-20 md:h-24 z-10 rotate-45 hidden md:block"
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
      className="absolute bottom-1/3 left-1/3 w-16 md:w-20 h-16 md:h-20 z-10 -rotate-90 hidden md:block"
      animate={{
        y: [70, 74, 40],
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

    {/* Points flottants - Réduits sur mobile */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-orange-200 opacity-20"
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
    <section className="relative min-h-[50svh] md:min-h-[80vh] font-outfit overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <FloatingElements />

      <div className="embla overflow-hidden h-[60svh] md:h-[80vh] " ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className={`embla__slide flex-[0_0_100%] min-w-0 relative ${slide.bgColor}`}
            >
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="grid grid-cols-2 gap-2 md:gap-10 items-center pt-8 md:pt-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-left space-y-2 md:space-y-6"
                  >
                    <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xs md:text-lg text-gray-600 max-w-xl lg:mx-0 line-clamp-2 md:line-clamp-none">
                      {slide.description}
                    </p>
                    {/* Bouton desktop */}
                    <div className="hidden md:block">
                      <Button 
                        size="sm"
                        className={`${slide.textColor} bg-[#227313] py-2 hover:bg-green-900 text-white flex-row text-xs md:text-base`}
                        asChild
                      >
                        <Link href="/produits">
                          {slide.cta}
                        </Link>
                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 inline-block" />
                      </Button>
                    
                    </div>
                    {/* Bouton mobile */}
                    <div className="block md:hidden">
                      <Button 
                        size="sm"
                        className={`${slide.textColor} bg-[#227313] w-full py-2 hover:bg-green-900 text-white text-xs`}
                        asChild
                      >
                        <Link href="/produits">
                          {slide.cta}
                        </Link>
                        <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                      </Button>
                    
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative h-32 md:h-[400px] lg:h-[500px]"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicateurs de slide */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                currentSlide === index 
                  ? 'bg-orange-500 w-4 md:w-6' 
                  : 'bg-orange-200'
              }`}
              aria-label={`Aller à la slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
