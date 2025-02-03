'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from '../../components/dashboard/Header'
import Sidebar from '../../components/dashboard/Sidebar'
import { DashboardProvider } from '../../contexts/DashboardContext'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Récupérer les informations de l'utilisateur
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Ne pas afficher le layout sur la page d'authentification
  if (pathname === '/dashboard/auth') {
    return children
  }

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-custom-green"></div>
      </div>
    )
  }

  // Ne pas afficher le contenu si pas d'utilisateur
  if (!user) {
    return null
  }

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-gray-100">
        
        <div className="flex flex-1 flex-col overflow-hidden">
          
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  )
}
