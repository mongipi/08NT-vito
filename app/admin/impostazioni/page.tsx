import type { Metadata } from 'next'
import { saveSettings } from '@/lib/actions/settings'
import { getSettingsMap, SETTING_KEYS } from '@/lib/settings'
import { DEFAULT_PUBLIC_SITE_SETTINGS } from '@/lib/site-settings'
import { LegalOverrideEditor } from './_LegalOverrideEditor'

export const metadata: Metadata = { title: 'Impostazioni' }

const card: React.CSSProperties = {
  background: 'white',
  borderRadius: '0.625rem',
  border: '1px solid #e8eaed',
  padding: '1.5rem',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: '#111827',
  margin: '0 0 1.25rem',
  paddingBottom: '0.875rem',
  borderBottom: '1px solid #f0f1f3',
}

const label: React.CSSProperties = {
  display: 'block',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#6b7280',
  marginBottom: '0.375rem',
}

const input: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #d1d5db',
  padding: '0.625rem 0.875rem',
  fontSize: '0.875rem',
  color: '#111827',
  outline: 'none',
  borderRadius: '0.375rem',
  fontFamily: 'inherit',
}

const hint: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#9ca3af',
  marginTop: '0.25rem',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      <h2 style={sectionTitle}>{title}</h2>
      {children}
    </div>
  )
}

