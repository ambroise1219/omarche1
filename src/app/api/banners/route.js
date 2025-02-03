import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM banners ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, image_url, link } = await request.json();
    const result = await pool.query(
      'INSERT INTO banners (title, image_url, link) VALUES ($1, $2, $3) RETURNING *',
      [title, image_url, link]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
