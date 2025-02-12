'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'

/**
 * Page d'authentification administrateur
 * Permet la connexion et l'inscription des administrateurs
 */
export default function AdminAuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // États pour les formulaires
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  /**
   * Gère la connexion d'un administrateur
   */
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      toast.success('Connexion réussie')
      
      // Redirection vers le dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Erreur de connexion:', error)
      toast.error(error.message || 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Gère l'inscription d'un nouvel administrateur
   */
  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (registerData.password !== registerData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas')
      }

      const response = await fetch('/api/auth/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          username: registerData.username
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      toast.success('Compte administrateur créé avec succès')
      
      // Connexion automatique après inscription
      const loginResponse = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
        }),
      })

      if (loginResponse.ok) {
        toast.success('Connexion réussie')
        // Redirection vers le dashboard
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      toast.error(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  // Gestionnaires de changement pour les formulaires
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-green/10 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Administration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Gérez votre espace administrateur
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="data-[state=active]:bg-custom-green data-[state=active]:text-white">
              Connexion
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-custom-green data-[state=active]:text-white">
              Inscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="mt-1"
                    placeholder="admin@omarche.com"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-custom-green hover:bg-custom-green/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    required
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="mt-1"
                    placeholder="admin@omarche.com"
                  />
                </div>

                <div>
                  <label htmlFor="register-username" className="block text-sm font-medium text-gray-700">
                    Nom d&apos;utilisateur
                  </label>
                  <Input
                    id="register-username"
                    name="username"
                    type="text"
                    required
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    className="mt-1"
                    placeholder="Admin"
                  />
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    required
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe
                  </label>
                  <Input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-custom-green hover:bg-custom-green/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Inscription...' : 'S\'inscrire'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
