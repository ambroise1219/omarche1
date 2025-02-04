import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card } from '@/components/ui/card'

const testimonials = [
  {
    name: "Aïcha K.",
    rating: 5,
    comment: "J'adore cette application ! Les produits sont toujours frais et la livraison est rapide."
  },
  {
    name: "Kouamé S.",
    rating: 5,
    comment: "Le service client est excellent et les prix sont très compétitifs."
  },
  {
    name: "Marie T.",
    rating: 5,
    comment: "La qualité des produits est exceptionnelle. Je recommande !"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Ce que disent nos clients
        </motion.h2>
        
        {/* Version mobile : défilement horizontal */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 pb-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="flex-none w-[280px]"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-orange-50 p-4 h-full">
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="text-sm mb-3 line-clamp-4">{testimonial.comment}</p>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Version desktop : grille */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="bg-orange-50 p-6 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="mb-4">{testimonial.comment}</p>
                <p className="font-semibold">{testimonial.name}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
