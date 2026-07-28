'use client'
import { useState } from 'react'
import { s } from '../_components/styles'

interface Variant {
  label: string
  quantity: number | string
  price: number | string
  comparePrice?: number | string | null
  b2bPrice?: number | string | null
  stock: number | string
  image?: string
}

const EMPTY: Variant = { label: '', quantity: '', price: '', comparePrice: '', b2bPrice: '', stock: '' }

function parseDecimal(value: number | string | null | undefined) {
  const normalized = String(value ?? '').trim().replace(',', '.')
  if (!normalized) return 0
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

export function VariantsEditor({ defaultValue }: { defaultValue: Variant[] }) {
  const [items, setItems] = useState<Variant[]>(defaultValue)

  function add() {
    setItems(prev => [...prev, { ...EMPTY }])
  }

  function remove(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function update(i: number, field: keyof Variant, value: string) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  const payload = items
    .filter(v => v.label.trim())
    .map(v => ({
      label: v.label,
      quantity: parseInt(String(v.quantity)) || 0,
      price: parseDecimal(v.price),
      comparePrice: v.comparePrice ? parseDecimal(v.comparePrice) : null,
      b2bPrice: v.b2bPrice ? parseDecimal(v.b2bPrice) : null,
      stock: parseInt(String(v.stock)) || 0,
    }))

  return (
    <div style={s.stack(10)}>
      <input type="hidden" name="variants" value={JSON.stringify(payload)} />

      {items.length === 0 ? (
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
          Nessuna variante: il prodotto usa il prezzo e le scorte definiti in &quot;Prezzo &amp; Stock&quot;.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.9fr 0.9fr 0.9fr 0.8fr 4.5rem 2rem', gap: '0.5rem' }}>
          {['Label (es. 30 pastiglie)', 'Pezzi', 'Vendita €', 'Originale €', 'B2B €', 'Scorte', 'Immagine', ''].map(h => (
            <span key={h} style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
          ))}
        </div>
      )}

      {items.map((item, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.9fr 0.9fr 0.9fr 0.8fr 4.5rem 2rem', gap: '0.5rem', alignItems: 'center' }}>
          <input type="text" value={item.label} onChange={e => update(i, 'label', e.target.value)} placeholder="es. 30 pastiglie" style={s.input} />
          <input type="number" value={item.quantity} onChange={e => update(i, 'quantity', e.target.value)} placeholder="30" style={s.input} />
          <input type="text" inputMode="decimal" value={item.price} onChange={e => update(i, 'price', e.target.value)} placeholder="0,00" style={s.input} />
          <input type="text" inputMode="decimal" value={item.comparePrice ?? ''} onChange={e => update(i, 'comparePrice', e.target.value)} placeholder="0,00" style={s.input} />
          <input type="text" inputMode="decimal" value={item.b2bPrice ?? ''} onChange={e => update(i, 'b2bPrice', e.target.value)} placeholder="0,00" style={s.input} />
          <input type="number" value={item.stock} onChange={e => update(i, 'stock', e.target.value)} placeholder="0" style={s.input} />
          <label style={{
            height: '2.5rem',
            border: '1px dashed #d1d5db',
            background: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
            fontSize: '0.625rem',
            color: '#6b7280',
          }}>
            {item.image
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              : 'Carica'}
            <input
              type="file"
              name={`img_variant_${i}`}
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                const preview = URL.createObjectURL(file)
                setItems(prev => prev.map((variant, index) => index === i ? { ...variant, image: preview } : variant))
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => remove(i)}
            style={{
              width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb',
              background: 'white', cursor: 'pointer',
              color: '#9ca3af', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, flexShrink: 0,
            }}
            aria-label="Rimuovi variante"
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
        Aggiungi variante
      </button>
    </div>
  )
}
