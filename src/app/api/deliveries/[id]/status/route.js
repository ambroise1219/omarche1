import { NextResponse } from 'next/server';
import pool from '../../../../../../lib/db';

/**
 * Met à jour le statut d'une livraison
 * @route PUT /api/deliveries/[id]/status
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Vérifier si la livraison existe
    const deliveryCheck = await pool.query(
      'SELECT id, order_id FROM deliveries WHERE id = $1',
      [id]
    );

    if (deliveryCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Livraison non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de la livraison
    const result = await pool.query(
      'UPDATE deliveries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // Si la livraison est terminée, mettre à jour le statut de la commande
    if (status === 'delivered') {
      await pool.query(
        'UPDATE orders SET status = $1 WHERE id = $2',
        ['delivered', deliveryCheck.rows[0].order_id]
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    );
  }
}
