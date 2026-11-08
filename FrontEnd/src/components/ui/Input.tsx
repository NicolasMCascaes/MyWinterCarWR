import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { Field } from './Field'
import { describedBy, fieldControlClass } from './fieldStyles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  icon?: ReactNode
  trailing?: ReactNode
  ref?: Ref<HTMLInputElement>
}

export function Input({ label, error, hint, icon, trailing, className, id, ref, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <Field id={inputId} label={label} error={error} hint={hint}>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(
            fieldControlClass,
            Boolean(icon) && 'pl-10',
            Boolean(trailing) && 'pr-12',
            error ? 'border-danger' : 'border-border',
            className,
          )}
          {...props}
        />
        {trailing && <span className="absolute inset-y-0 right-2 flex items-center">{trailing}</span>}
      </div>
    </Field>
  )
}
