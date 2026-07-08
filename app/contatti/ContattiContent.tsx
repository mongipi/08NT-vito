'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { PageHeader } from '@/components/ui/PageHeader'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'

export function ContattiContent() {
  const { locale } = useLocale()
  const t = useTranslation(locale)

  const CONTACT_ROWS = [
    { label: t('contact_row_address_label'), value: t('contact_row_address_value') },
    { label: t('contact_row_phone_label'), value: '080 303 1103', href: 'tel:+390803031103' },
    { label: t('contact_row_whatsapp_label'), value: '351 507 8701', href: 'https://wa.me/393515078701', icon: '/v61/icons/whatsapp.svg' },
    { label: t('contact_row_email_label'), value: '08naturaltechnology@gmail.com', href: 'mailto:08naturaltechnology@gmail.com' },
    { label: t('contact_row_social_label'), value: t('contact_row_social_value') },
  ]

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
                  ) : row.value}
                </div>
              ))}
            </div>
          </aside>

          <div className="v61-contact-form">
            <div className="v61-eyebrow">{t('contact_write_us')}</div>
            <h2 className="v61-title">{richText(t('contact_form_title'))}</h2>
            <form action="#" method="post">
              <Field label={t('contact_field_name')}><input autoComplete="name" name="nome" /></Field>
              <Field label={t('contact_field_email')}><input autoComplete="email" name="email" type="email" /></Field>
              <Field label={t('contact_field_subject')}>
                <select name="oggetto">
                  <option>{t('contact_subject_products')}</option>
                  <option>{t('contact_subject_collab')}</option>
                  <option>{t('contact_subject_distribution')}</option>
                  <option>{t('contact_subject_other')}</option>
                </select>
              </Field>
              <Field label={t('contact_field_message')}><textarea name="messaggio" /></Field>
              <button className="v61-button" type="submit">{t('contact_send')}</button>
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
