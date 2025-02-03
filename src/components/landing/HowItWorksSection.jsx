import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const steps = [
  { step: 1, title: "Inscrivez-vous", description: "Créez un compte en quelques secondes" },
  { step: 2, title: "Choisissez vos produits", description: "Ajoutez-les à votre panier" },
  { step: 3, title: "Passez commande", description: "Sélectionnez vos options" },
  { step: 4, title: "Suivez votre livraison", description: "Recevez vos produits frais" }
]

export function HowItWorksSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Comment ça marche ?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < 3 && (
                <ArrowRight className="hidden md:block absolute top-1/2 -right-4 text-orange-600" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