export default async function ImpostazioniPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const [settings, { saved }] = await Promise.all([getSettingsMap(), searchParams])
  const get = (key: string, fallback = '') => settings[key] ?? fallback

  const iban = get(SETTING_KEYS.IBAN)
  const intestatario = get(SETTING_KEYS.INTESTATARIO)
  const codSurcharge = get(SETTING_KEYS.COD_SURCHARGE, '5')
  const speGratuita = get(SETTING_KEYS.SPEDIZIONE_GRATUITA, '39.90')
  const prezzoSpe = get(SETTING_KEYS.PREZZO_SPEDIZIONE, '5.90')
  const supplementoEstero = get(SETTING_KEYS.SUPPLEMENTO_ESTERO, '10')
  const companyLegalName = get(SETTING_KEYS.COMPANY_LEGAL_NAME, DEFAULT_PUBLIC_SITE_SETTINGS.companyLegalName)
  const companyAddress = get(SETTING_KEYS.COMPANY_ADDRESS, DEFAULT_PUBLIC_SITE_SETTINGS.companyAddress)
  const companyPhone = get(SETTING_KEYS.COMPANY_PHONE, DEFAULT_PUBLIC_SITE_SETTINGS.companyPhone)
  const companyWhatsapp = get(SETTING_KEYS.COMPANY_WHATSAPP, DEFAULT_PUBLIC_SITE_SETTINGS.companyWhatsapp)
  const companyEmail = get(SETTING_KEYS.COMPANY_EMAIL, DEFAULT_PUBLIC_SITE_SETTINGS.companyEmail)
  const whatsappMessage = get(SETTING_KEYS.WHATSAPP_MESSAGE, DEFAULT_PUBLIC_SITE_SETTINGS.whatsappMessage)
  const socialFacebook = get(SETTING_KEYS.SOCIAL_FACEBOOK, DEFAULT_PUBLIC_SITE_SETTINGS.facebookUrl)
  const socialInstagram = get(SETTING_KEYS.SOCIAL_INSTAGRAM, DEFAULT_PUBLIC_SITE_SETTINGS.instagramUrl)
  const socialTiktok = get(SETTING_KEYS.SOCIAL_TIKTOK, DEFAULT_PUBLIC_SITE_SETTINGS.tiktokUrl)
  const newsletterKicker = get(SETTING_KEYS.NEWSLETTER_KICKER, DEFAULT_PUBLIC_SITE_SETTINGS.newsletterKicker)
  const newsletterTitle = get(SETTING_KEYS.NEWSLETTER_TITLE, DEFAULT_PUBLIC_SITE_SETTINGS.newsletterTitle)
  const newsletterBody = get(SETTING_KEYS.NEWSLETTER_BODY, DEFAULT_PUBLIC_SITE_SETTINGS.newsletterBody)
  const newsletterButtonLabel = get(SETTING_KEYS.NEWSLETTER_BUTTON_LABEL, DEFAULT_PUBLIC_SITE_SETTINGS.newsletterButtonLabel)
  const legalPrivacyOverride = get(SETTING_KEYS.LEGAL_PRIVACY_OVERRIDE)
  const legalCookieOverride = get(SETTING_KEYS.LEGAL_COOKIE_OVERRIDE)
  const legalNotesOverride = get(SETTING_KEYS.LEGAL_NOTES_OVERRIDE)
  const legalTermsOverride = get(SETTING_KEYS.LEGAL_TERMS_OVERRIDE)

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>
          Impostazioni
        </h1>
        <p
          style={{
            fontSize: '0.8125rem',
            color: '#9ca3af',
            marginTop: '0.1875rem',
            marginBottom: 0,
          }}
        >
          Configurazione generale del sito, della home e dei contenuti gestibili.
        </p>
      </div>

      {saved && (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.375rem',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.8125rem',
            color: '#15803d',
          }}
        >
          Impostazioni salvate
        </div>
      )}

      <form action={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Section title="Bonifico bancario">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={label} htmlFor="iban">
                IBAN
              </label>
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
              <label style={label} htmlFor="intestatario">
                Intestatario
              </label>
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
        </Section>

        <Section title="Contrassegno">
          <div>
            <label style={label} htmlFor="cod">
              Supplemento contrassegno (€)
            </label>
            <input
              id="cod"
              name={SETTING_KEYS.COD_SURCHARGE}
              type="number"
              step="0.01"
              min="0"
              defaultValue={codSurcharge}
              style={{ ...input, maxWidth: '10rem' }}
            />
            <p style={hint}>
              Importo aggiunto al totale quando il cliente sceglie il pagamento alla consegna.
            </p>
          </div>
        </Section>

        <Section title="Spedizione">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={label} htmlFor="speGratuita">
                Soglia spedizione gratuita (€)
              </label>
              <input
                id="speGratuita"
                name={SETTING_KEYS.SPEDIZIONE_GRATUITA}
                type="number"
                step="0.01"
                min="0"
                defaultValue={speGratuita}
                style={{ ...input, maxWidth: '10rem' }}
              />
            </div>
            <div>
              <label style={label} htmlFor="prezzoSpe">
                Prezzo spedizione standard (€)
              </label>
              <input
                id="prezzoSpe"
                name={SETTING_KEYS.PREZZO_SPEDIZIONE}
                type="number"
                step="0.01"
                min="0"
                defaultValue={prezzoSpe}
                style={{ ...input, maxWidth: '10rem' }}
              />
            </div>
            <div>
              <label style={label} htmlFor="supEstero">
                Supplemento spedizione estera (€)
              </label>
              <input
                id="supEstero"
                name={SETTING_KEYS.SUPPLEMENTO_ESTERO}
                type="number"
                step="0.01"
                min="0"
                defaultValue={supplementoEstero}
                style={{ ...input, maxWidth: '10rem' }}
              />
            </div>
          </div>
        </Section>

        <Section title="Azienda e contatti">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={label} htmlFor="companyLegalName">
                Ragione sociale
              </label>
              <input
                id="companyLegalName"
                name={SETTING_KEYS.COMPANY_LEGAL_NAME}
                defaultValue={companyLegalName}
                style={input}
              />
            </div>
            <div>
              <label style={label} htmlFor="companyAddress">
                Indirizzo completo
              </label>
              <input
                id="companyAddress"
                name={SETTING_KEYS.COMPANY_ADDRESS}
                defaultValue={companyAddress}
                style={input}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
              <div>
                <label style={label} htmlFor="companyPhone">
                  Telefono
                </label>
                <input
                  id="companyPhone"
                  name={SETTING_KEYS.COMPANY_PHONE}
                  defaultValue={companyPhone}
                  style={input}
                />
              </div>
              <div>
                <label style={label} htmlFor="companyWhatsapp">
                  WhatsApp
                </label>
                <input
                  id="companyWhatsapp"
                  name={SETTING_KEYS.COMPANY_WHATSAPP}
                  defaultValue={companyWhatsapp}
                  style={input}
                />
              </div>
              <div>
                <label style={label} htmlFor="companyEmail">
                  Email
                </label>
                <input
                  id="companyEmail"
                  name={SETTING_KEYS.COMPANY_EMAIL}
                  defaultValue={companyEmail}
                  style={input}
                />
              </div>
            </div>
            <div>
              <label style={label} htmlFor="whatsappMessage">
                Messaggio iniziale widget WhatsApp
              </label>
              <textarea
                id="whatsappMessage"
                name={SETTING_KEYS.WHATSAPP_MESSAGE}
                defaultValue={whatsappMessage}
                rows={3}
                style={{ ...input, resize: 'vertical' }}
              />
            </div>
          </div>
        </Section>

        <Section title="Social">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={label} htmlFor="socialFacebook">
                Facebook URL
              </label>
              <input
                id="socialFacebook"
                name={SETTING_KEYS.SOCIAL_FACEBOOK}
                defaultValue={socialFacebook}
                style={input}
              />
            </div>
            <div>
              <label style={label} htmlFor="socialInstagram">
                Instagram URL
              </label>
              <input
                id="socialInstagram"
                name={SETTING_KEYS.SOCIAL_INSTAGRAM}
                defaultValue={socialInstagram}
                style={input}
              />
            </div>
            <div>
              <label style={label} htmlFor="socialTiktok">
                TikTok URL
              </label>
              <input
                id="socialTiktok"
                name={SETTING_KEYS.SOCIAL_TIKTOK}
                defaultValue={socialTiktok}
                style={input}
              />
            </div>
          </div>
        </Section>

        <Section title="Newsletter contenuti">
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={label} htmlFor="newsletterKicker">
                Eyebrow
              </label>
              <input
                id="newsletterKicker"
                name={SETTING_KEYS.NEWSLETTER_KICKER}
                defaultValue={newsletterKicker}
                style={input}
              />
            </div>
            <div>
              <label style={label} htmlFor="newsletterTitle">
                Titolo
              </label>
              <input
                id="newsletterTitle"
                name={SETTING_KEYS.NEWSLETTER_TITLE}
                defaultValue={newsletterTitle}
                style={input}
              />
            </div>
            <div>
              <label style={label} htmlFor="newsletterBody">
                Testo
              </label>
              <textarea
                id="newsletterBody"
                name={SETTING_KEYS.NEWSLETTER_BODY}
                defaultValue={newsletterBody}
                rows={4}
                style={{ ...input, resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={label} htmlFor="newsletterButtonLabel">
                Testo bottone
              </label>
              <input
                id="newsletterButtonLabel"
                name={SETTING_KEYS.NEWSLETTER_BUTTON_LABEL}
                defaultValue={newsletterButtonLabel}
                style={{ ...input, maxWidth: '20rem' }}
              />
            </div>
          </div>
        </Section>

        <Section title="Pagine legali italiane">
          <div style={{ display: 'grid', gap: '1rem' }}>
            <LegalOverrideEditor
              name={SETTING_KEYS.LEGAL_PRIVACY_OVERRIDE}
              title="Privacy Policy"
              initialValue={legalPrivacyOverride}
            />
            <LegalOverrideEditor
              name={SETTING_KEYS.LEGAL_COOKIE_OVERRIDE}
              title="Cookie Policy"
              initialValue={legalCookieOverride}
            />
            <LegalOverrideEditor
              name={SETTING_KEYS.LEGAL_NOTES_OVERRIDE}
              title="Note Legali"
              initialValue={legalNotesOverride}
            />
            <LegalOverrideEditor
              name={SETTING_KEYS.LEGAL_TERMS_OVERRIDE}
              title="Termini e condizioni di vendita"
              initialValue={legalTermsOverride}
            />
          </div>
        </Section>

        <div>
          <button
            type="submit"
            style={{
              padding: '0.625rem 1.5rem',
              background: '#1a4a2e',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            Salva impostazioni
          </button>
        </div>
      </form>
    </div>
  )
}
