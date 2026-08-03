import { getLineById } from '@/services/lines'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { updateLine, deleteLine } from '@/lib/actions/admin/lines'
import { LineForm } from '../_LineForm'

export default async function EditLineaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const line = await getLineById(id)
  if (!line) notFound()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, fontSize: 13 }}>
        <Link href="/admin/linee" style={{ color: '#6b7280', textDecoration: 'none' }}>← Linee</Link>
        <span style={{ color: '#d1d5db' }}>/</span>
        <span style={{ fontWeight: 500, color: '#111827' }}>{line.name}</span>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: line.color, marginLeft: 4 }} />
      </div>
      <LineForm action={updateLine} line={line} deleteAction={deleteLine} />
    </div>
  )
}
