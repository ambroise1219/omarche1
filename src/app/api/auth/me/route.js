import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import pool from '../../../../lib/db'

export async function GET(request) {
  try {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Vérifier le token
    const decoded = verify(token, process.env.JWT_SECRET)

    // Récupérer les données de l'utilisateur
    const result = await pool.query(
      'SELECT id, email, username, role FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user: result.rows[0] })
  } catch (error) {
    console.error('Erreur dans /api/auth/me:', error)
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }
}
