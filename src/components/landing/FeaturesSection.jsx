import React from 'react'
import { motion } from 'framer-motion'
import { Truck, CreditCard, Calendar } from 'lucide-react'

const features = [
  {
    icon: <Truck className="h-8 w-8 text-orange-600" />,
    title: "Livraison rapide",
    description: "Suivi en temps réel de votre commande"
  },
  {
    icon: <CreditCard className="h-8 w-8 text-orange-600" />,
    title: "Paiement flexible",
    description: "Payez en espèces ou par Mobile Money"
  },
  {
    icon: <Calendar className="h-8 w-8 text-orange-600" />,
    title: "Programmation d'achats",
    description: "Planifiez vos commandes à l'avance"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Pourquoi choisir O&apos;Marché ?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
