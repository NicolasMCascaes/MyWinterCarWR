import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fakeToken, jsonResponse, renderRoutes } from '../../test/render'
import { RequireAuth } from '../auth/RequireAuth'
import { SubmitRunPage } from './SubmitRunPage'
import type { MyAttempt } from './types'

const YOUTUBE_LINK = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

const PENDING_ATTEMPT: MyAttempt = {
  idAttempt: 7,
  attemptCategory: 'DEATH',
  attemptTime: '00:30:15.2',
  videoLink: YOUTUBE_LINK,
  attemptDescription: null,
  attemptStatus: 'PENDING',
  isRecord: false,
  submittedAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
  reviewedAt: null,
}

function renderSubmit(url: string, role = 'USER') {
  localStorage.setItem('mwc.token', fakeToken({ username: 'erin', role }))
  return renderRoutes(
    [
      {
        path: '/submit/:category?',
        element: (
          <RequireAuth roles={['USER', 'MODERATOR']}>
            <SubmitRunPage />
          </RequireAuth>
        ),
      },
      { path: '/leaderboard/:category', element: <p>Leaderboard page</p> },
      { path: '/login', element: <p>Login page</p> },
    ],
    url,
  )
}

async function fillRunStep(link = YOUTUBE_LINK, time = '0012345') {
  await userEvent.type(await screen.findByLabelText('Video url'), link)
  await userEvent.type(screen.getByLabelText('Time'), time)
}

const next = () => userEvent.click(screen.getByRole('button', { name: 'Next' }))

describe('SubmitRunPage', () => {
  const fetchMock = vi.fn<typeof fetch>()
  let myAttempts: MyAttempt[]
  let submitResponse: () => Response

  const submitCalls = () => fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/attempt/submit'))

  beforeEach(() => {
    localStorage.clear()
    myAttempts = []
    submitResponse = () => new Response(null, { status: 200 })
    fetchMock.mockReset()
    fetchMock.mockImplementation(async (url) =>
      String(url).endsWith('/attempt/me') ? jsonResponse(myAttempts) : submitResponse(),
    )
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('walks through every step and submits the run', async () => {
    renderSubmit('/submit')

    await screen.findByRole('radiogroup')
    await next()
    expect(await screen.findByText('Select a category')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('radio', { name: 'Ice Race' }))
    await next()

    await fillRunStep()
    expect(screen.getByLabelText('Time')).toHaveValue('00:12:34.5')
    expect(screen.getByTitle('Preview of your run')).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    )
    await next()

    await userEvent.type(screen.getByLabelText('Description'), 'Clean run, no glitches')
    expect(screen.getByText('22/256')).toBeInTheDocument()
    await next()

    expect(screen.getByRole('heading', { name: 'Ice Race - erin' })).toBeInTheDocument()
    expect(screen.getByText('00:12:34.50')).toBeInTheDocument()
    myAttempts = [{ ...PENDING_ATTEMPT, attemptCategory: 'ICE_RACE' }]
    await userEvent.click(screen.getByRole('button', { name: 'Submit!' }))

    expect(await screen.findByRole('heading', { name: 'Run submitted!' })).toBeInTheDocument()
    const [, init] = submitCalls()[0]
    expect(new Headers(init?.headers).get('Authorization')).toMatch(/^Bearer /)
    expect(JSON.parse(String(init?.body))).toEqual({
      attemptCategory: 'ICE_RACE',
      videoLink: YOUTUBE_LINK,
      attemptTime: '00:12:34.50',
      attemptDescription: 'Clean run, no glitches',
    })
  })

  it('starts on the run step when the category comes from the url', async () => {
    renderSubmit('/submit/death')

    expect(await screen.findByLabelText('Video url')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('radio', { name: 'Death' })).toHaveAttribute('aria-checked', 'true')
  })

  it('validates the video link and the time', async () => {
    renderSubmit('/submit/rally')

    await fillRunStep('https://vimeo.com/123', '000000')
    await next()

    expect(await screen.findByText('Use a YouTube or Twitch link')).toBeInTheDocument()
    expect(screen.getByText('The time must be greater than zero')).toBeInTheDocument()
    expect(screen.getByLabelText('Video url')).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText('Time'))
    await userEvent.type(screen.getByLabelText('Time'), '0012')
    await next()
    expect(await screen.findByText('Use the format HH:MM:SS or HH:MM:SS.cc')).toBeInTheDocument()
  })

  it('sends a null description and lets the user edit from the review', async () => {
    renderSubmit('/submit/rally')

    await fillRunStep(YOUTUBE_LINK, '01020304')
    await next()
    await next()

    const review = screen.getByRole('heading', { name: 'Rally - erin' }).parentElement as HTMLElement
    expect(within(review).getByText('No description')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Edit time' }))
    expect(screen.getByLabelText('Time')).toHaveValue('01:02:03.04')
    await next()
    await next()
    await userEvent.click(screen.getByRole('button', { name: 'Submit!' }))

    await screen.findByRole('heading', { name: 'Run submitted!' })
    expect(JSON.parse(String(submitCalls()[0][1]?.body))).toMatchObject({
      attemptTime: '01:02:03.04',
      attemptDescription: null,
    })
  })

  it('warns before starting when a run is already waiting for review', async () => {
    myAttempts = [{ ...PENDING_ATTEMPT, attemptStatus: 'REJECTED' }, PENDING_ATTEMPT]
    renderSubmit('/submit/rally')

    expect(await screen.findByRole('heading', { name: 'Your run is under review' })).toBeInTheDocument()
    const [meUrl, meInit] = fetchMock.mock.calls[0]
    expect(String(meUrl)).toContain('/attempt/me')
    expect(new Headers(meInit?.headers).get('Authorization')).toMatch(/^Bearer /)
    expect(screen.getByText('Death')).toBeInTheDocument()
    expect(screen.getByText('00:30:15.20')).toBeInTheDocument()
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
    expect(screen.queryByLabelText('Video url')).not.toBeInTheDocument()
  })

  it('still explains the conflict if the run was sent from somewhere else', async () => {
    submitResponse = () =>
      jsonResponse({ errorMessage: 'User already has a pending attempt', errorCode: 409 }, 409)
    renderSubmit('/submit/rally')

    await fillRunStep()
    await next()
    await next()
    await userEvent.click(screen.getByRole('button', { name: 'Submit!' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('You already have a run waiting for review')
  })

  it('goes back to the leaderboard from the first step', async () => {
    renderSubmit('/submit')

    await userEvent.click(await screen.findByRole('radio', { name: 'Full Assembly' }))
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(await screen.findByText('Leaderboard page')).toBeInTheDocument()
  })

  it('lets moderators submit runs', async () => {
    renderSubmit('/submit/rally', 'MODERATOR')

    expect(await screen.findByLabelText('Video url')).toBeInTheDocument()
  })

  it('blocks admin accounts', () => {
    renderSubmit('/submit', 'ADMIN')

    expect(screen.getByRole('heading', { name: 'Restricted area' })).toBeInTheDocument()
  })
})
