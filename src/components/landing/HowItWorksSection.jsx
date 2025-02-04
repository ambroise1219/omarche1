import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'

const steps = [
  { step: 1, title: "Inscrivez-vous", description: "Créez un compte en quelques secondes" },
  { step: 2, title: "Choisissez vos produits", description: "Ajoutez-les à votre panier" },
  { step: 3, title: "Passez commande", description: "Sélectionnez vos options" },
  { step: 4, title: "Suivez votre livraison", description: "Recevez vos produits frais" }
]

export function HowItWorksSection() {
  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Comment ça marche ?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mb-3 md:mb-4 text-sm md:text-base">
                  {step.step}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
              </div>
              
              {/* Flèches de direction */}
              {index < 3 && (
                <>
                  {/* Flèche horizontale pour desktop */}
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 text-orange-600 w-6 h-6" />
                  {/* Flèche verticale pour mobile */}
                  <ArrowDown className="md:hidden absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-orange-600 w-6 h-6" />
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
