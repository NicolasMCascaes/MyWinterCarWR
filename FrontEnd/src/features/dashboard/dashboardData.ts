import { CATEGORIES, type CategoryInfo } from '../categories/categories'
import type { DailySubmissions, ModerationStats, StatsPeriod } from '../moderation/types'

export const PERIODS: readonly StatsPeriod[] = [7, 30, 90]

export function parsePeriod(value: string | null): StatsPeriod {
  const parsed = Number(value)
  return PERIODS.find((period) => period === parsed) ?? 7
}

export interface CategorySummary {
  info: CategoryInfo
  total: number
  approved: number
  rejected: number
  pending: number
  share: number
}

export interface DashboardSummary {
  pending: number
  submittedInPeriod: number
  approved: number
  rejected: number
  approvalRate: number | null
  totalRuns: number
  categories: CategorySummary[]
}

export function summarize(stats: ModerationStats): DashboardSummary {
  const byCategory = new Map(stats.totalsPerCategory.map((totals) => [totals.category, totals]))
  const rows = CATEGORIES.map((info) => {
    const totals = byCategory.get(info.id)
    return {
      info,
      total: totals?.total ?? 0,
      approved: totals?.approved ?? 0,
      rejected: totals?.rejected ?? 0,
      pending: totals?.pending ?? 0,
    }
  })
  const totalRuns = rows.reduce((sum, row) => sum + row.total, 0)
  const approved = rows.reduce((sum, row) => sum + row.approved, 0)
  const rejected = rows.reduce((sum, row) => sum + row.rejected, 0)
  const reviewed = approved + rejected

  return {
    pending: stats.pendingCount,
    submittedInPeriod: stats.submissionsPerDay.reduce((sum, day) => sum + day.submissions, 0),
    approved,
    rejected,
    approvalRate: reviewed === 0 ? null : approved / reviewed,
    totalRuns,
    categories: rows.map((row) => ({ ...row, share: totalRuns === 0 ? 0 : row.total / totalRuns })),
  }
}

function parseDay(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const weekdayFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'short' })
const shortDateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit' })
const longDateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export interface DayPoint {
  date: string
  label: string
  fullLabel: string
  submissions: number
}

export function toDayPoints(days: DailySubmissions[], period: StatsPeriod): DayPoint[] {
  return days.map((day) => {
    const date = parseDay(day.date)
    return {
      date: day.date,
      label: period === 7 ? weekdayFormatter.format(date) : shortDateFormatter.format(date),
      fullLabel: longDateFormatter.format(date),
      submissions: day.submissions,
    }
  })
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}
