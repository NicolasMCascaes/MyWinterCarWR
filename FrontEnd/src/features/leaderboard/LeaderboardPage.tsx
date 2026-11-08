import { RotateCw, Trophy, Upload } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button, EmptyState, Skeleton } from '../../components/ui'
import { cn } from '../../lib/cn'
import { categoryFromSlug, submitPath, type CategoryInfo } from '../categories/categories'
import { NotFoundPage } from '../errors/NotFoundPage'
import { useLeaderboard } from './api'
import { CategoryTabs } from './CategoryTabs'
import { Podium } from './Podium'
import { RankTable } from './RankTable'
import { RunDetailsModal } from './RunDetailsModal'
import type { LeaderboardEntry } from './types'

export function LeaderboardPage() {
  const { category: slug } = useParams()
  const category = categoryFromSlug(slug)

  if (!category) {
    return <NotFoundPage />
  }

  return <Leaderboard category={category} />
}

function Leaderboard({ category }: { category: CategoryInfo }) {
  const { data, isPending, isError, isPlaceholderData, isFetching, refetch } = useLeaderboard(category.id)
  const [selected, setSelected] = useState<LeaderboardEntry | null>(null)

  return (
    <PageContainer className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl sm:text-5xl">
            Leaderboard - <span style={{ color: category.colorVar }}>{category.label}</span>
          </h1>
          <Link
            to={submitPath(category)}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 font-display text-lg transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_0_24px_-6px_var(--color-primary)]"
          >
            <Upload className="size-5" aria-hidden /> Submit a run
          </Link>
        </div>
        <CategoryTabs current={category} />
      </header>

      {isPending ? (
        <LeaderboardSkeleton />
      ) : isError ? (
        <EmptyState
          title="Could not load the leaderboard"
          description="Check your connection and try again."
          action={
            <Button
              variant="dark"
              loading={isFetching}
              leftIcon={<RotateCw className="size-4" aria-hidden />}
              onClick={() => refetch()}
            >
              Try again
            </Button>
          }
        />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<Trophy className="size-10 text-gold" aria-hidden />}
          title="No records yet"
          description={`Nobody has set a ${category.label} record. Be the first!`}
        />
      ) : (
        <div className={cn('flex flex-col gap-8 transition-opacity', isPlaceholderData && 'opacity-50')}>
          <Podium key={category.id} entries={data.slice(0, 3)} onSelect={setSelected} />
          <section aria-labelledby="top-rank" className="mx-auto flex w-full max-w-4xl flex-col gap-2">
            <h2 id="top-rank" className="font-display text-xl">
              Top Rank
            </h2>
            <RankTable entries={data} onSelect={setSelected} />
          </section>
        </div>
      )}

      <RunDetailsModal entry={selected} onClose={() => setSelected(null)} />
    </PageContainer>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-label="Loading leaderboard">
      <div className="mx-auto grid w-full max-w-2xl grid-cols-3 items-end gap-3">
        <Skeleton className="h-56" />
        <Skeleton className="h-72" />
        <Skeleton className="h-44" />
      </div>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-14" />
        ))}
      </div>
    </div>
  )
}
