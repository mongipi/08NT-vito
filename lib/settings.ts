import { prisma } from '@/lib/prisma'

export const SETTING_KEYS = {
  IBAN:                  'IBAN_BONIFICO',
  INTESTATARIO:          'INTESTATARIO_BONIFICO',
  COD_SURCHARGE:         'COD_SURCHARGE',
  SPEDIZIONE_GRATUITA:   'SPEDIZIONE_GRATUITA',
  PREZZO_SPEDIZIONE:     'PREZZO_SPEDIZIONE',
  SUPPLEMENTO_ESTERO:    'SUPPLEMENTO_ESTERO',
} as const

export type SettingKey = typeof SETTING_KEYS[keyof typeof SETTING_KEYS]

const DEFAULTS: Record<string, string> = {
  IBAN_BONIFICO:         'IT00 X000 0000 0000 0000 0000 000',
  INTESTATARIO_BONIFICO: 'VIPHARMA di Tatulli Vito & Co. S.A.S.',
  COD_SURCHARGE:         '5',
  SPEDIZIONE_GRATUITA:   '39.90',
  PREZZO_SPEDIZIONE:     '5.90',
  SUPPLEMENTO_ESTERO:    '10',
}

let cache: Record<string, string> | null = null
let cacheAt = 0
const TTL = 60_000 // 1 minuto

export async function getSettingsMap(): Promise<Record<string, string>> {
  if (cache && Date.now() - cacheAt < TTL) return cache
  const rows = await prisma.setting.findMany()
  cache = { ...DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) }
  cacheAt = Date.now()
  return cache
}

export function invalidateSettingsCache() {
  cache = null
}
