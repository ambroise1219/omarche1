import './globals.css'
import { Geist, Geist_Mono } from "next/font/google"
import { Outfit } from "next/font/google"
import { Inter, Paytone_One } from 'next/font/google'
import { ClientProviders } from '../components/providers/client-providers'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: 'swap',
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: 'swap',
  subsets: ["latin"],
})

const outfit = Outfit({
  variable: "--font-outfit",
  display: 'swap',
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  display: 'swap',
  subsets: ["latin"],
})

const paytoneOne = Paytone_One({
  variable: "--font-paytone-one",
  display: 'swap',
  subsets: ["latin"],
  weight: "400",
})

export const metadata = {
  title: "O'Marché - Produits frais et locaux",
  description: 'Votre marché en ligne de produits frais et locaux. Livraison rapide et paiement sécurisé.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
