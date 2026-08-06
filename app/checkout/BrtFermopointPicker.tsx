'use client'

import { useState } from 'react'
import { searchBrtPudoByZipAction, searchBrtPudoByLatLngAction } from '@/lib/actions/brt'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

interface BrtPudoPoint {
  pudoId: string
  name: string
  address: string
  zipCode: string
  town: string
  type: string
  distanceMeters: number | null
  localizationHint: string
  hours: { dayOfWeek: number; morning: string | null; afternoon: string | null }[]
}

interface Props {
  pickupPointCode: string
  onSelect: (code: string, address: string) => void
  inputStyle: React.CSSProperties
  labelStyle: React.CSSProperties
  defaultZip?: string
}

const DAY_LABELS_IT = ['', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const DAY_LABELS_EN = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function formatDistance(meters: number | null, locale: 'it' | 'en'): string | null {
  if (meters === null) return null
  if (meters < 1000) return `${Math.round(meters)} m`
  const km = (meters / 1000).toFixed(1)
  return `${locale === 'it' ? km.replace('.', ',') : km} km`
}

function formatHours(hours: BrtPudoPoint['hours'], locale: 'it' | 'en'): string | null {
  if (!hours || hours.length === 0) return null
  const labels = locale === 'it' ? DAY_LABELS_IT : DAY_LABELS_EN
  const parts = hours
    .filter((h) => h.morning || h.afternoon)
    .map((h) => {
      const dayLabel = labels[h.dayOfWeek] ?? String(h.dayOfWeek)
      const slots = [h.morning, h.afternoon].filter(Boolean).join(', ')
      return `${dayLabel} ${slots}`
    })
  return parts.length > 0 ? parts.join(' · ') : null
}

export function BrtFermopointPicker({
  pickupPointCode,
  onSelect,
  inputStyle,
  labelStyle,
  defaultZip,
}: Props) {
  const { locale } = useLocale()
  const t = useTranslation(locale)

  const [zip, setZip] = useState(defaultZip ?? '')
  const [points, setPoints] = useState<BrtPudoPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function search() {
    if (!/^\d{5}$/.test(zip)) {
      setError(t('checkout_pickup_zip_error'))
      return
    }
    setLoading(true)
    setError(null)
    setPoints([])
    try {
      const data = await searchBrtPudoByZipAction(zip, locale)
      if (data.errorKey) {
        setError(t(data.errorKey))
        return
      }
      const found = data.points ?? []
      if (found.length === 0) setError(t('checkout_pickup_none_found'))
      setPoints(found)
    } catch {
      setError(t('checkout_pickup_network_error'))
    } finally {
      setLoading(false)
    }
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setError(t('checkout_brt_geolocation_unavailable'))
      return
    }
    setLocating(true)
    setError(null)
    setPoints([])
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await searchBrtPudoByLatLngAction(pos.coords.latitude, pos.coords.longitude, locale)
          if (data.errorKey) {
            setError(t(data.errorKey))
            return
          }
          const found = data.points ?? []
          if (found.length === 0) setError(t('checkout_pickup_none_found'))
          setPoints(found)
        } catch {
          setError(t('checkout_pickup_network_error'))
        } finally {
          setLocating(false)
        }
      },
      (err) => {
        setLocating(false)
        setError(err.code === err.PERMISSION_DENIED ? t('checkout_brt_geolocation_denied') : t('checkout_brt_geolocation_unavailable'))
      }
    )
  }

  const busy = loading || locating

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div>
        <label style={labelStyle}>{t('checkout_pickup_search_zip')}</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
          placeholder={t('checkout_pickup_search_zip_placeholder')}
          style={{ ...inputStyle, fontFamily: 'monospace' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={search}
          disabled={busy}
          style={{
            background: 'var(--forest)', color: 'white', border: 'none', padding: '0.625rem 1.25rem',
            fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
            cursor: busy ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
          }}
        >
          {loading ? '…' : t('checkout_pickup_search_button')}
        </button>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={busy}
          style={{
            background: 'white', color: 'var(--forest)', border: '1px solid var(--forest)', padding: '0.625rem 1.25rem',
            fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
            cursor: busy ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
          }}
        >
          {locating ? t('checkout_brt_locating') : t('checkout_brt_use_location')}
        </button>
      </div>

      {error && <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>{error}</p>}

      {points.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 280, overflowY: 'auto' }}>
          {points.map((p) => {
            const active = p.pudoId === pickupPointCode
            const fullAddress = `${p.name} — ${p.address}, ${p.town} (${p.zipCode})`
            const distanceLabel = formatDistance(p.distanceMeters, locale)
            const hoursLabel = formatHours(p.hours, locale)
            return (
              <label
                key={p.pudoId}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer',
                  padding: '0.625rem 0.75rem',
                  border: active ? '1.5px solid var(--forest)' : '1px solid var(--border)',
                  background: active ? '#f8faf9' : 'white',
                }}
              >
                <input
                  type="radio"
                  name="brtPudo"
                  checked={active}
                  onChange={() => onSelect(p.pudoId, fullAddress)}
                  style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem', marginTop: '0.125rem', flexShrink: 0 }}
                />
                <span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ink)' }}>
                    {p.name}
                    <span style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', border: '1px solid var(--border)', padding: '0.0625rem 0.375rem' }}>
                      {p.type === 'LOCKER' ? t('checkout_brt_type_locker') : t('checkout_brt_type_shop')}
                    </span>
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-4)', fontWeight: 300 }}>
                    {p.address}, {p.town} ({p.zipCode})
                    {distanceLabel ? ` · ${t('checkout_brt_distance', { distance: distanceLabel })}` : ''}
                  </span>
                  {hoursLabel && (
                    <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--ink-4)', marginTop: 2 }}>{hoursLabel}</span>
                  )}
                  {p.localizationHint && (
                    <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--ink-4)', marginTop: 2, fontStyle: 'italic' }}>{p.localizationHint}</span>
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
