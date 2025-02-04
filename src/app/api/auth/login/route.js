import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from '../../../../lib/db'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Vérifier les informations de connexion
    const result = await pool.query(
      'SELECT id, email, password, username, role FROM users WHERE email = $1',
      [email]
    )

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Créer le token JWT
    const token = sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log('Login - Token généré pour:', { userId: user.id, email: user.email })

    // Créer la réponse
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    })

    // Définir le cookie avec le token
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    })

    // Désactiver le cache pour la réponse de connexion
    response.headers.set('x-middleware-cache', 'no-cache')
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')

    return response
  } catch (error) {
    console.error('Login - Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    )
  }
}
