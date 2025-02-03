import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT d.*, 
        o.status as order_status,
        u.username as delivery_person_name,
        dp.latitude, dp.longitude
      FROM deliveries d
      LEFT JOIN orders o ON d.order_id = o.id
      LEFT JOIN users u ON d.delivery_person_id = u.id
      LEFT JOIN delivery_positions dp ON d.id = dp.delivery_id
      WHERE dp.id = (
        SELECT id FROM delivery_positions 
        WHERE delivery_id = d.id 
        ORDER BY timestamp DESC 
        LIMIT 1
      )
      ORDER BY d.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { order_id, delivery_person_id, status, latitude, longitude } = await request.json();
    
    const deliveryResult = await pool.query(
      'INSERT INTO deliveries (order_id, delivery_person_id, status) VALUES ($1, $2, $3) RETURNING *',
      [order_id, delivery_person_id, status]
    );
    
    if (latitude && longitude) {
      await pool.query(
        'INSERT INTO delivery_positions (delivery_id, latitude, longitude) VALUES ($1, $2, $3)',
        [deliveryResult.rows[0].id, latitude, longitude]
      );
    }
    
    return NextResponse.json(deliveryResult.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
