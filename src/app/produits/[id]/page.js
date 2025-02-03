import { Suspense } from 'react'
import { Navigation } from '../../../components/landing/Navigation'
import { Footer } from '../../../components/landing/Footer'
import ProductDetails from '../../../components/product/ProductDetails'

/**
 * Récupère les détails d'un produit depuis l'API
 * @param {string} id - Identifiant du produit
 * @returns {Promise<Object>} Détails du produit
 */
async function getProduct(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`,
    { cache: 'no-store' }
  )
  
  if (!res.ok) {
    throw new Error('Failed to fetch product')
  }

  return res.json()
}

/**
 * Page de détails d'un produit
 * Affiche les informations complètes d'un produit avec son carousel d'images,
 * ses caractéristiques et les options d'achat
 */
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500" />
          </div>
        }>
          <ProductDetails product={product} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}