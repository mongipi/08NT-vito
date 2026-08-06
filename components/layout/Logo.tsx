'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

interface LogoProps {
  variant?: 'dark' | 'light'
  height?: number
  className?: string
}

export function Logo({ variant = 'dark', height = 82, className }: LogoProps) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  return (
    <Link
      href="/"
      aria-label={t('logo_aria_home')}
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
