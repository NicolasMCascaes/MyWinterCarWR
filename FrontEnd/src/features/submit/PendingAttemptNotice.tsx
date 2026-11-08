import { ArrowLeft, Hourglass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { formatRunTime, timeAgo } from '../../lib/time'
import { categoryInfo, DEFAULT_CATEGORY, isCategory, leaderboardPath } from '../categories/categories'
import type { MyAttempt } from './types'

export function PendingAttemptNotice({ attempt }: { attempt: MyAttempt }) {
  const category = isCategory(attempt.attemptCategory)
    ? categoryInfo(attempt.attemptCategory)
    : DEFAULT_CATEGORY

  return (
    <PageContainer className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
      <Hourglass className="size-16 animate-rise text-warning" aria-hidden />
      <h1 className="font-display text-4xl sm:text-5xl">Your run is under review</h1>
      <p className="max-w-lg text-lg text-muted">
        You can send a new run once a moderator reviews the one you already submitted.
      </p>
      <dl className="grid w-full max-w-md grid-cols-3 gap-3 rounded-2xl border border-border bg-surface p-4 text-left">
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-muted">Category</dt>
          <dd className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: category.colorVar }}
              aria-hidden
            />
            {category.label}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-muted">Time</dt>
          <dd className="font-display">{formatRunTime(attempt.attemptTime)}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-muted">Submitted</dt>
          <dd>{attempt.submittedAt ? timeAgo(attempt.submittedAt) : '-'}</dd>
        </div>
      </dl>
      <Link
        to={leaderboardPath(category)}
        className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-display text-lg transition-colors hover:bg-primary-hover"
      >
        <ArrowLeft className="size-5" aria-hidden /> Back to leaderboard
      </Link>
    </PageContainer>
  )
}
