import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'
import { updateUserInfo } from '@/lib/actions/account'

export const metadata: Metadata = { title: 'Impostazioni account — 08 Natural Technology' }

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1px solid var(--border-2)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', color: 'var(--ink)', outline: 'none',
  background: 'white', fontFamily: 'var(--font-montserrat)',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.5625rem', fontWeight: 500,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  color: 'var(--ink-3)', marginBottom: '0.375rem',
}
const sectionTitle: React.CSSProperties = {
  fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.18em',
  textTransform: 'uppercase', color: 'var(--ink-4)',
  marginBottom: '1rem', paddingBottom: '0.625rem',
  borderBottom: '0.5px solid var(--border)',
}

function Field({ label, name, defaultValue, type = 'text', placeholder }: {
  label: string; name: string; defaultValue?: string | null; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input name={name} type={type} defaultValue={defaultValue ?? ''} placeholder={placeholder} style={inputStyle} />
    </div>
  )
}

export default async function ImpostazioniPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) redirect('/login')

  const { saved } = await searchParams
  const isB2B = user.role === 'b2b' || user.role === 'admin'

  return (
    <main style={{ background: 'var(--paper)', minHeight: '100dvh' }}>
      <div style={{ height: '0.1875rem', background: 'var(--forest)' }} />

      {/* Header */}
      <section style={{ background: 'linear-gradient(150deg, #0b2214 0%, var(--forest) 100%)', padding: '1.75rem 1.25rem' }}>
        <div style={{ maxWidth: '44rem', margin: '0 auto' }}>
          <Link href="/account" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none', marginBottom: '1.25rem',
          }}>
            <svg width="0.625rem" height="0.625rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Il mio account
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontWeight: 300,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white',
            margin: 0, letterSpacing: '0.02em',
          }}>
            Impostazioni
          </h1>
        </div>
      </section>

      {/* Form */}
      <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '1.75rem 1.25rem 3rem' }}>

        {saved && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.8125rem', color: '#15803d' }}>
            ✓ Modifiche salvate
          </div>
        )}

        <form action={updateUserInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Dati personali */}
          <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.5rem' }}>
            <p style={sectionTitle}>Dati personali</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="Nome e cognome" name="name" defaultValue={user.name} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Telefono" name="phone" defaultValue={user.phone} placeholder="+39 000 000 0000" />
                <Field label="Codice fiscale" name="fiscalCode" defaultValue={user.fiscalCode} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input value={user.email} disabled style={{ ...inputStyle, background: 'var(--paper)', color: 'var(--ink-4)', cursor: 'not-allowed' }} />
              </div>
            </div>
          </div>

          {/* Dati azienda */}
          <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.5rem' }}>
            <p style={sectionTitle}>Dati azienda <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(per acquisti B2B e fatturazione)</span></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="Ragione sociale" name="company" defaultValue={user.company} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Partita IVA" name="vatNumber" defaultValue={user.vatNumber} />
                <Field label="Codice SDI" name="sdiCode" defaultValue={user.sdiCode} placeholder="es. XXXXXXX" />
              </div>
              <Field label="PEC" name="pec" type="email" defaultValue={user.pec} placeholder="pec@esempio.it" />
            </div>
          </div>

          <button type="submit" style={{
            padding: '0.9375rem', background: 'var(--forest)', color: 'white',
            border: 'none', cursor: 'pointer',
            fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>
            Salva modifiche
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link href="/account/indirizzi" style={{ fontSize: '0.75rem', color: 'var(--ink-4)', textDecoration: 'none' }}>
            Gestisci indirizzi →
          </Link>
        </div>
      </div>
    </main>
  )
}
