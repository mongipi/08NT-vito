'use client'

import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { PageHeader } from '@/components/ui/PageHeader'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { formatWhatsappHref, getSocialLinks } from '@/lib/site-settings'

export function ContattiContent() {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const siteSettings = useSiteSettings()
  const socialLinks = getSocialLinks(siteSettings)
  const [sending, setSending] = useState(false)
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const CONTACT_ROWS = [
    { label: t('contact_row_address_label'), value: siteSettings.companyAddress, icon: '/v61/icons/address.svg' },
    { label: t('contact_row_phone_label'), value: siteSettings.companyPhone, href: `tel:${siteSettings.companyPhone.replace(/\s+/g, '')}`, icon: '/v61/icons/phone.svg' },
    { label: t('contact_row_whatsapp_label'), value: siteSettings.companyWhatsapp, href: formatWhatsappHref(siteSettings.companyWhatsapp), icon: '/v61/icons/whatsapp.svg' },
    { label: t('contact_row_email_label'), value: siteSettings.companyEmail, href: `mailto:${siteSettings.companyEmail}`, icon: '/v61/icons/email.svg' },
    { label: t('contact_row_social_label'), value: t('contact_row_social_value'), social: true },
  ]

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setFormMessage(null)

    try {
      const form = event.currentTarget
      const data = new FormData(form)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('nome'),
          email: data.get('email'),
          subject: data.get('oggetto'),
          message: data.get('messaggio'),
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message || 'Invio non riuscito.')
      form.reset()
      setFormMessage({
        type: 'success',
        text: locale === 'it' ? 'Messaggio inviato correttamente.' : 'Message sent successfully.',
      })
    } catch (error) {
      setFormMessage({
        type: 'error',
        text: error instanceof Error
          ? error.message
          : (locale === 'it' ? 'Invio non riuscito. Riprova tra poco.' : 'Unable to send. Please try again.'),
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <main>
      <PageHeader eyebrow={t('contact_eyebrow')} title={t('contact_title')} />

      <section className="section">
        <div className="v61-inner v61-contact-grid">
          <aside className="v61-contact-card">
            <div className="v61-eyebrow light">{t('contact_where_to_find_us')}</div>
            <h2>{richText(t('contact_company_title'))}</h2>
            <div className="v61-contact-list">
              {CONTACT_ROWS.map((row) => (
                <div className="v61-contact-item" key={row.label}>
                  <small>{row.label}</small>
                  {row.href ? (
                    <a href={row.href} target={row.href.startsWith('http') ? '_blank' : undefined} rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      {row.icon && <Image src={row.icon} alt="" width={15} height={15} />}
                      <span>{row.value}</span>
                    </a>
                  ) : row.social ? (
                    <div className="v61-contact-socials">
                      {socialLinks.map(({ href, label }) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                          <Image src={`/v61/icons/${label.toLowerCase()}.svg`} alt="" width={16} height={16} />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <span className="v61-contact-value">
                      {row.icon && <Image src={row.icon} alt="" width={15} height={15} />}
                      <span>{row.value}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </aside>

          <div className="v61-contact-form">
            <div className="v61-eyebrow">{t('contact_write_us')}</div>
            <h2 className="v61-title">{richText(t('contact_form_title'))}</h2>
            <form onSubmit={submitContact}>
              <Field label={t('contact_field_name')}><input autoComplete="name" name="nome" required /></Field>
              <Field label={t('contact_field_email')}><input autoComplete="email" name="email" type="email" required /></Field>
              <Field label={t('contact_field_subject')}>
                <select name="oggetto">
                  <option>{t('contact_subject_products')}</option>
                  <option>{t('contact_subject_collab')}</option>
                  <option>{t('contact_subject_distribution')}</option>
                  <option>{t('contact_subject_other')}</option>
                </select>
              </Field>
              <Field label={t('contact_field_message')}><textarea name="messaggio" required /></Field>
              <button className="v61-button" type="submit" disabled={sending}>
                {sending ? (locale === 'it' ? 'Invio...' : 'Sending...') : t('contact_send')}
              </button>
              {formMessage && (
                <p className={`v61-contact-form-message ${formMessage.type}`} role="status">
                  {formMessage.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="v61-field"><span>{label}</span>{children}</label>
}
