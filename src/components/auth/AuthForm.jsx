'use client'

import React from 'react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Mail, Lock, UserPlus, UserCheck } from 'lucide-react'

const tabs = {
  login: {
    title: 'Connexion',
    icon: <UserCheck className="w-6 h-6" />,
    buttonText: 'Se connecter'
  },
  register: {
    title: 'Inscription',
    icon: <UserPlus className="w-6 h-6" />,
    buttonText: 'S\'inscrire'
  }
}

export default function AuthForm(props) {
  const { mode = 'login' } = props
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password)
        toast.success('Connexion réussie')
      } else {
        await register(formData)
        toast.success('Inscription réussie')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            {Object.entries(tabs).map(([key, { title, icon }]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors ${
                  mode === key
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {icon}
                <span className="font-medium">{title}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nom d&apos;utilisateur
                  </label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={loading}
                    className="w-full"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                    className="pl-10"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? 'Chargement...' : tabs[mode].buttonText}
              </Button>
            </form>

            {mode === 'login' && (
              <div className="mt-4 text-center">
                <Link
                  href="/reset-password"
                  className="text-sm text-orange-600 hover:text-orange-500"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
