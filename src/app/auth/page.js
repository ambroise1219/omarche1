'use client'

import { Suspense } from 'react'
import AuthForm from '@/components/auth/AuthForm'

// Wrapper pour le contenu avec Suspense
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"/>
      </div>
    }>
      <AuthForm />
    </Suspense>
  )
}
