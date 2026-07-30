import type { Metadata } from 'next'
import { saveSettings } from '@/lib/actions/settings'
import { getSettingsMap, SETTING_KEYS } from '@/lib/settings'
import { DEFAULT_PUBLIC_SITE_SETTINGS } from '@/lib/site-settings'
import { FooterSectionsEditor } from './_FooterSectionsEditor'
import { FooterAssetsEditor } from './_FooterAssetsEditor'
import { HeroCarouselEditor } from './_HeroCarouselEditor'
import { HomeFeaturesEditor } from './_HomeFeaturesEditor'
import { LegalOverrideEditor } from './_LegalOverrideEditor'
import { MethodPageEditor } from './_MethodPageEditor'
import { NavLinksEditor } from './_NavLinksEditor'
import { ProductPageKickersEditor } from './_ProductPageKickersEditor'
import { ProductPageTextsEditor } from './_ProductPageTextsEditor'

export const metadata: Metadata = { title: 'Impostazioni' }

const card: React.CSSProperties = {
  background: 'white',
  borderRadius: '0.625rem',
  border: '1px solid #e8eaed',
  padding: '1.5rem',
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

export default async function ImpostazioniPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const [settings, { saved }] = await Promise.all([getSettingsMap(), searchParams])

  const iban = settings[SETTING_KEYS.IBAN] ?? ''
  const intestatario = settings[SETTING_KEYS.INTESTATARIO] ?? ''
  const codSurcharge = settings[SETTING_KEYS.COD_SURCHARGE] ?? '5'
  const speGratuita = settings[SETTING_KEYS.SPEDIZIONE_GRATUITA] ?? '39.90'
  const prezzoSpe = settings[SETTING_KEYS.PREZZO_SPEDIZIONE] ?? '5.90'
  const supplementoEstero = settings[SETTING_KEYS.SUPPLEMENTO_ESTERO] ?? '10'
  const homeHeroCarousel = settings[SETTING_KEYS.HOME_HERO_CAROUSEL] ?? ''
  const companyDisplayName =
    settings[SETTING_KEYS.COMPANY_DISPLAY_NAME] ?? DEFAULT_PUBLIC_SITE_SETTINGS.companyDisplayName
  const companyLegalName =
    settings[SETTING_KEYS.COMPANY_LEGAL_NAME] ?? DEFAULT_PUBLIC_SITE_SETTINGS.companyLegalName
  const companyAddress =
    settings[SETTING_KEYS.COMPANY_ADDRESS] ?? DEFAULT_PUBLIC_SITE_SETTINGS.companyAddress
  const companyPhone =
    settings[SETTING_KEYS.COMPANY_PHONE] ?? DEFAULT_PUBLIC_SITE_SETTINGS.companyPhone
  const companyWhatsapp =
    settings[SETTING_KEYS.COMPANY_WHATSAPP] ?? DEFAULT_PUBLIC_SITE_SETTINGS.companyWhatsapp
  const companyEmail =
    settings[SETTING_KEYS.COMPANY_EMAIL] ?? DEFAULT_PUBLIC_SITE_SETTINGS.companyEmail
  const whatsappMessage =
    settings[SETTING_KEYS.WHATSAPP_MESSAGE] ?? DEFAULT_PUBLIC_SITE_SETTINGS.whatsappMessage
  const socialFacebook =
    settings[SETTING_KEYS.SOCIAL_FACEBOOK] ?? DEFAULT_PUBLIC_SITE_SETTINGS.facebookUrl
  const socialInstagram =
    settings[SETTING_KEYS.SOCIAL_INSTAGRAM] ?? DEFAULT_PUBLIC_SITE_SETTINGS.instagramUrl
  const socialTiktok =
    settings[SETTING_KEYS.SOCIAL_TIKTOK] ?? DEFAULT_PUBLIC_SITE_SETTINGS.tiktokUrl
  const headerNavLinks = settings[SETTING_KEYS.HEADER_NAV_LINKS] ?? ''
  const footerSections = settings[SETTING_KEYS.FOOTER_SECTIONS] ?? ''
  const footerPayments =
    settings[SETTING_KEYS.FOOTER_PAYMENTS] ??
    DEFAULT_PUBLIC_SITE_SETTINGS.footerPayments.join('\n')
  const footerCouriers = settings[SETTING_KEYS.FOOTER_COURIERS] ?? ''
  const footerMinistryLogo = settings[SETTING_KEYS.FOOTER_MINISTRY_LOGO] ?? ''
  const footerCopyrightText =
    settings[SETTING_KEYS.FOOTER_COPYRIGHT_TEXT] ??
    DEFAULT_PUBLIC_SITE_SETTINGS.footerCopyrightText
  const footerMadeLabel =
    settings[SETTING_KEYS.FOOTER_MADE_LABEL] ?? DEFAULT_PUBLIC_SITE_SETTINGS.footerMadeLabel
  const productPageKickers = settings[SETTING_KEYS.PRODUCT_PAGE_KICKERS] ?? ''
  const productPageTexts = settings[SETTING_KEYS.PRODUCT_PAGE_TEXTS] ?? ''
  const homeFeatures = settings[SETTING_KEYS.HOME_FEATURES] ?? ''
  const homeFormulasEyebrow =
    settings[SETTING_KEYS.HOME_FORMULAS_EYEBROW] ??
    DEFAULT_PUBLIC_SITE_SETTINGS.homeFormulasEyebrow
  const homeFormulasTitle =
    settings[SETTING_KEYS.HOME_FORMULAS_TITLE] ?? DEFAULT_PUBLIC_SITE_SETTINGS.homeFormulasTitle
  const homeFormulasBody =
    settings[SETTING_KEYS.HOME_FORMULAS_BODY] ?? DEFAULT_PUBLIC_SITE_SETTINGS.homeFormulasBody
  const homeFormulasCtaLabel =
    settings[SETTING_KEYS.HOME_FORMULAS_CTA_LABEL] ??
    DEFAULT_PUBLIC_SITE_SETTINGS.homeFormulasCtaLabel
  const homeFormulasCtaHref =
    settings[SETTING_KEYS.HOME_FORMULAS_CTA_HREF] ??
    DEFAULT_PUBLIC_SITE_SETTINGS.homeFormulasCtaHref
  const homeBlogEyebrow =
    settings[SETTING_KEYS.HOME_BLOG_EYEBROW] ?? DEFAULT_PUBLIC_SITE_SETTINGS.homeBlogEyebrow
  const homeBlogTitle =
    settings[SETTING_KEYS.HOME_BLOG_TITLE] ?? DEFAULT_PUBLIC_SITE_SETTINGS.homeBlogTitle
  const homeBlogBody =
    settings[SETTING_KEYS.HOME_BLOG_BODY] ?? DEFAULT_PUBLIC_SITE_SETTINGS.homeBlogBody
  const newsletterKicker =
    settings[SETTING_KEYS.NEWSLETTER_KICKER] ?? DEFAULT_PUBLIC_SITE_SETTINGS.newsletterKicker
  const newsletterTitle =
    settings[SETTING_KEYS.NEWSLETTER_TITLE] ?? DEFAULT_PUBLIC_SITE_SETTINGS.newsletterTitle
  const newsletterBody =
    settings[SETTING_KEYS.NEWSLETTER_BODY] ?? DEFAULT_PUBLIC_SITE_SETTINGS.newsletterBody
  const newsletterButtonLabel =
    settings[SETTING_KEYS.NEWSLETTER_BUTTON_LABEL] ??
    DEFAULT_PUBLIC_SITE_SETTINGS.newsletterButtonLabel
  const newsletterEmailPlaceholder =
    settings[SETTING_KEYS.NEWSLETTER_EMAIL_PLACEHOLDER] ??
    DEFAULT_PUBLIC_SITE_SETTINGS.newsletterEmailPlaceholder
  const methodPageContent = settings[SETTING_KEYS.METHOD_PAGE_CONTENT] ?? ''
  const legalPrivacyOverride = settings[SETTING_KEYS.LEGAL_PRIVACY_OVERRIDE] ?? ''
  const legalCookieOverride = settings[SETTING_KEYS.LEGAL_COOKIE_OVERRIDE] ?? ''
  const legalNotesOverride = settings[SETTING_KEYS.LEGAL_NOTES_OVERRIDE] ?? ''
  const legalTermsOverride = settings[SETTING_KEYS.LEGAL_TERMS_OVERRIDE] ?? ''

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
        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Bonifico bancario
          </h2>
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
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Contrassegno
          </h2>
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
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Spedizione
          </h2>
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
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Home hero carousel
          </h2>
          <HeroCarouselEditor initialValue={homeHeroCarousel} />
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Pagine prodotto
          </h2>
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <ProductPageKickersEditor
              name={SETTING_KEYS.PRODUCT_PAGE_KICKERS}
              initialValue={productPageKickers}
              defaults={DEFAULT_PUBLIC_SITE_SETTINGS.productPageKickers}
            />
            <ProductPageTextsEditor
              name={SETTING_KEYS.PRODUCT_PAGE_TEXTS}
              initialValue={productPageTexts}
              defaults={DEFAULT_PUBLIC_SITE_SETTINGS.productPageTexts}
            />
          </div>
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Azienda e contatti
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={label} htmlFor="companyDisplayName">
                Nome brand visibile
              </label>
              <input
                id="companyDisplayName"
                name={SETTING_KEYS.COMPANY_DISPLAY_NAME}
                defaultValue={companyDisplayName}
                style={input}
              />
            </div>
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
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Social
          </h2>
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
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Header navigation
          </h2>
          <NavLinksEditor
            name={SETTING_KEYS.HEADER_NAV_LINKS}
            initialValue={headerNavLinks}
            defaults={DEFAULT_PUBLIC_SITE_SETTINGS.headerNavLinks}
            helperText="Gestisci il menu principale del sito. I link disattivati spariscono sia da desktop che da mobile."
          />
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Footer links e pagamenti
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <FooterSectionsEditor
              name={SETTING_KEYS.FOOTER_SECTIONS}
              initialValue={footerSections}
              defaults={DEFAULT_PUBLIC_SITE_SETTINGS.footerSections}
            />
            <FooterAssetsEditor
              couriersName={SETTING_KEYS.FOOTER_COURIERS}
              couriersInitialValue={footerCouriers}
              courierDefaults={DEFAULT_PUBLIC_SITE_SETTINGS.footerCouriers}
              ministryName={SETTING_KEYS.FOOTER_MINISTRY_LOGO}
              ministryInitialValue={footerMinistryLogo}
              ministryDefault={DEFAULT_PUBLIC_SITE_SETTINGS.footerMinistryLogo}
            />
            <div>
              <label style={label} htmlFor="footerPayments">
                Pagamenti mostrati nel footer
              </label>
              <textarea
                id="footerPayments"
                name={SETTING_KEYS.FOOTER_PAYMENTS}
                defaultValue={footerPayments}
                rows={6}
                style={{ ...input, resize: 'vertical' }}
              />
              <p style={hint}>Inserisci un metodo di pagamento per riga.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
              <div>
                <label style={label} htmlFor="footerCopyrightText">
                  Footer - Testo diritti
                </label>
                <input
                  id="footerCopyrightText"
                  name={SETTING_KEYS.FOOTER_COPYRIGHT_TEXT}
                  defaultValue={footerCopyrightText}
                  style={input}
                />
              </div>
              <div>
                <label style={label} htmlFor="footerMadeLabel">
                  Footer - Etichetta Made in Italy
                </label>
                <input
                  id="footerMadeLabel"
                  name={SETTING_KEYS.FOOTER_MADE_LABEL}
                  defaultValue={footerMadeLabel}
                  style={input}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Home contenuti
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <HomeFeaturesEditor
              name={SETTING_KEYS.HOME_FEATURES}
              initialValue={homeFeatures}
              defaults={DEFAULT_PUBLIC_SITE_SETTINGS.homeFeatures}
            />
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={label} htmlFor="homeFormulasEyebrow">
                  Home formule - Eyebrow
                </label>
                <input
                  id="homeFormulasEyebrow"
                  name={SETTING_KEYS.HOME_FORMULAS_EYEBROW}
                  defaultValue={homeFormulasEyebrow}
                  style={input}
                />
              </div>
              <div>
                <label style={label} htmlFor="homeFormulasTitle">
                  Home formule - Titolo
                </label>
                <textarea
                  id="homeFormulasTitle"
                  name={SETTING_KEYS.HOME_FORMULAS_TITLE}
                  defaultValue={homeFormulasTitle}
                  rows={3}
                  style={{ ...input, resize: 'vertical' }}
                />
                <p style={hint}>Puoi andare a capo e usare il grassetto con **testo**.</p>
              </div>
              <div>
                <label style={label} htmlFor="homeFormulasBody">
                  Home formule - Testo
                </label>
                <textarea
                  id="homeFormulasBody"
                  name={SETTING_KEYS.HOME_FORMULAS_BODY}
                  defaultValue={homeFormulasBody}
                  rows={4}
                  style={{ ...input, resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={label} htmlFor="homeFormulasCtaLabel">
                    Home formule - Testo bottone
                  </label>
                  <input
                    id="homeFormulasCtaLabel"
                    name={SETTING_KEYS.HOME_FORMULAS_CTA_LABEL}
                    defaultValue={homeFormulasCtaLabel}
                    style={input}
                  />
                </div>
                <div>
                  <label style={label} htmlFor="homeFormulasCtaHref">
                    Home formule - Link bottone
                  </label>
                  <input
                    id="homeFormulasCtaHref"
                    name={SETTING_KEYS.HOME_FORMULAS_CTA_HREF}
                    defaultValue={homeFormulasCtaHref}
                    style={input}
                  />
                </div>
              </div>
              <div>
                <label style={label} htmlFor="homeBlogEyebrow">
                  Home blog - Eyebrow
                </label>
                <input
                  id="homeBlogEyebrow"
                  name={SETTING_KEYS.HOME_BLOG_EYEBROW}
                  defaultValue={homeBlogEyebrow}
                  style={input}
                />
              </div>
              <div>
                <label style={label} htmlFor="homeBlogTitle">
                  Home blog - Titolo
                </label>
                <input
                  id="homeBlogTitle"
                  name={SETTING_KEYS.HOME_BLOG_TITLE}
                  defaultValue={homeBlogTitle}
                  style={input}
                />
              </div>
              <div>
                <label style={label} htmlFor="homeBlogBody">
                  Home blog - Testo
                </label>
                <textarea
                  id="homeBlogBody"
                  name={SETTING_KEYS.HOME_BLOG_BODY}
                  defaultValue={homeBlogBody}
                  rows={4}
                  style={{ ...input, resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Newsletter contenuti
          </h2>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
              <div>
                <label style={label} htmlFor="newsletterButtonLabel">
                  Testo bottone
                </label>
                <input
                  id="newsletterButtonLabel"
                  name={SETTING_KEYS.NEWSLETTER_BUTTON_LABEL}
                  defaultValue={newsletterButtonLabel}
                  style={input}
                />
              </div>
              <div>
                <label style={label} htmlFor="newsletterEmailPlaceholder">
                  Placeholder email
                </label>
                <input
                  id="newsletterEmailPlaceholder"
                  name={SETTING_KEYS.NEWSLETTER_EMAIL_PLACEHOLDER}
                  defaultValue={newsletterEmailPlaceholder}
                  style={input}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Qualità 08 contenuti
          </h2>
          <MethodPageEditor
            name={SETTING_KEYS.METHOD_PAGE_CONTENT}
            initialValue={methodPageContent}
          />
        </div>

        <div style={card}>
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.25rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid #f0f1f3',
            }}
          >
            Pagine legali italiane
          </h2>
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
        </div>

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
