'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { formatWhatsappHref } from '@/lib/site-settings'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

export function ChatWidget() {
  const [open, setOpen] = useState(true)
  const siteSettings = useSiteSettings()
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const href = formatWhatsappHref(siteSettings.companyWhatsapp, siteSettings.whatsappMessage)

  return (
    <div className="v61-chat-widget">
      {open && (
        <section className="v61-whatsapp-panel" aria-label={t('chat_aria_panel')}>
          <button
            type="button"
            className="v61-whatsapp-close"
            onClick={() => setOpen(false)}
            aria-label={t('chat_aria_close')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="v61-whatsapp-head">
            <Image
              src="/v61/icons/whatsapp.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <div>
              <span>{t('chat_direct_support')}</span>
              <strong>WhatsApp 08</strong>
            </div>
          </div>
          <p>{t('chat_body')}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="v61-chat-launcher v61-whatsapp-launcher"
            aria-label={t('chat_aria_open_chat')}
          >
            <Image
              src="/v61/icons/whatsapp.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            <span>{t('chat_open_whatsapp')}</span>
          </a>
        </section>
      )}
      {!open && (
        <button
          type="button"
          className="v61-chat-launcher v61-whatsapp-launcher v61-whatsapp-minimized"
          onClick={() => setOpen(true)}
          aria-label={t('chat_aria_open_widget')}
        >
          <Image
            src="/v61/icons/whatsapp.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
          <span>WhatsApp</span>
        </button>
      )}
    </div>
  )
}
