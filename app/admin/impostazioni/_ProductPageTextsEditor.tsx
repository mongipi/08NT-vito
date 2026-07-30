'use client'

import { useMemo, useState } from 'react'
import type { ProductPageTexts } from '@/lib/site-settings'

type Props = {
  name: string
  initialValue: string
  defaults: ProductPageTexts
}

function normalizeValue(raw: string, defaults: ProductPageTexts): ProductPageTexts {
  if (!raw.trim()) return defaults

  try {
    const parsed = JSON.parse(raw)
    const pick = (key: keyof ProductPageTexts) =>
      typeof parsed?.[key] === 'string' && parsed[key].trim() ? parsed[key].trim() : defaults[key]

    return {
      breadcrumbBrandLabel: pick('breadcrumbBrandLabel'),
      allProductsLabel: pick('allProductsLabel'),
      madeInItalyLabel: pick('madeInItalyLabel'),
      defaultKickerTemplate: pick('defaultKickerTemplate'),
      galleryFrontLabel: pick('galleryFrontLabel'),
      galleryInfographicLabel: pick('galleryInfographicLabel'),
      galleryCompositionLabel: pick('galleryCompositionLabel'),
      galleryBackLabel: pick('galleryBackLabel'),
      galleryLabelLabel: pick('galleryLabelLabel'),
      sectionUsageTitle: pick('sectionUsageTitle'),
      sectionTargetTitle: pick('sectionTargetTitle'),
      sectionFormatTitle: pick('sectionFormatTitle'),
      sectionIngredientsTitle: pick('sectionIngredientsTitle'),
      fallbackUsageBody: pick('fallbackUsageBody'),
      fallbackTargetBody: pick('fallbackTargetBody'),
      fallbackIngredientsBody: pick('fallbackIngredientsBody'),
      capsuleSuffix: pick('capsuleSuffix'),
      daysSuffix: pick('daysSuffix'),
    }
  } catch {
    return defaults
  }
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #d1d5db',
  padding: '0.625rem 0.875rem',
  fontSize: '0.875rem',
  color: '#111827',
  outline: 'none',
  borderRadius: '0.375rem',
  fontFamily: 'inherit',
  background: 'white',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#6b7280',
}

export function ProductPageTextsEditor({ name, initialValue, defaults }: Props) {
  const [value, setValue] = useState<ProductPageTexts>(() => normalizeValue(initialValue, defaults))
  const serialized = useMemo(() => JSON.stringify(value), [value])

  const update = (key: keyof ProductPageTexts, next: string) =>
    setValue((current) => ({ ...current, [key]: next }))

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <input type="hidden" name={name} value={serialized} />
      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6 }}>
        Gestisci i testi comuni usati nelle pagine prodotto. Nel template kicker puoi usare
        <strong> {'{line}'}</strong> per inserire automaticamente il nome linea.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
        <Field label="Breadcrumb brand" value={value.breadcrumbBrandLabel} onChange={(next) => update('breadcrumbBrandLabel', next)} />
        <Field label="Link tutti i prodotti" value={value.allProductsLabel} onChange={(next) => update('allProductsLabel', next)} />
        <Field label="Made in Italy" value={value.madeInItalyLabel} onChange={(next) => update('madeInItalyLabel', next)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '1rem' }}>
        <Field label="Template kicker default" value={value.defaultKickerTemplate} onChange={(next) => update('defaultKickerTemplate', next)} />
        <Field label="Suffisso capsule" value={value.capsuleSuffix} onChange={(next) => update('capsuleSuffix', next)} />
        <Field label="Suffisso giorni" value={value.daysSuffix} onChange={(next) => update('daysSuffix', next)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '1rem' }}>
        <Field label="Label fronte" value={value.galleryFrontLabel} onChange={(next) => update('galleryFrontLabel', next)} />
        <Field label="Label infografica" value={value.galleryInfographicLabel} onChange={(next) => update('galleryInfographicLabel', next)} />
        <Field label="Label composizione" value={value.galleryCompositionLabel} onChange={(next) => update('galleryCompositionLabel', next)} />
        <Field label="Label retro" value={value.galleryBackLabel} onChange={(next) => update('galleryBackLabel', next)} />
        <Field label="Label etichetta" value={value.galleryLabelLabel} onChange={(next) => update('galleryLabelLabel', next)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        <Field label="Titolo modo d'uso" value={value.sectionUsageTitle} onChange={(next) => update('sectionUsageTitle', next)} />
        <Field label="Titolo destinatario" value={value.sectionTargetTitle} onChange={(next) => update('sectionTargetTitle', next)} />
        <Field label="Titolo formato" value={value.sectionFormatTitle} onChange={(next) => update('sectionFormatTitle', next)} />
        <Field label="Titolo ingredienti" value={value.sectionIngredientsTitle} onChange={(next) => update('sectionIngredientsTitle', next)} />
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <Area label="Fallback modo d'uso" value={value.fallbackUsageBody} onChange={(next) => update('fallbackUsageBody', next)} />
        <Area label="Fallback destinatario" value={value.fallbackTargetBody} onChange={(next) => update('fallbackTargetBody', next)} />
        <Area label="Fallback ingredienti" value={value.fallbackIngredientsBody} onChange={(next) => update('fallbackIngredientsBody', next)} />
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label style={{ display: 'grid', gap: '0.375rem' }}>
      <span style={labelStyle}>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} style={fieldStyle} />
    </label>
  )
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label style={{ display: 'grid', gap: '0.375rem' }}>
      <span style={labelStyle}>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        style={{ ...fieldStyle, resize: 'vertical' }}
      />
    </label>
  )
}
