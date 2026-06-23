import Link from 'next/link'
import { createLine } from '@/lib/actions/admin/lines'
import { LineForm } from '../_LineForm'

export const metadata = { title: 'Nuova linea' }

export default function NuovaLineaPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, fontSize: 13 }}>
        <Link href="/admin/linee" style={{ color: '#6b7280', textDecoration: 'none' }}>← Linee</Link>
        <span style={{ color: '#d1d5db' }}>/</span>
        <span style={{ fontWeight: 500, color: '#111827' }}>Nuova linea</span>
      </div>
      <LineForm action={createLine} />
    </div>
  )
}
