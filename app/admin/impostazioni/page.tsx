import type { Metadata } from 'next'
import { saveSettings } from '@/lib/actions/settings'
import { getSettingsMap, SETTING_KEYS } from '@/lib/settings'

export const metadata: Metadata = { title: 'Impostazioni' }

const card: React.CSSProperties = {
  background: 'white', borderRadius: '0.625rem', border: '1px solid #e8eaed', padding: '1.5rem',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: '0.6875rem', fontWeight: 600,
  letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.375rem',
}
const input: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1px solid #d1d5db', padding: '0.625rem 0.875rem',
  fontSize: '0.875rem', color: '#111827', outline: 'none',
  borderRadius: '0.375rem', fontFamily: 'inherit',
}
const hint: React.CSSProperties = {
  fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem',
}

export default async function ImpostazioniPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const [settings, { saved }] = await Promise.all([getSettingsMap(), searchParams])

  const iban         = settings[SETTING_KEYS.IBAN]         ?? ''
  const intestatario = settings[SETTING_KEYS.INTESTATARIO] ?? ''
  const codSurcharge       = settings[SETTING_KEYS.COD_SURCHARGE]       ?? '5'
  const speGratuita        = settings[SETTING_KEYS.SPEDIZIONE_GRATUITA] ?? '39.90'
  const prezzoSpe          = settings[SETTING_KEYS.PREZZO_SPEDIZIONE]   ?? '5.90'
  const supplementoEstero  = settings[SETTING_KEYS.SUPPLEMENTO_ESTERO]  ?? '10'

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>Impostazioni</h1>
        <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.1875rem', marginBottom: 0 }}>
          Configurazione pagamenti e tariffe
        </p>
      </div>

      {saved && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.375rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.8125rem', color: '#15803d' }}>
          ✓ Impostazioni salvate
        </div>
      )}

      <form action={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Bonifico bancario */}
        <div style={card}>
          <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', margin: '0 0 1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid #f0f1f3' }}>
            Bonifico bancario
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={label} htmlFor="iban">IBAN</label>
              <input
                id="iban"
                name={SETTING_KEYS.IBAN}
                defaultValue={iban}
                placeholder="IT00 X000 0000 0000 0000 0000 000"
                style={{ ...input, fontFamily: 'monospace', letterSpacing: '0.05em' }}
              />
              <p style={hint}>Mostrato al cliente nella pagina di conferma ordine bonifico.</p>
            </div>
            <div>
              <label style={label} htmlFor="intestatario">Intestatario</label>
              <input
                id="intestatario"
                name={SETTING_KEYS.INTESTATARIO}
                defaultValue={intestatario}
                placeholder="VIPHARMA di Tatulli Vito & Co. S.A.S."
                style={input}
              />
              <p style={hint}>Ragione sociale o nome da indicare come beneficiario del bonifico.</p>
            </div>
          </div>
        </div>

        {/* Contrassegno */}
        <div style={card}>
          <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', margin: '0 0 1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid #f0f1f3' }}>
            Contrassegno
          </h2>
          <div>
            <label style={label} htmlFor="cod">Supplemento contrassegno (€)</label>
            <input
              id="cod"
              name={SETTING_KEYS.COD_SURCHARGE}
              type="number"
              step="0.01"
              min="0"
              defaultValue={codSurcharge}
              style={{ ...input, maxWidth: '10rem' }}
            />
            <p style={hint}>Importo aggiunto al totale quando il cliente sceglie il pagamento alla consegna.</p>
          </div>
        </div>

        {/* Spedizione */}
        <div style={card}>
          <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', margin: '0 0 1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid #f0f1f3' }}>
            Spedizione
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={label} htmlFor="speGratuita">Soglia spedizione gratuita (€)</label>
              <input
                id="speGratuita"
                name={SETTING_KEYS.SPEDIZIONE_GRATUITA}
                type="number" step="0.01" min="0"
                defaultValue={speGratuita}
                style={{ ...input, maxWidth: '10rem' }}
              />
              <p style={hint}>Sotto questa cifra si applica il costo di spedizione standard. Sopra, la spedizione è gratuita (solo Italia).</p>
            </div>
            <div>
              <label style={label} htmlFor="prezzoSpe">Prezzo spedizione standard (€)</label>
              <input
                id="prezzoSpe"
                name={SETTING_KEYS.PREZZO_SPEDIZIONE}
                type="number" step="0.01" min="0"
                defaultValue={prezzoSpe}
                style={{ ...input, maxWidth: '10rem' }}
              />
              <p style={hint}>Costo fisso applicato quando il cliente non ha diritto alla spedizione gratuita.</p>
            </div>
            <div>
              <label style={label} htmlFor="supEstero">Supplemento spedizione estera (€)</label>
              <input
                id="supEstero"
                name={SETTING_KEYS.SUPPLEMENTO_ESTERO}
                type="number" step="0.01" min="0"
                defaultValue={supplementoEstero}
                style={{ ...input, maxWidth: '10rem' }}
              />
              <p style={hint}>Aggiunto sempre per destinazioni fuori Italia, anche se la spedizione base è gratuita.</p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            style={{
              padding: '0.625rem 1.5rem',
              background: '#1a4a2e', color: 'white', border: 'none',
              borderRadius: '0.375rem', cursor: 'pointer',
              fontSize: '0.8125rem', fontWeight: 600,
            }}
          >
            Salva impostazioni
          </button>
        </div>
      </form>
    </div>
  )
}
