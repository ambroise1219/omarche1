import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'  

export function Footer() {
  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">O&apos;Marché</h3>
            <p className="text-gray-400">
              Des produits frais et locaux, livrés chez vous en toute simplicité.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Carrières</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">CGV</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Confidentialité</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Télécharger l&apos;app</h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full text-white border-white hover:bg-white/10">
                App Store
              </Button>
              <Button variant="outline" className="w-full text-white border-white hover:bg-white/10">
                Google Play
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} O&apos;Marché. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
