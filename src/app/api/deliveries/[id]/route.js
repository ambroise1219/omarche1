import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const delivery = await pool.query(`
      SELECT d.*, 
        o.status as order_status,
        u.username as delivery_person_name,
        dp.latitude, dp.longitude
      FROM deliveries d
      LEFT JOIN orders o ON d.order_id = o.id
      LEFT JOIN users u ON d.delivery_person_id = u.id
      LEFT JOIN delivery_positions dp ON d.id = dp.delivery_id
      WHERE d.id = $1 AND dp.id = (
        SELECT id FROM delivery_positions 
        WHERE delivery_id = d.id 
        ORDER BY timestamp DESC 
        LIMIT 1
      )
    `, [id]);

    if (delivery.rows.length === 0) {
      return NextResponse.json({ error: 'Livraison non trouvée' }, { status: 404 });
    }
    return NextResponse.json(delivery.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status, latitude, longitude } = await request.json();
    
    // Mise à jour du statut de la livraison
    const result = await pool.query(
      'UPDATE deliveries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // Si de nouvelles coordonnées sont fournies, ajouter une nouvelle position
    if (latitude && longitude) {
      await pool.query(
        'INSERT INTO delivery_positions (delivery_id, latitude, longitude) VALUES ($1, $2, $3)',
        [id, latitude, longitude]
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    // Supprimer d'abord les positions de livraison associées
    await pool.query('DELETE FROM delivery_positions WHERE delivery_id = $1', [id]);
    // Puis supprimer la livraison
    await pool.query('DELETE FROM deliveries WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Livraison supprimée avec succès' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
