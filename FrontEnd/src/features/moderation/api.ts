import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError, http } from '../../lib/http'
import { leaderboardKeys } from '../leaderboard/api'
import type { AttemptDetails, ReviewDecision, ReviewedStatus } from './types'

export const moderationKeys = {
  all: ['moderation'] as const,
  pending: () => ['moderation', 'pending'] as const,
  attempt: (id: number) => ['moderation', 'attempt', id] as const,
  history: (status: ReviewedStatus | null) => ['moderation', 'history', status ?? 'ALL'] as const,
}

export function fetchPendingAttempts(): Promise<AttemptDetails[]> {
  return http.get<AttemptDetails[]>('/attempt/moderator/listAllAttemptByStatus?status=PENDING')
}

export function fetchAttempt(id: number): Promise<AttemptDetails> {
  return http.get<AttemptDetails>(`/attempt/moderator/${id}`)
}

export function fetchReviewHistory(status: ReviewedStatus | null): Promise<AttemptDetails[]> {
  return http.get<AttemptDetails[]>(`/attempt/moderator/history${status ? `?status=${status}` : ''}`)
}

export function reviewAttempt(id: number, decision: ReviewDecision): Promise<void> {
  return http.patch<void>(`/attempt/moderator/${decision === 'approve' ? 'accept' : 'reject'}/${id}`)
}

export function usePendingAttempts() {
  return useQuery({
    queryKey: moderationKeys.pending(),
    queryFn: fetchPendingAttempts,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  })
}

export function useAttempt(id: number) {
  return useQuery({ queryKey: moderationKeys.attempt(id), queryFn: () => fetchAttempt(id) })
}

export function useReviewHistory(status: ReviewedStatus | null) {
  return useQuery({ queryKey: moderationKeys.history(status), queryFn: () => fetchReviewHistory(status) })
}

export function reviewErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return 'This run was already reviewed by another moderator.'
    }
    if (error.status === 403) {
      return 'You cannot review your own run.'
    }
    if (error.status === 404) {
      return 'This run no longer exists.'
    }
  }
  return 'Could not save your decision. Please try again.'
}

export function useReviewAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, decision }: { id: number; decision: ReviewDecision }) => reviewAttempt(id, decision),
    onSuccess: (_, { id }) => {
      queryClient.setQueryData<AttemptDetails[]>(moderationKeys.pending(), (pending) =>
        pending?.filter((attempt) => attempt.idAttempt !== id),
      )
    },
    onSettled: (_, __, { decision }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: moderationKeys.all }),
        decision === 'approve' ? queryClient.invalidateQueries({ queryKey: leaderboardKeys.all }) : null,
      ]),
  })
}
