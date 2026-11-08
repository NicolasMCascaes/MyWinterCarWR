import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export function PageContainer({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={cn('mx-auto w-full max-w-7xl px-4 py-8 outline-none sm:px-6', className)}
      {...props}
    />
  )
}
