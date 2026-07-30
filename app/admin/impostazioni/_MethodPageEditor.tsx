'use client'

import { useMemo, useState } from 'react'
import {
  DEFAULT_METHOD_PAGE_CONTENT,
  normalizeMethodPageContent,
  type MethodFeatureCard,
  type MethodFormula,
  type MethodPageContent,
  type MethodStep,
} from '@/lib/method-page'

type Props = {
  name: string
  initialValue: string
}

const inputStyle: React.CSSProperties = {
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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#6b7280',
  marginBottom: '0.375rem',
}

const boxStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '0.75rem',
  padding: '1rem',
  background: '#fafafa',
  display: 'grid',
  gap: '0.875rem',
}

function Field({
  label,
  value,
  onChange,
  rows,
  hint,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  rows?: number
  hint?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          style={{ ...inputStyle, resize: 'vertical' }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input style={inputStyle} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint ? <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>{hint}</p> : null}
    </div>
  )
}

function ListEditor({
  title,
  values,
  onChange,
}: {
  title: string
  values: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <div style={{ display: 'grid', gap: '0.625rem' }}>
      <strong style={{ fontSize: '0.9rem', color: '#111827' }}>{title}</strong>
      {values.map((item, index) => (
        <Field
          key={`${title}-${index}`}
          label={`${title} ${index + 1}`}
          value={item}
          onChange={(next) => onChange(values.map((current, currentIndex) => (currentIndex === index ? next : current)))}
        />
      ))}
    </div>
  )
}

