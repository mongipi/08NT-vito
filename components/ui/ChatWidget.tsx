'use client'

import Image from 'next/image'
import { useState } from 'react'

const WHATSAPP_NUMBER = '393515078701'
const WHATSAPP_MESSAGE =
  'Ciao, arrivo dal sito 08 Natural Technology e vorrei ricevere assistenza.'

export function ChatWidget() {
  const [open, setOpen] = useState(true)
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <div className="v61-chat-widget">
      {open && (
        <section className="v61-whatsapp-panel" aria-label="Assistenza WhatsApp">
          <button
            type="button"
            className="v61-whatsapp-close"
            onClick={() => setOpen(false)}
            aria-label="Chiudi assistenza WhatsApp"
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
              <span>Assistenza diretta</span>
              <strong>WhatsApp 08</strong>
            </div>
          </div>
          <p>
            Hai bisogno di un consiglio sui prodotti o vuoi parlare con noi per un ordine?
            Scrivici direttamente su WhatsApp.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="v61-chat-launcher v61-whatsapp-launcher"
            aria-label="Apri la chat WhatsApp"
          >
            <Image
              src="/v61/icons/whatsapp.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            <span>Apri WhatsApp</span>
          </a>
        </section>
      )}
      {!open && (
        <button
          type="button"
          className="v61-chat-launcher v61-whatsapp-launcher v61-whatsapp-minimized"
          onClick={() => setOpen(true)}
          aria-label="Apri assistenza WhatsApp"
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
