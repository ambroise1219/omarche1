import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET 

/**
 * Vérifie et décode un token JWT
 * @param {string} token - Le token JWT à vérifier
 * @returns {Promise<Object>} Les données décodées du token
 */
export const verifyAuth = async (token) => {
  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    throw new Error('Token invalide')
  }
}

/**
 * Génère un token JWT pour un utilisateur
 * @param {Object} user - Les données de l'utilisateur
 * @returns {string} Le token JWT généré
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns {Promise<Object|null>} Les données de l'utilisateur ou null
 */
export const getAuthUser = async () => {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  if (!token) {
    return null
  }

  try {
    const user = await verifyAuth(token.value)
    return user
  } catch (error) {
    return null
  }
}

/**
 * Vérifie si l'utilisateur est un administrateur
 * @returns {Promise<boolean>}
 */
export const isAdmin = async () => {
  const user = await getAuthUser()
  return user?.role === 'admin'
}
