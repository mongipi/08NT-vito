import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** 'dark' = logo su sfondo chiaro (navbar). 'light' = su sfondo scuro (footer, hero). */
  variant?: 'dark' | 'light'
  height?: number
  className?: string
}

export function Logo({ variant = 'dark', height = 40, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="08 Natural Technology — torna alla home"
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src="/logo.png"
        alt="08 Natural Technology"
        width={height * 2.5}
        height={height}
        style={{
          height,
          width: 'auto',
          objectFit: 'contain',
          filter: variant === 'light'
            ? 'brightness(0) invert(1) opacity(0.72)'
            : undefined,
        }}
        priority
      />
    </Link>
  )
}
