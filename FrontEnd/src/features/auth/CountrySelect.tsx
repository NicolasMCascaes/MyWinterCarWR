import { Check, ChevronDown, Search } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Flag } from '../../components/ui'
import { Field } from '../../components/ui/Field'
import { describedBy, fieldControlClass } from '../../components/ui/fieldStyles'
import { cn } from '../../lib/cn'
import { COUNTRIES, countryName } from '../../lib/countries'

interface CountrySelectProps {
  value: string
  onChange: (code: string) => void
  onBlur?: () => void
  error?: string
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function CountrySelect({ value, onChange, onBlur, error }: CountrySelectProps) {
  const id = useId()
  const listId = `${id}-list`
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const options = useMemo(() => {
    const term = normalize(query.trim())
    if (!term) {
      return COUNTRIES
    }
    return COUNTRIES.filter(
      (country) => normalize(country.name).includes(term) || country.code.toLowerCase() === term,
    )
  }, [query])

  useEffect(() => {
    if (!open) {
      return
    }
    searchRef.current?.focus()
    const handleOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
        onBlur?.()
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open, onBlur])

  useEffect(() => {
    listRef.current?.children[activeIndex]?.scrollIntoView?.({ block: 'nearest' })
  }, [activeIndex])

  const openList = () => {
    const selectedIndex = COUNTRIES.findIndex((country) => country.code === value)
    setQuery('')
    setActiveIndex(Math.max(selectedIndex, 0))
    setOpen(true)
  }

  const choose = (code: string) => {
    onChange(code)
    setOpen(false)
    onBlur?.()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, options.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const option = options[activeIndex]
      if (option) {
        choose(option.code)
      }
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <Field id={id} label="Country" error={error}>
      <div ref={containerRef} className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error)}
          onClick={() => (open ? setOpen(false) : openList())}
          className={cn(
            fieldControlClass,
            'flex items-center gap-3 text-left',
            error ? 'border-danger' : 'border-border',
          )}
        >
          {value ? (
            <>
              <Flag code={value} className="text-lg" />
              <span className="flex-1 truncate">{countryName(value)}</span>
            </>
          ) : (
            <span className="flex-1 text-muted/60">Select your country</span>
          )}
          <ChevronDown
            className={cn('size-5 text-muted transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </button>

        {open && (
          <div className="absolute z-30 mt-2 w-full animate-fade-in overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search className="size-4 text-muted" aria-hidden />
              <input
                ref={searchRef}
                role="combobox"
                aria-label="Search country"
                aria-controls={listId}
                aria-expanded="true"
                aria-activedescendant={
                  options[activeIndex] ? `${id}-${options[activeIndex].code}` : undefined
                }
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="h-11 flex-1 bg-transparent text-white placeholder:text-muted/60 focus:outline-none"
              />
            </div>
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label="Countries"
              className="max-h-60 overflow-y-auto py-1"
            >
              {options.length === 0 && <li className="px-4 py-3 text-muted">No country found</li>}
              {options.map((country, index) => (
                <li
                  key={country.code}
                  id={`${id}-${country.code}`}
                  role="option"
                  aria-selected={country.code === value}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(country.code)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-4 py-2 transition-colors',
                    index === activeIndex && 'bg-surface-3',
                  )}
                >
                  <Flag code={country.code} />
                  <span className="flex-1 truncate">{country.name}</span>
                  {country.code === value && <Check className="size-4 text-accent" aria-hidden />}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Field>
  )
}
