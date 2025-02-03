import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = [
  '/',
  '/auth',
  '/dashboard/auth',
  '/categories',
  '/produits',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/admin/login',
  '/api/auth/admin/register'
]

// Routes réservées aux administrateurs
const adminRoutes = [
  '/dashboard',
  '/dashboard/products',
  '/dashboard/orders',
  '/dashboard/users'
]

// Routes réservées aux clients
const clientRoutes = [
  '/profile',
  '/orders',
  '/cart'
]

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Vérifier si c'est une route publique
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Si c'est la page d'authentification admin et que l'utilisateur est déjà connecté en tant qu'admin
    if (pathname === '/dashboard/auth') {
      const token = request.cookies.get('token')?.value
      if (token) {
        try {
          const decoded = verify(token, process.env.JWT_SECRET)
          if (decoded.role === 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
          }
        } catch (error) {
          // Token invalide, continuer normalement
        }
      }
    }
    return NextResponse.next()
  }

  // Vérifier si c'est une route admin ou client
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isClientRoute = clientRoutes.some(route => pathname.startsWith(route))

  // Récupérer le token depuis les cookies
  const token = request.cookies.get('token')?.value

  // Si pas de token, rediriger vers la page d'authentification appropriée
  if (!token) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/dashboard/auth', request.url))
    }
    if (isClientRoute) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
    return NextResponse.next()
  }

  try {
    // Vérifier le token
    const decoded = verify(token, process.env.JWT_SECRET)

    // Vérifier les permissions pour les routes admin
    if (isAdminRoute && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/auth', request.url))
    }

    // Ajouter les informations de l'utilisateur à la requête
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.userId)
    requestHeaders.set('x-user-role', decoded.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // En cas d'erreur de vérification du token
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/dashboard/auth', request.url))
    }
    if (isClientRoute) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
    return NextResponse.next()
  }
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (auth endpoints)
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /icons (inside /public)
     * 5. /images (inside /public)
     * 6. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/auth|_next|fonts|icons|images|[\\w-]+\\.\\w+).*)',
  ],
}
