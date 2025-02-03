import React from 'react'
import { Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ContactSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Contactez-nous</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2">
              <Phone className="text-orange-600" />
              <span>+225 07 07 07 07 07</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="text-orange-600" />
              <span>contact@omarche.ci</span>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="ghost" size="icon" className="hover:bg-orange-50">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-orange-50">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-orange-50">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
