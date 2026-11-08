import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigate } from 'react-router-dom'
import { fakeToken, jsonResponse, renderRoutes } from '../../test/render'
import { RequireAuth } from '../auth/RequireAuth'
import { HistoryPage } from './HistoryPage'
import { ModeratorLayout } from './ModeratorLayout'
import { QueuePage } from './QueuePage'
import type { AttemptDetails } from './types'
import { VerificationPage } from './VerificationPage'

const MOD_ID = 'mod-id'

function attempt(overrides: Partial<AttemptDetails>): AttemptDetails {
  return {
    idAttempt: 1,
    attemptTime: '00:07:45',
    videoLink: 'https://www.youtube.com/watch?v=abc123',
    attemptCategory: 'RALLY',
    attemptDescription: null,
    attemptStatus: 'PENDING',
    isRecord: false,
    submittedAt: '2026-02-19T10:00:00',
    userId: 'alice-id',
    username: 'alice',
    country: 'BR',
    reviewedBy: null,
    reviewedAt: null,
    ...overrides,
  }
}

const ALICE = attempt({ idAttempt: 1 })
const OWN = attempt({ idAttempt: 2, userId: MOD_ID, username: 'mod', attemptCategory: 'DEATH' })
const BOB = attempt({ idAttempt: 3, userId: 'bob-id', username: 'bob', attemptTime: '00:09:00.50' })

function renderModeration(url: string) {
  localStorage.setItem('mwc.token', fakeToken({ username: 'mod', role: 'MODERATOR', id: MOD_ID }))
  return renderRoutes(
    [
      {
        path: '/moderation',
        element: (
          <RequireAuth roles={['MODERATOR']}>
            <ModeratorLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to="/moderation/queue" replace /> },
          { path: 'queue', element: <QueuePage /> },
          { path: 'history', element: <HistoryPage /> },
          { path: 'attempts/:id', element: <VerificationPage /> },
        ],
      },
      { path: '/', element: <p>Home page</p> },
    ],
    url,
  )
}

