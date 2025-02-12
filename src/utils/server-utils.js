import pool from '../../lib/db';

// Fonction utilitaire pour formater les IDs BigInt
export function formatBigInt(id) {
  return typeof id === 'string' ? id : id?.toString();
}

export async function getCategoryFromDB(id) {
  try {
    console.log('📦 [Server] Récupération catégorie:', id);
    
    // Utiliser CAST pour forcer l'ID en text dans la requête
    const result = await pool.query(`
      SELECT 
        c.*,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', CAST(p.id AS text),
                'name', p.name,
                'description', p.description,
                'price', p.price,
                'stock', p.stock,
                'images', (
                  SELECT json_agg(
                    json_build_object(
                      'id', CAST(pi.id AS text),
                      'image_url', pi.image_url
                    )
                  )
                  FROM product_images pi
                  WHERE pi.product_id = p.id
                )
              )
            )
            FROM products p
            WHERE p.category_id = c.id
          ),
          '[]'
        ) as products
      FROM categories c
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const category = result.rows[0];
    
    // S'assurer que les produits sont un tableau même si vide
    category.products = Array.isArray(category.products) ? category.products : [];

    // Formater les IDs des produits avant de retourner
    if (category.products) {
      category.products = category.products.map(product => ({
        ...product,
        id: formatBigInt(product.id)
      }));
    }
    
    console.log('✅ [Server] Catégorie chargée avec', category.products.length, 'produits');
    return category;

  } catch (error) {
    console.error('❌ [Server] Erreur DB:', error);
    throw error;
  }
}
