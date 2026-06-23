'use client'
import { useState } from 'react'

interface Props {
  name: string
  label: string
  defaultChecked?: boolean
}

export function ToggleField({ name, label, defaultChecked = false }: Props) {
  const [on, setOn] = useState(defaultChecked)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{label}</span>

      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(o => !o)}
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: on ? '#1a4a2e' : '#d1d5db',
          border: 'none', cursor: 'pointer', padding: 0,
          position: 'relative', flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 3, left: on ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }} />
      </button>

      {/* Valore reale nel form */}
      <input type="hidden" name={name} value={on ? 'on' : 'off'} />
    </div>
  )
}
