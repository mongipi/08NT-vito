'use client'

import { LEGAL_OVERRIDE_EXAMPLE } from '@/lib/legal-overrides'

type Props = {
  name: string
  title: string
  initialValue: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #d1d5db',
  padding: '0.875rem 1rem',
  fontSize: '0.8125rem',
  color: '#111827',
  outline: 'none',
  borderRadius: '0.5rem',
  fontFamily: 'Consolas, Menlo, Monaco, monospace',
  lineHeight: 1.6,
  minHeight: '20rem',
  resize: 'vertical',
}

export function LegalOverrideEditor({ name, title, initialValue }: Props) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        padding: '1rem',
        background: '#fafafa',
        display: 'grid',
        gap: '0.75rem',
      }}
    >
      <strong style={{ fontSize: '0.95rem', color: '#111827' }}>{title}</strong>
      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', maxWidth: '56rem' }}>
        Inserisci qui un override completo in JSON per la versione italiana. Se lasci vuoto,
        il sito continua a usare il contenuto attuale già presente nel codice.
      </p>
      <textarea
        name={name}
        defaultValue={initialValue}
        placeholder={LEGAL_OVERRIDE_EXAMPLE}
        style={inputStyle}
        spellCheck={false}
      />
    </div>
  )
}
