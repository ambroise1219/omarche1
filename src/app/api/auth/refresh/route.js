import { NextResponse } from 'next/server'
import { verify, sign } from 'jsonwebtoken'
import pool from '../../../../lib/db'

export async function GET(request) {
  try {
    // Récupérer le token depuis les headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token non fourni' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]

    // Vérifier le token actuel
    const decoded = verify(token, process.env.JWT_SECRET)

    // Vérifier si l'utilisateur existe toujours
    const result = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.userId]
    )

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Générer un nouveau token
    const newToken = sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Créer la réponse avec le nouveau token
    const response = NextResponse.json({ token: newToken })

    // Mettre à jour le cookie
    response.cookies.set({
      name: 'token',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    })

    return response
  } catch (error) {
    console.error('Erreur de rafraîchissement du token:', error)
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue lors du rafraîchissement' },
      { status: 500 }
    )
  }
}
