import { NextResponse } from "next/server"
import { executeQuery } from "../../../../lib/db"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

export async function PUT(request) {
  try {
    const token = request.cookies.get('authToken')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 })
    }

    const body = await request.json()
    const { username, email, password, phone_number, location, profile_image_url } = body

    let updateFields = []
    let values = []
    let paramCount = 1

    if (username) {
      updateFields.push(`username = $${paramCount}`)
      values.push(username)
      paramCount++
    }

    if (email) {
      updateFields.push(`email = $${paramCount}`)
      values.push(email)
      paramCount++
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateFields.push(`password = $${paramCount}`)
      values.push(hashedPassword)
      paramCount++
    }

    if (phone_number) {
      updateFields.push(`phone_number = $${paramCount}`)
      values.push(phone_number)
      paramCount++
    }

    if (location) {
      updateFields.push(`location = $${paramCount}`)
      values.push(location)
      paramCount++
    }

    if (profile_image_url) {
      updateFields.push(`profile_image_url = $${paramCount}`)
      values.push(profile_image_url)
      paramCount++
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 })
    }

    values.push(decoded.userId)
    const query = `
      UPDATE users 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING id, username, email, role, phone_number, location, profile_image_url
    `

   

    const result = await executeQuery(query, values)
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ 
      message: "Profil mis à jour avec succès",
      user: result.rows[0]
    })

  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
