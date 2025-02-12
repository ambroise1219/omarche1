import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import pool from '../../../../../lib/db'

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      console.log('🚫 Pas de token trouvé')
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const decoded = verify(token, process.env.JWT_SECRET)
    console.log('✅ Token décodé:', decoded)

    const result = await pool.query(
      'SELECT id, email, username, role FROM users WHERE id = $1 AND role = $2',
      [decoded.userId, 'admin']
    )

    if (!result.rows[0]) {
      console.log('🚫 Admin non trouvé')
      return NextResponse.json({ error: 'Admin non trouvé' }, { status: 404 })
    }

    console.log('👤 Admin trouvé:', result.rows[0])
    return NextResponse.json({ user: result.rows[0] })

  } catch (error) {
    console.error('❌ Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
