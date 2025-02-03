import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await pool.query('SELECT * FROM banners WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, image_url, link } = await request.json();
    const result = await pool.query(
      'UPDATE banners SET title = $1, image_url = $2, link = $3 WHERE id = $4 RETURNING *',
      [title, image_url, link, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await pool.query('DELETE FROM banners WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
