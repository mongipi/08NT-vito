import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? 'consumer'
        token.stripeCustomerId = (user as { stripeCustomerId?: string }).stripeCustomerId ?? null
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = (token.role as 'consumer' | 'b2b' | 'admin') ?? 'consumer'
      session.user.stripeCustomerId = token.stripeCustomerId as string | null
      return session
    },
  },
} satisfies NextAuthConfig
