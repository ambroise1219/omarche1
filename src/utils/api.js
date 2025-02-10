'use client'

import { toast } from 'sonner'

/**
 * Fonction utilitaire pour effectuer des appels API avec retry et gestion d'erreurs
 * @param {string} url - URL de l'API
 * @param {Object} options - Options de la requête fetch
 * @param {number} retries - Nombre de tentatives en cas d'échec
 * @param {number} delay - Délai entre les tentatives en millisecondes
 * @returns {Promise<any>} Données de la réponse
 */
export async function fetchWithRetry(url, options = {}, retries = 2, delay = 1000) {
  let lastError
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      lastError = error
      console.error(`Tentative ${i + 1}/${retries + 1} échouée:`, error)
      
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  // Si toutes les tentatives ont échoué
  throw lastError
}

/**
 * Fonction pour charger les catégories avec gestion d'erreur
 * @returns {Promise<Array>} Liste des catégories
 */
export async function fetchCategories() {
  try {
    const data = await fetchWithRetry('/api/categories')
    return data
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
    toast.error("Impossible de charger les catégories")
    return []
  }
}

/**
 * Fonction pour charger les produits avec gestion d'erreur
 * @returns {Promise<Array>} Liste des produits
 */
export async function fetchProducts() {
  try {
    const data = await fetchWithRetry('/api/products')
    return data
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
    toast.error("Impossible de charger les produits")
    return []
  }
}

/**
 * Fonction pour charger un produit spécifique par son ID
 * @param {string} id - ID du produit
 * @returns {Promise<Object>} Détails du produit
 */
export async function fetchProductById(id) {
  try {
    const data = await fetchWithRetry(`/api/products/${id}`)
    return data
  } catch (error) {
    console.error('Erreur lors du chargement du produit:', error)
    toast.error("Impossible de charger les détails du produit")
    return null
  }
}

/**
 * Fonction pour charger une catégorie spécifique par son ID
 * @param {string} id - ID de la catégorie
 * @returns {Promise<Object>} Détails de la catégorie
 */
export async function fetchCategoryById(id) {
  try {
    const data = await fetchWithRetry(`/api/categories/${id}`)
    return data
  } catch (error) {
    console.error('Erreur lors du chargement de la catégorie:', error)
    toast.error("Impossible de charger les détails de la catégorie")
    return null
  }
}

/**
 * Fonction pour charger les produits d'une catégorie spécifique
 * @param {string} categoryId - ID de la catégorie
 * @returns {Promise<Array>} Liste des produits de la catégorie
 */
export async function fetchProductsByCategory(categoryId) {
  try {
    const data = await fetchWithRetry(`/api/categories/${categoryId}/products`)
    return data
  } catch (error) {
    console.error('Erreur lors du chargement des produits de la catégorie:', error)
    toast.error("Impossible de charger les produits de cette catégorie")
    return []
  }
}
