'use client'

 
import { Toaster } from 'sonner'
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from "next-themes";
import { AuthProvider } from '../context/AuthContext';

export function RootLayoutClient({ children }) {
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
