import { History } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Chip, EmptyState } from '../../components/ui'
import { useAuth } from '../auth/useAuth'
import { useReviewHistory } from './api'
import { AttemptTable } from './AttemptTable'
import { LoadError, ModerationPage, TableSkeleton } from './ModerationPage'
import type { ReviewedStatus } from './types'

const FILTERS: Array<{ value: ReviewedStatus | null; label: string }> = [
  { value: null, label: 'All' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
]

function parseStatus(value: string | null): ReviewedStatus | null {
  return value === 'APPROVED' || value === 'REJECTED' ? value : null
}

export function HistoryPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const status = parseStatus(searchParams.get('status'))
  const { data, isPending, isError, isFetching, refetch } = useReviewHistory(status)

  const filters = (
    <div role="group" aria-label="Filter by status" className="flex gap-2">
      {FILTERS.map((filter) => (
        <Chip
          key={filter.label}
          selected={filter.value === status}
          onClick={() => setSearchParams(filter.value ? { status: filter.value } : {}, { replace: true })}
          className="h-9 px-4 text-base"
        >
          {filter.label}
        </Chip>
      ))}
    </div>
  )

  return (
    <ModerationPage title="Review History" subtitle="Reviewed runs, most recent first" actions={filters}>
      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <LoadError onRetry={() => refetch()} retrying={isFetching} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<History className="size-10 text-muted" aria-hidden />}
          title="No reviewed runs"
          description="Runs appear here after a moderator approves or rejects them."
        />
      ) : (
        <AttemptTable
          attempts={data}
          columns={['reviewedBy', 'reviewedAt']}
          currentUserId={user?.id}
          caption="Reviewed runs"
        />
      )}
    </ModerationPage>
  )
}
