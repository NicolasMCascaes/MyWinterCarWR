import { Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRunTime } from '../../lib/time'
import type { LeaderboardEntry } from '../leaderboard/types'
import { leaderboardPath, type CategoryInfo } from './categories'

interface CategoryCardProps {
  category: CategoryInfo
  record: LeaderboardEntry | null
}

export function CategoryCard({ category, record }: CategoryCardProps) {
  return (
    <Link
      to={leaderboardPath(category)}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-chip text-bg transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-16px_var(--color-accent)]"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={category.image}
          alt=""
          className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
        <span
          className="absolute top-3 left-3 size-3 rounded-full ring-2 ring-white"
          style={{ backgroundColor: category.colorVar }}
          aria-hidden
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="font-display text-3xl">{category.label}</h2>
        <p className="flex-1 leading-snug">{category.description}</p>
        <p className="mt-2 flex items-center gap-2 border-t border-bg/10 pt-3 font-display text-sm">
          <Trophy className="size-4 text-bronze" aria-hidden />
          {record ? `WR ${formatRunTime(record.attemptTime)} by ${record.username}` : 'No record yet'}
        </p>
      </div>
    </Link>
  )
}
