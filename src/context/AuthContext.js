'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Liste des routes protégées qui nécessitent une authentification
  const protectedRoutes = ['/dashboard', '/profile']

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
      } else {
        setUser(null)
        // Rediriger uniquement si on est sur une route protégée
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          router.push('/auth')
        }
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [pathname]) // Ajouter pathname comme dépendance

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion')
      }

      console.log('AuthContext - Connexion réussie:', data.user)
      setUser(data.user)

      // Vérifier immédiatement l'authentification après la connexion
      await checkAuth()

      // Rediriger vers la page précédente ou la page de profil
      const redirectTo = new URLSearchParams(window.location.search).get('redirectTo')
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.push('/profile')
      }

      return data
    } catch (error) {
      console.error('AuthContext - Erreur de connexion:', error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur d\'inscription')
      }

      console.log('AuthContext - Inscription réussie:', data)
      setUser(data.user)
      router.push('/profile')

      return data
    } catch (error) {
      console.error('AuthContext - Erreur d\'inscription:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setUser(null)
      router.push('/auth')
    } catch (error) {
      console.error('AuthContext - Erreur de déconnexion:', error)
    }
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider')
  }
  return context
}
