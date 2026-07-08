'use client'

import Link from 'next/link'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

export function ForgotPasswordContent() {
  const { locale } = useLocale()
  const t = useTranslation(locale)

  return (
    <main style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 3, background: 'var(--forest)' }} />

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 1.25rem',
        background: 'linear-gradient(160deg, var(--paper) 0%, #fff 60%)',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{
            fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--green)', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'block', width: 18, height: '1px', background: 'var(--green)' }} />
            {t('forgot_eyebrow')}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontWeight: 300,
            fontSize: 'clamp(2rem, 6vw, 2.75rem)',
            color: 'var(--forest)', lineHeight: 1, letterSpacing: '-0.01em',
            marginBottom: '0.375rem',
          }}>
            {t('forgot_title')}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', marginBottom: '2.25rem', fontWeight: 300 }}>
            {t('forgot_body')}
          </p>

          <ForgotPasswordForm />

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--ink-3)', marginTop: '2rem' }}>
            <Link href="/login" style={{ color: 'var(--forest)', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid var(--green-l)' }}>
              {t('forgot_back_to_login')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
