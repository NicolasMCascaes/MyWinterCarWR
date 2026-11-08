import { Eye, EyeOff } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { Input } from './Input'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'trailing'>

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="rounded-lg p-2 text-muted transition-colors hover:text-white"
        >
          <Icon className="size-5" aria-hidden />
        </button>
      }
    />
  )
}
