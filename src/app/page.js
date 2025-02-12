'use client'

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Store, ArrowRight, Truck, CreditCard, Calendar, Gift, Star, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"
import { CategorySection } from "../components/landing/CategorySection"
import { ProductSection } from "../components/landing/ProductSection"
import { HeroCarousel } from "../components/landing/HeroCarousel"
import { Navigation } from "../components/landing/Navigation"
import { MapSection } from "../components/landing/MapSection"
import { Footer } from "../components/landing/Footer"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function HomePage() {
  return (
    <main>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div >
        <HeroCarousel />
      </div>

      {/* Categories Section */}
      <CategorySection />

      {/* Products Section */}
      <ProductSection />

      {/* Map Section */}
      <MapSection />

      {/* Pourquoi Nous Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Pourquoi Choisir O&apos;Marché
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Store className="h-8 w-8 text-orange-600" />,
                title: "Produits Locaux",
                description: "Des produits frais et de qualité provenant directement des producteurs locaux."
              },
              {
                icon: <Truck className="h-8 w-8 text-orange-600" />,
                title: "Livraison Rapide",
                description: "Livraison le jour même pour toute commande passée avant 14h."
              },
              {
                icon: <CreditCard className="h-8 w-8 text-orange-600" />,
                title: "Paiement Sécurisé",
                description: "Paiement sécurisé par Mobile Money ou à la livraison."
              },
              {
                icon: <Calendar className="h-8 w-8 text-orange-600" />,
                title: "Service 7j/7",
                description: "Notre service client est disponible tous les jours de la semaine."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="mb-4 inline-flex p-3 bg-orange-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Questions fréquentes
          </motion.h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="paiement">
              <AccordionTrigger>
                Quels sont les modes de paiement disponibles ?
              </AccordionTrigger>
              <AccordionContent>
                Nous acceptons les paiements en espèces à la livraison ainsi que les paiements par Mobile Money (Orange Money, MTN Mobile Money, Wave).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="livraison">
              <AccordionTrigger>
                Dans quelles villes livrez-vous ?
              </AccordionTrigger>
              <AccordionContent>
                Nous livrons actuellement dans toute la ville d&apos;Abidjan et ses communes. L&apos;extension vers d&apos;autres villes est prévue prochainement.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="suivi">
              <AccordionTrigger>
                Comment suivre ma commande ?
              </AccordionTrigger>
              <AccordionContent>
                Vous pouvez suivre votre commande en temps réel via notre application mobile. Vous recevrez également des notifications à chaque étape de la livraison.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Contactez-nous
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-6">Restons en contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Phone className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-gray-600">+225 07 07 07 07 07</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Mail className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">contact@omarche.ci</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Link href="#" className="p-3 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors">
                    <Facebook className="h-6 w-6 text-orange-600" />
                  </Link>
                  <Link href="#" className="p-3 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors">
                    <Instagram className="h-6 w-6 text-orange-600" />
                  </Link>
                  <Link href="#" className="p-3 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors">
                    <Twitter className="h-6 w-6 text-orange-600" />
                  </Link>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-6">Téléchargez notre application</h3>
                <p className="text-gray-600 mb-8">
                  Profitez d&apos;une expérience d&apos;achat optimale avec notre application mobile.
                  Disponible sur iOS et Android.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="#">
                    <Image
                      src="/appstore.png"
                      alt="Télécharger sur l'App Store"
                      width={200}
                      height={60}
                      className="h-[60px] w-auto hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <Link href="#">
                    <Image
                      src="/playstore.png"
                      alt="Télécharger sur le Play Store"
                      width={200}
                      height={60}
                      className="h-[60px] w-auto hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
    <Footer />
    </main>
  )
}