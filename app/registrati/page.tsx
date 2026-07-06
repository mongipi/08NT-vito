import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { RegisterPageContent } from './RegisterPageContent'

export const metadata: Metadata = {
  title: 'Registrati — 08 Natural Technology',
  description: 'Crea il tuo account 08 Natural Technology',
}

export default async function RegisterPage() {
  const session = await auth()
  if (session?.user) redirect('/account')
  return <RegisterPageContent />
}