export function MethodPageEditor({ name, initialValue }: Props) {
  const [content, setContent] = useState<MethodPageContent>(() =>
    normalizeMethodPageContent(initialValue, DEFAULT_METHOD_PAGE_CONTENT)
  )
  const serialized = useMemo(() => JSON.stringify(content), [content])

  function patchCard(cards: MethodFeatureCard[], index: number, patch: Partial<MethodFeatureCard>) {
    return cards.map((card, cardIndex) => (cardIndex === index ? { ...card, ...patch } : card))
  }

  function patchStep(steps: MethodStep[], index: number, patch: Partial<MethodStep>) {
    return steps.map((step, stepIndex) => (stepIndex === index ? { ...step, ...patch } : step))
  }

  function patchFormula(formulas: MethodFormula[], index: number, patch: Partial<MethodFormula>) {
    return formulas.map((formula, formulaIndex) =>
      formulaIndex === index ? { ...formula, ...patch } : formula
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="hidden" name={name} value={serialized} />
      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', maxWidth: '52rem' }}>
        Qui gestisci i contenuti principali della pagina Qualità 08 in lingua italiana. Le altre
        lingue continuano a usare i testi tradotti già presenti.
      </p>

      <div style={boxStyle}>
        <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Hero</strong>
        <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(next) => setContent({ ...content, hero: { ...content.hero, eyebrow: next } })} />
        <Field label="Titolo" value={content.hero.title} rows={3} hint="Puoi usare **testo** per il grassetto e andare a capo." onChange={(next) => setContent({ ...content, hero: { ...content.hero, title: next } })} />
        <Field label="Testo" value={content.hero.body} rows={4} onChange={(next) => setContent({ ...content, hero: { ...content.hero, body: next } })} />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
          <Field label="Testo bottone" value={content.hero.ctaLabel} onChange={(next) => setContent({ ...content, hero: { ...content.hero, ctaLabel: next } })} />
          <Field label="Link bottone" value={content.hero.ctaHref} onChange={(next) => setContent({ ...content, hero: { ...content.hero, ctaHref: next } })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
          <Field label="Immagine hero" value={content.hero.imageSrc} onChange={(next) => setContent({ ...content, hero: { ...content.hero, imageSrc: next } })} />
          <Field label="Alt immagine" value={content.hero.imageAlt} onChange={(next) => setContent({ ...content, hero: { ...content.hero, imageAlt: next } })} />
        </div>
      </div>

      <div style={boxStyle}>
        <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Qualità, innovazione e fiducia</strong>
        <Field label="Eyebrow" value={content.promise.eyebrow} onChange={(next) => setContent({ ...content, promise: { ...content.promise, eyebrow: next } })} />
        <Field label="Titolo" value={content.promise.title} rows={3} onChange={(next) => setContent({ ...content, promise: { ...content.promise, title: next } })} />
        <Field label="Testo introduttivo" value={content.promise.body} rows={3} onChange={(next) => setContent({ ...content, promise: { ...content.promise, body: next } })} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '1rem' }}>
          <div style={boxStyle}>
            <strong style={{ fontSize: '0.9rem', color: '#111827' }}>Pannello sinistro</strong>
            <Field label="Titolo" value={content.promise.panel1.title} onChange={(next) => setContent({ ...content, promise: { ...content.promise, panel1: { ...content.promise.panel1, title: next } } })} />
            <ListEditor title="Paragrafo" values={content.promise.panel1.paragraphs} onChange={(next) => setContent({ ...content, promise: { ...content.promise, panel1: { ...content.promise.panel1, paragraphs: next } } })} />
            <ListEditor title="Punto elenco" values={content.promise.panel1.items} onChange={(next) => setContent({ ...content, promise: { ...content.promise, panel1: { ...content.promise.panel1, items: next } } })} />
          </div>

          <div style={boxStyle}>
            <strong style={{ fontSize: '0.9rem', color: '#111827' }}>Pannello destro</strong>
            <Field label="Titolo" value={content.promise.panel2.title} onChange={(next) => setContent({ ...content, promise: { ...content.promise, panel2: { ...content.promise.panel2, title: next } } })} />
            <ListEditor title="Paragrafo" values={content.promise.panel2.paragraphs} onChange={(next) => setContent({ ...content, promise: { ...content.promise, panel2: { ...content.promise.panel2, paragraphs: next } } })} />
            <ListEditor title="Punto elenco" values={content.promise.panel2.items} onChange={(next) => setContent({ ...content, promise: { ...content.promise, panel2: { ...content.promise.panel2, items: next } } })} />
          </div>
        </div>
      </div>

      <div style={boxStyle}>
        <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Valori del benessere</strong>
        <Field label="Eyebrow" value={content.values.eyebrow} onChange={(next) => setContent({ ...content, values: { ...content.values, eyebrow: next } })} />
        <Field label="Titolo" value={content.values.title} rows={3} onChange={(next) => setContent({ ...content, values: { ...content.values, title: next } })} />
        <Field label="Testo" value={content.values.body} rows={4} onChange={(next) => setContent({ ...content, values: { ...content.values, body: next } })} />
        {content.values.cards.map((card, index) => (
          <div key={card.id} style={boxStyle}>
            <strong style={{ fontSize: '0.9rem', color: '#111827' }}>Valore {index + 1}</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '120px minmax(0,1fr)', gap: '1rem' }}>
              <Field label="Icona" value={card.icon} onChange={(next) => setContent({ ...content, values: { ...content.values, cards: patchCard(content.values.cards, index, { icon: next }) } })} />
              <Field label="Titolo" value={card.title} onChange={(next) => setContent({ ...content, values: { ...content.values, cards: patchCard(content.values.cards, index, { title: next }) } })} />
            </div>
            <Field label="Testo" value={card.body} rows={3} onChange={(next) => setContent({ ...content, values: { ...content.values, cards: patchCard(content.values.cards, index, { body: next }) } })} />
          </div>
        ))}
      </div>

      <div style={boxStyle}>
        <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Alta qualità e attenzione sulle formule</strong>
        <Field label="Eyebrow" value={content.difference.eyebrow} onChange={(next) => setContent({ ...content, difference: { ...content.difference, eyebrow: next } })} />
        <Field label="Titolo" value={content.difference.title} rows={3} onChange={(next) => setContent({ ...content, difference: { ...content.difference, title: next } })} />
        <Field label="Testo" value={content.difference.body} rows={4} onChange={(next) => setContent({ ...content, difference: { ...content.difference, body: next } })} />
        {content.difference.steps.map((step, index) => (
          <div key={step.id} style={boxStyle}>
            <strong style={{ fontSize: '0.9rem', color: '#111827' }}>Step {index + 1}</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '120px minmax(0,1fr)', gap: '1rem' }}>
              <Field label="Numero" value={step.n} onChange={(next) => setContent({ ...content, difference: { ...content.difference, steps: patchStep(content.difference.steps, index, { n: next }) } })} />
              <Field label="Titolo" value={step.title} onChange={(next) => setContent({ ...content, difference: { ...content.difference, steps: patchStep(content.difference.steps, index, { title: next }) } })} />
            </div>
            <Field label="Testo" value={step.body} rows={3} onChange={(next) => setContent({ ...content, difference: { ...content.difference, steps: patchStep(content.difference.steps, index, { body: next }) } })} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '1rem' }}>
        <div style={boxStyle}>
          <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Per chi riconosce il valore della qualità</strong>
          <Field label="Eyebrow" value={content.positioning.audience.eyebrow} onChange={(next) => setContent({ ...content, positioning: { ...content.positioning, audience: { ...content.positioning.audience, eyebrow: next } } })} />
          <Field label="Titolo" value={content.positioning.audience.title} rows={3} onChange={(next) => setContent({ ...content, positioning: { ...content.positioning, audience: { ...content.positioning.audience, title: next } } })} />
          <ListEditor title="Paragrafo" values={content.positioning.audience.paragraphs} onChange={(next) => setContent({ ...content, positioning: { ...content.positioning, audience: { ...content.positioning.audience, paragraphs: next } } })} />
          <ListEditor title="Punto elenco" values={content.positioning.audience.items} onChange={(next) => setContent({ ...content, positioning: { ...content.positioning, audience: { ...content.positioning.audience, items: next } } })} />
        </div>

        <div style={boxStyle}>
          <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Made in Italy</strong>
          <Field label="Eyebrow" value={content.positioning.madeInItaly.eyebrow} onChange={(next) => setContent({ ...content, positioning: { ...content.positioning, madeInItaly: { ...content.positioning.madeInItaly, eyebrow: next } } })} />
          <Field label="Titolo" value={content.positioning.madeInItaly.title} rows={3} onChange={(next) => setContent({ ...content, positioning: { ...content.positioning, madeInItaly: { ...content.positioning.madeInItaly, title: next } } })} />
          <ListEditor title="Paragrafo" values={content.positioning.madeInItaly.paragraphs} onChange={(next) => setContent({ ...content, positioning: { ...content.positioning, madeInItaly: { ...content.positioning.madeInItaly, paragraphs: next } } })} />
          <ListEditor title="Punto elenco" values={content.positioning.madeInItaly.items} onChange={(next) => setContent({ ...content, positioning: { ...content.positioning, madeInItaly: { ...content.positioning.madeInItaly, items: next } } })} />
        </div>
      </div>

      <div style={boxStyle}>
        <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Linea prodotti</strong>
        <Field label="Eyebrow" value={content.lineup.eyebrow} onChange={(next) => setContent({ ...content, lineup: { ...content.lineup, eyebrow: next } })} />
        <Field label="Titolo" value={content.lineup.title} rows={3} onChange={(next) => setContent({ ...content, lineup: { ...content.lineup, title: next } })} />
        <Field label="Testo" value={content.lineup.body} rows={4} onChange={(next) => setContent({ ...content, lineup: { ...content.lineup, body: next } })} />
        <Field label="Etichetta link scopri" value={content.lineup.discoverLabel} onChange={(next) => setContent({ ...content, lineup: { ...content.lineup, discoverLabel: next } })} />
        {content.lineup.formulas.map((formula, index) => (
          <div key={formula.id} style={boxStyle}>
            <strong style={{ fontSize: '0.9rem', color: '#111827' }}>Formula {index + 1}</strong>
            <Field label="Linea" value={formula.line} onChange={(next) => setContent({ ...content, lineup: { ...content.lineup, formulas: patchFormula(content.lineup.formulas, index, { line: next }) } })} />
            <Field label="Nome" value={formula.name} onChange={(next) => setContent({ ...content, lineup: { ...content.lineup, formulas: patchFormula(content.lineup.formulas, index, { name: next }) } })} />
            <Field label="Testo" value={formula.body} rows={3} onChange={(next) => setContent({ ...content, lineup: { ...content.lineup, formulas: patchFormula(content.lineup.formulas, index, { body: next }) } })} />
            <Field label="Link prodotto opzionale" value={formula.href ?? ''} onChange={(next) => setContent({ ...content, lineup: { ...content.lineup, formulas: patchFormula(content.lineup.formulas, index, { href: next || undefined }) } })} />
          </div>
        ))}
      </div>

      <div style={boxStyle}>
        <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Vision</strong>
        <Field label="Titolo" value={content.vision.title} onChange={(next) => setContent({ ...content, vision: { ...content.vision, title: next } })} />
        <Field label="Primo testo" value={content.vision.p1} rows={3} hint="Puoi usare **testo** per il grassetto." onChange={(next) => setContent({ ...content, vision: { ...content.vision, p1: next } })} />
        <Field label="Secondo testo" value={content.vision.p2} rows={3} onChange={(next) => setContent({ ...content, vision: { ...content.vision, p2: next } })} />
        <Field label="Terzo testo" value={content.vision.p3} rows={3} onChange={(next) => setContent({ ...content, vision: { ...content.vision, p3: next } })} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '1rem' }}>
          <Field label="Bottone primario testo" value={content.vision.ctaPrimaryLabel} onChange={(next) => setContent({ ...content, vision: { ...content.vision, ctaPrimaryLabel: next } })} />
          <Field label="Bottone primario link" value={content.vision.ctaPrimaryHref} onChange={(next) => setContent({ ...content, vision: { ...content.vision, ctaPrimaryHref: next } })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '1rem' }}>
          <Field label="Bottone secondario testo" value={content.vision.ctaSecondaryLabel} onChange={(next) => setContent({ ...content, vision: { ...content.vision, ctaSecondaryLabel: next } })} />
          <Field label="Bottone secondario link" value={content.vision.ctaSecondaryHref} onChange={(next) => setContent({ ...content, vision: { ...content.vision, ctaSecondaryHref: next } })} />
        </div>
      </div>
    </div>
  )
}
