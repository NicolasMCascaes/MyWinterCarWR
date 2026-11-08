import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface ChartCardProps {
  title: string
  subtitle?: string
  className?: string
  children: ReactNode
}

export function ChartCard({ title, subtitle, className, children }: ChartCardProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        'flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-gradient-to-b from-surface to-bg-deep p-5',
        className,
      )}
    >
      <header className="flex flex-col">
        <h2 className="font-display text-xl">{title}</h2>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </header>
      {children}
    </section>
  )
}

interface TooltipRow {
  label: string
  value: string
  color?: string
}

export function ChartTooltipBox({ title, rows }: { title: string; rows: TooltipRow[] }) {
  return (
    <div className="min-w-36 rounded-xl border border-border bg-surface px-3 py-2 text-sm shadow-2xl">
      <p className="mb-1 text-muted">{title}</p>
      {rows.map((row) => (
        <p key={row.label} className="flex items-center gap-2">
          {row.color && (
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: row.color }} aria-hidden />
          )}
          <span className="flex-1">{row.label}</span>
          <span className="font-display tabular-nums">{row.value}</span>
        </p>
      ))}
    </div>
  )
}
