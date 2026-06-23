import Link from 'next/link'

interface Props {
  title: string
  description?: string
  action?: { label: string; href: string }
}

export function PageHeader({ title, description, action }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>{title}</h1>
        {description && <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.1875rem', marginBottom: 0 }}>{description}</p>}
      </div>
      {action && (
        <Link href={action.href} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          background: '#1a4a2e', color: 'white', textDecoration: 'none',
          fontSize: '0.8125rem', fontWeight: 500, borderRadius: '0.4375rem',
          padding: '0.5rem 1rem', whiteSpace: 'nowrap',
        }}>
          <svg width="0.8125rem" height="0.8125rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {action.label}
        </Link>
      )}
    </div>
  )
}
