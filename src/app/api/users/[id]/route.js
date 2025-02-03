import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';  

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await pool.query(
      'SELECT id, username, email, role, profile_image_url, created_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { username, email, role, profile_image_url } = await request.json();
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, role = $3, profile_image_url = $4 WHERE id = $5 RETURNING id, username, email, role, profile_image_url',
      [username, email, role, profile_image_url, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, username, email, role, profile_image_url`;
    
    const result = await pool.query(query, [...values, id]);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
