import { Geist, Geist_Mono } from "next/font/google";
import { Outfit } from "next/font/google";
import { Inter, Paytone_One } from 'next/font/google'
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "../components/Providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  display: "swap",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] })
const paytoneOne = Paytone_One({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-paytone'
})

export const metadata = {
  title: 'O\'marché - Votre marché en ligne',
  description: 'Découvrez O\'marché, votre marché en ligne local et responsable.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={outfit.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${inter.className} ${paytoneOne.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <Providers>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
