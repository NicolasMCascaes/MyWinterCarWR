import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

interface WizardProgressProps {
  steps: readonly string[]
  current: number
}

export function WizardProgress({ steps, current }: WizardProgressProps) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {steps.map((label, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={label} aria-current={active ? 'step' : undefined} className="flex flex-1 flex-col gap-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
              <div
                className={cn(
                  'h-full rounded-full bg-accent transition-[width] duration-500 ease-out',
                  done || active ? 'w-full' : 'w-0',
                )}
              />
            </div>
            <span
              className={cn(
                'flex items-center gap-1 text-sm transition-colors',
                active ? 'text-white' : done ? 'text-accent' : 'text-muted',
              )}
            >
              {done && <Check className="size-3.5" aria-hidden />}
              <span className={cn(!active && 'hidden sm:inline')}>{label}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
