import { Flag, Modal, VideoEmbed } from '../../components/ui'
import { formatDate, formatRunTime } from '../../lib/time'
import { categoryInfo } from '../categories/categories'
import { medalColor } from './medals'
import type { LeaderboardEntry } from './types'

interface RunDetailsModalProps {
  entry: LeaderboardEntry | null
  onClose: () => void
}

export function RunDetailsModal({ entry, onClose }: RunDetailsModalProps) {
  return (
    <Modal open={entry !== null} onClose={onClose} title={entry ? `${entry.username}'s run` : 'Run'}>
      {entry && (
        <div className="grid gap-5 md:grid-cols-[1fr_16rem]">
          <VideoEmbed
            link={entry.videoLink}
            title={`${entry.username} - ${categoryInfo(entry.category).label}`}
          />
          <dl className="flex flex-col gap-3 rounded-xl bg-surface-2 p-4">
            <Detail label="Position">
              <span className="font-display text-2xl" style={{ color: medalColor(entry.position) }}>
                #{entry.position}
              </span>
            </Detail>
            <Detail label="Player">
              <span className="flex items-center gap-2">
                <Flag code={entry.country} />
                {entry.username}
              </span>
            </Detail>
            <Detail label="Category">{categoryInfo(entry.category).label}</Detail>
            <Detail label="Time">
              <span className="tabular-nums">{formatRunTime(entry.attemptTime)}</span>
            </Detail>
            {entry.submittedAt && <Detail label="Submitted at">{formatDate(entry.submittedAt)}</Detail>}
            {entry.attemptDescription && <Detail label="Description">{entry.attemptDescription}</Detail>}
          </dl>
        </div>
      )}
    </Modal>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-display text-lg break-words">{children}</dd>
    </div>
  )
}