describe('moderation', () => {
  const fetchMock = vi.fn<typeof fetch>()
  let pending: AttemptDetails[]
  let details: Record<number, AttemptDetails>
  let reviewResponse: () => Response

  const calls = (method: string, fragment: string) =>
    fetchMock.mock.calls.filter(
      ([url, init]) => (init?.method ?? 'GET') === method && String(url).includes(fragment),
    )

  beforeEach(() => {
    localStorage.clear()
    pending = [ALICE, OWN, BOB]
    details = { 1: ALICE, 2: OWN, 3: BOB }
    reviewResponse = () => new Response(null, { status: 200 })
    fetchMock.mockReset()
    fetchMock.mockImplementation(async (input, init) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (method === 'PATCH') {
        const response = reviewResponse()
        if (response.ok) {
          const id = Number(url.split('/').pop())
          pending = pending.filter((item) => item.idAttempt !== id)
        }
        return response
      }
      if (url.includes('status=PENDING')) {
        return jsonResponse(pending)
      }
      if (url.includes('/history')) {
        const reviewed = [
          attempt({
            idAttempt: 9,
            attemptStatus: 'APPROVED',
            reviewedBy: 'mod',
            reviewedAt: '2026-03-01T12:00:00',
          }),
          attempt({
            idAttempt: 8,
            attemptStatus: 'REJECTED',
            reviewedBy: 'mod',
            reviewedAt: '2026-02-28T12:00:00',
          }),
        ]
        const status = new URL(url).searchParams.get('status')
        return jsonResponse(status ? reviewed.filter((item) => item.attemptStatus === status) : reviewed)
      }
      const id = Number(url.split('/').pop())
      return details[id]
        ? jsonResponse(details[id])
        : jsonResponse({ errorMessage: 'Attempt not found' }, 404)
    })
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lists pending runs and opens one for verification', async () => {
    renderModeration('/moderation')

    const table = await screen.findByRole('table', { name: 'Runs pending verification' })
    const rows = within(table).getAllByRole('row').slice(1)
    expect(rows.map((row) => within(row).getByRole('link').textContent)).toEqual(['alice', 'mod', 'bob'])
    expect(within(rows[1]).getByText('Your run')).toBeInTheDocument()
    expect(screen.getByText('3 runs pending verification, oldest first')).toBeInTheDocument()
    expect(screen.getByLabelText('3 pending')).toBeInTheDocument()

    await userEvent.click(within(rows[2]).getByText('00:09:00.50'))

    expect(await screen.findByRole('heading', { name: 'Run Information' })).toBeInTheDocument()
    expect(screen.getByTitle("bob's run")).toBeInTheDocument()
  })

  it('shows an empty state when the queue is clear', async () => {
    pending = []
    renderModeration('/moderation/queue')

    expect(await screen.findByText('All caught up')).toBeInTheDocument()
  })

  it('approves a run and jumps to the next one, skipping your own', async () => {
    renderModeration('/moderation/attempts/1')

    await userEvent.click(await screen.findByRole('button', { name: /Approve/ }))

    await waitFor(() => expect(screen.getByTitle("bob's run")).toBeInTheDocument())
    expect(calls('PATCH', '/attempt/moderator/accept/1')).toHaveLength(1)
    expect(screen.getByLabelText('2 pending')).toBeInTheDocument()
  })

  it('asks for confirmation before rejecting, also from the keyboard', async () => {
    pending = [ALICE]
    renderModeration('/moderation/attempts/1')
    await screen.findByRole('heading', { name: 'Run Information' })

    await userEvent.keyboard('r')
    const dialog = await screen.findByRole('dialog', { name: 'Reject this run?' })
    expect(calls('PATCH', '/reject/')).toHaveLength(0)

    await userEvent.click(within(dialog).getByRole('button', { name: 'Reject run' }))

    expect(await screen.findByText('All caught up')).toBeInTheDocument()
    expect(calls('PATCH', '/attempt/moderator/reject/1')).toHaveLength(1)
  })

  it('approves with the A shortcut', async () => {
    renderModeration('/moderation/attempts/3')
    await screen.findByTitle("bob's run")

    await userEvent.keyboard('a')

    await waitFor(() => expect(calls('PATCH', '/attempt/moderator/accept/3')).toHaveLength(1))
  })

  it('does not let moderators review their own run', async () => {
    renderModeration('/moderation/attempts/2')

    expect(await screen.findByText(/This is your own run/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Approve/ })).not.toBeInTheDocument()
    await userEvent.keyboard('a')
    expect(calls('PATCH', '/')).toHaveLength(0)
  })

  it('explains when another moderator already reviewed the run', async () => {
    reviewResponse = () => jsonResponse({ errorMessage: 'Attempt is not pending', errorCode: 409 }, 409)
    renderModeration('/moderation/attempts/1')

    await userEvent.click(await screen.findByRole('button', { name: /Approve/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent('already reviewed by another moderator')
  })

  it('shows reviewed runs as read only', async () => {
    details[5] = attempt({
      idAttempt: 5,
      attemptStatus: 'APPROVED',
      isRecord: true,
      reviewedBy: 'mod',
      reviewedAt: '2026-03-01T12:00:00',
      attemptDescription: 'Clean run',
    })
    renderModeration('/moderation/attempts/5')

    expect(await screen.findByRole('heading', { name: 'Reviewed Run' })).toBeInTheDocument()
    expect(screen.getByText('Clean run')).toBeInTheDocument()
    expect(screen.getByText('On the podium')).toBeInTheDocument()
    expect(screen.getByText('01/03/2026')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Approve/ })).not.toBeInTheDocument()
  })

  it('handles unknown runs', async () => {
    renderModeration('/moderation/attempts/404')

    expect(await screen.findByText('Run not found')).toBeInTheDocument()
  })

  it('filters the review history by status', async () => {
    renderModeration('/moderation/history')

    const table = await screen.findByRole('table', { name: 'Reviewed runs' })
    expect(within(table).getAllByRole('row')).toHaveLength(3)

    await userEvent.click(screen.getByRole('button', { name: 'Rejected' }))

    await waitFor(() => expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(2))
    expect(within(screen.getByRole('table')).getByText('Rejected')).toBeInTheDocument()
    expect(calls('GET', '/history?status=REJECTED')).toHaveLength(1)
  })
})
