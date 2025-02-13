'use client'

import { Suspense } from 'react'
import { Navigation } from '../../components/landing/Navigation'
import { Footer } from '../../components/landing/Footer'
import AuthForm from '../../components/auth/AuthForm'

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Chargement en cours...</div>}>
      <Navigation />
      <AuthForm />
      <Footer />
    </Suspense>
  )
}
