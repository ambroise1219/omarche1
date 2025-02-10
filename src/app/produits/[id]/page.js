'use client'

import { useState, useEffect } from 'react'
import ProductDetails from '@/components/landing/ProductDetails'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { fetchProductById } from '@/utils/api'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Page de détails d'un produit
 * Affiche les informations complètes d'un produit avec son carousel d'images,
 * ses caractéristiques et les options d'achat
 */
export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      try {
        const data = await fetchProductById(params.id)
        if (isMounted && data) {
          setProduct(data)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [params.id])

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {loading ? (
          <div className="space-y-8 p-8">
            <Skeleton className="h-[400px] w-full" />
            <div className="grid lg:grid-cols-2 gap-8">
              <Skeleton className="h-[300px]" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        ) : (
          <ProductDetails product={product} />
        )}
      </main>
      <Footer />
    </>
  )
}