import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  dotColor?: string
}

export function Chip({
  selected = false,
  dotColor,
  className,
  children,
  type = 'button',
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-xl px-5 font-display text-lg font-semibold transition-all duration-200',
        'active:scale-[0.97]',
        selected
          ? 'bg-accent text-white shadow-[0_0_20px_-4px_var(--color-accent)]'
          : 'bg-chip text-bg hover:-translate-y-0.5 hover:bg-white',
        className,
      )}
      {...props}
    >
      {dotColor && (
        <span className="size-2.5 rounded-full" style={{ backgroundColor: dotColor }} aria-hidden />
      )}
      {children}
    </button>
  )
}
