import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
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

    // Vérifier le token
    const decoded = verify(token, process.env.JWT_SECRET)

    // Récupérer les informations de l'utilisateur
    const result = await pool.query(
      `SELECT id, email, username, role, created_at, avatar_url, 
      phone, address, first_name, last_name
      FROM users WHERE id = $1`,
      [decoded.userId]
    )

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les commandes de l'utilisateur
    const ordersResult = await pool.query(
      `SELECT o.*, 
       json_agg(json_build_object(
         'id', oi.id,
         'product_id', oi.product_id,
         'quantity', oi.quantity,
         'price', oi.price
       )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [user.id]
    )

    // Formater les données utilisateur
    const userData = {
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      username: user.username,
      role: user.role,
      createdAt: user.created_at,
      avatar: user.avatar_url,
      phone: user.phone,
      address: user.address,
      orders: ordersResult.rows
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Erreur de vérification du token:', error)
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la vérification' },
      { status: 500 }
    )
  }
}
