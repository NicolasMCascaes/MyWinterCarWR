import { RotateCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button, EmptyState, Skeleton } from '../../components/ui'

interface ModerationPageProps {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export function ModerationPage({ title, subtitle, actions, children }: ModerationPageProps) {
  return (
    <main className="flex flex-col gap-6 px-4 pt-2 pb-10 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-4xl">{title}</h1>
          {subtitle && <p className="text-muted">{subtitle}</p>}
        </div>
        {actions}
      </header>
      {children}
    </main>
  )
}

export function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border p-5" aria-label="Loading">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  )
}

export function LoadError({ onRetry, retrying }: { onRetry: () => void; retrying: boolean }) {
  return (
    <EmptyState
      title="Could not load the runs"
      description="Check your connection and try again."
      action={
        <Button
          variant="dark"
          loading={retrying}
          leftIcon={<RotateCw className="size-4" aria-hidden />}
          onClick={onRetry}
        >
          Try again
        </Button>
      }
    />
  )
}
