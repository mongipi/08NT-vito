'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { IMAGE_KEYS } from '@/lib/domain/product-images'
import { variantImageKey } from '@/lib/domain/variant-image'
import { slugify } from '@/lib/utils'
import { parseFormData } from '@/lib/validation/form'
import {
  idOnlySchema,
  productFormSchema,
  productUpdateSchema,
  type VariantInput,
} from '@/lib/validation/product'
import {
  createProduct as createProductRecord,
  deleteProduct as deleteProductRecord,
  replaceIngredients,
  replaceVariants,
  updateProduct as updateProductRecord,
} from '@/services/products'
import { deleteObsoleteVariantImages, saveProductImage } from '@/services/product-images'

const LIST_PATH = '/admin/prodotti'

async function readUpload(formData: FormData, field: string) {
  const file = formData.get(field) as File | null
  if (!file || file.size === 0) return null
  return { data: new Uint8Array(await file.arrayBuffer()), mimeType: file.type || 'image/png' }
}

/** Immagini fisse del prodotto (fronte, infografica, lati, etichetta). */
async function saveProductImages(productId: string, formData: FormData) {
  for (const key of IMAGE_KEYS) {
    const upload = await readUpload(formData, `img_${key}`)
    if (upload) await saveProductImage(productId, key, upload.data, upload.mimeType)
  }
}

/**
 * Immagini delle varianti. Le immagini di varianti eliminate vengono rimosse,
 * altrimenti resterebbero orfane a occupare spazio nel database.
 */
async function saveVariantImages(productId: string, variants: VariantInput[], formData: FormData) {
  const activeKeys: string[] = []

  for (const [index, variant] of variants.entries()) {
    const key = variantImageKey(variant.quantity, variant.label)
    if (key === 'variant-') continue
    activeKeys.push(key)

    const upload = await readUpload(formData, `img_variant_${index}`)
    if (upload) await saveProductImage(productId, key, upload.data, upload.mimeType)
  }

  await deleteObsoleteVariantImages(productId, activeKeys)
}

/** Salva ingredienti, varianti e immagini di un prodotto già esistente. */
async function saveProductRelations(
  productId: string,
  data: {
    ingredients: { name: string; dosage: string | null; vnr: string | null }[]
    variants: VariantInput[]
  },
  formData: FormData
) {
  await Promise.all([
    saveProductImages(productId, formData),
    saveVariantImages(productId, data.variants, formData),
    replaceIngredients(productId, data.ingredients),
    replaceVariants(productId, data.variants),
  ])
}

export async function createProduct(formData: FormData) {
  const { lineId, ingredients, variants, ...fields } = parseFormData(productFormSchema, formData)

  const product = await createProductRecord({
    ...fields,
    slug: slugify(fields.name),
    line: { connect: { id: lineId } },
  })

  await saveProductRelations(product.id, { ingredients, variants }, formData)

  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}

export async function updateProduct(formData: FormData) {
  const { id, lineId, ingredients, variants, ...fields } = parseFormData(
    productUpdateSchema,
    formData
  )

  await updateProductRecord(id, { ...fields, line: { connect: { id: lineId } } })

  await saveProductRelations(id, { ingredients, variants }, formData)

  revalidatePath(LIST_PATH)
  revalidatePath(`${LIST_PATH}/${id}`)
  redirect(`${LIST_PATH}/${id}`)
}

export async function deleteProduct(formData: FormData) {
  const { id } = parseFormData(idOnlySchema, formData)
  await deleteProductRecord(id)
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}
