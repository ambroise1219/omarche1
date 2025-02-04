'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [user, setUser] = useState(session?.user || null)
  const [loading, setLoading] = useState(status === 'loading')

  useEffect(() => {
    setUser(session?.user || null)
    setLoading(status === 'loading')
  }, [session, status])

  const login = async (email, password) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        return { success: false, error: 'Email ou mot de passe incorrect' }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Une erreur est survenue' }
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push('/auth')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
