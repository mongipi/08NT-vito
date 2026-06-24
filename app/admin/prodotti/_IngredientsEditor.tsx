'use client'
import { useState } from 'react'
import { s } from '../_components/styles'

interface Ingredient {
  name: string
  dosage?: string | null
}

export function IngredientsEditor({ defaultValue }: { defaultValue: Ingredient[] }) {
  const [items, setItems] = useState<Ingredient[]>(
    defaultValue.length > 0 ? defaultValue : [{ name: '', dosage: '' }]
  )

  function add() {
    setItems(prev => [...prev, { name: '', dosage: '' }])
  }

  function remove(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function update(i: number, field: keyof Ingredient, value: string) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  return (
    <div style={s.stack(10)}>
      <input type="hidden" name="ingredients" value={JSON.stringify(items.filter(i => i.name.trim()))} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2rem', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Ingrediente</span>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Per dose</span>
        <span />
      </div>

      {items.map((item, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2rem', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            value={item.name}
            onChange={e => update(i, 'name', e.target.value)}
            placeholder="es. Agnocasto E.S."
            style={s.input}
          />
          <input
            type="text"
            value={item.dosage ?? ''}
            onChange={e => update(i, 'dosage', e.target.value)}
            placeholder="es. 200 mg"
            style={s.input}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={items.length === 1}
            style={{
              width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb',
              background: 'white', cursor: items.length === 1 ? 'not-allowed' : 'pointer',
              color: '#9ca3af', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: items.length === 1 ? 0.4 : 1, padding: 0, flexShrink: 0,
            }}
            aria-label="Rimuovi"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          fontSize: '0.75rem', fontWeight: 500, color: '#1a4a2e',
          background: 'none', border: '1px dashed #a7c4b0',
          borderRadius: '0.4375rem', padding: '0.4375rem 0.75rem', cursor: 'pointer', width: '100%',
          justifyContent: 'center',
        }}
      >
        <svg width="0.75rem" height="0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Aggiungi ingrediente
      </button>
    </div>
  )
}
