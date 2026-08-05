// Client per le API REST BRT "Pudo-Fermopoint" (ricerca punti di ritiro/consegna).
// Autenticazione: header statico X-API-Auth (UUID), niente OAuth/token cache a differenza di Poste.

export interface BrtOpeningDay {
  dayOfWeek: number
  morning: string | null // "openTime-closeTime" oppure null se chiuso al mattino
  afternoon: string | null
}

export interface BrtPudoPoint {
  pudoId: string
  name: string
  address: string
  zipCode: string
  town: string
  country: string
  type: string
  distanceMeters: number | null
  localizationHint: string
  lat: string
  lng: string
  hours: BrtOpeningDay[]
}

interface RawPusPointHour {
  dayOfWeek?: number
  dayTime?: 'MORNING' | 'AFTERNOON'
  openTime?: string
  closeTime?: string
}

interface RawPusPudoPoint {
  pudoId?: string
  pointName?: string
  street?: string
  streetNumber?: string
  zipCode?: string
  town?: string
  country?: string
  type?: string
  distanceFromPoint?: number
  localizationHint?: string
  latitude?: string
  longitude?: string
  hours?: RawPusPointHour[]
  enabled?: boolean
  available?: boolean
}

interface RawPusResponse {
  pudo?: RawPusPudoPoint[]
  requestId?: string
  timestamp?: string
}

function getBrtConfig(): { token: string; host: string } {
  const token = process.env.BRT_API_TOKEN
  const host = process.env.BRT_API_HOST ?? 'https://api.brt.it'
  if (!token) {
    throw new Error('Credenziali BRT non configurate (BRT_API_TOKEN)')
  }
  return { token, host }
}

const DEFAULT_QUERY = {
  pudotype: 'ALL',
  max_pudo_number: '25',
  maxDistanceSearch: '20000',
}

async function fetchPudo(path: string, params: Record<string, string | undefined>): Promise<RawPusPudoPoint[]> {
  const { token, host } = getBrtConfig()

  const query = new URLSearchParams()
  for (const [key, value] of Object.entries({ ...DEFAULT_QUERY, ...params })) {
    if (value !== undefined && value !== '') query.set(key, value)
  }

  const url = `${host}${path}?${query.toString()}`

  let res: Response
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { 'X-API-Auth': token, Accept: 'application/json' },
    })
  } catch (err) {
    console.error(`Chiamata a ${path} fallita:`, err)
    throw new Error('Impossibile contattare il servizio BRT')
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error('Autenticazione BRT non valida')
  }
  if (res.status === 404) {
    return []
  }
  if (!res.ok) {
    console.error(`Ricerca BRT (${path}) fallita con status ${res.status}:`, await res.text().catch(() => ''))
    throw new Error(`Ricerca punti BRT fallita (${res.status})`)
  }

  const data = (await res.json()) as RawPusResponse
  return data.pudo ?? []
}

function normalizeHours(hours: RawPusPointHour[] | undefined): BrtOpeningDay[] {
  if (!hours || hours.length === 0) return []

  const byDay = new Map<number, BrtOpeningDay>()
  for (const h of hours) {
    if (h.dayOfWeek === undefined) continue
    const entry = byDay.get(h.dayOfWeek) ?? { dayOfWeek: h.dayOfWeek, morning: null, afternoon: null }
    const slot = h.openTime && h.closeTime ? `${h.openTime}-${h.closeTime}` : null
    if (h.dayTime === 'MORNING') entry.morning = slot
    else if (h.dayTime === 'AFTERNOON') entry.afternoon = slot
    byDay.set(h.dayOfWeek, entry)
  }

  return Array.from(byDay.values()).sort((a, b) => a.dayOfWeek - b.dayOfWeek)
}

function normalizePoint(p: RawPusPudoPoint): BrtPudoPoint {
  const clean = (v: string | undefined) => (v ?? '').trim()
  const streetNumber = clean(p.streetNumber)
  const street = clean(p.street)

  return {
    pudoId: clean(p.pudoId),
    name: clean(p.pointName),
    address: streetNumber ? `${street} ${streetNumber}`.trim() : street,
    zipCode: clean(p.zipCode),
    town: clean(p.town),
    country: clean(p.country),
    type: clean(p.type),
    distanceMeters: typeof p.distanceFromPoint === 'number' ? p.distanceFromPoint : null,
    localizationHint: clean(p.localizationHint),
    lat: clean(p.latitude),
    lng: clean(p.longitude),
    hours: normalizeHours(p.hours),
  }
}

