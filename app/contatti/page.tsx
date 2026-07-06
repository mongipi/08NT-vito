import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = { title: 'Contatti' }

const CONTACT_ROWS = [
  { label: 'Indirizzo', value: 'Via Don Luigi Sturzo 44/46/48 - Bitonto (BA) 70032' },
  { label: 'Telefono', value: '080 303 1103', href: 'tel:+390803031103' },
  { label: 'WhatsApp', value: '351 507 8701', href: 'https://wa.me/393515078701', icon: '/v61/icons/whatsapp.svg' },
  { label: 'Email', value: '08naturaltechnology@gmail.com', href: 'mailto:08naturaltechnology@gmail.com' },
  { label: 'Social', value: 'Seguici per aggiornamenti e contenuti.' },
]

export default function ContattiPage() {
  return (
    <main>
      <PageHeader eyebrow="Parliamo" title="Contatti." />

      <section className="section">
        <div className="v61-inner v61-contact-grid">
          <aside className="v61-contact-card">
            <div className="v61-eyebrow light">Dove trovarci</div>
            <h2>VIPHARMA di<br /><em>Tatulli Vito &amp; Co.</em></h2>
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
            <div className="v61-eyebrow">Scrivici</div>
            <h2 className="v61-title">Mandaci un<br /><em>messaggio.</em></h2>
            <form action="#" method="post">
              <Field label="Nome e cognome"><input autoComplete="name" name="nome" /></Field>
              <Field label="Email"><input autoComplete="email" name="email" type="email" /></Field>
              <Field label="Oggetto">
                <select name="oggetto">
                  <option>Informazioni sui prodotti</option>
                  <option>Collaborazioni</option>
                  <option>Distribuzione</option>
                  <option>Altro</option>
                </select>
              </Field>
              <Field label="Messaggio"><textarea name="messaggio" /></Field>
              <button className="v61-button" type="submit">Invia messaggio</button>
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
