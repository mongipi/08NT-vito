import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow: ReactNode
  script?: string
  title: ReactNode
  body?: string
}

export function PageHeader({ eyebrow, script, title, body }: PageHeaderProps) {
  return (
    <section className="page-hero products-hero">
      <div className="v61-inner">
        <div className="v61-eyebrow light">{eyebrow}</div>
        {script && <span className="v61-script" style={{ color: 'rgba(184,144,60,.62)', marginBottom: 6 }}>{script}</span>}
        <div className="v61-title" style={{ color: 'var(--silver-3)', fontSize: 'clamp(2.4rem,5vw,4.1rem)' }}>{title}</div>
        {body && <p>{body}</p>}
      </div>
    </section>
  )
}
