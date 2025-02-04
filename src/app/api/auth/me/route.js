import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import pool from '../../../../lib/db'

export async function GET(request) {
  try {
    // Récupérer le token depuis les cookies
    const authToken = request.cookies.get('authToken')?.value

    if (!authToken) {
      console.log('/api/auth/me - Pas de token trouvé')
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier le token
    const decoded = verify(authToken, process.env.JWT_SECRET)
    console.log('/api/auth/me - Token vérifié:', { userId: decoded.userId })

    // Récupérer les informations de l'utilisateur
    const result = await pool.query(
      'SELECT id, email, username, role, phone_number, location, profile_image_url FROM users WHERE id = $1',
      [decoded.userId]
    )

    const user = result.rows[0]

    if (!user) {
      console.log('/api/auth/me - Utilisateur non trouvé')
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Créer la réponse avec les informations de l'utilisateur
    const response = NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        phone_number: user.phone_number || '',
        location: user.location || '',
        profile_image_url: user.profile_image_url || ''
      }
    })

    // Conserver le cookie dans la réponse
    response.cookies.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    })

    return response

  } catch (error) {
    console.error('/api/auth/me - Erreur:', error)
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      // Si le token est invalide ou expiré, supprimer le cookie
      const response = NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      )
      
      response.cookies.set('authToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0)
      })
      
      return response
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
