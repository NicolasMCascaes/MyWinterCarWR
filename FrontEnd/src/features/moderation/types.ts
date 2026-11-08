import type { Category } from '../categories/categories'
import type { AttemptStatus } from '../submit/types'

export type { AttemptStatus }

export type ReviewedStatus = Exclude<AttemptStatus, 'PENDING'>

export type ReviewDecision = 'approve' | 'reject'

export interface AttemptDetails {
  idAttempt: number
  attemptTime: string
  videoLink: string
  attemptCategory: Category
  attemptDescription: string | null
  attemptStatus: AttemptStatus
  isRecord: boolean
  submittedAt: string | null
  userId: string
  username: string
  country: string | null
  reviewedBy: string | null
  reviewedAt: string | null
}

export type StatsPeriod = 7 | 30 | 90

export interface DailySubmissions {
  date: string
  submissions: number
}

export interface CategoryTotals {
  category: string
  total: number
  pending: number
  approved: number
  rejected: number
}

export interface ModerationStats {
  days: number
  pendingCount: number
  submissionsPerDay: DailySubmissions[]
  totalsPerCategory: CategoryTotals[]
}
