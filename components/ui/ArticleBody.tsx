'use client'

import { useLocale, pickLocalized } from '@/contexts/LocaleContext'

interface Props {
  body: string
  bodyEn?: string | null
}

/** Divide il corpo dell'articolo in blocchi (titoli/paragrafi), nella lingua selezionata. */
export function ArticleBody({ body, bodyEn }: Props) {
  const { locale } = useLocale()
  const text = pickLocalized(locale, body, bodyEn)
  const blocks = text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean)

  return (
    <>
      {blocks.map((block, index) => {
        if (block.startsWith('### ')) {
          return (
            <h3
              key={index}
              style={{ fontSize: 15, fontWeight: 700, color: 'var(--green)', lineHeight: 1.5, margin: '22px 0 8px' }}
            >
              {block.replace(/^###\s+/, '')}
            </h3>
          )
        }

        if (block.startsWith('## ')) {
          return (
            <h2
              key={index}
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, margin: '30px 0 12px',
              }}
            >
              {block.replace(/^##\s+/, '')}
            </h2>
          )
        }

        return (
          <p key={index} style={{ fontSize: 13, fontWeight: 300, color: 'var(--ink-2)', lineHeight: 2, marginBottom: 18 }}>
            {block}
          </p>
        )
      })}
    </>
  )
}
