import { ArrowLeft, Check, SearchX, ShieldAlert, Trophy, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, EmptyState, Flag, Modal, Skeleton, VideoEmbed } from '../../components/ui'
import { ApiError } from '../../lib/http'
import { formatDate, formatRunTime, timeAgo } from '../../lib/time'
import { useAuth } from '../auth/useAuth'
import { categoryInfo, isCategory } from '../categories/categories'
import { reviewErrorMessage, useAttempt, usePendingAttempts, useReviewAttempt } from './api'
import { LoadError, ModerationPage } from './ModerationPage'
import { StatusBadge } from './StatusBadge'
import type { AttemptDetails, ReviewDecision } from './types'

export function VerificationPage() {
  const { id } = useParams()
  const attemptId = Number(id)

  if (!Number.isInteger(attemptId) || attemptId <= 0) {
    return <AttemptNotFound />
  }
  return <Verification key={attemptId} attemptId={attemptId} />
}

function AttemptNotFound() {
  return (
    <ModerationPage title="Verification Queue">
      <EmptyState
        icon={<SearchX className="size-10 text-muted" aria-hidden />}
        title="Run not found"
        description="It may have been removed or the link is wrong."
        action={<BackLink to="/moderation/queue" label="Back to queue" />}
      />
    </ModerationPage>
  )
}

function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 font-display text-lg text-muted transition-colors hover:text-white"
    >
      <ArrowLeft className="size-5" aria-hidden /> {label}
    </Link>
  )
}

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  )
}

