import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

export interface BrtFermopoint {
  id: string
  name: string
  address: string
  city: string
  province: string
  postalCode: string
  distanceKm?: number
  openingHours?: string
}

interface BrtApiPoint {
  id: string
  pudoType?: number
  name: string
  address: {
    streetName?: string
    houseNumber?: string
    zipCode?: string
    city?: string
    country?: string
  }
  distance?: number
  businessHours?: Record<string, Array<{ from: string; to: string }>>
}

interface BrtApiResponse {
  parcelShopDetailsList?: BrtApiPoint[]
}

export interface SearchBrtFermopointsInput {
  postalCode?: string
  city?: string
  address?: string
  latitude?: number
  longitude?: number
}

interface Coordinates {
  latitude: number
  longitude: number
}

const DEFAULT_BRT_PARCEL_SHOPS_URL = 'https://www.mybrt.it/it/mybrt/parcel-shops?lang=it'
const BRT_PARCEL_SHOPS_FALLBACK_URLS = [
  DEFAULT_BRT_PARCEL_SHOPS_URL,
  'https://mybrt.it/it/mybrt/parcel-shops?lang=it',
  'https://www.brt.it/it/mybrt/parcel-shops?lang=it',
]
const MAX_BRT_REDIRECTS = 5
const execFileAsync = promisify(execFile)

function decodeHtml(value: string) {
  return value
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]+>/g, ' '))
}

function buildSearchUrl(input: SearchBrtFermopointsInput, baseUrl = process.env.BRT_FERMOPOINT_ENDPOINT || DEFAULT_BRT_PARCEL_SHOPS_URL) {
  const url = new URL(baseUrl)

  if (input.city?.trim()) url.searchParams.set('city', input.city.trim())
  if (input.postalCode?.trim()) url.searchParams.set('zipCode', input.postalCode.trim())
  if (input.address?.trim()) url.searchParams.set('queryAddress', input.address.trim())
  url.searchParams.set('country', 'IT')
  url.searchParams.set('sendingContext', 'false')

  if (typeof input.latitude === 'number' && typeof input.longitude === 'number') {
    url.searchParams.set('latitude', String(input.latitude))
    url.searchParams.set('longitude', String(input.longitude))
  }

  return url
}

function getSearchUrlCandidates(input: SearchBrtFermopointsInput) {
  const configured = process.env.BRT_FERMOPOINT_ENDPOINT?.trim()
  const urls = [configured, ...BRT_PARCEL_SHOPS_FALLBACK_URLS]
    .filter((value): value is string => Boolean(value))
    .map((value) => buildSearchUrl(input, value))

  return urls.filter((url, index, all) => all.findIndex((candidate) => candidate.toString() === url.toString()) === index)
}

async function geocodeAddress(input: SearchBrtFermopointsInput): Promise<Coordinates | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'it')
  url.searchParams.set('addressdetails', '0')

  const address = input.address?.trim()
  const postalCode = input.postalCode?.trim()
  const city = input.city?.trim()

  if (address && postalCode && city) {
    url.searchParams.set('q', [address, postalCode, city, 'Italia'].join(', '))
  } else if (postalCode && city) {
    url.searchParams.set('q', [postalCode, city, 'Italia'].join(', '))
  } else if (postalCode) {
    url.searchParams.set('postalcode', postalCode)
    url.searchParams.set('country', 'Italia')
  } else {
    return null
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': '08 Natural Technology Checkout/1.0',
        Accept: 'application/json',
        'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) return null
    const data = await response.json() as Array<{ lat?: string; lon?: string }>
    const first = data[0]
    if (!first?.lat || !first?.lon) return null

    const latitude = Number(first.lat)
    const longitude = Number(first.lon)
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null

    return { latitude, longitude }
  } catch {
    return null
  }
}

async function fetchBrtPage(url: URL | string, redirects = 0): Promise<Response> {
  if (redirects > MAX_BRT_REDIRECTS) {
    throw new Error('Troppi redirect dalla pagina BRT Fermopoint.')
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
      Referer: DEFAULT_BRT_PARCEL_SHOPS_URL,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
    redirect: 'manual',
  })

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location')
    if (!location) {
      throw new Error(`Redirect BRT senza destinazione (${response.status}).`)
    }

    const nextUrl = new URL(location, typeof url === 'string' ? url : url.toString())
    return fetchBrtPage(nextUrl, redirects + 1)
  }

  return response
}

