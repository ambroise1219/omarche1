import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(request, context) {
  try {
    const { id } = context.params;
    
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        json_agg(
          json_build_object(
            'id', pi.id,
            'product_id', pi.product_id,
            'image_url', pi.image_url
          )
        ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = $1
      GROUP BY p.id, c.name
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Met à jour un produit
 * @param {Request} request - Requête HTTP
 * @param {Object} params - Paramètres de la route
 * @returns {Promise<NextResponse>} Produit mis à jour
 */
export async function PUT(request, context) {
  let client;
  console.log('=== DÉBUT DE LA MISE À JOUR ===');
  console.log('ID du produit:', context.params.id);
  
  try {
    client = await pool.connect();
    const { id } = context.params;
    const bodyText = await request.text();
    console.log('Body brut:', bodyText);
    
    let bodyData;
    try {
      bodyData = JSON.parse(bodyText);
    } catch (error) {
      console.error('Erreur parsing JSON:', error);
      return NextResponse.json(
        { error: 'Invalid JSON data' },
        { status: 400 }
      );
    }

    const { name, description, price, stock, category_id, images } = bodyData;
    console.log('Données parsées:', {
      id,
      name,
      description,
      price,
      stock,
      category_id,
      images
    });

    // Validation des données
    if (!name || !price || !stock || !category_id) {
      console.log('Validation échouée:', { name, price, stock, category_id });
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');
    console.log('Transaction commencée');

    try {
      // Vérifier si le produit existe
      const productExists = await client.query(
        'SELECT id FROM products WHERE id = $1',
        [id]
      );
      console.log('Vérification produit:', productExists.rows);

      if (productExists.rows.length === 0) {
        throw new Error('Produit non trouvé');
      }

      // Vérifier si la catégorie existe
      const categoryExists = await client.query(
        'SELECT id FROM categories WHERE id = $1',
        [category_id]
      );
      console.log('Vérification catégorie:', categoryExists.rows);

      if (categoryExists.rows.length === 0) {
        throw new Error('Catégorie non trouvée');
      }

      // Mise à jour du produit
      console.log('Tentative de mise à jour du produit avec:', {
        name,
        description,
        price,
        stock,
        category_id,
        id
      });

      const result = await client.query(
        `UPDATE products 
         SET name = $1, description = $2, price = $3, stock = $4, category_id = $5 
         WHERE id = $6 
         RETURNING *`,
        [name, description || null, price, stock, category_id, id]
      );
      console.log('Résultat mise à jour produit:', result.rows[0]);

      // Supprimer toutes les anciennes images
      console.log('Suppression des anciennes images pour le produit:', id);
      await client.query(
        'DELETE FROM product_images WHERE product_id = $1',
        [id]
      );

      // Ajouter les nouvelles images
      if (images && images.length > 0) {
        console.log('Ajout des nouvelles images:', images);
        for (const image of images) {
          const imageUrl = image.url || image.image_url;
          if (imageUrl) {
            console.log('Insertion image:', imageUrl);
            await client.query(
              'INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)',
              [id, imageUrl]
            );
          }
        }
      }

      // Récupérer le produit mis à jour avec ses nouvelles images
      console.log('Récupération du produit mis à jour');
      const updatedProduct = await client.query(`
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
        GROUP BY p.id, c.name, p.created_at
      `, [id]);

      if (updatedProduct.rows.length === 0) {
        throw new Error('Produit non trouvé après la mise à jour');
      }

      await client.query('COMMIT');
      console.log('Transaction validée');
      
      return NextResponse.json(updatedProduct.rows[0]);
    } catch (error) {
      if (client) {
        await client.query('ROLLBACK');
      }
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    );
  } finally {
    console.log('=== FIN DE LA MISE À JOUR ===');
    if (client) {
      client.release();
    }
  }
}

/**
 * Supprime un produit et ses images associées
 * @param {Request} request - Requête HTTP
 * @param {Object} params - Paramètres de la route
 * @returns {Promise<NextResponse>} Réponse de confirmation
 */
export async function DELETE(request, context) {
  try {
    const { id } = context.params;

    // Vérifier si le produit existe
    const productExists = await pool.query(
      'SELECT id FROM products WHERE id = $1',
      [id]
    );

    if (productExists.rows.length === 0) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer d'abord les images associées
    await pool.query('DELETE FROM product_images WHERE product_id = $1', [id]);

    // Puis supprimer le produit
    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    return NextResponse.json(
      { message: 'Produit supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}
