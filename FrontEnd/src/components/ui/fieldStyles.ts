export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) {
    return `${id}-error`
  }
  return hint ? `${id}-hint` : undefined
}

export const fieldControlClass =
  'h-12 w-full rounded-xl border bg-surface-2 px-4 text-white transition-[border-color,box-shadow] placeholder:text-muted/60 focus:border-accent focus:shadow-[0_0_20px_-6px_var(--color-accent)] focus:outline-none'
