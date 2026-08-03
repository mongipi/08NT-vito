import { requireAdmin } from '@/lib/auth/guards'
import { AdminShell } from './_components/AdminShell'

export const metadata = { title: { default: 'Admin', template: '%s | Admin 08NT' } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin()

  return <AdminShell user={user}>{children}</AdminShell>
}
