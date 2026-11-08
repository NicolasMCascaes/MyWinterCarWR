import { keepPreviousData, queryOptions, useQueries, useQuery } from '@tanstack/react-query'
import { http } from '../../lib/http'
import { CATEGORIES, type Category } from '../categories/categories'
import type { LeaderboardEntry } from './types'

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  category: (category: Category) => ['leaderboard', category] as const,
}

export function fetchLeaderboard(category: Category): Promise<LeaderboardEntry[]> {
  return http.get<LeaderboardEntry[]>(`/records/leaderboard?category=${category}`)
}

function leaderboardQuery(category: Category) {
  return queryOptions({
    queryKey: leaderboardKeys.category(category),
    queryFn: () => fetchLeaderboard(category),
  })
}

export function useLeaderboard(category: Category) {
  return useQuery({ ...leaderboardQuery(category), placeholderData: keepPreviousData })
}

export function useWorldRecords() {
  return useQueries({
    queries: CATEGORIES.map((category) => leaderboardQuery(category.id)),
    combine: (results) =>
      CATEGORIES.map((category, index) => ({
        category,
        record: results[index].data?.[0] ?? null,
        isPending: results[index].isPending,
      })),
  })
}
