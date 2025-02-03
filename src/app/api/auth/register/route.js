import { NextResponse } from 'next/server'
import { hashSync } from 'bcryptjs'
import pool from '../../../../lib/db'

export async function POST(request) {
  try {
    const { username, email, password, phoneNumber } = await request.json()

    // Validation des données
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Validation du numéro de téléphone
    if (phoneNumber && !/^[+]?[0-9]{10,15}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Le format du numéro de téléphone est invalide' },
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

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )

    if (existingUsername.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ce nom d\'utilisateur est déjà pris' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = hashSync(password, 10)

    // Insérer le nouvel utilisateur avec le numéro de téléphone
    const result = await pool.query(
      `INSERT INTO users (username, email, password, role, phone_number) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, username, email, role, phone_number`,
      [username, email, hashedPassword, 'user', phoneNumber]
    )

    const newUser = result.rows[0]

    return NextResponse.json({
      message: 'Inscription réussie',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phone_number
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}
