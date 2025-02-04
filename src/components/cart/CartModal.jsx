'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'  
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

export function CartModal() {
  const router = useRouter()
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    isCartOpen,
    setIsCartOpen
  } = useCart()

  const handleCheckout = () => {
    setIsCartOpen(false)
    router.push('/commande')
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingBag className="h-6 w-6 text-white hover:text-orange-500" />
          {getCartCount() > 0 && (
            <Badge
              className="absolute -top-2 -right-2 bg-orange-500 p-2 text-white"
              variant="secondary"
            >
              {getCartCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Votre Panier</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col mt-8">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">Votre panier est vide</p>
              <Button
                className="mt-4"
                onClick={() => setIsCartOpen(false)}
              >
                Continuer mes achats
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-4 py-4"
                  >
                    <Link
                      href={`/produits/${item.id}`}
                      className="relative aspect-square w-24 overflow-hidden rounded-lg"
                      onClick={() => setIsCartOpen(false)}
                    >
                      <Image
                        src={item.images?.[0]?.image_url || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <Link
                          href={`/produits/${item.id}`}
                          className="font-medium hover:text-orange-500 transition-colors"
                          onClick={() => setIsCartOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="font-medium text-orange-600">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Section du total et bouton de commande */}
              <div className="sticky bottom-0 bg-white pt-4 pb-6 mt-auto">
                <Separator className="mb-4" />
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-orange-600">
                    {getCartTotal().toLocaleString()} FCFA
                  </span>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Commander maintenant
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
