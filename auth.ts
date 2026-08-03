import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import authConfig from './auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
// prisma serve qui solo come storage dell'adapter NextAuth; le query applicative
// passano da services/users.
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth/password'
import { createUser, getUserByEmail, updateUser } from '@/services/users'

class EmailNotVerifiedError extends CredentialsSignin {
  code = 'email_not_verified'
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: 'consumer' | 'b2b' | 'admin'
      stripeCustomerId?: string | null
    }
  }
  interface User {
    role: 'consumer' | 'b2b' | 'admin'
    stripeCustomerId?: string | null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await getUserByEmail(credentials.email as string)
        if (!user?.password) return null
        const valid = await verifyPassword(credentials.password as string, user.password)
        if (!valid) return null
        if (!user.emailVerified) throw new EmailNotVerifiedError()
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as 'consumer' | 'b2b' | 'admin',
          stripeCustomerId: user.stripeCustomerId,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const email = user.email!
        const existing = await getUserByEmail(email)
        if (!existing) {
          await createUser({
            email,
            name: user.name,
            image: user.image,
            role: 'consumer',
            emailVerified: new Date(),
          })
        } else if (!existing.emailVerified) {
          await updateUser(existing.id, { emailVerified: new Date() })
        }
      }
      return true
    },
  },
})
