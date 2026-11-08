import { cn } from '../../lib/cn'
import { countryName } from '../../lib/countries'

interface FlagProps {
  code: string | null | undefined
  className?: string
}

export function Flag({ code, className }: FlagProps) {
  if (!code) {
    return (
      <span aria-label="Unknown country" className={cn('text-muted', className)}>
        -
      </span>
    )
  }
  const name = countryName(code)
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className={cn('fi rounded-[3px] shadow-sm', `fi-${code.toLowerCase()}`, className)}
    />
  )
}
