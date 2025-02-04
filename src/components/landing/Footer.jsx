'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#126803] text-white">
      {/* Vague décorative */}
      <div className="w-full overflow-hidden rotate-180">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[120%] h-[40px] md:h-[60px] translate-x-[-10%]"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0L48 8.875C96 17.75 192 35.5 288 44.375C384 53.25 480 53.25 576 44.375C672 35.5 768 17.75 864 26.625C960 35.5 1056 71 1152 79.875C1248 88.75 1344 71 1392 62.125L1440 53.25V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
            fill="#126803"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo et Description */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.webp"
                alt="O'Marché Logo"
                width={120}
                height={48}
                className="object-contain"
              />
            </Link>
            <p className="text-sm md:text-base text-white/80">
              Votre marché en ligne de produits frais et locaux. 
              Livraison rapide et paiement sécurisé.
            </p>
          </div>

          {/* Liens Rapides */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-semibold">Liens Rapides</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link href="/produits" className="text-white/80 hover:text-orange-500 transition-colors">
                  Nos Produits
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-white/80 hover:text-orange-500 transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-white/80 hover:text-orange-500 transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-orange-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm md:text-base">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-orange-500 flex-shrink-0" />
                <span className="text-white/80">Koumassi, Remblais, Abidjan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-orange-500 flex-shrink-0" />
                <a href="tel:+2250101020304" className="text-white/80 hover:text-orange-500 transition-colors">
                  +225 01 01 02 03 04
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-orange-500 flex-shrink-0" />
                <a href="mailto:contact@omarche.ci" className="text-white/80 hover:text-orange-500 transition-colors">
                  contact@omarche.ci
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux Sociaux */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h3 className="text-base md:text-lg font-semibold">Suivez-nous</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs md:text-sm text-white/60">
            {new Date().getFullYear()} O'Marché. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
