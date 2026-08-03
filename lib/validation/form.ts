import { z } from 'zod'

/**
 * Utilità comuni per validare i FormData dei server action.
 *
 * Prima ogni azione leggeva i campi con decine di cast `as string`: un campo
 * mancante diventava la stringa "null" o un NaN scritto a database senza che
 * nulla se ne accorgesse.
 */

/** Stringa obbligatoria, con spazi rimossi. */
export const requiredString = (campo: string) =>
  z
    .string({ message: `${campo} è obbligatorio` })
    .trim()
    .min(1, `${campo} è obbligatorio`)

/**
 * Campo di form eventualmente assente.
 *
 * Serve `.optional()`: una chiave non inviata dal browser (tipicamente una
 * checkbox non spuntata, o un campo facoltativo lasciato vuoto) altrimenti
 * farebbe fallire l'intera validazione.
 */
const anyField = z.unknown().optional()

/** Stringa facoltativa: vuota o assente diventa null. */
export const optionalString = anyField.transform((value) => {
  const trimmed = String(value ?? '').trim()
  return trimmed === '' ? null : trimmed
})

/** Stringa facoltativa con valore predefinito quando assente o vuota. */
export const stringWithDefault = (fallback: string) =>
  anyField.transform((value) => String(value ?? '').trim() || fallback)

/** Numero decimale che accetta sia la virgola sia il punto. */
export const decimal = (fallback = 0) =>
  anyField.transform((value) => {
    const normalized = String(value ?? '')
      .trim()
      .replace(',', '.')
    if (!normalized) return fallback
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : fallback
  })

/** Decimale facoltativo: vuoto diventa null. */
export const optionalDecimal = anyField.transform((value) => {
  const normalized = String(value ?? '')
    .trim()
    .replace(',', '.')
  if (!normalized) return null
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : null
})

export const integer = (fallback = 0) =>
  anyField.transform((value) => {
    const parsed = Number.parseInt(String(value ?? '').trim(), 10)
    return Number.isFinite(parsed) ? parsed : fallback
  })

export const optionalInteger = anyField.transform((value) => {
  const raw = String(value ?? '').trim()
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : null
})

/** Checkbox HTML: assente quando non spuntata, "on" quando spuntata. */
export const checkbox = anyField.transform((value) => value === 'on' || value === true)

/** Campo che contiene JSON serializzato, validato con lo schema indicato. */
export function jsonField<T extends z.ZodTypeAny>(schema: T, fallback: z.input<T>) {
  return anyField.transform((value, ctx) => {
    const raw = String(value ?? '').trim()
    let parsed: unknown = fallback
    if (raw) {
      try {
        parsed = JSON.parse(raw)
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Contenuto JSON non valido' })
        return z.NEVER
      }
    }
    const result = schema.safeParse(parsed)
    if (!result.success) {
      ctx.addIssue({
        code: 'custom',
        message: result.error.issues[0]?.message ?? 'Dati non validi',
      })
      return z.NEVER
    }
    return result.data as z.output<T>
  })
}

/**
 * Applica lo schema al FormData e solleva un errore leggibile se non valida.
 * I server action non hanno un canale di errore strutturato: un messaggio
 * chiaro è meglio di un crash Prisma a valle.
 */
export function parseFormData<T extends z.ZodType>(schema: T, formData: FormData): z.output<T> {
  const result = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'campo'}: ${issue.message}`)
      .join('; ')
    throw new Error(`Dati non validi — ${details}`)
  }
  return result.data
}
