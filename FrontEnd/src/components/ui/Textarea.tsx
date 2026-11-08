import { useId, type Ref, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Field } from './Field'
import { describedBy, fieldControlClass } from './fieldStyles'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  ref?: Ref<HTMLTextAreaElement>
}

export function Textarea({ label, error, hint, className, id, ref, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <Field id={textareaId} label={label} error={error} hint={hint}>
      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(textareaId, error, hint)}
        className={cn(
          fieldControlClass,
          'h-auto min-h-36 resize-y py-3',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        {...props}
      />
    </Field>
  )
}
