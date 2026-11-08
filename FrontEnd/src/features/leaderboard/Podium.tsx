import { Trophy } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Avatar, Flag } from '../../components/ui'
import { cn } from '../../lib/cn'
import { formatRunTime } from '../../lib/time'
import { medalColor } from './medals'
import type { LeaderboardEntry } from './types'

const SPOTS = [
  { position: 2, height: 'h-44 sm:h-56', trophy: 'size-12 sm:size-16', delay: '120ms' },
  { position: 1, height: 'h-56 sm:h-72', trophy: 'size-16 sm:size-24', delay: '0ms' },
  { position: 3, height: 'h-32 sm:h-44', trophy: 'size-10 sm:size-14', delay: '240ms' },
]

const BLOCK_SHAPE: CSSProperties = {
  clipPath: 'polygon(14% 0, 86% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)',
}

interface PodiumProps {
  entries: LeaderboardEntry[]
  onSelect: (entry: LeaderboardEntry) => void
}

export function Podium({ entries, onSelect }: PodiumProps) {
  const byPosition = new Map(entries.map((entry) => [entry.position, entry]))

  return (
    <ol aria-label="Podium" className="mx-auto grid w-full max-w-2xl grid-cols-3 items-end gap-2 sm:gap-3">
      {SPOTS.map((spot) => {
        const entry = byPosition.get(spot.position)
        const color = medalColor(spot.position)
        return (
          <li
            key={spot.position}
            className="flex min-w-0 animate-rise flex-col items-center gap-3"
            style={{ animationDelay: spot.delay }}
          >
            {entry ? (
              <button
                type="button"
                onClick={() => onSelect(entry)}
                aria-label={`Position ${spot.position}: ${entry.username}, ${formatRunTime(entry.attemptTime)}`}
                className="group flex max-w-full flex-col items-center gap-1.5 rounded-xl px-1 py-1 transition-transform hover:-translate-y-1 sm:px-2"
              >
                <Avatar name={entry.username} size={spot.position === 1 ? 'lg' : 'md'} ringColor={color} />
                <span className="max-w-full truncate font-display text-lg">{entry.username}</span>
                <span className="flex items-center gap-1.5 text-xs text-muted tabular-nums transition-colors group-hover:text-white sm:text-sm">
                  <Flag code={entry.country} />
                  {formatRunTime(entry.attemptTime)}
                </span>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-1.5 px-2 py-1 text-muted">
                <span className="flex size-12 items-center justify-center rounded-full border-2 border-dashed border-border font-display">
                  ?
                </span>
                <span className="font-display">Open spot</span>
              </div>
            )}
            <div
              style={BLOCK_SHAPE}
              className={cn(
                'flex w-full items-center justify-center bg-podium transition-[filter] duration-300',
                spot.height,
                entry && 'hover:brightness-125',
              )}
            >
              <Trophy
                className={cn(spot.trophy, 'drop-shadow-[0_0_18px_currentColor]')}
                style={{ color }}
                aria-hidden
              />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
