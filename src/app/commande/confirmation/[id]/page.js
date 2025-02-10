'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button' 
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Truck, Phone } from 'lucide-react'
import { toast } from 'sonner'

export default function OrderConfirmationPage({ params }) {
  const { id } = params
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
 
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`)
        if (!response.ok) {
          throw new Error('Commande non trouvée')
        }
        const data = await response.json()
        setOrder(data)
      } catch (error) {
        toast.error('Impossible de charger les détails de la commande')
        router.push('/commande')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Commande confirmée !
                </h1>
                <p className="text-gray-600 mt-2">
                  Merci pour votre commande. Votre numéro de commande est #{id}
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-orange-600 mb-2">
                    <Truck className="h-5 w-5" />
                    <span className="font-medium">Statut de la livraison</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Notre équipe de livraison vous contactera dans les prochaines 24 heures
                    pour organiser la livraison.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-blue-600 mb-2">
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">Besoin d'aide ?</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Notre service client est disponible pour vous aider.
                    Contactez-nous au +225 XX XX XX XX XX
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    onClick={() => router.push('/produits')}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    Continuer les achats
                  </Button>
                  <Button
                    onClick={() => router.push('/profile')}
                    variant="outline"
                    className="flex-1"
                  >
                    Voir mes commandes
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
