import type { Line, Product, Ingredient, ProductImage } from '@prisma/client'
import { s } from '../_components/styles'
import { ImageUploader } from './_ImageUploader'
import { ToggleField } from '../_components/ToggleField'
import { IngredientsEditor } from './_IngredientsEditor'

interface Props {
  lines: Line[]
  action: (fd: FormData) => Promise<void>
  product?: Product & { line: Line; ingredients: Ingredient[]; productImages: Pick<ProductImage, 'key'>[] }
  deleteAction?: (fd: FormData) => Promise<void>
}

function Field({ label: lbl, name, type = 'text', required, defaultValue, placeholder, rows }: {
  label: string; name: string; type?: string; required?: boolean
  defaultValue?: string | number | null; placeholder?: string; rows?: number
}) {
  return (
    <div>
      <label style={s.label}>{lbl}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}</label>
      {rows
        ? <textarea name={name} required={required} defaultValue={defaultValue ?? ''} placeholder={placeholder} rows={rows} style={{ ...s.input, resize: 'vertical' }} />
        : <input name={name} type={type} required={required} defaultValue={defaultValue ?? ''} placeholder={placeholder} style={s.input} />
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

            {/* Immagini */}
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Immagini</p>
              <ImageUploader images={images} />
              <p style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '0.75rem', marginBottom: 0 }}>
                PNG, JPG o WebP. Clicca uno slot per caricare. Le immagini esistenti restano invariate se non ne selezioni una nuova.
              </p>
            </div>

            {/* Ingredienti */}
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Ingredienti · Contenuti medi per dose</p>
              <IngredientsEditor defaultValue={product?.ingredients ?? []} />
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
              <div style={s.stack(12)}>
                <Field label="Prezzo (€)" name="price" type="number" required defaultValue={product?.price} placeholder="0.00" />
                <Field label="Prezzo barrato (€)" name="comparePrice" type="number" defaultValue={product?.comparePrice} placeholder="0.00" />
                <Field label="Scorte" name="stock" type="number" required defaultValue={product?.stock ?? 0} />
              </div>
            </div>

            <div style={s.cardPad}>
              <p style={s.cardTitle}>Visibilità</p>
              <ToggleField name="published" label="Pubblicato" defaultChecked={product?.published ?? false} />
            </div>

            <button type="submit" style={s.btnPrimary}>
              {product ? 'Salva modifiche' : 'Crea prodotto'}
            </button>
          </div>
        </div>
      </form>

      {/* Delete — form separato, non annidato */}
      {product && deleteAction && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ ...s.cardPad, maxWidth: '16.25rem', borderColor: '#fecaca', background: '#fff5f5' }}>
            <p style={{ ...s.cardTitle, color: '#dc2626', marginBottom: '0.375rem' }}>Zona pericolosa</p>
            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.875rem', marginTop: 0 }}>Operazione irreversibile.</p>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={product.id} />
              <button type="submit" style={s.btnDanger}>Elimina prodotto</button>
            </form>
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
