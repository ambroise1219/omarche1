import React from 'react'
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

export function ContactSection() {
  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Contactez-nous</h2>
          
          <Card className="p-6 space-y-6">
            {/* Informations de contact */}
            <div className="space-y-4">
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <a href="tel:+22507070707" className="text-sm text-muted-foreground hover:text-orange-600">
                    +225 07 07 07 07 07
                  </a>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href="mailto:contact@omarche.ci" className="text-sm text-muted-foreground hover:text-orange-600">
                    contact@omarche.ci
                  </a>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">
                    Koumassi, Remblais, Abidjan
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Réseaux sociaux */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-center mb-4">Suivez-nous sur les réseaux sociaux</p>
              <div className="flex justify-center gap-4">
                <Button variant="ghost" size="icon" className="hover:bg-orange-50 w-10 h-10">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-orange-50 w-10 h-10">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-orange-50 w-10 h-10">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
