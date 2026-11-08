import { Play } from 'lucide-react'
import { Flag } from '../../components/ui'
import { formatRunTime } from '../../lib/time'
import { medalColor } from './medals'
import type { LeaderboardEntry } from './types'

interface RankTableProps {
  entries: LeaderboardEntry[]
  onSelect: (entry: LeaderboardEntry) => void
}

export function RankTable({ entries, onSelect }: RankTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-deep/60 p-3 sm:p-6">
      <table className="w-full table-fixed border-separate border-spacing-y-3 text-center sm:table-auto">
        <thead>
          <tr className="font-display text-muted">
            <th scope="col" className="w-12 font-normal sm:w-24">
              #
            </th>
            <th scope="col" className="font-normal">
              Username
            </th>
            <th scope="col" className="font-normal">
              Time
            </th>
            <th scope="col" className="font-normal">
              Country
            </th>
            <th scope="col" className="hidden w-14 font-normal sm:table-cell">
              <span className="sr-only">Video</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={entry.idAttempt}
              onClick={() => onSelect(entry)}
              style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
              className="group animate-rise cursor-pointer bg-surface-2 transition-colors hover:bg-surface-3"
            >
              <td className="rounded-l-xl py-3 pl-3 text-left font-display text-xl sm:pl-5 sm:text-3xl">
                <span style={{ color: medalColor(entry.position) }}>#{entry.position}</span>
              </td>
              <td className="truncate px-1 font-display sm:text-lg">{entry.username}</td>
              <td className="font-display text-sm tabular-nums sm:text-lg">
                {formatRunTime(entry.attemptTime)}
              </td>
              <td className="rounded-r-xl sm:rounded-none">
                {entry.country ? (
                  <Flag code={entry.country} className="text-2xl" />
                ) : (
                  <span className="text-muted" aria-label="Unknown country">
                    -
                  </span>
                )}
              </td>
              <td className="hidden rounded-r-xl pr-2 sm:table-cell">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onSelect(entry)
                  }}
                  aria-label={`Watch ${entry.username}'s run`}
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-all group-hover:bg-accent group-hover:text-white"
                >
                  <Play className="size-4" aria-hidden />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
