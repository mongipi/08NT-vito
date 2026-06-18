import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LogoProps {
  /** Colore testo + bordo. Default: var(--green) */
  color?: string
  /** Font size del "08". Default: 22px */
  size?: number
  className?: string
}

/** Logo 08 Natural Technology — Server Component. */
export function Logo({ color = 'var(--green)', size = 22, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="08 Natural Technology — torna alla home"
      className={cn('inline-flex flex-col items-center justify-center gap-[1px]', className)}
      style={{
        border: '1.5px solid currentColor',
        color,
        padding: '4px 10px 5px',
        cursor: 'pointer',
      }}
    >
      <span
        className="leading-none tracking-[-0.01em]"
        style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: size,
          fontWeight: 400,
          color: 'currentColor',
        }}
        aria-hidden="true"
      >
        08
      </span>
      <span
        className="uppercase whitespace-nowrap leading-none"
        style={{
          fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
          fontSize: 6,
          fontWeight: 300,
          letterSpacing: '0.26em',
          color: 'currentColor',
        }}
        aria-hidden="true"
      >
        Natural Technology
      </span>
    </Link>
  )
}
