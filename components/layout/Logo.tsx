import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'dark' | 'light'
  height?: number
  className?: string
}

export function Logo({ variant = 'dark', height = 82, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="08 Natural Technology - torna alla home"
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src="/v61/img/logo-08.png"
        alt="08 Natural Technology"
        width={height * 2.2}
        height={height}
        style={{
          height,
          width: 'auto',
          objectFit: 'contain',
          filter: variant === 'light' ? 'brightness(0) invert(1) opacity(0.72)' : undefined,
        }}
        priority
      />
    </Link>
  )
}
