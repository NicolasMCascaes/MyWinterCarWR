import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'

const SIZES = { sm: 'size-8 text-sm', md: 'size-12 text-lg', lg: 'size-16 text-2xl' }

interface AvatarProps {
  name: string
  size?: keyof typeof SIZES
  ringColor?: string
  className?: string
}

export function Avatar({ name, size = 'md', ringColor, className }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-white font-display font-bold text-bg ring-4',
        SIZES[size],
        className,
      )}
      style={{ '--tw-ring-color': ringColor ?? 'transparent' } as CSSProperties}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}
