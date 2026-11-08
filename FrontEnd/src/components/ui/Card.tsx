import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

const TONES = {
  surface: 'border-border bg-surface text-text',
  light: 'border-transparent bg-chip text-bg',
  accent: 'border-transparent bg-accent text-white',
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: keyof typeof TONES
  padded?: boolean
  interactive?: boolean
}

export function Card({
  tone = 'surface',
  padded = true,
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border',
        TONES[tone],
        padded && 'p-6',
        interactive &&
          'transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_var(--color-accent)]',
        className,
      )}
      {...props}
    />
  )
}
