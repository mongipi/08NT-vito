import { useState } from 'react'
import { searchBrtFermopointsAction } from '@/lib/actions/brt'

interface BrtFermopoint {
  id: string
  name: string
  address: string
  city: string
  province: string
  postalCode: string
  distanceKm?: number
  openingHours?: string
}

interface Props {
  pickupPointCode: string
  pickupPointAddress: string
  onSelect: (code: string, address: string) => void
  inputStyle: React.CSSProperties
  labelStyle: React.CSSProperties
  postalCode: string
  t: (key: string, vars?: Record<string, string | number>) => string
}

export function BrtFermopointPicker({
  pickupPointCode,
  pickupPointAddress,
  onSelect,
  inputStyle,
  labelStyle,
  postalCode,
  t,
}: Props) {
  const [cap, setCap] = useState(postalCode)
  const [points, setPoints] = useState<BrtFermopoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualOverride, setManualOverride] = useState(false)
  const [configurationMissing, setConfigurationMissing] = useState(false)

  async function searchByAddress() {
    if (!/^\d{5}$/.test(cap)) {
      setError(t('checkout_brt_cap_error'))
      return
    }

    setLoading(true)
    setError(null)
    setPoints([])

    try {
      const data = await searchBrtFermopointsAction(cap)
      if (data.error) {
        setConfigurationMissing(Boolean(data.configurationMissing))
        setError(data.error)
        return
      }

      const found = data.points ?? []
      if (found.length === 0) setError(t('checkout_brt_none_found'))
      setPoints(found.slice(0, 25))
    } catch {
      setError(t('checkout_brt_network_error'))
    } finally {
      setLoading(false)
    }
  }

  function searchByLocation() {
    if (!navigator.geolocation) {
      setError(t('checkout_brt_geolocation_unavailable'))
      return
    }

    setLoading(true)
    setError(null)
    setPoints([])

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await searchBrtFermopointsAction(undefined, undefined, undefined, position.coords.latitude, position.coords.longitude)
          if (data.error) {
            setConfigurationMissing(Boolean(data.configurationMissing))
            setError(data.error)
            return
          }

          const found = data.points ?? []
          if (found.length === 0) setError(t('checkout_brt_none_found'))
          setPoints(found.slice(0, 25))
        } catch {
          setError(t('checkout_brt_network_error'))
        } finally {
          setLoading(false)
        }
      },
      () => {
        setLoading(false)
        setError(t('checkout_brt_geolocation_denied'))
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  if (manualOverride) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
          {t('checkout_brt_manual_entry')}
        </div>
        <div>
          <label style={labelStyle}>
            {t('checkout_pickup_address')}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
          </label>
          <input
            type="text"
            value={pickupPointAddress}
            onChange={e => onSelect(pickupPointCode, e.target.value)}
            placeholder={t('checkout_pickup_address_placeholder')}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>{t('checkout_pickup_code')}</label>
          <input
            type="text"
            value={pickupPointCode}
            onChange={e => onSelect(e.target.value, pickupPointAddress)}
            placeholder={t('checkout_pickup_code_placeholder')}
            style={{ ...inputStyle, fontFamily: 'monospace' }}
          />
        </div>
        <button
          type="button"
          onClick={() => setManualOverride(false)}
          style={{ alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, fontSize: '0.75rem', color: 'var(--forest)', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {t('checkout_brt_back_search')}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
        {t('checkout_brt_intro')}
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>{t('checkout_postal_code')}</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={cap}
            onChange={e => setCap(e.target.value.replace(/\D/g, ''))}
            placeholder="00164"
            style={{ ...inputStyle, fontFamily: 'monospace' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
        <button
          type="button"
          onClick={searchByAddress}
          disabled={loading}
          style={{
            background: 'var(--forest)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '...' : t('checkout_brt_search_address')}
        </button>
        <button
          type="button"
          onClick={searchByLocation}
          disabled={loading}
          style={{
            background: 'white',
            color: 'var(--forest)',
            border: '1px solid var(--border-2)',
            padding: '0.75rem 1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {t('checkout_brt_use_location')}
        </button>
      </div>

      {error && <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>{error}</p>}

      <a
        href="https://www.mybrt.it/it/mybrt/parcel-shops"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: '0.75rem', color: 'var(--forest)', fontWeight: 500, width: 'max-content' }}
      >
        {t('checkout_brt_open_locator')} →
      </a>

      {points.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 320, overflowY: 'auto' }}>
          {points.map((point) => {
            const active = point.id === pickupPointCode
            const fullAddress = `${point.name} - ${point.address}, ${point.city} (${point.province})`

            return (
              <label
                key={point.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  cursor: 'pointer',
                  padding: '0.625rem 0.75rem',
                  border: active ? '1.5px solid var(--forest)' : '1px solid var(--border)',
                  background: active ? '#f8faf9' : 'white',
                }}
              >
                <input
                  type="radio"
                  name="brtFermopoint"
                  checked={active}
                  onChange={() => onSelect(point.id, fullAddress)}
                  style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem', marginTop: '0.125rem', flexShrink: 0 }}
                />
                <span>
                  <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ink)' }}>{point.name}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-4)', fontWeight: 300 }}>
                    {point.address}, {point.city} ({point.province})
                  </span>
                  {typeof point.distanceKm === 'number' && (
                    <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--ink-4)', marginTop: 2 }}>
                      {t('checkout_brt_distance', { distance: point.distanceKm.toFixed(1) })}
                    </span>
                  )}
                  {point.openingHours && (
                    <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--ink-4)', marginTop: 2 }}>
                      {point.openingHours}
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
        {configurationMissing ? t('checkout_brt_manual_entry') : t('checkout_brt_manual_fallback')}
      </button>
    </div>
  )
}
