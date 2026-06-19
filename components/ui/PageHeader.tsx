interface PageHeaderProps {
  eyebrow: string
  script: string
  title: React.ReactNode
}

/** Dark forest page header — used on prodotti, brand, blog, contatti. */
export function PageHeader({ eyebrow, script, title }: PageHeaderProps) {
  return (
    <div
      className="section"
      style={{
        background: 'var(--forest)',
        borderBottom: '1px solid var(--amber)',
        paddingBottom: '3.25rem',
      }}
    >
      <div
        className="flex items-center gap-2.5"
        style={{
          fontSize: '0.5625rem',
          fontWeight: 300,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(253,246,232,0.45)',
          marginBottom: '1.125rem',
        }}
      >
        <span
          style={{
            display: 'block',
            width: 24,
            height: '0.5px',
            background: 'var(--amber)',
            opacity: 0.6,
            flexShrink: 0,
          }}
        />
        {eyebrow}
      </div>

      <span
        style={{
          fontFamily: 'var(--font-great-vibes), cursive',
          fontSize: '1.625rem',
          color: 'rgba(184,144,60,0.5)',
          display: 'block',
          marginBottom: 4,
        }}
      >
        {script}
      </span>

      <div
        style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: 'clamp(30px, 5vw, 44px)',
          fontWeight: 300,
          color: 'var(--silver-3)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </div>
    </div>
  )
}
