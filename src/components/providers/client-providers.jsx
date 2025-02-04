'use client'

import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "../../app/api/uploadthing/core"
import { CartProvider } from '../../context/CartContext'
import { ThemeProvider } from "next-themes"
import { AuthProvider } from '../../context/AuthContext'

export function ClientProviders({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster richColors position="top-center" />
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
