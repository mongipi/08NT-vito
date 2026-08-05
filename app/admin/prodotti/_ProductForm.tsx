import type { Line, Product, Ingredient, ProductImage, ProductVariant } from '@prisma/client'
import { s } from '../_components/styles'
import { ImageUploader } from './_ImageUploader'
import { ToggleField } from '../_components/ToggleField'
import { IngredientsEditor } from './_IngredientsEditor'
import { VariantsEditor } from './_VariantsEditor'
import { ConfirmSaveButton, ConfirmDeleteButton } from '../_components/ConfirmButtons'

interface Props {
  lines: Line[]
  action: (fd: FormData) => Promise<void>
  product?: Product & { line: Line; ingredients: Ingredient[]; productImages: Pick<ProductImage, 'key'>[]; variants: ProductVariant[] }
  deleteAction?: (fd: FormData) => Promise<void>
}

function Field({ label: lbl, name, type = 'text', required, defaultValue, placeholder, rows, step }: {
  label: string; name: string; type?: string; required?: boolean
  defaultValue?: string | number | null; placeholder?: string; rows?: number; step?: string
}) {
  return (
    <div>
      <label style={s.label}>{lbl}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}</label>
      {rows
        ? <textarea name={name} required={required} defaultValue={defaultValue ?? ''} placeholder={placeholder} rows={rows} style={{ ...s.input, resize: 'vertical' }} />
        : <input name={name} type={type} step={step} required={required} defaultValue={defaultValue ?? ''} placeholder={placeholder} style={s.input} />
      }
    </div>
  )
}

