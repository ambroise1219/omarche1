import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT o.*, u.username, u.email,
      json_agg(json_build_object(
        'product_id', od.product_id,
        'quantity', od.quantity,
        'price', od.price
      )) as items
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_details od ON o.id = od.order_id
      GROUP BY o.id, u.username, u.email
      ORDER BY o.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { user_id, total, status, items } = await request.json();

    // Insérer la commande
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING *',
      [user_id, total, status]
    );
    
    const order_id = orderResult.rows[0].id;

    // Insérer les détails de la commande
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order_id, item.product_id, item.quantity, item.price]
      );
    }

    return NextResponse.json(orderResult.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
