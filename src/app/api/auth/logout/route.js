import { NextResponse } from 'next/server'

export async function POST() {
  // Créer une réponse vide
  const response = NextResponse.json({ success: true })

  // Supprimer le cookie authToken
  response.cookies.set({
    name: 'authToken',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0) // Date dans le passé pour supprimer le cookie
  })

  return response
}
