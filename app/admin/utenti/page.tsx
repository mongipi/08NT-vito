import { searchUsers } from '@/services/users'
import Link from 'next/link'
import { PageHeader } from '../_components/PageHeader'
import { Badge } from '../_components/Badge'
import { SearchInput } from '../_components/SearchInput'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Utenti' }

const th: React.CSSProperties = { padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '1px solid #f0f1f3', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { padding: '0.6875rem 1rem', fontSize: '0.8125rem', color: '#374151', borderBottom: '1px solid #f7f8f9' }

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function UtentiPage({ searchParams }: Props) {
  const { q } = await searchParams

  const users = await searchUsers(q)

  return (
    <div>
      <PageHeader title="Utenti" description={`${users.length} utenti${q ? ' trovati' : ' registrati'}`} />
      <SearchInput placeholder="Cerca per nome, email, azienda o P.IVA…" />
      <div style={{ background: 'white', borderRadius: '0.625rem', border: '1px solid #e8eaed', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '36rem' }}>
            <thead>
              <tr>{['Nome', 'Email', 'Ruolo', 'Azienda', 'Iscritto il', ''].map(h => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '2.5rem 1rem' }}>
                  {q ? `Nessun utente trovato per "${q}"` : 'Nessun utente'}
                </td></tr>
              )}
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: '#f0f7f2', color: '#1a4a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>
                        {(u.name ?? u.email ?? 'U')[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, color: '#111827' }}>{u.name ?? '—'}</span>
                    </div>
                  </td>
                  <td style={{ ...td, color: '#6b7280' }}>{u.email}</td>
                  <td style={td}><Badge value={u.role} /></td>
                  <td style={{ ...td, color: '#9ca3af' }}>{u.company ?? '—'}</td>
                  <td style={{ ...td, color: '#9ca3af' }}>{formatDate(u.createdAt)}</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <Link href={`/admin/utenti/${u.id}`} style={{ fontSize: '0.75rem', fontWeight: 500, color: '#1a4a2e', textDecoration: 'none' }}>Modifica</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
