import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'accent' | 'dark' | 'light' | 'success' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover hover:shadow-[0_0_24px_-4px_var(--color-primary)]',
  accent: 'bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_24px_-4px_var(--color-accent)]',
  dark: 'bg-surface-3 text-white hover:bg-surface-2 hover:shadow-[0_0_24px_-6px_var(--color-accent)]',
  light: 'bg-chip text-bg hover:bg-white',
  success: 'bg-success text-bg hover:brightness-110',
  danger: 'bg-danger text-white hover:brightness-110',
  ghost: 'bg-transparent text-white hover:bg-white/10',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-base gap-2',
  lg: 'h-14 px-8 text-2xl gap-3',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-display font-semibold transition-all duration-200',
        'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="size-[1em] animate-spin" aria-hidden /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
}
