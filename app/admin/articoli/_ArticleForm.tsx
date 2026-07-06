import type { Article } from '@prisma/client'
import { s } from '../_components/styles'
import { ToggleField } from '../_components/ToggleField'
import { ConfirmSaveButton, ConfirmDeleteButton } from '../_components/ConfirmButtons'

interface Props {
  action: (fd: FormData) => Promise<void>
  article?: Article
  deleteAction?: (fd: FormData) => Promise<void>
}

export function ArticleForm({ action, article, deleteAction }: Props) {
  const pubDate = article
    ? new Date(article.publishedAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]

  return (
    <>
      <form action={action}>
        {article && <input type="hidden" name="id" value={article.id} />}

        <div className="article-form-grid">
          {/* Main column */}
          <div style={s.stack(16)}>
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Contenuto</p>
              <div style={s.stack(14)}>
                <div>
                  <label style={s.label}>Titolo<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                  <input name="title" required defaultValue={article?.title} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Estratto<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                  <textarea name="excerpt" required defaultValue={article?.excerpt} rows={2} style={{ ...s.input, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={s.label}>Corpo articolo<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                  <textarea name="body" required defaultValue={article?.body} rows={14} style={{ ...s.input, resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div style={s.cardPad}>
              <p style={s.cardTitle}>Traduzione inglese (EN)</p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '-0.375rem 0 0.875rem' }}>
                Mostrata sul sito quando il cliente seleziona EN. Se lasci un campo vuoto, resta visibile l&apos;italiano.
              </p>
              <div style={s.stack(14)}>
                <div>
                  <label style={s.label}>Titolo (EN)</label>
                  <input name="titleEn" defaultValue={article?.titleEn ?? ''} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Estratto (EN)</label>
                  <textarea name="excerptEn" defaultValue={article?.excerptEn ?? ''} rows={2} style={{ ...s.input, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={s.label}>Corpo articolo (EN)</label>
                  <textarea name="bodyEn" defaultValue={article?.bodyEn ?? ''} rows={14} style={{ ...s.input, resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div style={s.cardPad}>
              <p style={s.cardTitle}>SEO</p>
              <div style={s.stack(14)}>
                <div>
                  <label style={s.label}>Meta title</label>
                  <input name="metaTitle" defaultValue={article?.metaTitle ?? ''} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Meta description</label>
                  <textarea name="metaDescription" defaultValue={article?.metaDescription ?? ''} rows={2} style={{ ...s.input, resize: 'vertical' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={s.stack(16)}>
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Dettagli</p>
              <div style={s.stack(12)}>
                <div>
                  <label style={s.label}>Tag<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                  <input name="tag" required defaultValue={article?.tag} placeholder="es. Scienza" style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Data pubblicazione</label>
                  <input name="publishedAt" type="date" defaultValue={pubDate} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Tempo di lettura (min)</label>
                  <input name="readingTime" type="number" defaultValue={article?.readingTime ?? ''} style={s.input} />
                </div>
                <ToggleField name="published" label="Pubblicato" defaultChecked={article?.published ?? false} />
              </div>
            </div>

            <ConfirmSaveButton
              label={article ? 'Salva modifiche' : 'Pubblica articolo'}
              title={article ? 'Conferma salvataggio' : 'Pubblica articolo'}
              message={article ? 'Vuoi salvare le modifiche a questo articolo?' : 'Vuoi pubblicare questo nuovo articolo?'}
              style={s.btnPrimary}
            />
          </div>
        </div>
      </form>

      {/* Delete — form separato, non annidato */}
      {article && deleteAction && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ ...s.cardPad, maxWidth: '16.25rem', borderColor: '#fecaca', background: '#fff5f5' }}>
            <p style={{ ...s.cardTitle, color: '#dc2626', marginBottom: '0.375rem' }}>Zona pericolosa</p>
            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.875rem', marginTop: 0 }}>Operazione irreversibile.</p>
            <ConfirmDeleteButton
              formAction={deleteAction}
              hiddenFields={{ id: article.id }}
              title="Elimina articolo"
              message={`Stai per eliminare "${article.title}". Questa operazione è irreversibile.`}
              buttonLabel="Elimina articolo"
              buttonStyle={s.btnDanger}
            />
          </div>
        </div>
      )}

      <style>{`
        .article-form-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }
        @media (min-width: 56.25rem) {
          .article-form-grid {
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
