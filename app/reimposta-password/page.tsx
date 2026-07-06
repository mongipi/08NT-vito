import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { ResetPasswordContent } from './ResetPasswordContent'

export const metadata: Metadata = {
  title: 'Reimposta password — 08 Natural Technology',
  description: 'Scegli una nuova password per il tuo account 08 Natural Technology',
}

export default async function ResetPasswordPage() {
  const session = await auth()
  if (session?.user) redirect('/account')
  return <ResetPasswordContent />
}
