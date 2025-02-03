'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { CartModal } from '../cart/CartModal'
import { Menu, X, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { cartItems = [] } = useCart() || {}
  const { user, logout } = useAuth() || {}
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    if (logout) {
      logout()
    }
  }

  const menuItems = [
    { href: '/produits', label: 'Produits' },
    { href: '/categories', label: 'Catégories' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 bg-gradient-to-r from-custom-green/95 to-custom-green/90 backdrop-blur-sm shadow-lg ${
        isScrolled 
          ? 'py-2' 
          : 'py-4'
      }`}
    >
      <div className="container items-center mx-auto px-4">
        <div className="flex items-center  justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <div className="flex items-center gap-3">
              <div className=" ">
                <Image
                  src="/logo.webp"
                  alt="Omarche Logo"
        
                  className="object-contain p-1"
                  width={200}  
                  height={200}
                />
              </div>
              
            </div>
          </Link>

          {/* Barre de recherche - Desktop */}
          <div className="hidden md:block relative max-w-md w-full mx-8">
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative group text-white/90 hover:text-white transition-colors"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <CartModal />
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    className="border-2 border-white bg-transparent text-white hover:bg-orange-500 hover:border-orange-500 transition-colors"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button 
                      variant="outline" 
                      className="border-2 border-white bg-transparent text-white hover:bg-orange-500 hover:border-orange-500 transition-colors"
                    >
                      Se connecter
                    </Button>
                  </Link>

                  <Link href="/auth?mode=register">
                    <Button 
                      className="bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                    >
                      S&apos;inscrire
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Menu mobile overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-green-700 shadow-lg rounded-b-xl md:hidden"
            >
              <div className="p-4">
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
                />
                <Search className="absolute left-7 top-[1.75rem] h-4 w-4 text-white/60" />
              </div>

              <nav className="flex flex-col">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-6 py-3 text-white/90 hover:bg-green-600 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="px-6 py-4 border-t border-white/10">
                  <CartModal />
                  <div className="flex flex-col gap-3 mt-4">
                    {user ? (
                      <Button 
                        variant="outline"
                        className="w-full border-2 border-white bg-transparent text-white hover:bg-orange-500 hover:border-orange-500 transition-colors"
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                      >
                        Déconnexion
                      </Button>
                    ) : (
                      <>
                        <Link href="/auth">
                          <Button 
                            variant="outline"
                            className="w-full border-2 border-white bg-transparent text-white hover:bg-orange-500 hover:border-orange-500 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            Se connecter
                          </Button>
                        </Link>
                        <Link href="/auth?mode=register">
                          <Button 
                            className="w-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            S&apos;inscrire
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