async function fetchBrtPageViaPowerShell(url: URL): Promise<string> {
  const { stdout } = await execFileAsync(
    'powershell.exe',
    [
      '-NoProfile',
      '-Command',
      "$ProgressPreference='SilentlyContinue'; [Console]::OutputEncoding=[System.Text.Encoding]::UTF8; $resp = Invoke-WebRequest -UseBasicParsing -Uri $env:BRT_FERMOPOINT_URL; $resp.Content",
    ],
    {
      env: { ...process.env, BRT_FERMOPOINT_URL: url.toString() },
      maxBuffer: 10 * 1024 * 1024,
      timeout: 20000,
    }
  )

  return stdout
}

function formatOpeningHours(businessHours?: Record<string, Array<{ from: string; to: string }>>) {
  if (!businessHours) return undefined
  const firstDay = Object.entries(businessHours).find(([, slots]) => Array.isArray(slots) && slots.length > 0)
  if (!firstDay) return undefined
  const [, slots] = firstDay
  return slots.map((slot) => `${slot.from.slice(0, 5)}-${slot.to.slice(0, 5)}`).join(' · ')
}

function mapApiPoint(point: BrtApiPoint): BrtFermopoint {
  return {
    id: point.id,
    name: point.name.trim(),
    address: [point.address.streetName, point.address.houseNumber].filter(Boolean).join(' ').trim(),
    city: (point.address.city ?? '').trim(),
    province: '',
    postalCode: (point.address.zipCode ?? '').trim(),
    distanceKm: typeof point.distance === 'number' ? point.distance : undefined,
    openingHours: formatOpeningHours(point.businessHours),
  }
}

async function searchBrtFermopointsViaPowerShellApi(input: SearchBrtFermopointsInput): Promise<BrtFermopoint[]> {
  if (typeof input.latitude !== 'number' || typeof input.longitude !== 'number') {
    throw new Error('Coordinate mancanti per la ricerca BRT Fermopoint.')
  }

  const searchUrls = getSearchUrlCandidates(input)
  let lastError = ''

  for (const searchUrl of searchUrls) {
    const pageUrl = `${searchUrl.origin}/it/mybrt/parcel-shops?lang=it`
    const mapUrl = `${searchUrl.origin}/it/mybrt/parcel-shop-map`
    const script = `
$ProgressPreference='SilentlyContinue'
try {
  [Console]::OutputEncoding=[System.Text.Encoding]::UTF8
  $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  $page = Invoke-WebRequest -UseBasicParsing -Uri '${pageUrl}' -WebSession $session
  $csrf = ([regex]::Match($page.Content, '<meta name="_csrf" content="([^"]+)"')).Groups[1].Value
  if ([string]::IsNullOrWhiteSpace($csrf)) {
    throw 'CSRF token BRT non trovato'
  }
  $body = @{
    addressValue = ''
    latitude = '${input.latitude}'
    longitude = '${input.longitude}'
    filterValues = @{
      typeFilters = @()
      serviceFilters = @()
      openingFilters = 'ANY_TIME'
      openingDayFilters = $null
      openingFromFilters = $null
      openingToFilters = $null
    }
  } | ConvertTo-Json -Depth 6
  $headers = @{
    'Content-Type' = 'application/json; charset=utf-8'
    'X-CSRF-TOKEN' = $csrf
    'X-Requested-With' = 'XMLHttpRequest'
  }
  $resp = Invoke-WebRequest -UseBasicParsing -Method POST -Uri '${mapUrl}' -Headers $headers -Body $body -WebSession $session
  Write-Output 'BRT_JSON_START'
  Write-Output ($resp.Content.Trim())
  Write-Output 'BRT_JSON_END'
} catch {
  Write-Error $_
  exit 1
}
`

    try {
      const { stdout, stderr } = await execFileAsync('powershell.exe', ['-NoProfile', '-Command', script], {
        env: process.env,
        maxBuffer: 10 * 1024 * 1024,
        timeout: 30000,
      })

      const match = stdout.match(/BRT_JSON_START\r?\n([\s\S]*?)\r?\nBRT_JSON_END/)
      const jsonText = match?.[1]?.trim()
      if (!jsonText) {
        lastError = `Risposta JSON BRT non valida.${stderr?.trim() ? ` ${stderr.trim()}` : ''}`
        continue
      }

      const payload = JSON.parse(jsonText) as BrtApiResponse
      const points = (payload.parcelShopDetailsList ?? []).map(mapApiPoint).filter((point) => point.id && point.name && point.city)
      if (points.length > 0) {
        return points.slice(0, 25)
      }

      lastError = 'Nessun BRT Fermopoint trovato nella risposta JSON BRT.'
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Errore sconosciuto ricerca BRT via PowerShell.'
    }
  }

  throw new Error(lastError || 'Servizio BRT Fermopoint non raggiungibile al momento.')
}