function Verification({ attemptId }: { attemptId: number }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const attemptQuery = useAttempt(attemptId)
  const pendingQuery = usePendingAttempts()
  const reviewMutation = useReviewAttempt()
  const [confirmingReject, setConfirmingReject] = useState(false)

  const attempt = attemptQuery.data
  const own = attempt?.userId === user?.id
  const canReview = attempt?.attemptStatus === 'PENDING' && !own

  const decide = (decision: ReviewDecision) => {
    if (!attempt || reviewMutation.isPending) {
      return
    }
    setConfirmingReject(false)
    const nextAttempt = pendingQuery.data?.find(
      (candidate) => candidate.idAttempt !== attempt.idAttempt && candidate.userId !== user?.id,
    )
    reviewMutation.mutate(
      { id: attempt.idAttempt, decision },
      {
        onSuccess: () => {
          toast.success(`${attempt.username}'s run was ${decision === 'approve' ? 'approved' : 'rejected'}.`)
          navigate(nextAttempt ? `/moderation/attempts/${nextAttempt.idAttempt}` : '/moderation/queue', {
            replace: true,
          })
        },
      },
    )
  }

  useEffect(() => {
    if (!canReview || confirmingReject) {
      return
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) {
        return
      }
      const key = event.key.toLowerCase()
      if (key === 'a') {
        event.preventDefault()
        decide('approve')
      } else if (key === 'r') {
        event.preventDefault()
        setConfirmingReject(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  if (attemptQuery.isPending) {
    return (
      <ModerationPage title="Verification Queue">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]" aria-label="Loading">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </ModerationPage>
    )
  }

  if (attemptQuery.isError) {
    if (attemptQuery.error instanceof ApiError && attemptQuery.error.status === 404) {
      return <AttemptNotFound />
    }
    return (
      <ModerationPage title="Verification Queue">
        <LoadError onRetry={() => attemptQuery.refetch()} retrying={attemptQuery.isFetching} />
      </ModerationPage>
    )
  }

  const reviewed = attemptQuery.data.attemptStatus !== 'PENDING'

  return (
    <ModerationPage
      title={reviewed ? 'Reviewed Run' : 'Verification Queue'}
      subtitle={
        reviewed ? (
          <BackLink to="/moderation/history" label="Back to history" />
        ) : (
          <BackLink to="/moderation/queue" label="Back to queue" />
        )
      }
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-5">
          <VideoEmbed
            link={attemptQuery.data.videoLink}
            title={`${attemptQuery.data.username}'s run`}
            className="[&>div]:rounded-2xl"
          />

          {reviewMutation.isError && (
            <p role="alert" className="rounded-xl bg-danger/15 px-4 py-3 text-center text-danger">
              {reviewErrorMessage(reviewMutation.error)}
            </p>
          )}

          {own && attemptQuery.data.attemptStatus === 'PENDING' && (
            <p className="flex items-center gap-2 rounded-xl bg-warning/15 px-4 py-3 text-warning">
              <ShieldAlert className="size-5 shrink-0" aria-hidden />
              This is your own run. Another moderator has to review it.
            </p>
          )}

          {canReview && (
            <div className="flex flex-wrap justify-between gap-4">
              <Button
                variant="danger"
                size="lg"
                leftIcon={<X className="size-6" aria-hidden />}
                disabled={reviewMutation.isPending}
                onClick={() => setConfirmingReject(true)}
                aria-keyshortcuts="R"
                className="min-w-40"
              >
                Reprove <Kbd>R</Kbd>
              </Button>
              <Button
                variant="success"
                size="lg"
                leftIcon={<Check className="size-6" aria-hidden />}
                loading={reviewMutation.isPending && reviewMutation.variables.decision === 'approve'}
                disabled={reviewMutation.isPending}
                onClick={() => decide('approve')}
                aria-keyshortcuts="A"
                className="min-w-40"
              >
                Approve <Kbd>A</Kbd>
              </Button>
            </div>
          )}
        </div>

        <RunInformation attempt={attemptQuery.data} own={own} />
      </div>

      <Modal
        open={confirmingReject}
        onClose={() => setConfirmingReject(false)}
        title="Reject this run?"
        className="w-[min(92vw,28rem)]"
      >
        <p className="text-muted">
          {attemptQuery.data.username}&apos;s {formatRunTime(attemptQuery.data.attemptTime)} run will be
          marked as rejected. This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmingReject(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={reviewMutation.isPending}
            leftIcon={<X className="size-5" aria-hidden />}
            onClick={() => decide('reject')}
          >
            Reject run
          </Button>
        </div>
      </Modal>
    </ModerationPage>
  )
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="ml-1 hidden rounded border border-current/40 px-1.5 text-xs opacity-70 sm:inline">
      {children}
    </kbd>
  )
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-display text-lg break-words">{children}</dd>
    </div>
  )
}

function RunInformation({ attempt, own }: { attempt: AttemptDetails; own: boolean }) {
  const category = isCategory(attempt.attemptCategory) ? categoryInfo(attempt.attemptCategory) : null

  return (
    <section
      aria-labelledby="run-information"
      className="flex flex-col gap-5 rounded-2xl border border-border bg-gradient-to-b from-surface to-bg-deep p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="run-information" className="font-display text-2xl">
          Run Information
        </h2>
        <StatusBadge status={attempt.attemptStatus} />
      </div>
      <dl className="flex flex-col gap-4">
        <InfoRow label="Player">
          <span className="inline-flex items-center gap-2">
            {attempt.country && <Flag code={attempt.country} />}
            {attempt.username}
            {own && <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">You</span>}
          </span>
        </InfoRow>
        <InfoRow label="Category">
          <span className="inline-flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: category?.colorVar }}
              aria-hidden
            />
            {category?.label ?? attempt.attemptCategory}
          </span>
        </InfoRow>
        <InfoRow label="Attempt time">
          <span className="text-2xl tabular-nums">{formatRunTime(attempt.attemptTime)}</span>
        </InfoRow>
        <InfoRow label="Submitted at">
          {attempt.submittedAt ? `${formatDate(attempt.submittedAt)} (${timeAgo(attempt.submittedAt)})` : '-'}
        </InfoRow>
        <InfoRow label="Description">
          {attempt.attemptDescription ? (
            <span className="font-sans text-base">{attempt.attemptDescription}</span>
          ) : (
            <span className="text-base text-muted">No description</span>
          )}
        </InfoRow>
        {attempt.attemptStatus !== 'PENDING' && (
          <>
            <InfoRow label="Reviewed by">{attempt.reviewedBy ?? '-'}</InfoRow>
            <InfoRow label="Reviewed at">{attempt.reviewedAt ? formatDate(attempt.reviewedAt) : '-'}</InfoRow>
          </>
        )}
        {attempt.isRecord && (
          <p className="inline-flex items-center gap-2 font-display text-gold">
            <Trophy className="size-5" aria-hidden /> On the podium
          </p>
        )}
      </dl>
    </section>
  )
}
