import { NextResponse } from 'next/server';
import pool from '../../../../../../lib/db';

/**
 * Récupère l'historique des positions d'une livraison
 * @route GET /api/deliveries/[id]/positions
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

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

    // Récupérer toutes les positions de la livraison
    const result = await pool.query(`
      SELECT 
        dp.id,
        dp.latitude,
        dp.longitude,
        dp.timestamp,
        d.status as delivery_status,
        o.status as order_status
      FROM delivery_positions dp
      JOIN deliveries d ON dp.delivery_id = d.id
      JOIN orders o ON d.order_id = o.id
      WHERE dp.delivery_id = $1
      ORDER BY dp.timestamp DESC
    `, [id]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des positions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des positions' },
      { status: 500 }
    );
  }
}
