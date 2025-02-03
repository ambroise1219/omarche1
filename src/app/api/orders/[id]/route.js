import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const order = await pool.query(`
      SELECT o.*, u.username, u.email,
      json_agg(json_build_object(
        'product_id', od.product_id,
        'quantity', od.quantity,
        'price', od.price
      )) as items
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_details od ON o.id = od.order_id
      WHERE o.id = $1
      GROUP BY o.id, u.username, u.email
    `, [id]);

    if (order.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await pool.query('DELETE FROM order_details WHERE order_id = $1', [id]);
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
