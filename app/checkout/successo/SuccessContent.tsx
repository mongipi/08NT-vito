'use client'

import Link from 'next/link'
import { ClearCart } from './ClearCart'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'

interface Props {
  orderId?: string
  method?: string
  iban: string
  intestatario: string
}

export function SuccessContent({ orderId, method, iban, intestatario }: Props) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const isBonifico = method === 'bonifico'
  const isContrassegno = method === 'contrassegno'

  return (
    <main style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <ClearCart />
      <div style={{ height: 3, background: 'var(--forest)' }} />

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 1.25rem',
        background: 'linear-gradient(160deg, var(--paper) 0%, #fff 60%)',
      }}>
        <div style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
          {/* Icona check */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#f0fdf4', border: '1.5px solid #bbf7d0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.75rem',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <div style={{ fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ width: 18, height: '1px', background: 'var(--green)', display: 'block' }} />
            {t('success_order_received')}
            <span style={{ width: 18, height: '1px', background: 'var(--green)', display: 'block' }} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontWeight: 300,
            fontSize: 'clamp(2rem, 6vw, 2.75rem)',
            color: 'var(--forest)', lineHeight: 1, margin: '0 0 1rem',
          }}>
            {t('success_thank_you')}
          </h1>

          {/* Istruzioni bonifico */}
          {isBonifico && (
            <div style={{
              textAlign: 'left', margin: '1.5rem 0 2rem',
              background: '#f8faf9', border: '1px solid #bbf7d0', padding: '1.25rem 1.5rem',
            }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '0.875rem' }}>
                {t('success_bank_instructions_title')}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', fontWeight: 300, lineHeight: 1.7, margin: '0 0 0.875rem' }}>
                {richText(t('success_bank_instructions_body'))}
              </p>
              <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
                {[
                  { label: t('success_bank_holder'), value: intestatario },
                  { label: t('success_bank_iban'),    value: iban, mono: true },
                  { label: t('success_bank_reason'),  value: orderId ? `Ordine #${orderId.slice(-8).toUpperCase()}` : t('success_bank_reason_fallback') },
                ].map(({ label, value, mono }) => (
                  <div key={label} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem' }}>
                    <dt style={{ color: 'var(--ink-4)', fontWeight: 500, minWidth: '6rem', flexShrink: 0 }}>{label}</dt>
                    <dd style={{ color: 'var(--ink)', fontWeight: mono ? 600 : 400, margin: 0, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Istruzioni contrassegno */}
          {isContrassegno && (
            <div style={{
              textAlign: 'left', margin: '1.5rem 0 2rem',
              background: '#fffbeb', border: '1px solid #fde68a', padding: '1.25rem 1.5rem',
            }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a16207', marginBottom: '0.875rem' }}>
                {t('success_cod_title')}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', fontWeight: 300, lineHeight: 1.7, margin: 0 }}>
                {richText(t('success_cod_body'))}
              </p>
            </div>
          )}

          {/* Stripe: messaggio standard */}
          {!isBonifico && !isContrassegno && (
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-3)', fontWeight: 300, lineHeight: 1.8, maxWidth: 380, margin: '0 auto 2.5rem' }}>
              {t('success_stripe_body')}
            </p>
          )}

          {(isBonifico || isContrassegno) && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--ink-4)', fontWeight: 300, lineHeight: 1.7, marginBottom: '2rem' }}>
              {t('success_confirmation_email_note')}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, margin: '0 auto' }}>
            <Link href="/account" style={{
              display: 'block', padding: '0.875rem',
              background: 'var(--forest)', color: 'white', textDecoration: 'none',
              fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              textAlign: 'center',
            }}>
              {t('success_view_orders')}
            </Link>
            <Link href="/prodotti" style={{
              display: 'block', padding: '0.875rem',
              background: 'transparent', color: 'var(--forest)', textDecoration: 'none',
              fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
              textAlign: 'center', border: '1px solid var(--forest)',
            }}>
              {t('success_continue_shopping')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