export function ProductForm({ lines, action, product, deleteAction }: Props) {
  const KEY_TO_PATH: Record<string, string> = { fronte: 'fronte', infografica: 'infografica', lato1: 'lato-1', lato2: 'lato-2', etichetta: 'etichetta' }
  const images: Record<string, string> = {}
  if (product) {
    for (const img of product.productImages) {
      const path = KEY_TO_PATH[img.key]
      if (path) images[img.key] = `/api/product-images/${product.id}/${path}`
      else if (img.key.startsWith('variant-')) images[img.key] = `/api/product-images/${product.id}/${img.key}`
    }
  }

  return (
    <>
      <form action={action}>
        {product && <input type="hidden" name="id" value={product.id} />}

        <div className="product-form-grid">
          {/* Main column */}
          <div style={s.stack(16)}>
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Informazioni base</p>
              <div style={s.stack(14)}>
                <Field label="Nome prodotto" name="name" required defaultValue={product?.name} />
                <div style={s.grid2}>
                  <div>
                    <label style={s.label}>Linea<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                    <select name="lineId" required defaultValue={product?.lineId ?? ''} style={s.select}>
                      <option value="">Seleziona linea</option>
                      {lines.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                  <Field label="Ordine" name="order" type="number" defaultValue={product?.order ?? 99} />
                </div>
              </div>
            </div>

            <div style={s.cardPad}>
              <p style={s.cardTitle}>Descrizioni</p>
              <div style={s.stack(14)}>
                <Field label="Descrizione breve" name="shortDescription" required defaultValue={product?.shortDescription} rows={2} />
                <Field label="Descrizione lunga" name="longDescription" required defaultValue={product?.longDescription} rows={5} />
                <Field label="Uso consigliato" name="usage" defaultValue={product?.usage} rows={2} />
                <Field label="Target" name="target" defaultValue={product?.target} rows={2} />
              </div>
            </div>

            <div style={s.cardPad}>
              <p style={s.cardTitle}>Formato</p>
              <div style={s.stack(14)}>
                <Field label="Descrizione formato" name="format" defaultValue={product?.format} placeholder="es. 60 capsule vegetali" />
                <div style={s.grid2}>
                  <Field label="Capsule" name="capsules" type="number" defaultValue={product?.capsules} />
                  <Field label="Giorni trattamento" name="days" type="number" defaultValue={product?.days} />
                  <Field label="Dosaggio" name="dosage" defaultValue={product?.dosage} placeholder="es. 2 capsule/die" />
                  <Field label="Notifica Min. Salute" name="notificationMs" defaultValue={product?.notificationMs} />
                </div>
              </div>
            </div>

            <div style={s.cardPad}>
              <p style={s.cardTitle}>Varianti · Formati acquistabili</p>
              <VariantsEditor defaultValue={product?.variants.map(v => ({
                label: v.label,
                quantity: v.quantity,
                price: v.price,
                comparePrice: v.comparePrice,
                b2bPrice: v.b2bPrice,
                stock: v.stock,
                image: images[`variant-${variantImageToken(v.quantity, v.label)}`],
              })) ?? []} />
            </div>

            {/* Immagini */}
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Immagini</p>
              <ImageUploader images={images} />
              <p style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '0.75rem', marginBottom: 0 }}>
                PNG, JPG o WebP. Clicca uno slot per caricare. Le immagini esistenti restano invariate se non ne selezioni una nuova.
              </p>
            </div>

            {/* Valori nutrizionali (tabella strutturata nome/dosaggio) */}
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Valori nutrizionali · Contenuti medi per dose</p>
              <IngredientsEditor defaultValue={product?.ingredients ?? []} />
            </div>

            {/* Ingredienti (testo libero, box separato in pagina prodotto) */}
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Ingredienti</p>
              <Field label="Elenco ingredienti" name="ingredientsText" defaultValue={product?.ingredientsText} rows={4} placeholder="es. Agnocasto, Vitamina B6, Magnesio, ..." />
            </div>

            {/* Traduzione inglese */}
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Traduzione inglese (EN)</p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '-0.375rem 0 0.875rem' }}>
                Mostrata sul sito quando il cliente seleziona EN. Se lasci un campo vuoto, resta visibile l&apos;italiano.
              </p>
              <div style={s.stack(14)}>
                <Field label="Nome prodotto (EN)" name="nameEn" defaultValue={product?.nameEn} />
                <Field label="Descrizione breve (EN)" name="shortDescriptionEn" defaultValue={product?.shortDescriptionEn} rows={2} />
                <Field label="Descrizione lunga (EN)" name="longDescriptionEn" defaultValue={product?.longDescriptionEn} rows={5} />
                <Field label="Uso consigliato (EN)" name="usageEn" defaultValue={product?.usageEn} rows={2} />
                <Field label="Target (EN)" name="targetEn" defaultValue={product?.targetEn} rows={2} />
                <Field label="Descrizione formato (EN)" name="formatEn" defaultValue={product?.formatEn} />
                <Field label="Elenco ingredienti (EN)" name="ingredientsTextEn" defaultValue={product?.ingredientsTextEn} rows={4} />
              </div>
            </div>

            <div style={s.cardPad}>
              <p style={s.cardTitle}>SEO</p>
              <div style={s.stack(14)}>
                <Field label="Meta title" name="metaTitle" defaultValue={product?.metaTitle} />
                <Field label="Meta description" name="metaDescription" defaultValue={product?.metaDescription} rows={2} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={s.stack(16)}>
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Prezzo & Stock</p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '-0.375rem 0 0.875rem' }}>
                Usati solo se il prodotto non ha varianti (vedi sotto).
              </p>
              <div style={s.stack(12)}>
                <Field label="Prezzo di vendita (€)" name="price" required defaultValue={product?.price} placeholder="0,00" />
                <Field label="Prezzo originale barrato (€)" name="comparePrice" defaultValue={product?.comparePrice} placeholder="0,00" />
                <Field label="Scorte" name="stock" type="number" required defaultValue={product?.stock ?? 0} />
              </div>
            </div>

            <div style={s.cardPad}>
              <p style={s.cardTitle}>Visibilità</p>
              <ToggleField name="published" label="Pubblicato" defaultChecked={product?.published ?? false} />
            </div>

            <ConfirmSaveButton
              label={product ? 'Salva modifiche' : 'Crea prodotto'}
              title={product ? 'Conferma salvataggio' : 'Crea prodotto'}
              message={product ? 'Vuoi salvare le modifiche a questo prodotto?' : 'Vuoi creare questo nuovo prodotto?'}
              style={s.btnPrimary}
            />
          </div>
        </div>
      </form>

      {/* Delete — form separato, non annidato */}
      {product && deleteAction && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ ...s.cardPad, maxWidth: '16.25rem', borderColor: '#fecaca', background: '#fff5f5' }}>
            <p style={{ ...s.cardTitle, color: '#dc2626', marginBottom: '0.375rem' }}>Zona pericolosa</p>
            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.875rem', marginTop: 0 }}>Operazione irreversibile.</p>
            <ConfirmDeleteButton
              formAction={deleteAction}
              hiddenFields={{ id: product.id }}
              title="Elimina prodotto"
              message={`Stai per eliminare "${product.name}". Questa operazione è irreversibile e rimuoverà anche immagini e ingredienti.`}
              buttonLabel="Elimina prodotto"
              buttonStyle={s.btnDanger}
            />
          </div>
        </div>
      )}

      <style>{`
        .product-form-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }
        @media (min-width: 56.25rem) {
          .product-form-grid {
            display: grid;
            grid-template-columns: 1fr 16.25rem;
            gap: 1.25rem;
            align-items: start;
          }
        }
      `}</style>
    </>
  )
}

function variantImageToken(quantity: number, label: string) {
  if (quantity > 0) return String(quantity)
  const quantityInLabel = label.match(/\d+/)?.[0]
  if (quantityInLabel) return quantityInLabel
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
