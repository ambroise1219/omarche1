import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

// Routes qui nécessitent une authentification client
const protectedClientRoutes = [
  '/profile'
]

// Routes du dashboard (déjà protégées par la session existante)
const dashboardRoutes = [
  '/dashboard',
  '/dashboard/auth'
]

// Routes publiques qui ne doivent pas être protégées
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/me',
  '/api/auth/logout',
  '/auth',
  '/'
]

// Vérifier si c'est une ressource statique
const isStaticResource = (path) => {
  return path.startsWith('/_next') || 
         path.startsWith('/images') || 
         path.startsWith('/fonts') || 
         path.startsWith('/icons') || 
         path.includes('.') ||
         path.startsWith('/api/categories')
}

// Vérifier si c'est une route dashboard
const isDashboardRoute = (path) => {
  return dashboardRoutes.some(route => path.startsWith(route))
}

// Vérifier si c'est une route client protégée
const isProtectedClientRoute = (path) => {
  return protectedClientRoutes.some(route => path.startsWith(route))
}

// Vérifier si c'est une route publique
const isPublicRoute = (path) => {
  return publicRoutes.some(route => path.startsWith(route))
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Permettre l'accès aux ressources statiques et routes publiques
  if (isStaticResource(pathname) || isPublicRoute(pathname)) {
    console.log('Middleware - Route publique ou statique:', pathname)
    return NextResponse.next()
  }

  // Si c'est une route dashboard, laisser la logique existante gérer
  if (isDashboardRoute(pathname)) {
    return NextResponse.next()
  }

  // Pour la route /profile (protégée)
  if (isProtectedClientRoute(pathname)) {
    console.log('Middleware - Route protégée détectée:', pathname)
    
    const authToken = request.cookies.get('authToken')?.value
    console.log('Middleware - Token trouvé:', !!authToken)

    if (!authToken) {
      console.log('Middleware - Pas de token, redirection vers /auth')
      const response = NextResponse.redirect(new URL('/auth', request.url))
      response.headers.set('x-middleware-cache', 'no-cache')
      return response
    }

    try {
      // Vérifier le token
      const decoded = verify(authToken, process.env.JWT_SECRET)
      console.log('Middleware - Token vérifié avec succès:', { userId: decoded.userId })
      
      // Si le token est valide, permettre l'accès
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', decoded.userId)
      requestHeaders.set('x-user-email', decoded.email)

      // Cloner la requête avec les nouveaux headers
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

      // Important: Conserver le cookie dans la réponse
      response.cookies.set('authToken', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 jours
      })

      // Désactiver le cache pour les routes protégées
      response.headers.set('x-middleware-cache', 'no-cache')
      response.headers.set('Cache-Control', 'no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')

      return response
    } catch (error) {
      console.error('Middleware - Erreur de vérification du token:', error)
      
      // Si le token est invalide, supprimer le cookie et rediriger
      const response = NextResponse.redirect(new URL('/auth', request.url))
      response.cookies.set('authToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0)
      })

      // Désactiver le cache pour la redirection
      response.headers.set('x-middleware-cache', 'no-cache')
      response.headers.set('Cache-Control', 'no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    }
  }

  // Pour toutes les autres routes (e-commerce public)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon|robots.txt).*)',
  ],
}
