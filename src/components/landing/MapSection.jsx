'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

export function MapSection() {
  useEffect(() => {
    // Charger le script Yandex Maps
    const script = document.createElement('script')
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=fr_FR'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      // Initialiser la carte une fois le script chargé
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map('map', {
          center: [5.2992, -3.9892], // Coordonnées d'Abidjan, Koumassi
          zoom: 14,
          controls: ['zoomControl', 'fullscreenControl']
        })

        // Ajouter un marqueur pour O'Marché
        const placemark = new window.ymaps.Placemark([5.2992, -3.9892], {
          balloonContent: 'O\'Marché - Votre marché en ligne',
          balloonContentHeader: 'O\'Marché',
          balloonContentBody: 'Remblais, Koumassi, Abidjan',
          balloonContentFooter: 'Ouvert 7j/7'
        }, {
          preset: 'islands#orangeShoppingIcon'
        })

        map.geoObjects.add(placemark)
      })
    }

    return () => {
      // Nettoyer le script lors du démontage
      const scriptElement = document.querySelector('script[src*="api-maps.yandex.ru"]')
      if (scriptElement) {
        document.body.removeChild(scriptElement)
      }
    }
  }, [])

  return (
    <section className="bg-white w-full">
      <div className="container mx-auto px-4 max-w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <MapPin className="h-6 w-6 text-orange-500" />
            <h2 className="text-3xl font-bold">Notre Emplacement</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Retrouvez-nous à Koumassi, Remblais - Abidjan. Notre équipe est là pour vous accueillir et vous guider dans vos achats.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <div 
            id="map" 
            className="w-full h-[500px]"
            style={{ background: '#f0f0f0' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
