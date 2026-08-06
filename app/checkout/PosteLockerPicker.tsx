'use client'

import { useState } from 'react'
import { searchPosteLockersAction } from '@/lib/actions/poste'
import type { PosteLocker } from '@/lib/poste'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

interface Props {
  pickupPointCode: string
  onSelect: (code: string, address: string) => void
  inputStyle: React.CSSProperties
  labelStyle: React.CSSProperties
}

export function PosteLockerPicker({ pickupPointCode, onSelect, inputStyle, labelStyle }: Props) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const [cap, setCap] = useState('')
  const [lockers, setLockers] = useState<PosteLocker[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function search() {
    if (!/^\d{5}$/.test(cap)) {
      setError(t('checkout_pickup_zip_error'))
      return
    }
    setLoading(true)
    setError(null)
    setLockers([])
    try {
      const data = await searchPosteLockersAction(cap)
      if (data.errorKey) {
        setError(t(data.errorKey))
        return
      }
      const found = data.lockers ?? []
      if (found.length === 0) setError(t('checkout_pickup_none_found'))
      setLockers(found)
    } catch {
      setError(t('checkout_pickup_network_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div>
        <label style={labelStyle}>{t('checkout_poste_search_label')}</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text" inputMode="numeric" maxLength={5}
            value={cap}
            onChange={e => setCap(e.target.value.replace(/\D/g, ''))}
            placeholder={t('checkout_poste_zip_placeholder')}
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
            {loading ? '…' : t('checkout_pickup_search_button')}
          </button>
        </div>
      </div>

      {error && <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>{error}</p>}

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
                      {t('checkout_poste_hours_weekday')} {l.openTimeMon}–{l.closeTimeMon}
                      {l.openTimeSat ? ` · ${t('checkout_poste_hours_saturday')} ${l.openTimeSat}–${l.closeTimeSat}` : ''}
                    </span>
                  )}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
