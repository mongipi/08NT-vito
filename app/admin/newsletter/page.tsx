import Link from 'next/link'
import { PageHeader } from '../_components/PageHeader'
import { Badge } from '../_components/Badge'
import { formatDate } from '@/lib/utils'
import { getSubscriberCounts, getSubscribers } from '@/services/newsletter'
import { searchUsers } from '@/services/users'

export const metadata = { title: 'Newsletter' }

const th: React.CSSProperties = {
  padding: '0.625rem 1rem',
  textAlign: 'left',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#9ca3af',
  borderBottom: '1px solid #f0f1f3',
  whiteSpace: 'nowrap',
}
const td: React.CSSProperties = {
  padding: '0.6875rem 1rem',
  fontSize: '0.8125rem',
  color: '#374151',
  borderBottom: '1px solid #f7f8f9',
}

export default async function NewsletterPage() {
  const [subscribers, counts, users] = await Promise.all([
    getSubscribers(),
    getSubscriberCounts(),
    searchUsers(),
  ])

  // Un iscritto puo' anche essere un cliente registrato: le due cose sono
  // indipendenti, ma in elenco e' utile vederlo.
  const customerEmails = new Set(users.map((user) => user.email))

  const stats = [
    { label: 'Iscritti attivi', value: counts.active, color: '#15803d', bg: '#f0fdf4' },
    { label: 'In attesa di conferma', value: counts.pending, color: '#b45309', bg: '#fffbeb' },
    { label: 'Disiscritti', value: counts.unsubscribed, color: '#6b7280', bg: '#f9fafb' },
    { label: 'Totale', value: counts.total, color: '#1d4ed8', bg: '#eff6ff' },
  ]

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description={`${counts.active} iscritti attivi su ${counts.total} indirizzi`}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: stat.bg,
              border: '1px solid #e8eaed',
              borderRadius: '0.625rem',
              padding: '1rem 1.125rem',
            }}
          >
            <p style={{ margin: 0, fontSize: '1.375rem', fontWeight: 600, color: stat.color }}>
              {stat.value}
            </p>
            <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Link
          href="/admin/newsletter/export"
          prefetch={false}
          style={{
            display: 'inline-block',
            padding: '0.5rem 0.875rem',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#111827',
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            textDecoration: 'none',
          }}
        >
          Esporta CSV
        </Link>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '0.75rem' }}>
          Esporta i soli iscritti attivi, gli unici a cui e&apos; consentito scrivere.
        </span>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '0.625rem',
          border: '1px solid #e8eaed',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '44rem' }}>
            <thead>
              <tr>
                {['Email', 'Stato', 'Cliente', 'Origine', 'Lingua', 'Iscritto il', 'Confermato il'].map(
                  (h) => (
                    <th key={h} style={th}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '2.5rem 1rem' }}
                  >
                    Nessun iscritto.
                  </td>
                </tr>
              )}
              {subscribers.map((sub) => {
                return (
                  <tr key={sub.id}>
                    <td style={{ ...td, fontWeight: 500, color: '#111827' }}>{sub.email}</td>
                    <td style={td}>
                      <Badge value={sub.status} />
                    </td>
                    <td style={{ ...td, color: '#9ca3af' }}>
                      {customerEmails.has(sub.email) ? 'sì' : '—'}
                    </td>
                    <td style={{ ...td, color: '#6b7280' }}>{sub.source}</td>
                    <td style={{ ...td, color: '#6b7280' }}>{sub.locale}</td>
                    <td style={{ ...td, color: '#6b7280' }}>{formatDate(sub.createdAt)}</td>
                    <td style={{ ...td, color: '#6b7280' }}>
                      {sub.confirmedAt ? formatDate(sub.confirmedAt) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
