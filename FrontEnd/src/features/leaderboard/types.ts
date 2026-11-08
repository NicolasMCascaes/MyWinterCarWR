import type { Category } from '../categories/categories'

export interface LeaderboardEntry {
  position: number
  idAttempt: number
  userId: string
  username: string
  country: string | null
  category: Category
  attemptTime: string
  videoLink: string
  attemptDescription: string | null
  submittedAt: string | null
}
