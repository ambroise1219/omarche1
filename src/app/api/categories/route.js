import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Récupère toutes les catégories
 * @returns {Promise<NextResponse>} Liste des catégories
 */
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}

/**
 * Crée une nouvelle catégorie
 * @param {Request} request - Requête HTTP
 * @returns {Promise<NextResponse>} Catégorie créée
 */
export async function POST(request) {
  try {
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

    // Vérifier si une catégorie avec le même nom existe déjà
    const existingCategory = await pool.query(
      'SELECT id FROM categories WHERE name = $1',
      [name]
    );

    if (existingCategory.rows.length > 0) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    // Insertion de la nouvelle catégorie
    const result = await pool.query(
      'INSERT INTO categories (name, description, image_url) VALUES ($1, $2, $3) RETURNING *',
      [name, description || null, image_url || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}
