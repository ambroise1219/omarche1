import { NextResponse } from 'next/server';
import pool from '../../../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const result = await pool.query(`
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'product_id', od.product_id,
            'quantity', od.quantity,
            'price', od.price,
            'product', (
              SELECT json_build_object(
                'name', p.name,
                'image_url', (
                  SELECT image_url FROM product_images pi 
                  WHERE pi.product_id = p.id 
                  LIMIT 1
                )
              )
              FROM products p 
              WHERE p.id = od.product_id
            )
          )
        ) as items
      FROM orders o 
      LEFT JOIN order_details od ON o.id = od.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [id]);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
