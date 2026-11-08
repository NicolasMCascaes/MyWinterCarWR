import { PartyPopper } from 'lucide-react'
import { EmptyState } from '../../components/ui'
import { useAuth } from '../auth/useAuth'
import { usePendingAttempts } from './api'
import { AttemptTable } from './AttemptTable'
import { LoadError, ModerationPage, TableSkeleton } from './ModerationPage'

export function QueuePage() {
  const { user } = useAuth()
  const { data, isPending, isError, isFetching, refetch } = usePendingAttempts()

  const subtitle = data?.length
    ? `${data.length} ${data.length === 1 ? 'run' : 'runs'} pending verification, oldest first`
    : 'Pending verification'

  return (
    <ModerationPage title="Verification Queue" subtitle={subtitle}>
      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <LoadError onRetry={() => refetch()} retrying={isFetching} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<PartyPopper className="size-10 text-gold" aria-hidden />}
          title="All caught up"
          description="There are no runs waiting for verification."
        />
      ) : (
        <AttemptTable
          attempts={data}
          columns={['submitted', 'country']}
          currentUserId={user?.id}
          caption="Runs pending verification"
        />
      )}
    </ModerationPage>
  )
}
