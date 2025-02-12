'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow py-40  flex items-center justify-center p-4 bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <motion.div 
            className="grid lg:grid-cols-2 gap-8 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Contenu texte */}
            <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-7xl font-bold">
                  <span className="text-gray-900">Oops!</span>
                  <span className="text-orange-500 block mt-2">Page introuvable</span>
                </h1>
                
                <p className="text-gray-600 text-lg md:text-xl">
                  La page que vous recherchez semble avoir été déplacée,<br className="hidden md:inline"/>
                  supprimée ou n&apos;existe pas.
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  variant="default" 
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Link href="/" className="flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    Revenir  à l&apos;accueil
                  </Link>
                </Button>
                
                
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.3, 
                type: "spring",
                stiffness: 100
              }}
              className="relative h-[400px] w-full order-1 lg:order-2"
            >
              <Image
                src="/404-illustration.svg"
                alt="Page 404"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
