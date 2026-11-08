import type { Category } from '../categories/categories'

export interface SubmitAttemptRequest {
  attemptCategory: Category
  videoLink: string
  attemptTime: string
  attemptDescription: string | null
}

export type AttemptStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface MyAttempt {
  idAttempt: number
  attemptCategory: Category
  attemptTime: string
  videoLink: string
  attemptDescription: string | null
  attemptStatus: AttemptStatus
  isRecord: boolean
  submittedAt: string | null
  reviewedAt: string | null
}
