import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Récupère tous les produits avec leurs images
 * @returns {Promise<NextResponse>} Liste des produits
 */
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'image_url', pi.image_url
            )
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) as images,
        CAST(p.price AS DECIMAL(10,2)) as price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id, c.name
      ORDER BY p.created_at DESC
    `);
    
    // Convertir les prix en nombres
    const productsWithNumericPrices = result.rows.map(product => ({
      ...product,
      price: parseFloat(product.price)
    }));
    
    return NextResponse.json(productsWithNumericPrices);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

/**
 * Crée un nouveau produit
 * @param {Request} request - Requête HTTP
 * @returns {Promise<NextResponse>} Produit créé
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, category_id, images } = body;

  

    // Validation des données
    if (!name || !price || !stock || !category_id) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Vérifier si la catégorie existe
    
    
    const categoryExists = await pool.query(
      'SELECT id FROM categories WHERE id::text = $1',
      [category_id]
    );

  

    if (categoryExists.rows.length === 0) {
      return NextResponse.json(
        { error: `Catégorie non trouvée avec l'ID: ${category_id}` },
        { status: 400 }
      );
    }

    // Début de la transaction
    await pool.query('BEGIN');

    try {
      // Création du produit
      const productResult = await pool.query(
        'INSERT INTO products (name, description, price, stock, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description || null, price, stock, category_id]
      );

      const productId = productResult.rows[0].id;

      // Ajout des images si présentes
      if (images && images.length > 0) {
        for (const image_url of images) {
          await pool.query(
            'INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)',
            [productId, image_url]
          );
        }
      }

      await pool.query('COMMIT');

      // Récupérer le produit créé avec ses images
      const finalResult = await pool.query(`
        SELECT 
          p.*,
          c.name as category_name,
          COALESCE(
            json_agg(
              json_build_object(
                'id', pi.id,
                'image_url', pi.image_url
              )
            ) FILTER (WHERE pi.id IS NOT NULL),
            '[]'
          ) as images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = $1
        GROUP BY p.id, c.name
      `, [productId]);

      return NextResponse.json(finalResult.rows[0], { status: 201 });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}
