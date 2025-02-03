import { Suspense } from 'react'
import { Navigation } from '../../../components/landing/Navigation'
import { Footer } from '../../../components/landing/Footer'
import HeroCategory from '../../../components/category/HeroCategory'
import CategoryProductCard from '../../../components/category/CategoryProductCard'
import { notFound } from 'next/navigation'

async function getCategory(id) {
  try {
    // Récupérer les détails de la catégorie
    const categoryResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories/${id}`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!categoryResponse.ok) {
      if (categoryResponse.status === 404) {
        notFound()
      }
      throw new Error('Failed to fetch category')
    }
    
    const categoryData = await categoryResponse.json()

    // Récupérer tous les produits
    const productsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!productsResponse.ok) {
      throw new Error('Failed to fetch products')
    }

    const productsData = await productsResponse.json()

    // Filtrer les produits par category_id
    const categoryProducts = productsData.filter(
      product => product.category_id === id
    )

    return {
      ...categoryData,
      products: categoryProducts
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    throw new Error('Failed to fetch category')
  }
}

export default async function CategoryPage({ params }) {
  const category = await getCategory(params.id)

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        <Suspense 
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-orange-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-orange-300 animate-spin"></div>
                </div>
              </div>
            </div>
          }
        >
          {/* Hero Section */}
          <HeroCategory category={category} />
          
          {/* Products Grid Section */}
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">
                Produits dans {category.name}
                <span className="text-orange-500 ml-2">
                  ({category.products?.length || 0})
                </span>
              </h2>
              {category.products?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {category.products.map((product) => (
                    <CategoryProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Aucun produit disponible dans cette catégorie pour le moment.
                </div>
              )}
            </div>
          </section>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

// Génération des métadonnées
export async function generateMetadata({ params }) {
  try {
    const category = await getCategory(params.id)
    return {
      title: `${category.name} | Omarche`,
      description: category.description,
    }
  } catch {
    return {
      title: 'Catégorie | Omarche',
      description: 'Découvrez notre sélection de produits dans cette catégorie',
    }
  }
}