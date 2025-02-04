'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

/**
 * Singleton pour gérer l'initialisation de l'API Yandex Maps
 * Ce pattern permet d'éviter les problèmes de chargement multiple du script
 * et assure qu'une seule instance de l'API est chargée dans l'application
 */
const YandexMapsLoader = {
  // État du chargement
  isLoading: false,
  isLoaded: false,
  // File d'attente des callbacks à exécuter une fois l'API chargée
  callbacks: [],
  
  /**
   * Charge l'API Yandex Maps de manière asynchrone
   * @returns {Promise} Une promesse résolue quand l'API est chargée
   */
  load() {
    // Si l'API est déjà chargée, retourne immédiatement
    if (this.isLoaded) {
      return Promise.resolve()
    }
    
    // Si l'API est en cours de chargement, ajoute le callback à la file d'attente
    if (this.isLoading) {
      return new Promise(resolve => this.callbacks.push(resolve))
    }
    
    this.isLoading = true
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=fr_FR'
      script.async = true
      
      // Gestion du chargement réussi
      script.onload = () => {
        window.ymaps.ready(() => {
          this.isLoaded = true
          this.isLoading = false
          // Exécute tous les callbacks en attente
          this.callbacks.forEach(cb => cb())
          this.callbacks = []
          resolve()
        })
      }
      
      // Gestion des erreurs de chargement
      script.onerror = (error) => {
        this.isLoading = false
        reject(error)
      }
      
      document.body.appendChild(script)
    })
  }
}

/**
 * Composant MapSection
 * Affiche une carte interactive de l'emplacement d'O'Marché avec un marqueur personnalisé
 */
export function MapSection() {
  // Références pour la carte
  const mapRef = useRef(null)          // Référence au conteneur DOM de la carte
  const mapInstanceRef = useRef(null)   // Référence à l'instance de la carte Yandex
  const [isMapError, setIsMapError] = useState(false)

  useEffect(() => {
    let isMounted = true

    /**
     * Initialise la carte Yandex Maps
     * Gère le chargement de l'API et la création de l'instance de la carte
     */
    const initializeMap = async () => {
      try {
        // Charge l'API Yandex Maps
        await YandexMapsLoader.load()
        
        // Vérifie si le composant est toujours monté et si la carte n'est pas déjà initialisée
        if (!isMounted || !mapRef.current || mapInstanceRef.current) return

        // Crée une nouvelle instance de carte
        const map = new window.ymaps.Map('map', {
          center: [5.3011744, -3.9666682], // Coordonnées de Koumassi, Remblais
          zoom: 15,
          controls: ['zoomControl', 'fullscreenControl']
        }, {
          suppressMapOpenBlock: true
        })

        // Configuration du marqueur personnalisé
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
          iconColor: '#f97316' // Orange pour correspondre à la charte graphique
        })

        // Ajoute le marqueur et configure les comportements de la carte
        map.geoObjects.add(placemark)
        map.behaviors.disable('scrollZoom') // Désactive le zoom par scroll pour une meilleure UX
        map.container.fitToViewport()
        
        mapInstanceRef.current = map
      } catch (error) {
        console.error('Erreur lors du chargement de la carte:', error)
        if (isMounted) {
          setIsMapError(true)
        }
      }
    }

    initializeMap()

    // Nettoyage lors du démontage du composant
    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <section className="w-full bg-white">
      <div className="w-full">
        {/* En-tête de la section */}
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

        {/* Conteneur de la carte */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full"
        >
          {isMapError ? (
            // Affichage d'un message d'erreur si le chargement de la carte échoue
            <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center text-gray-500">
              Une erreur est survenue lors du chargement de la carte
            </div>
          ) : (
            // Conteneur de la carte Yandex Maps
            <div 
              id="map" 
              ref={mapRef}
              className="w-full h-[600px]"
              style={{ background: '#f0f0f0' }}
            />
          )}
        </motion.div>
      </div>
    </section>
  )
}
