import type { ReactNode } from 'react'

export interface LegalSection {
  title: string
  paragraphs?: ReactNode[]
  items?: ReactNode[]
  subsections?: {
    title: string
    paragraphs: ReactNode[]
  }[]
}

interface LegalDocumentProps {
  eyebrow: string
  title: string
  subtitle: string
  updated: string
  sections: LegalSection[]
}

export function LegalDocument({ eyebrow, title, subtitle, updated, sections }: LegalDocumentProps) {
  return (
    <main className="v61-legal-page">
      <section className="v61-legal-hero">
        <div className="v61-inner">
          <div className="v61-eyebrow light">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <span>Ultimo aggiornamento: {updated}</span>
        </div>
      </section>

      <section className="section v61-legal-section">
        <div className="v61-legal-layout">
          <aside className="v61-legal-index" aria-label="Indice pagina">
            <p>Indice</p>
            <ol>
              {sections.map((section) => (
                <li key={section.title}>
                  <a href={`#${slugify(section.title)}`}>{section.title.replace(/^\d+\.\s*/, '')}</a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="v61-legal-content">
            {sections.map((section) => (
              <article key={section.title} id={slugify(section.title)}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                {section.items && (
                  <ul>
                    {section.items.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                )}
                {section.subsections?.map((subsection) => (
                  <div key={subsection.title} className="v61-legal-subsection">
                    <h3>{subsection.title}</h3>
                    {subsection.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </div>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
