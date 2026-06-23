import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminShell } from './_components/AdminShell'

export const metadata = { title: { default: 'Admin', template: '%s | Admin 08NT' } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    redirect('/login')
  }

  return <AdminShell user={session.user}>{children}</AdminShell>
}
