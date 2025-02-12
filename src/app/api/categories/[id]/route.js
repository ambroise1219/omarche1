import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    

    // Récupérer la catégorie et ses produits en une seule requête
    const result = await pool.query(`
      SELECT 
        c.*,
        json_agg(
          json_build_object(
            'id', p.id::text, -- Convertir en texte pour préserver la précision
            'name', p.name,
            'description', p.description,
            'price', p.price,
            'stock', p.stock,
            'images', (
              SELECT json_agg(json_build_object(
                'id', pi.id::text, -- Convertir en texte
                'image_url', pi.image_url
              ))
              FROM product_images pi
              WHERE pi.product_id = p.id
            )
          )
        ) as products
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);

    if (result.rows.length === 0) {
      console.log('❌ Catégorie non trouvée:', id);
      return NextResponse.json(
        { error: 'Catégorie non trouvée' }, 
        { status: 404 }
      );
    }

    // Nettoyer les données pour gérer le cas où il n'y a pas de produits
    const category = result.rows[0];
    category.products = category.products[0] === null ? [] : category.products;
 
    return NextResponse.json(category);
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * Met à jour une catégorie
 * @param {Request} request - Requête HTTP
 * @param {Object} params - Paramètres de la route
 * @returns {Promise<NextResponse>} Catégorie mise à jour
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, description, image_url } = await request.json();

    // Validation des données
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie ne doit pas dépasser 100 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si la catégorie existe
    const categoryExists = await pool.query(
      'SELECT id FROM categories WHERE id = $1',
      [id]
    );

    if (categoryExists.rows.length === 0) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si le nouveau nom existe déjà pour une autre catégorie
    const existingCategory = await pool.query(
      'SELECT id FROM categories WHERE name = $1 AND id != $2',
      [name, id]
    );

    if (existingCategory.rows.length > 0) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    // Mise à jour de la catégorie
    const result = await pool.query(
      `UPDATE categories 
       SET name = $1, description = $2, image_url = $3 
       WHERE id = $4 
       RETURNING *`,
      [name, description || null, image_url || null, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la catégorie' },
      { status: 500 }
    );
  }
}

/**
 * Supprime une catégorie
 * @param {Request} request - Requête HTTP
 * @param {Object} params - Paramètres de la route
 * @returns {Promise<NextResponse>} Réponse de confirmation
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Vérifier si la catégorie existe
    const categoryExists = await pool.query(
      'SELECT id FROM categories WHERE id = $1',
      [id]
    );

    if (categoryExists.rows.length === 0) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si la catégorie a des produits associés
    const hasProducts = await pool.query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = $1',
      [id]
    );

    const productCount = parseInt(hasProducts.rows[0].count);
    if (productCount > 0) {
      return NextResponse.json(
        { 
          error: 'Cette catégorie ne peut pas être supprimée car elle est utilisée',
          details: {
            productCount,
            message: `Cette catégorie contient ${productCount} produit${productCount > 1 ? 's' : ''}. Veuillez d'abord déplacer ou supprimer ces produits avant de supprimer la catégorie.`
          }
        },
        { status: 400 }
      );
    }

    // Suppression de la catégorie
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);

    return NextResponse.json(
      { message: 'Catégorie supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    );
  }
}
