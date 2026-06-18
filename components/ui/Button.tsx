import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md'
  asChild?: false
}

const base =
  'inline-flex items-center justify-center gap-2 cursor-pointer font-sans text-[9px] font-medium tracking-[0.18em] uppercase transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-[var(--green)] text-white hover:bg-[var(--green-2)] px-6 py-3',
  outline: 'border border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)] hover:text-white px-6 py-3',
  ghost:   'text-[var(--ink-3)] hover:text-[var(--green)] bg-transparent px-3 py-2',
}

const sizes = {
  sm: 'px-4 py-2 text-[8px]',
  md: '',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], size === 'sm' && sizes.sm, className)} {...props}>
      {children}
    </button>
  )
}
