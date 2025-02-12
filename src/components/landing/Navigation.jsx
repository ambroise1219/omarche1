'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { CartModal } from '../cart/CartModal'
import { Input } from '../ui/input'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartItems = [] } = useCart() || {}
  const { user, logout } = useAuth() || {}

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
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="">
                <Image
                  src="/logo.webp"
                  alt="Omarche Logo"
                  width={200}
                  height={60} // Définir une hauteur fixe
                  className="object-contain w-auto h-auto" // Maintenir le ratio
                  priority // Charger en priorité car c'est le LCP
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-10 h-10 cursor-pointer">
                      <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.username}`} />
                      <AvatarFallback className="bg-orange-500/10">
                        {user.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1 bg-amber-400 py-2 rounded-lg">
                        <p className="text-sm font-medium leading-none text-center text-slate-700">{user.username}</p>
                        
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem >
                      <Link href={`/profile`} className='flex flex-row items-center justify-center '>
                      <User className="mr-2 h-4 w-4 " />
                      <span>Mon Profil</span>
                      </Link>
                     
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600" 
                      onClick={async () => {
                        await logout()
                        router.push('/auth')
                        toast.success('Déconnexion réussie')
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth">
                  <Button>Se connecter</Button>
                </Link>
              )}
            </div>

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10  "
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
              className="absolute top-full left-0 right-0 bg-custom-green shadow-lg md:hidden"
            >
              {/* Barre de recherche mobile */}
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                </div>
              </div>

              {/* Menu items */}
              <nav className="flex flex-col">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-6 py-4 text-white/90 hover:bg-orange-500 hover:text-white active:bg-green-800 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-base">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Panier et actions utilisateur */}
              <div className="px-6 py-4 border-t border-white/10">
                <div className="mb-4">
                  <CartModal />
                </div>

                {/* Actions utilisateur */}
                {user ? (
                  <div className="space-y-4">
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors">
                        <Avatar className="h-10 w-10 hover:cursor-pointer">
                          <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.username}`} />
                          <AvatarFallback className="bg-orange-500/10">
                            {user.username?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">{user.username}</p>
                         
                        </div>
                      </div>
                    </Link>
                    <Button 
                      variant="outline"
                      className="w-full border-2 border-white bg-transparent text-white hover:bg-orange-500 hover:border-orange-500 active:bg-orange-600 transition-colors"
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth" className="block">
                      <Button 
                        variant="outline"
                        className="w-full border-2 border-white bg-transparent text-white hover:bg-orange-500 hover:border-orange-500 active:bg-orange-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/auth?mode=register" className="block">
                      <Button 
                        className="w-full bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        S&apos;inscrire
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
