import type { ModerationStats } from '../moderation/types'
import { formatPercent, parsePeriod, summarize, toDayPoints } from './dashboardData'

const STATS: ModerationStats = {
  days: 7,
  pendingCount: 1,
  submissionsPerDay: [
    { date: '2026-11-07', submissions: 2 },
    { date: '2026-11-08', submissions: 8 },
  ],
  totalsPerCategory: [
    { category: 'RALLY_RACE', total: 5, pending: 0, approved: 5, rejected: 0 },
    { category: 'RALLY', total: 8, pending: 0, approved: 7, rejected: 1 },
    { category: 'DEATH', total: 4, pending: 1, approved: 2, rejected: 1 },
    { category: 'FULL_ASSEMBLY', total: 3, pending: 0, approved: 3, rejected: 0 },
  ],
}

describe('dashboardData', () => {
  it('summarizes only the categories used by the site, in display order', () => {
    const summary = summarize(STATS)

    expect(summary.categories.map((category) => category.info.id)).toEqual([
      'RALLY',
      'ICE_RACE',
      'FULL_ASSEMBLY',
      'DEATH',
    ])
    expect(summary.totalRuns).toBe(15)
    expect(summary.approved).toBe(12)
    expect(summary.rejected).toBe(2)
    expect(summary.approvalRate).toBeCloseTo(12 / 14)
    expect(summary.submittedInPeriod).toBe(10)
    expect(summary.pending).toBe(1)
    expect(summary.categories[1]).toMatchObject({ total: 0, share: 0 })
    expect(summary.categories[0].share).toBeCloseTo(8 / 15)
  })

  it('has no approval rate before any review', () => {
    const summary = summarize({ ...STATS, totalsPerCategory: [], submissionsPerDay: [] })

    expect(summary.approvalRate).toBeNull()
    expect(summary.totalRuns).toBe(0)
  })

  it('labels days by weekday for a week and by date otherwise', () => {
    expect(toDayPoints(STATS.submissionsPerDay, 7).map((point) => point.label)).toEqual(['Sat', 'Sun'])
    expect(toDayPoints(STATS.submissionsPerDay, 30).map((point) => point.label)).toEqual(['07/11', '08/11'])
    expect(toDayPoints(STATS.submissionsPerDay, 7)[1].fullLabel).toBe('Sun, 08 Nov 2026')
  })

  it('parses the period from the url', () => {
    expect(parsePeriod('30')).toBe(30)
    expect(parsePeriod('90')).toBe(90)
    expect(parsePeriod('15')).toBe(7)
    expect(parsePeriod(null)).toBe(7)
  })

  it('formats percentages', () => {
    expect(formatPercent(0.857)).toBe('86%')
  })
})
