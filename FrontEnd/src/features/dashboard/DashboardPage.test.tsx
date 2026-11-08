import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fakeToken, jsonResponse, renderRoutes } from '../../test/render'
import type { ModerationStats } from '../moderation/types'
import { DashboardPage } from './DashboardPage'

function stats(days: number, submissions: number): ModerationStats {
  return {
    days,
    pendingCount: 2,
    submissionsPerDay: Array.from({ length: days }, (_, index) => ({
      date: `2026-11-${String(index + 1).padStart(2, '0')}`.slice(0, 10),
      submissions: index === days - 1 ? submissions : 0,
    })),
    totalsPerCategory: [
      { category: 'RALLY', total: 6, pending: 1, approved: 4, rejected: 1 },
      { category: 'DEATH', total: 4, pending: 1, approved: 2, rejected: 1 },
    ],
  }
}

describe('DashboardPage', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('mwc.token', fakeToken({ username: 'mod', role: 'MODERATOR' }))
    fetchMock.mockReset()
    fetchMock.mockImplementation(async (input) => {
      const days = Number(new URL(String(input)).searchParams.get('days'))
      return jsonResponse(stats(days, days === 7 ? 3 : 11))
    })
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the key numbers and the category breakdown', async () => {
    renderRoutes([{ path: '/moderation/dashboard', element: <DashboardPage /> }], '/moderation/dashboard')

    expect(await screen.findByRole('link', { name: /Pending review\s*2/ })).toHaveAttribute(
      'href',
      '/moderation/queue',
    )
    expect(screen.getByText('In the last 7 days').previousSibling).toHaveTextContent('3')
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('6 of 8 reviewed runs')).toBeInTheDocument()

    const breakdown = screen.getByRole('list', { name: 'Runs per category' })
    const items = within(breakdown).getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual([
      'Rally6 of 1060% of all runs',
      'Ice Race0 of 100% of all runs',
      'Full Assembly0 of 100% of all runs',
      'Death4 of 1040% of all runs',
    ])
    expect(String(fetchMock.mock.calls[0][0])).toContain('/attempt/moderator/stats?days=7')
  })

  it('switches the period and keeps it in the url', async () => {
    const { router } = renderRoutes(
      [{ path: '/moderation/dashboard', element: <DashboardPage /> }],
      '/moderation/dashboard',
    )
    await screen.findByText('In the last 7 days')

    await userEvent.click(screen.getByRole('radio', { name: '30 days' }))

    expect(await screen.findByText('In the last 30 days')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Last 30 days · 11 runs')).toBeInTheDocument())
    expect(router.state.location.search).toBe('?days=30')
    expect(screen.getByRole('radio', { name: '30 days' })).toHaveAttribute('aria-checked', 'true')
  })

  it('lists the daily submissions in the data table', async () => {
    renderRoutes([{ path: '/moderation/dashboard', element: <DashboardPage /> }], '/moderation/dashboard')

    const table = await screen.findByRole('table', { name: 'Submitted runs per day', hidden: true })
    expect(within(table).getAllByRole('row', { hidden: true })).toHaveLength(8)
  })
})
