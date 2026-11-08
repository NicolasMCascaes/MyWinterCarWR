import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jsonResponse, renderRoute } from '../../test/render'
import { LeaderboardPage } from './LeaderboardPage'
import type { LeaderboardEntry } from './types'

function entry(position: number, username: string, attemptTime: string): LeaderboardEntry {
  return {
    position,
    idAttempt: position * 10,
    userId: `user-${position}`,
    username,
    country: position === 1 ? 'BR' : null,
    category: 'RALLY',
    attemptTime,
    videoLink: `https://youtu.be/video${position}`,
    attemptDescription: position === 1 ? 'Clean run' : null,
    submittedAt: '2026-11-08T01:51:19.09075',
  }
}

const RALLY = [
  entry(1, 'carol', '00:08:00'),
  entry(2, 'dave', '00:09:00'),
  entry(3, 'alice', '00:10:00'),
  entry(4, 'bob', '00:11:00'),
]

describe('LeaderboardPage', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function renderPage(url: string) {
    return renderRoute(<LeaderboardPage />, { path: '/leaderboard/:category?', url })
  }

  it('shows the podium in 2-1-3 order and every entry in the table', async () => {
    fetchMock.mockResolvedValue(jsonResponse(RALLY))

    renderPage('/leaderboard/rally')

    const podium = await screen.findByRole('list', { name: 'Podium' })
    const spots = within(podium).getAllByRole('button')
    expect(spots.map((spot) => spot.getAttribute('aria-label'))).toEqual([
      'Position 2: dave, 00:09:00.00',
      'Position 1: carol, 00:08:00.00',
      'Position 3: alice, 00:10:00.00',
    ])
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1)
    expect(rows).toHaveLength(4)
    expect(rows[3]).toHaveTextContent('#4bob00:11:00.00')
    expect(fetchMock.mock.calls[0][0]).toContain('/records/leaderboard?category=RALLY')
  })

  it('uses the default category when the url has none', async () => {
    fetchMock.mockResolvedValue(jsonResponse(RALLY))

    renderPage('/leaderboard')

    expect(await screen.findByRole('heading', { name: 'Leaderboard - Rally' })).toBeInTheDocument()
  })

  it('marks open podium spots when there are fewer than three records', async () => {
    fetchMock.mockResolvedValue(jsonResponse([{ ...entry(1, 'erin', '00:05:00'), category: 'DEATH' }]))

    renderPage('/leaderboard/death')

    expect(await screen.findAllByText('Open spot')).toHaveLength(2)
  })

  it('shows an empty state when the category has no records', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]))

    renderPage('/leaderboard/ice-race')

    expect(await screen.findByText('No records yet')).toBeInTheDocument()
  })

  it('offers a retry when the request fails', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ errorMessage: 'boom', errorCode: 500 }, 500))
    fetchMock.mockResolvedValueOnce(jsonResponse(RALLY))

    renderPage('/leaderboard/rally')

    await userEvent.click(await screen.findByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('list', { name: 'Podium' })).toBeInTheDocument()
  })

  it('opens the run details with the embedded video', async () => {
    fetchMock.mockResolvedValue(jsonResponse(RALLY))

    renderPage('/leaderboard/rally')

    await userEvent.click(await screen.findByRole('button', { name: "Watch carol's run" }))

    const dialog = screen.getByRole('dialog', { name: "carol's run" })
    expect(within(dialog).getByTitle('carol - Rally')).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/video1',
    )
    expect(within(dialog).getByText('Clean run')).toBeInTheDocument()

    await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('renders not found for an unknown category', () => {
    renderPage('/leaderboard/rally-race')

    expect(screen.getByText('You drove off the map')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