function normalizeResults(raw: RawPusPudoPoint[]): BrtPudoPoint[] {
  const byId = new Map<string, BrtPudoPoint>()
  for (const p of raw) {
    if (p.enabled === false || p.available === false) continue
    const point = normalizePoint(p)
    if (!point.pudoId) continue
    // Quando lo stesso punto compare in più ricerche (una per frazione del CAP), ognuna calcola
    // la distanza da un centro geocodificato diverso: teniamo l'occorrenza con distanza minore,
    // la lettura più vicina alla realtà.
    const existing = byId.get(point.pudoId)
    if (!existing || (point.distanceMeters ?? Infinity) < (existing.distanceMeters ?? Infinity)) {
      byId.set(point.pudoId, point)
    }
  }
  return Array.from(byId.values()).sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity))
}

// L'API BRT richiede sempre una città oltre al CAP. Un CAP italiano può coprire più frazioni/comuni
// (es. 70032 = Mariotto, Bitonto, Palombaio) e la qualità del geocoding di BRT dipende dalla città
// esatta: usarne una a caso può restituire punti a 10km invece che a 300m. Risolviamo quindi tutte le
// località del CAP tramite zippopotam.us (gratuito, senza chiave) e le interroghiamo in parallelo,
// come già fatto per i service type di Poste in searchPosteLockers.
async function resolvePlacesForZip(zipCode: string): Promise<string[]> {
  let res: Response
  try {
    res = await fetch(`https://api.zippopotam.us/it/${zipCode}`)
  } catch (err) {
    console.error(`Impossibile risolvere il CAP ${zipCode} in città:`, err)
    throw new Error('Impossibile determinare la città dal CAP')
  }
  if (!res.ok) {
    throw new Error('CAP non trovato')
  }

  const data = (await res.json()) as { places?: { 'place name'?: string }[] }
  const places = Array.from(new Set((data.places ?? []).map((p) => p['place name']?.trim()).filter((v): v is string => !!v)))
  if (places.length === 0) {
    throw new Error('CAP non trovato')
  }
  return places
}

export interface SearchBrtByZipParams {
  zipCode: string
  language?: string
}

export async function searchBrtPudoByZip({ zipCode, language }: SearchBrtByZipParams): Promise<BrtPudoPoint[]> {
  if (!/^\d{5}$/.test(zipCode)) {
    throw new Error('CAP non valido')
  }

  const places = await resolvePlacesForZip(zipCode)

  const results = await Promise.allSettled(
    places.map((city) => fetchPudo('/pudo/v1/open/pickup/get-pudo-by-address', { zipCode, city, countryCode: 'ITA', language }))
  )

  const allFailed = results.every((r) => r.status === 'rejected')
  if (allFailed) {
    const first = results[0] as PromiseRejectedResult
    throw first.reason instanceof Error ? first.reason : new Error(String(first.reason))
  }

  const raw: RawPusPudoPoint[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') raw.push(...r.value)
    else console.error('Una delle ricerche per località del CAP è fallita:', r.reason)
  }

  return normalizeResults(raw)
}

export interface SearchBrtByLatLngParams {
  latitude: number
  longitude: number
  language?: string
}

export async function searchBrtPudoByLatLng({
  latitude,
  longitude,
  language,
}: SearchBrtByLatLngParams): Promise<BrtPudoPoint[]> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Coordinate non valide')
  }

  // BRT limita latitude/longitude a 16 caratteri: navigator.geolocation restituisce
  // fino a 17 decimali, va arrotondato (6 decimali = precisione ~11cm, ampiamente sufficiente).
  const raw = await fetchPudo('/pudo/v1/open/pickup/get-pudo-by-lat-lng', {
    latitude: latitude.toFixed(6),
    longitude: longitude.toFixed(6),
    language,
  })

  return normalizeResults(raw)
}
