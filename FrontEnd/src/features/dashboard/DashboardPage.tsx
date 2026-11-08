import { CircleCheck, ClockAlert, type LucideIcon, Percent, Upload } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Skeleton } from '../../components/ui'
import { cn } from '../../lib/cn'
import { useModerationStats } from '../moderation/api'
import { LoadError, ModerationPage } from '../moderation/ModerationPage'
import { CategoryBreakdown } from './CategoryBreakdown'
import { formatPercent, parsePeriod, PERIODS, summarize, toDayPoints } from './dashboardData'
import { ReviewOutcomesChart } from './ReviewOutcomesChart'
import { SubmissionsChart } from './SubmissionsChart'

interface StatTileProps {
  label: string
  value: string
  hint: string
  icon: LucideIcon
  to?: string
}

function StatTile({ label, value, hint, icon: Icon, to }: StatTileProps) {
  const body: ReactNode = (
    <>
      <span className="flex items-center justify-between text-sm text-muted">
        {label}
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="font-display text-4xl tabular-nums">{value}</span>
      <span className="text-xs text-muted">{hint}</span>
    </>
  )
  const className = 'flex flex-col gap-1 rounded-2xl border border-border bg-surface p-5'
  if (to) {
    return (
      <Link
        to={to}
        className={cn(
          className,
          'transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-surface-2',
        )}
      >
        {body}
      </Link>
    )
  }
  return <div className={className}>{body}</div>
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-label="Loading">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} className="h-28" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const period = parsePeriod(searchParams.get('days'))
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = useModerationStats(period)

  const periodSelect = (
    <div
      role="radiogroup"
      aria-label="Period"
      className="flex rounded-xl border border-border bg-surface p-1"
    >
      {PERIODS.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === period}
          onClick={() => setSearchParams(option === 7 ? {} : { days: String(option) }, { replace: true })}
          className={cn(
            'rounded-lg px-3 py-1.5 font-display transition-colors',
            option === period ? 'bg-accent text-white' : 'text-muted hover:text-white',
          )}
        >
          {option} days
        </button>
      ))}
    </div>
  )

  return (
    <ModerationPage
      title="Moderator Dashboard"
      subtitle="Submissions and review activity"
      actions={periodSelect}
    >
      {isPending ? (
        <DashboardSkeleton />
      ) : isError ? (
        <LoadError onRetry={() => refetch()} retrying={isFetching} />
      ) : (
        <DashboardContent stats={data} period={period} dimmed={isPlaceholderData} />
      )}
    </ModerationPage>
  )
}

function DashboardContent({
  stats,
  period,
  dimmed,
}: {
  stats: NonNullable<ReturnType<typeof useModerationStats>['data']>
  period: ReturnType<typeof parsePeriod>
  dimmed: boolean
}) {
  const summary = summarize(stats)
  const reviewed = summary.approved + summary.rejected

  return (
    <div className={cn('flex flex-col gap-6 transition-opacity', dimmed && 'opacity-60')}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Pending review"
          value={String(summary.pending)}
          hint="Open the verification queue"
          icon={ClockAlert}
          to="/moderation/queue"
        />
        <StatTile
          label="Submitted"
          value={String(summary.submittedInPeriod)}
          hint={`In the last ${period} days`}
          icon={Upload}
        />
        <StatTile label="Approved" value={String(summary.approved)} hint="All time" icon={CircleCheck} />
        <StatTile
          label="Approval rate"
          value={summary.approvalRate === null ? '-' : formatPercent(summary.approvalRate)}
          hint={`${summary.approved} of ${reviewed} reviewed runs`}
          icon={Percent}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <SubmissionsChart
          points={toDayPoints(stats.submissionsPerDay, period)}
          period={period}
          total={summary.submittedInPeriod}
        />
        <CategoryBreakdown categories={summary.categories} totalRuns={summary.totalRuns} />
        <ReviewOutcomesChart categories={summary.categories} />
      </div>
    </div>
  )
}
