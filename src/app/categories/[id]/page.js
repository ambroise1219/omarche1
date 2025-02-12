import { Suspense } from 'react'
import { Navigation } from '../../../components/landing/Navigation'
import { Footer } from '../../../components/landing/Footer'
import HeroCategory from '../../../components/category/HeroCategory'
import CategoryProductCard from '../../../components/category/CategoryProductCard'
import { notFound } from 'next/navigation'
import { getCategoryFromDB } from '@/utils/server-utils'

async function getCategory(id) {
  try {
    const category = await getCategoryFromDB(id);
    
    if (!category) {
      console.log('❌ [Server] Catégorie non trouvée');
      notFound();
    }

    return category;
  } catch (error) {
    console.error('❌ [Server] Erreur:', error);
    throw error;
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