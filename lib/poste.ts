import { log } from "console"

export interface PosteLocker {
  officeCode: string
  description: string
  address: string
  place: string
  province: string
  zipCode: string
  openTimeMon: string
  closeTimeMon: string
  openTimeSat: string
  closeTimeSat: string
  saturationPercentage: string
  phone: string
  lat: string
  lng: string
}

let cachedToken: { value: string; expiresAt: number } | null = null

async function getPosteAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value
  }

  const clientId = process.env.POSTE_CLIENT_ID
  const secretId = process.env.POSTE_CLIENT_SECRET
  const authUrl = process.env.POSTE_AUTH_URL
  const scope = process.env.POSTE_SCOPE
  if (!clientId || !secretId || !authUrl || !scope) {
    throw new Error('Credenziali Poste Italiane non configurate (POSTE_CLIENT_ID/POSTE_CLIENT_SECRET/POSTE_AUTH_URL/POSTE_SCOPE)')
  }

  const res = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      POSTE_ClientID: clientId,
    },
    body: JSON.stringify({ clientId, secretId, scope, grantType: 'client_credentials' }),
  })

  if (!res.ok) {
    throw new Error(`Autenticazione Poste Italiane fallita (${res.status})`)
  }

  const data = await res.json()
  const expiresInSec = Number(data.expires_in ?? 3600)
  cachedToken = { value: data.access_token, expiresAt: Date.now() + expiresInSec * 1000 }
  return cachedToken.value
}

// Tipi di punto di consegna documentati: PUNTOPOSTE-LOCKER (APT), CASELLA POSTALE (CPT),
// FERMOPOSTA (FMP). 'PUN' (PuntoPoste) non è supportato da questo endpoint (risponde 500);
// al suo posto risulta funzionante 'RTZ'.
const SERVICE_TYPES = ['APT', 'CPT', 'FMP', 'RTZ'] as const

// L'endpoint, quando riceve più tipi in un'unica richiesta (arg0..argN), restituisce un
// risultato vuoto se anche solo uno dei tipi non ha corrispondenze per il CAP — non fa un OR
// tra i tipi. Per questo interroghiamo un tipo per volta e uniamo i risultati qui.
async function searchPosteLockersByType(zipCode: string, serviceType: string): Promise<Record<string, string>[]> {
  const clientId = process.env.POSTE_CLIENT_ID
  const deliveryPointUrl = process.env.POSTE_DELIVERY_POINT_URL
  if (!clientId || !deliveryPointUrl) {
    throw new Error('Credenziali Poste Italiane non configurate (POSTE_CLIENT_ID/POSTE_DELIVERY_POINT_URL)')
  }

  const accessToken = await getPosteAccessToken()

  let res: Response
  try {
    res = await fetch(deliveryPointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        POSTE_ClientID: clientId,
        Authorization: accessToken,
      },
      body: JSON.stringify({ arg0: { zipCode, serviceType } }),
    })
  } catch (err) {
    log(`Chiamata a ${deliveryPointUrl} (serviceType=${serviceType}) fallita:`, err)
    throw err
  }

  if (!res.ok) {
    log(`Ricerca Poste Italiane (serviceType=${serviceType}) fallita con status ${res.status}:`, await res.text().catch(() => ''))
    throw new Error(`Ricerca locker Poste Italiane fallita (${res.status})`)
  }

  const data = await res.json()
  const result = data.returnX ?? data.return ?? data
  if (result.outcome !== 'OK') {
    throw new Error(`Ricerca locker Poste Italiane: esito ${result.outcome} (codice ${result.code})`)
  }

  return result.deliveryPoint ?? []
}

export async function searchPosteLockers(zipCode: string): Promise<PosteLocker[]> {
  if (!/^\d{5}$/.test(zipCode)) {
    throw new Error('CAP non valido')
  }

  const results = await Promise.allSettled(
    SERVICE_TYPES.map((serviceType) => searchPosteLockersByType(zipCode, serviceType))
  )

  const allFailed = results.every((r) => r.status === 'rejected')
  if (allFailed) {
    const first = results[0] as PromiseRejectedResult
    throw first.reason instanceof Error ? first.reason : new Error(String(first.reason))
  }

  const byOfficeCode = new Map<string, Record<string, string>>()
  for (const r of results) {
    if (r.status !== 'fulfilled') {
      log('Una delle ricerche per tipo è fallita:', r.reason)
      continue
    }
    for (const p of r.value) {
      const code = (p.officeCode ?? '').trim()
      if (code && !byOfficeCode.has(code)) byOfficeCode.set(code, p)
    }
  }

  // I campi restituiti dall'API arrivano con padding a larghezza fissa (es. "BITONTO   "), vanno ripuliti.
  const clean = (v: string | undefined) => (v ?? '').trim()

  return Array.from(byOfficeCode.values()).map((p) => ({
    officeCode: clean(p.officeCode),
    description: clean(p.officeDescription),
    address: clean(p.address),
    place: clean(p.place),
    province: clean(p.province),
    zipCode: clean(p.zipCode) || zipCode,
    openTimeMon: clean(p.openTimeMon),
    closeTimeMon: clean(p.closeTimeMon),
    openTimeSat: clean(p.openTimeSat),
    closeTimeSat: clean(p.closeTimeSat),
    saturationPercentage: clean(p.saturationPercentage),
    phone: clean(p.phone),
    lat: clean(p.XDegree),
    lng: clean(p.YDegree),
  }))
}
