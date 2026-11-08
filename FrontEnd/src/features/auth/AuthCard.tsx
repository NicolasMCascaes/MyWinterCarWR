import type { FormEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthCardProps {
  title: string
  description: string
  switchLabel: string
  switchTo: string
  onSubmit: FormEventHandler<HTMLFormElement>
  footer: ReactNode
  children: ReactNode
}

export function AuthCard({
  title,
  description,
  switchLabel,
  switchTo,
  onSubmit,
  footer,
  children,
}: AuthCardProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md animate-rise overflow-hidden rounded-[2rem] bg-gradient-to-b from-auth-from to-auth-to shadow-[0_24px_80px_-24px_var(--color-auth-to)]"
      >
        <div className="flex flex-col gap-6 px-6 pt-8 pb-6 sm:px-10">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl">{title}</h1>
            <Link
              to={switchTo}
              className="max-w-40 text-right font-display text-xl text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {switchLabel}
            </Link>
          </div>
          <p className="text-lg leading-snug text-white/90">{description}</p>
          <div className="flex flex-col gap-5">{children}</div>
        </div>
        <div className="flex flex-col items-center gap-3 border-t border-white/30 px-6 py-6 sm:px-10">
          {footer}
        </div>
      </form>
    </div>
  )
}
