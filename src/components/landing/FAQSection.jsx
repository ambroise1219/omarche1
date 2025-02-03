import React from 'react'
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Quels sont les modes de paiement disponibles ?",
    answer: "Nous acceptons les paiements en espèces à la livraison ainsi que les paiements par Mobile Money (Orange Money, MTN Mobile Money, Wave)."
  },
  {
    question: "Dans quelles villes livrez-vous ?",
    answer: "Nous livrons actuellement dans toute la ville d'Abidjan et ses communes. L'extension vers d'autres villes est prévue prochainement."
  },
  {
    question: "Comment suivre ma commande ?",
    answer: "Vous pouvez suivre votre commande en temps réel via notre application mobile. Vous recevrez également des notifications à chaque étape de la livraison."
  }
]

export function FAQSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Questions fréquentes
        </motion.h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <AccordionItem value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
