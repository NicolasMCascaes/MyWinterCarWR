import { Link, useNavigate } from 'react-router-dom'
import { Flag } from '../../components/ui'
import { cn } from '../../lib/cn'
import { formatDate, formatRunTime, timeAgo } from '../../lib/time'
import { categoryInfo, isCategory } from '../categories/categories'
import { StatusBadge } from './StatusBadge'
import type { AttemptDetails } from './types'

export type AttemptColumn = 'submitted' | 'country' | 'reviewedBy' | 'reviewedAt'

interface AttemptTableProps {
  attempts: AttemptDetails[]
  columns: AttemptColumn[]
  currentUserId?: string
  caption: string
}

const HEADERS: Record<AttemptColumn, string> = {
  submitted: 'Issued at',
  country: 'Country',
  reviewedBy: 'Reviewed by',
  reviewedAt: 'Reviewed at',
}

function CategoryLabel({ category }: { category: string }) {
  if (!isCategory(category)) {
    return <span className="text-muted">{category}</span>
  }
  const info = categoryInfo(category)
  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: info.colorVar }} aria-hidden />
      {info.label}
    </span>
  )
}

function DateCell({ value }: { value: string | null }) {
  if (!value) {
    return <span className="text-muted">-</span>
  }
  return (
    <span className="flex flex-col leading-tight">
      <span>{formatDate(value)}</span>
      <span className="text-xs text-muted">{timeAgo(value)}</span>
    </span>
  )
}

function renderColumn(column: AttemptColumn, attempt: AttemptDetails) {
  switch (column) {
    case 'submitted':
      return <DateCell value={attempt.submittedAt} />
    case 'reviewedAt':
      return <DateCell value={attempt.reviewedAt} />
    case 'reviewedBy':
      return attempt.reviewedBy ?? <span className="text-muted">-</span>
    case 'country':
      return attempt.country ? (
        <Flag code={attempt.country} className="text-2xl" />
      ) : (
        <span className="text-muted">-</span>
      )
  }
}

const HIDDEN_ON_MOBILE: AttemptColumn[] = ['country', 'reviewedBy']

export function AttemptTable({ attempts, columns, currentUserId, caption }: AttemptTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-bg-deep/60 p-3 sm:p-5">
      <table className="w-full border-separate border-spacing-y-2 text-center">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="font-display text-muted">
            <th scope="col" className="px-3 text-left font-normal">
              Username
            </th>
            <th scope="col" className="px-2 font-normal">
              Category
            </th>
            <th scope="col" className="px-2 font-normal">
              Time
            </th>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className={cn(
                  'px-2 font-normal',
                  HIDDEN_ON_MOBILE.includes(column) && 'hidden md:table-cell',
                )}
              >
                {HEADERS[column]}
              </th>
            ))}
            <th scope="col" className="px-2 font-normal">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt, index) => {
            const own = attempt.userId === currentUserId
            const detailPath = `/moderation/attempts/${attempt.idAttempt}`
            return (
              <tr
                key={attempt.idAttempt}
                onClick={() => navigate(detailPath)}
                style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
                className="animate-rise cursor-pointer bg-surface-2 transition-colors hover:bg-surface-3"
              >
                <td className="rounded-l-xl px-3 py-3 text-left font-display">
                  <Link
                    to={detailPath}
                    onClick={(event) => event.stopPropagation()}
                    className="hover:underline focus-visible:underline"
                  >
                    {attempt.username}
                  </Link>
                  {own && (
                    <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-xs whitespace-nowrap text-accent">
                      Your run
                    </span>
                  )}
                </td>
                <td className="px-2 whitespace-nowrap">
                  <CategoryLabel category={attempt.attemptCategory} />
                </td>
                <td className="px-2 font-display tabular-nums">{formatRunTime(attempt.attemptTime)}</td>
                {columns.map((column) => (
                  <td
                    key={column}
                    className={cn(
                      'px-2 text-sm',
                      HIDDEN_ON_MOBILE.includes(column) && 'hidden md:table-cell',
                    )}
                  >
                    {renderColumn(column, attempt)}
                  </td>
                ))}
                <td className="rounded-r-xl px-2">
                  <StatusBadge status={attempt.attemptStatus} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
