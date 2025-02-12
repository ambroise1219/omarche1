'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'  
import Image from 'next/image'
import { MapPin, Phone, CreditCard, Truck } from 'lucide-react'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function CommandePage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '', // Ajout du champ email
    phone: '',
    commune: '',
    quartier: '',
    addressDetails: '',
    paymentMethod: 'cash'
  })

  // Charger les données de l'utilisateur connecté
  useEffect(() => {
     
    
    if (user) {
      // Traitement du nom complet
      const [firstName = '', lastName = ''] = (user.username || '').split(' ') || [];
      
      // Traitement de l'adresse
      const [commune = '', ...restLocation] = (user.location || '').split(',');
      const quartier = restLocation.join(',').trim();
   
  
      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || '',
        phone: user.phone_number || '',
        commune: commune || '',
        quartier: quartier || '',
        addressDetails: user.address || '',
        paymentMethod: prev.paymentMethod
      }));
    }
  }, [user]);

  // Log à chaque changement de formData
  useEffect(() => {
   
  }, [formData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Préparer les données de la commande
      const orderData = {
        formData: {
          ...formData,
          email: user?.email || formData.email || '', // Ajout du champ email
        },
        cartItems: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getCartTotal() + 1000,
        user: user || null
      };

     

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.type === "EMAIL_EXISTS" && data.role === 'guest') {
          toast.error(
            <div>
              <p>Cet email existe déjà.</p>
              <Button 
                variant="link" 
                onClick={() => router.push('/changermotdepasse')}
              >
                Cliquez ici pour réinitialiser votre mot de passe
              </Button>
            </div>
          );
          return;
        }
        throw new Error(data.error);
      }

      // Succès
      toast.success('Commande créée avec succès');
      clearCart();
      router.push(`/commande/confirmation/${data.orderId}`);

    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <Button
            onClick={() => router.push('/produits')}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Retourner aux achats
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-3xl font-bold mb-8 mt-16 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Finaliser votre commande
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Formulaire de commande */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations personnelles */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="exemple@email.com"
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="+225 XX XX XX XX XX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Adresse de livraison */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <Input
                          id="commune"
                          placeholder="Commune"
                          value={formData.commune}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <Input
                          id="quartier"
                          placeholder="Quartier"
                          value={formData.quartier}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addressDetails">Détails de l&apos;adresse</Label>
                        <Textarea 
                          id="addressDetails"
                          placeholder="Précisions sur l'adresse de livraison..."
                          className="min-h-[100px]"
                          value={formData.addressDetails}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mode de paiement */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Mode de paiement</h2>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border hover:border-orange-500 cursor-pointer">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="h-5 w-5 text-orange-500" />
                          Paiement à la livraison
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border hover:border-orange-500 cursor-pointer">
                        <RadioGroupItem value="mobile" id="mobile" />
                        <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer">
                          <Phone className="h-5 w-5 text-orange-500" />
                          Mobile Money
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Résumé de la commande */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative aspect-square w-20 overflow-hidden rounded-lg flex-shrink-0">
                        <Image
                          src={item.images?.[0]?.image_url || '/placeholder.png'}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                        <p className="font-medium text-orange-600">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Détails des coûts */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{getCartTotal().toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span>1,000 FCFA</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">
                      {(getCartTotal() + 1000).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                {/* Informations de livraison */}
                <div className="mt-6 bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <Truck className="h-5 w-5" />
                    <span className="font-medium">Informations de livraison</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Livraison estimée sous 24h après confirmation de la commande.
                    Nos livreurs vous contacteront pour organiser la livraison.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
