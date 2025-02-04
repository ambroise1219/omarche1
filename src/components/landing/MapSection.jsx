'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

export function MapSection() {
  const mapRef = useRef(null)

  useEffect(() => {
    let map = null
    let scriptElement = null

    // Vérifier si le script existe déjà
    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]')
    if (existingScript) {
      return
    }

    // Charger le script Yandex Maps
    scriptElement = document.createElement('script')
    scriptElement.src = 'https://api-maps.yandex.ru/2.1/?lang=fr_FR'
    scriptElement.async = true
    document.body.appendChild(scriptElement)

    scriptElement.onload = () => {
      // Initialiser la carte une fois le script chargé
      window.ymaps.ready(() => {
        if (!mapRef.current) return

        map = new window.ymaps.Map('map', {
          center: [5.3011744, -3.9666682], // Coordonnées de Koumassi, Remblais
          zoom: 15,
          controls: ['zoomControl', 'fullscreenControl']
        }, {
          suppressMapOpenBlock: true
        })

        // Ajouter un marqueur pour O'Marché
        const placemark = new window.ymaps.Placemark([5.3011744, -3.9666682], {
          balloonContentHeader: 'O\'Marché',
          balloonContentBody: `
            <div style="text-align: center;">
              <strong>O'Marché - Votre marché en ligne</strong><br/>
              Remblais, Koumassi<br/>
              Abidjan, Côte d'Ivoire<br/>
              <br/>
              Ouvert 7j/7 de 8h à 20h
            </div>
          `,
          balloonContentFooter: '<div style="text-align: center;">🌟 Livraison disponible 🌟</div>'
        }, {
          preset: 'islands#orangeShoppingIcon',
          iconColor: '#f97316'
        })

        map.geoObjects.add(placemark)
        map.behaviors.disable('scrollZoom')
        map.container.fitToViewport()
      })
    }

    return () => {
      // Nettoyer la carte et le script lors du démontage
      if (map && map.destroy) {
        map.destroy()
      }
      
      // Ne pas supprimer le script si d'autres instances en ont besoin
      const otherMaps = document.querySelectorAll('#map')
      if (otherMaps.length <= 1 && scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement)
      }
    }
  }, [])

  return (
    <section className="w-full bg-white">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <MapPin className="h-6 w-6 text-orange-500" />
            <h2 className="text-3xl font-bold">Notre Emplacement</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto px-4">
            Retrouvez-nous à Koumassi, Remblais - Abidjan. Notre équipe est là pour vous accueillir et vous guider dans vos achats.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <div 
            id="map" 
            ref={mapRef}
            className="w-full h-[600px]"
            style={{ background: '#f0f0f0' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
