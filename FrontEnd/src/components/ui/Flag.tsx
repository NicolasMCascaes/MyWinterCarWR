import { cn } from '../../lib/cn'
import { countryName } from '../../lib/countries'

const FLAG_URLS = import.meta.glob<string>('/node_modules/flag-icons/flags/4x3/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
})

function flagUrl(code: string): string | undefined {
  return FLAG_URLS[`/node_modules/flag-icons/flags/4x3/${code.toLowerCase()}.svg`]
}

interface FlagProps {
  code: string | null | undefined
  className?: string
}

export function Flag({ code, className }: FlagProps) {
  if (!code) {
    return null
  }
  const name = countryName(code)
  const src = flagUrl(code)
  if (!src) {
    return (
      <span title={name} className={cn('font-display text-xs text-muted', className)}>
        {code.toUpperCase()}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={name}
      title={name}
      loading="lazy"
      decoding="async"
      className={cn(
        'inline-block h-[1em] w-[1.333em] rounded-[3px] object-cover align-[-0.125em] shadow-sm',
        className,
      )}
    />
  )
}
