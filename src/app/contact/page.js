'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implémenter la logique d'envoi du formulaire
  }

  return (
    <>
    <Navigation />
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#126803] text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-white/80 text-lg">
              Notre équipe est là pour vous aider et répondre à toutes vos questions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Informations de contact */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 h-full">
                <h2 className="text-2xl font-semibold mb-6">Nos coordonnées</h2>
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Téléphone</h3>
                      <p className="text-muted-foreground">
                        <a href="tel:+22507070707" className="hover:text-orange-600">
                          +225 07 07 07 07 07
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Du lundi au samedi, de 8h à 20h
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        <a href="mailto:contact@omarche.ci" className="hover:text-orange-600">
                          contact@omarche.ci
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Nous répondons sous 24h
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Adresse</h3>
                      <p className="text-muted-foreground">
                        Koumassi, Remblais
                      </p>
                      <p className="text-muted-foreground">
                        Abidjan, Côte d'Ivoire
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Carte Google Maps */}
                <div className="mt-8 rounded-lg overflow-hidden h-[200px] bg-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15891.464458755768!2d-3.9783333!3d5.2916667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1eb8dd53eb71f%3A0x9f4b8fc7e1686bc1!2sKoumassi%2C%20Abidjan!5e0!3m2!1sfr!2sci!4v1707060167477!5m2!1sfr!2sci"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Formulaire de contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Votre message..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
    <Footer  />
    </>
  )
}