function parseDistanceKm(block: string) {
  const match = block.match(/<span class="cut-long-text">\s*([\d.,]+)\s*<\/span>/i)
  if (!match) return undefined
  const normalized = match[1].replace(',', '.')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseAddressParts(block: string) {
  const grayBlocks = [...block.matchAll(/<label class="gray-out">([\s\S]*?)<\/label>/gi)]
  if (grayBlocks.length < 2) {
    return { address: '', postalCode: '', city: '' }
  }

  const addressSpans = [...grayBlocks[0][1].matchAll(/<span>([\s\S]*?)<\/span>/gi)].map((m) => stripTags(m[1]))
  const locationSpans = [...grayBlocks[1][1].matchAll(/<span>([\s\S]*?)<\/span>/gi)].map((m) => stripTags(m[1]))

  return {
    address: addressSpans.filter(Boolean).join(' ').trim(),
    postalCode: locationSpans[0] ?? '',
    city: locationSpans[1] ?? '',
  }
}

function parseBrtParcelShopList(html: string): BrtFermopoint[] {
  const itemRegex = /<div class="item" id="([^"]+)">([\s\S]*?)<\/div>\s*<a class="pudo-point-link[\s\S]*?<\/a>/gi
  const points: BrtFermopoint[] = []

  for (const match of html.matchAll(itemRegex)) {
    const id = decodeHtml(match[1])
    const block = match[2]
    const nameMatch = block.match(/<span class="inline">([\s\S]*?)<\/span>/i)
    const { address, postalCode, city } = parseAddressParts(block)

    const name = nameMatch ? stripTags(nameMatch[1]) : ''
    if (!id || !name || !address || !city) continue

    points.push({
      id,
      name,
      address,
      city,
      province: '',
      postalCode,
      distanceKm: parseDistanceKm(block),
    })
  }

  return points
}

export function isBrtConfigured() {
  return true
}

export async function searchBrtFermopoints(input: SearchBrtFermopointsInput): Promise<BrtFermopoint[]> {
  if (!input.postalCode?.trim() && (typeof input.latitude !== 'number' || typeof input.longitude !== 'number')) {
    throw new Error('Per cercare un BRT Fermopoint serve almeno il CAP oppure la posizione attuale.')
  }

  let normalizedInput = { ...input }
  if (typeof normalizedInput.latitude !== 'number' || typeof normalizedInput.longitude !== 'number') {
    const geocoded = await geocodeAddress(normalizedInput)
    if (geocoded) {
      normalizedInput = {
        ...normalizedInput,
        latitude: geocoded.latitude,
        longitude: geocoded.longitude,
      }
    }
  }

  if (process.platform === 'win32' && typeof normalizedInput.latitude === 'number' && typeof normalizedInput.longitude === 'number') {
    try {
      const points = await searchBrtFermopointsViaPowerShellApi(normalizedInput)
      if (points.length > 0) {
        return points
      }
    } catch {
      // Continue with the public HTML fallback below.
    }
  }

  let html = ''
  const searchUrls = getSearchUrlCandidates(normalizedInput)
  let resolved = false

  for (const url of searchUrls) {
    try {
      const response = await fetchBrtPage(url)
      if (!response.ok) {
        continue
      }
      html = await response.text()
      if (html.trim()) {
        resolved = true
        break
      }
    } catch {
      if (process.platform === 'win32') {
        try {
          html = await fetchBrtPageViaPowerShell(url)
          if (html.trim()) {
            resolved = true
            break
          }
        } catch {
          continue
        }
      }
    }
  }

  if (!resolved || !html.trim()) {
    throw new Error(
      'Servizio BRT Fermopoint non raggiungibile al momento. Puoi usare la mappa ufficiale BRT o inserire il punto manualmente.'
    )
  }

  const points = parseBrtParcelShopList(html)

  if (points.length === 0) {
    throw new Error('Nessun BRT Fermopoint trovato nella risposta pubblica BRT.')
  }

  if (
    normalizedInput.city?.trim() &&
    !points.some((point) => point.city.toLowerCase() === normalizedInput.city!.trim().toLowerCase())
  ) {
    throw new Error('BRT ha restituito punti non coerenti con la localita richiesta. Riprova con un indirizzo piu preciso.')
  }

  return points.slice(0, 25)
}
