'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'  
import { Input } from '../../components/ui/input' 
import { Label } from '../../components/ui/label'
import { Card } from '../../components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '../../components/landing/Navigation'
import { Footer } from '../../components/landing/Footer'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register, user } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phoneNumber: '', 
  })

  useEffect(() => {
    const mode = searchParams.get('mode')
    setIsLogin(mode !== 'register')
  }, [searchParams])

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      // Récupérer l'URL de redirection depuis les paramètres
      const redirectTo = searchParams.get('redirectTo')
      router.push(redirectTo || '/')
    }
  }, [user, router, searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Connexion
        await login(formData.email, formData.password)
        toast.success('Connexion réussie')
      } else {
        // Inscription
        if (formData.password !== formData.confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas')
          return
        }

        const userData = {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          phoneNumber: formData.phoneNumber
        }

        await register(userData)
        toast.success('Inscription réussie')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
          {/* Section gauche - Logo et texte */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left text-white"
          >
            <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
               <Image 
                src="/logo.webp"
                alt="Logo"
                width={200}
                height={200} 
             />
            </div>
            <p className="text-xl mb-4">
              {isLogin ? 'Connectez-vous pour accéder à votre compte' : 'Créez votre compte pour commencer vos achats'}
            </p>
            <p className="text-sm opacity-90">
              Rejoignez notre communauté et profitez d'une expérience d'achat unique
            </p>
          </motion.div>

          {/* Section droite - Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nom d'utilisateur</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Votre nom d'utilisateur"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+33612345678"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'S\'inscrire'}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    href={isLogin ? '/auth?mode=register' : '/auth?mode=login'}
                    className="text-black hover:text-orange-500 text-sm"
                  >
                    {isLogin
                      ? "Pas encore de compte ? S'inscrire"
                      : 'Déjà un compte ? Se connecter'}
                  </Link>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}
