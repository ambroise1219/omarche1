'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Vérifier l'état de l'authentification au chargement
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('AuthContext - Utilisateur vérifié:', data)
        setUser(data.user)
      } else {
        const error = await response.json()
        console.log('AuthContext - Erreur d\'authentification:', error)
        setUser(null)
        
        // Si on est sur une page protégée, rediriger vers la page de connexion
        if (window.location.pathname !== '/auth') {
          router.push('/auth?redirectTo=' + window.location.pathname)
        }
      }
    } catch (error) {
      console.error('AuthContext - Erreur de vérification:', error)
      setUser(null)
      
      // Si on est sur une page protégée, rediriger vers la page de connexion
      if (window.location.pathname !== '/auth') {
        router.push('/auth?redirectTo=' + window.location.pathname)
      }
    } finally {
      setLoading(false)
    }
  }

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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider')
  }
  return context
}
