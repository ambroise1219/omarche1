import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

/**
 * Configuration de NextAuth avec une stratégie de session JWT
 * et une meilleure gestion de la persistance
 */
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()
          
          // Stockage des informations importantes dans le token
          return {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            role: data.user.role,
            accessToken: data.token
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 heures
    updateAge: 60 * 60, // Mise à jour toutes les heures
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 heures
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Première connexion : ajout des informations au token
        token.id = user.id
        token.email = user.email
        token.username = user.username
        token.role = user.role
        token.accessToken = user.accessToken
      }

      // Vérifier si le token a besoin d'être rafraîchi
      const shouldRefreshTime = Math.round((token.exp ?? 0) - 30 * 60 - Date.now() / 1000)
      
      if (shouldRefreshTime > 0) {
        return token
      }

      // Rafraîchir le token
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token.accessToken}`,
          }
        })

        if (!response.ok) {
          throw new Error('Failed to refresh token')
        }

        const data = await response.json()
        
        return {
          ...token,
          accessToken: data.token,
          exp: Math.floor(Date.now() / 1000 + 24 * 60 * 60), // 24 heures
        }
      } catch (error) {
        console.error('Error refreshing token:', error)
        return { ...token, error: 'RefreshAccessTokenError' }
      }
    },
    async session({ session, token }) {
      if (token) {
        // Transférer les informations du token à la session
        session.user = {
          id: token.id,
          email: token.email,
          username: token.username,
          role: token.role
        }
        session.accessToken = token.accessToken
        session.error = token.error
      }
      return session
    }
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }
