import { NextResponse } from 'next/server';
import pool from '../../../../../../lib/db';

/**
 * Met à jour la position d'une livraison
 * @route POST /api/deliveries/[id]/position
 */
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { latitude, longitude } = await request.json();

    // Vérifier si la livraison existe
    const deliveryCheck = await pool.query(
      'SELECT id FROM deliveries WHERE id = $1',
      [id]
    );

    if (deliveryCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Livraison non trouvée' },
        { status: 404 }
      );
    }

    // Insérer la nouvelle position
    const result = await pool.query(
      'INSERT INTO delivery_positions (delivery_id, latitude, longitude) VALUES ($1, $2, $3) RETURNING *',
      [id, latitude, longitude]
    );

    // Mettre à jour la position actuelle dans la table deliveries
    await pool.query(
      'UPDATE deliveries SET latitude = $1, longitude = $2 WHERE id = $3',
      [latitude, longitude, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la position:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la position' },
      { status: 500 }
    );
  }
}
