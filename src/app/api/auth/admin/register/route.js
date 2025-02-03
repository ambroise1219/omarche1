import { NextResponse } from 'next/server'
import { hashSync } from 'bcryptjs'
import { verify } from 'jsonwebtoken'
import pool from '../../../../../lib/db'

export async function POST(request) {
  try {
    // Vérifier si un admin existe déjà
    const firstAdminCheck = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE role = $1',
      ['admin']
    )

    const adminCount = parseInt(firstAdminCheck.rows[0].count)

    // Si des admins existent déjà, vérifier que la requête vient d'un admin
    if (adminCount > 0) {
      const token = request.cookies.get('token')?.value

      if (!token) {
        return NextResponse.json(
          { error: 'Non autorisé' },
          { status: 401 }
        )
      }

      try {
        const decoded = verify(token, process.env.JWT_SECRET)
        if (decoded.role !== 'admin') {
          return NextResponse.json(
            { error: 'Non autorisé' },
            { status: 403 }
          )
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Non autorisé' },
          { status: 401 }
        )
      }
    }

    const { email, password, username } = await request.json()

    // Vérifier les champs requis
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = hashSync(password, 10)

    // Créer l'utilisateur admin
    const result = await pool.query(
      `INSERT INTO users (email, password, username, role, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id, email, username, role`,
      [email, hashedPassword, username, 'admin']
    )

    return NextResponse.json({
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Erreur lors de l\'inscription admin:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}
