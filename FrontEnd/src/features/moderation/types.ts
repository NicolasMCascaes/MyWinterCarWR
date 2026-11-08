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
