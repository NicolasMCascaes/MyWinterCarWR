import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError, http } from '../../lib/http'
import { parseRunTime, toApiTime } from '../../lib/time'
import type { Category } from '../categories/categories'
import type { MyAttempt, SubmitAttemptRequest } from './types'

export const myAttemptsKey = ['attempts', 'me'] as const

export function fetchMyAttempts(): Promise<MyAttempt[]> {
  return http.get<MyAttempt[]>('/attempt/me')
}

export function useMyAttempts() {
  return useQuery({ queryKey: myAttemptsKey, queryFn: fetchMyAttempts })
}

export function submitAttempt(request: SubmitAttemptRequest): Promise<void> {
  return http.post<void>('/attempt/submit', request)
}

export interface SubmitRunValues {
  category: Category
  videoLink: string
  time: string
  description: string
}

export function toSubmitRequest(values: SubmitRunValues): SubmitAttemptRequest {
  const time = parseRunTime(values.time)
  if (!time) {
    throw new Error(`Invalid run time: ${values.time}`)
  }
  const description = values.description.trim()
  return {
    attemptCategory: values.category,
    videoLink: values.videoLink.trim(),
    attemptTime: toApiTime(time),
    attemptDescription: description || null,
  }
}

export function submitErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return 'You already have a run waiting for review. Wait for a moderator before sending another one.'
    }
    if (error.status === 400) {
      return error.message
    }
    if (error.status === 403) {
      return 'Admin accounts cannot submit runs.'
    }
  }
  return 'Could not submit your run right now. Please try again.'
}

export function useSubmitAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: SubmitRunValues) => submitAttempt(toSubmitRequest(values)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: myAttemptsKey }),
  })
}
