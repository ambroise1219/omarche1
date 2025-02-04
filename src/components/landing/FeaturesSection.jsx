import React from 'react'
import { motion } from 'framer-motion'
import { Truck, CreditCard, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: <Truck className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />,
    title: "Livraison rapide",
    description: "Suivi en temps réel de votre commande"
  },
  {
    icon: <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />,
    title: "Paiement flexible",
    description: "Payez en espèces ou par Mobile Money"
  },
  {
    icon: <Calendar className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />,
    title: "Programmation d'achats",
    description: "Planifiez vos commandes à l'avance"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Pourquoi choisir O&apos;Marché ?
        </motion.h2>
        
        {/* Version mobile : défilement horizontal */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 pb-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex-none w-[280px]"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-4 h-full">
                  <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Version desktop : grille */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
