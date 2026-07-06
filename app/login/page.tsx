import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { LoginPageContent } from './LoginPageContent'

export const metadata: Metadata = {
  title: 'Accedi — 08 Natural Technology',
  description: 'Accedi al tuo account 08 Natural Technology',
}

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect(session.user.role === 'admin' ? '/admin' : '/account')
  return <LoginPageContent />
}
