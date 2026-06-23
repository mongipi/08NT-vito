import type React from 'react'

export const s = {
  label: {
    display: 'block',
    fontSize: '0.6875rem',
    fontWeight: 500,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#6b7280',
    marginBottom: '0.375rem',
  } satisfies React.CSSProperties,

  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    padding: '0.5rem 0.625rem',
    fontSize: '0.875rem',
    color: '#111827',
    outline: 'none',
    background: 'white',
    fontFamily: 'inherit',
  } satisfies React.CSSProperties,

  select: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    padding: '0.5rem 0.625rem',
    fontSize: '0.875rem',
    color: '#111827',
    outline: 'none',
    background: 'white',
    fontFamily: 'inherit',
    appearance: 'auto',
  } satisfies React.CSSProperties,

  cardPad: {
    background: 'white',
    borderRadius: '0.625rem',
    border: '1px solid #e8eaed',
    padding: '1.25rem',
  } satisfies React.CSSProperties,

  card: {
    background: 'white',
    borderRadius: '0.625rem',
    border: '1px solid #e8eaed',
    overflow: 'hidden',
  } satisfies React.CSSProperties,

  cardHeader: {
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid #f0f1f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } satisfies React.CSSProperties,

  cardTitle: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#374151',
    marginTop: 0,
    marginBottom: '0.875rem',
  } satisfies React.CSSProperties,

  btnPrimary: {
    width: '100%',
    padding: '0.6875rem 1rem',
    background: '#1a4a2e',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.02em',
  } satisfies React.CSSProperties,

  btnDanger: {
    width: '100%',
    padding: '0.5625rem 1rem',
    background: 'white',
    color: '#dc2626',
    border: '1px solid #fca5a5',
    borderRadius: '0.375rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
  } satisfies React.CSSProperties,

  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.875rem',
  } satisfies React.CSSProperties,

  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  } satisfies React.CSSProperties,

  link: {
    fontSize: '0.8125rem',
    color: '#6b7280',
    textDecoration: 'none',
  } satisfies React.CSSProperties,

  linkGreen: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: '#1a4a2e',
    textDecoration: 'none',
  } satisfies React.CSSProperties,

  mono: {
    fontFamily: 'monospace',
    fontSize: '0.8125rem',
    color: '#374151',
  } satisfies React.CSSProperties,

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '28rem',
  } satisfies React.CSSProperties,

  th: {
    padding: '0.625rem 1rem',
    textAlign: 'left',
    fontSize: '0.6875rem',
    fontWeight: 600,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: '#9ca3af',
    borderBottom: '1px solid #f0f1f3',
    whiteSpace: 'nowrap',
  } satisfies React.CSSProperties,

  td: {
    padding: '0.6875rem 1rem',
    fontSize: '0.8125rem',
    color: '#374151',
    borderBottom: '1px solid #f7f8f9',
  } satisfies React.CSSProperties,

  stack: (gap: number): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    gap: `${gap / 16}rem`,
  }),
}
