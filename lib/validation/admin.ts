import { z } from 'zod'
import {
  checkbox,
  decimal,
  integer,
  optionalDecimal,
  optionalInteger,
  optionalString,
  requiredString,
  stringWithDefault,
} from '@/lib/validation/form'

/** Schemi delle form dell'area amministrativa. */

export const lineCreateSchema = z.object({
  name: requiredString('Nome linea'),
  slug: optionalString,
  color: requiredString('Colore'),
  colorLight: requiredString('Colore chiaro'),
})

export const lineUpdateSchema = lineCreateSchema.extend({
  id: requiredString('Id linea'),
  slug: requiredString('Slug'),
})

export const discountCreateSchema = z.object({
  code: requiredString('Codice').transform((value) => value.toUpperCase()),
  type: z.enum(['percent', 'fixed'], { message: 'Tipo sconto non valido' }),
  value: decimal(0),
  minOrderAmount: optionalDecimal,
  maxUses: optionalInteger,
  expiresAt: optionalString.transform((value) => (value ? new Date(value) : null)),
  applicableTo: z.enum(['all', 'b2b', 'consumer']).catch('all'),
})

export const articleSchema = z.object({
  title: requiredString('Titolo'),
  excerpt: requiredString('Estratto'),
  body: requiredString('Contenuto'),
  tag: requiredString('Tag'),
  publishedAt: requiredString('Data di pubblicazione').transform((value) => new Date(value)),
  readingTime: optionalInteger,
  published: checkbox,
  metaTitle: optionalString,
  metaDescription: optionalString,
  titleEn: optionalString,
  excerptEn: optionalString,
  bodyEn: optionalString,
})

export const articleUpdateSchema = articleSchema.extend({
  id: requiredString('Id articolo'),
})

export const userInfoSchema = z.object({
  name: optionalString,
  phone: optionalString,
  fiscalCode: optionalString,
  company: optionalString,
  vatNumber: optionalString,
  pec: optionalString,
  sdiCode: optionalString,
})

export const addressSchema = z.object({
  label: optionalString,
  isDefault: checkbox,
  firstName: requiredString('Nome'),
  lastName: requiredString('Cognome'),
  company: optionalString,
  vatNumber: optionalString,
  fiscalCode: optionalString,
  address: requiredString('Indirizzo'),
  city: requiredString('Città'),
  postalCode: requiredString('CAP'),
  province: optionalString,
  country: stringWithDefault('IT'),
  phone: optionalString,
})

export const addressUpdateSchema = addressSchema.extend({
  id: requiredString('Id indirizzo'),
})

export const orderStatusSchema = z.object({
  id: requiredString('Id ordine'),
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled'], {
    message: 'Stato ordine non valido',
  }),
  trackingNumber: optionalString,
})

export const userRoleSchema = z.object({
  id: requiredString('Id utente'),
  role: z.enum(['consumer', 'b2b', 'admin'], { message: 'Ruolo non valido' }),
})

// integer resta esportato per gli schemi che ne hanno bisogno altrove
export { integer }
