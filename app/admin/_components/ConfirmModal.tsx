'use client'

import { useEffect, useRef } from 'react'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ open, title, message, confirmLabel = 'Conferma', cancelLabel = 'Annulla', danger = false, onConfirm, onCancel }: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) confirmRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 12, padding: '1.75rem',
          maxWidth: 420, width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600, color: '#111' }}>
          {title}
        </h2>
        <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.625rem 1.125rem',
              background: '#f3f4f6', color: '#374151',
              border: '1px solid #e5e7eb', borderRadius: 8,
              fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            style={{
              padding: '0.625rem 1.25rem',
              background: danger ? '#dc2626' : '#15803d',
              color: '#fff', border: 'none', borderRadius: 8,
              fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
