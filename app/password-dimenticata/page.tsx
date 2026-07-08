import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { ForgotPasswordContent } from './ForgotPasswordContent'

export const metadata: Metadata = {
  title: 'Password dimenticata — 08 Natural Technology',
  description: 'Reimposta la password del tuo account 08 Natural Technology',
}

export default async function ForgotPasswordPage() {
  const session = await auth()
  if (session?.user) redirect('/account')
  return <ForgotPasswordContent />
}
