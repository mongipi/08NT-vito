import { z } from 'zod'
import {
  checkbox,
  decimal,
  integer,
  jsonField,
  optionalDecimal,
  optionalInteger,
  optionalString,
  requiredString,
} from '@/lib/validation/form'

/** Ingredienti e varianti arrivano dal form come JSON serializzato. */

export const ingredientSchema = z.object({
  name: requiredString('Nome ingrediente'),
  dosage: optionalString,
  vnr: optionalString,
})

export const variantSchema = z.object({
  label: requiredString('Etichetta variante'),
  quantity: integer(0),
  price: decimal(0),
  comparePrice: optionalDecimal,
  b2bPrice: optionalDecimal,
  stock: integer(0),
})

export type IngredientInput = z.infer<typeof ingredientSchema>
export type VariantInput = z.infer<typeof variantSchema>

/** Campi anagrafici del prodotto, prima letti con 27 cast `as string` di fila. */
export const productFormSchema = z.object({
  name: requiredString('Nome'),
  lineId: requiredString('Linea'),
  price: decimal(0),
  comparePrice: optionalDecimal,
  stock: integer(0),
  published: checkbox,
  order: integer(99),
  shortDescription: requiredString('Descrizione breve'),
  longDescription: requiredString('Descrizione lunga'),
  usage: optionalString,
  target: optionalString,
  format: optionalString,
  ingredientsText: optionalString,
  nameEn: optionalString,
  shortDescriptionEn: optionalString,
  longDescriptionEn: optionalString,
  usageEn: optionalString,
  targetEn: optionalString,
  formatEn: optionalString,
  ingredientsTextEn: optionalString,
  capsules: optionalInteger,
  days: optionalInteger,
  dosage: optionalString,
  notificationMs: optionalString,
  metaTitle: optionalString,
  metaDescription: optionalString,
  ingredients: jsonField(z.array(ingredientSchema), []),
  variants: jsonField(z.array(variantSchema), []),
})

export type ProductFormInput = z.infer<typeof productFormSchema>

export const productUpdateSchema = productFormSchema.extend({
  id: requiredString('Id prodotto'),
})

export const idOnlySchema = z.object({ id: requiredString('Id') })
