import { ChevronRight, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Flag, Skeleton } from '../../components/ui'
import { formatRunTime } from '../../lib/time'
import { leaderboardPath } from '../categories/categories'
import { useWorldRecords } from './api'

export function WorldRecordsStrip() {
  const records = useWorldRecords()

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {records.map(({ category, record, isPending }) => (
        <li key={category.id}>
          <Link
            to={leaderboardPath(category)}
            className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_12px_32px_-12px_var(--color-accent)]"
            style={{ borderTopColor: category.colorVar, borderTopWidth: 4 }}
          >
            <span className="flex items-center justify-between font-display text-xl">
              {category.label}
              <ChevronRight
                className="size-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-white"
                aria-hidden
              />
            </span>
            {isPending ? (
              <Skeleton className="h-12" />
            ) : record ? (
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-2 font-display text-3xl tabular-nums">
                  <Trophy className="size-6 text-gold" aria-hidden />
                  {formatRunTime(record.attemptTime)}
                </span>
                <span className="flex items-center gap-2 text-muted">
                  <Flag code={record.country} />
                  {record.username}
                </span>
              </span>
            ) : (
              <span className="text-muted">No record yet. Be the first!</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
