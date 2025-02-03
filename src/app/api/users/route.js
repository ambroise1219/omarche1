import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; 

export async function GET() {
  try {
    const result = await pool.query('SELECT id, username, email, role, profile_image_url, created_at FROM users');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { username, email, password, role, profile_image_url } = await request.json();
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role, profile_image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, profile_image_url',
      [username, email, password, role, profile_image_url]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
