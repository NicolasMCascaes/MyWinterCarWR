import { cn } from '../../lib/cn'
import type { AttemptStatus } from './types'

const STYLES: Record<AttemptStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-gold text-bg' },
  APPROVED: { label: 'Approved', className: 'bg-success text-bg' },
  REJECTED: { label: 'Rejected', className: 'bg-danger text-white' },
}

export function StatusBadge({ status }: { status: AttemptStatus }) {
  const style = STYLES[status]
  return (
    <span
      className={cn(
        'inline-block rounded-md px-2 py-0.5 font-display text-xs sm:px-2.5 sm:text-sm',
        style.className,
      )}
    >
      {style.label}
    </span>
  )
}
