'use client'

import { useState } from 'react'
import { searchPosteLockersAction } from '@/lib/actions/poste'
import type { PosteLocker } from '@/lib/poste'


interface Props {
  pickupPointCode: string
  pickupPointAddress: string
  onSelect: (code: string, address: string) => void
  inputStyle: React.CSSProperties
  labelStyle: React.CSSProperties
}

export function PosteLockerPicker({ pickupPointCode, pickupPointAddress, onSelect, inputStyle, labelStyle }: Props) {
  const [cap, setCap] = useState('')
  const [lockers, setLockers] = useState<PosteLocker[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualOverride, setManualOverride] = useState(false)
  const [configurationMissing, setConfigurationMissing] = useState(false)

  async function search() {
    if (!/^\d{5}$/.test(cap)) {
      setError('Inserisci un CAP valido (5 cifre)')
      return
    }
    setLoading(true)
    setError(null)
    setLockers([])
    try {
      const data = await searchPosteLockersAction(cap)
      if (data.error) {
        setError(data.error)
        setConfigurationMissing(Boolean(data.configurationMissing))
        return
      }
      const found = data.lockers ?? []
      if (found.length === 0) setError('Nessun punto di ritiro trovato per questo CAP')
      setLockers(found)
    } catch {
      setError('Errore di rete durante la ricerca')
    } finally {
      setLoading(false)
    }
  }

  if (manualOverride) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div>
          <label style={labelStyle}>
            Indirizzo punto di ritiro<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
          </label>
          <input
            type="text"
            value={pickupPointAddress}
            onChange={e => onSelect(pickupPointCode, e.target.value)}
            placeholder="es. Ufficio Postale Via Roma 1, Palermo"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Codice punto <span style={{ color: 'var(--ink-4)', fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(opzionale)</span></label>
          <input
            type="text"
            value={pickupPointCode}
            onChange={e => onSelect(e.target.value, pickupPointAddress)}
            placeholder="es. 23625"
            style={{ ...inputStyle, fontFamily: 'monospace' }}
          />
        </div>
        <button
          type="button"
          onClick={() => setManualOverride(false)}
          style={{ alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, fontSize: '0.75rem', color: 'var(--forest)', textDecoration: 'underline', cursor: 'pointer' }}
        >
          Torna alla ricerca punti di ritiro
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div>
        <label style={labelStyle}>Cerca punto di ritiro per CAP</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text" inputMode="numeric" maxLength={5}
            value={cap}
            onChange={e => setCap(e.target.value.replace(/\D/g, ''))}
            placeholder="es. 00164"
            style={{ ...inputStyle, fontFamily: 'monospace' }}
          />
          <button
            type="button"
            onClick={search}
            disabled={loading}
            style={{
              background: 'var(--forest)', color: 'white', border: 'none', padding: '0 1.25rem',
              fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
              cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {loading ? '…' : 'Cerca'}
          </button>
        </div>
      </div>

      {error && <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>{error}</p>}

      <a
        href="https://www.poste.it/prenotazione/vieni-in-poste?vieni-in-poste"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: '0.75rem', color: 'var(--forest)', fontWeight: 500, width: 'max-content' }}
      >
        Visualizza i punti Poste Italiane vicino a te →
      </a>

      {lockers.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 280, overflowY: 'auto' }}>
          {lockers.map(l => {
            const active = l.officeCode === pickupPointCode
            const fullAddress = `${l.description} — ${l.address}, ${l.place} (${l.province})`
            return (
              <label key={l.officeCode} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer',
                padding: '0.625rem 0.75rem',
                border: active ? '1.5px solid var(--forest)' : '1px solid var(--border)',
                background: active ? '#f8faf9' : 'white',
              }}>
                <input
                  type="radio" name="posteLocker" checked={active}
                  onChange={() => onSelect(l.officeCode, fullAddress)}
                  style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem', marginTop: '0.125rem', flexShrink: 0 }}
                />
                <span>
                  <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ink)' }}>{l.description}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-4)', fontWeight: 300 }}>
                    {l.address}, {l.place} ({l.province})
                  </span>
                  {(l.openTimeMon || l.openTimeSat) && (
                    <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--ink-4)', marginTop: 2 }}>
                      Lun-Ven {l.openTimeMon}–{l.closeTimeMon}{l.openTimeSat ? ` · Sab ${l.openTimeSat}–${l.closeTimeSat}` : ''}
                    </span>
                  )}
                </span>
              </label>
            )
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setManualOverride(true)}
        style={{ alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, fontSize: '0.75rem', color: 'var(--ink-4)', textDecoration: 'underline', cursor: 'pointer' }}
      >
        {configurationMissing
          ? 'Inserisci il punto Poste scelto'
          : 'Non trovi il tuo punto? Inseriscilo manualmente'}
      </button>
    </div>
  )
}
