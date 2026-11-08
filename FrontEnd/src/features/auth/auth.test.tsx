import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Outlet } from 'react-router-dom'
import { fakeToken, jsonResponse, renderRoutes } from '../../test/render'
import { LoginPage } from './LoginPage'
import { RequireAuth } from './RequireAuth'
import { SignupPage } from './SignupPage'
import { UserMenu } from './UserMenu'

const TOKEN_KEY = 'mwc.token'

function routes() {
  return [
    {
      element: (
        <>
          <UserMenu />
          <Outlet />
        </>
      ),
      children: [
        { path: '/', element: <p>Home page</p> },
        { path: '/login', element: <LoginPage /> },
        { path: '/signup', element: <SignupPage /> },
        {
          path: '/submit',
          element: (
            <RequireAuth roles={['USER']}>
              <p>Submit page</p>
            </RequireAuth>
          ),
        },
        {
          path: '/moderation',
          element: (
            <RequireAuth roles={['MODERATOR']}>
              <p>Moderation page</p>
            </RequireAuth>
          ),
        },
      ],
    },
  ]
}

describe('authentication', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    localStorage.clear()
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('redirects anonymous users to login and back after signing in', async () => {
    const token = fakeToken({ username: 'erin', role: 'USER' })
    fetchMock.mockResolvedValue(jsonResponse({ token, username: 'erin' }))
    const { router } = renderRoutes(routes(), '/submit?category=rally')

    expect(await screen.findByRole('heading', { name: 'Login to your account' })).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Email'), 'erin@test.local')
    await userEvent.type(screen.getByLabelText('Password'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Submit page')).toBeInTheDocument()
    expect(router.state.location.search).toBe('?category=rally')
    expect(localStorage.getItem(TOKEN_KEY)).toBe(token)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toContain('/user/login')
    expect(init?.body).toBe(JSON.stringify({ email: 'erin@test.local', password: 'senha123' }))
  })

  it('validates the login form before calling the api', async () => {
    renderRoutes(routes(), '/login')

    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument()
    expect(screen.getByText('Enter your password')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([401, 404])('shows a generic message when login fails with %i', async (status) => {
    fetchMock.mockResolvedValue(jsonResponse({ errorMessage: 'x', errorCode: status }, status))
    renderRoutes(routes(), '/login')

    await userEvent.type(screen.getByLabelText('Email'), 'erin@test.local')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password.')
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('registers, signs in automatically and sends the selected country', async () => {
    const token = fakeToken({ username: 'frank', role: 'USER' })
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(jsonResponse({ token, username: 'frank' }))
    renderRoutes(routes(), '/signup')

    await userEvent.type(screen.getByLabelText('Email'), 'frank@test.local')
    await userEvent.type(screen.getByLabelText('Password'), 'senha123')
    await userEvent.type(screen.getByLabelText('Username'), 'frank')
    await userEvent.click(screen.getByLabelText('Country'))
    await userEvent.type(screen.getByRole('combobox', { name: 'Search country' }), 'portu')
    await userEvent.click(screen.getByRole('option', { name: /Portugal/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('Home page')).toBeInTheDocument()
    const registerBody = JSON.parse(String(fetchMock.mock.calls[0][1]?.body))
    expect(registerBody).toEqual({
      email: 'frank@test.local',
      password: 'senha123',
      username: 'frank',
      country: 'PT',
    })
    expect(String(fetchMock.mock.calls[1][0])).toContain('/user/login')
    expect(localStorage.getItem(TOKEN_KEY)).toBe(token)
  })

  it('preselects the country from the browser locale and allows keyboard selection', async () => {
    renderRoutes(routes(), '/signup')

    expect(screen.getByLabelText('Country')).toHaveTextContent(
      new Intl.DisplayNames(['en'], { type: 'region' }).of(navigator.language.split('-')[1] ?? '') ?? '',
    )

    await userEvent.click(screen.getByLabelText('Country'))
    await userEvent.type(screen.getByRole('combobox', { name: 'Search country' }), 'fin{Enter}')

    expect(screen.getByLabelText('Country')).toHaveTextContent('Finland')
  })

  it('explains conflicts and validation errors on registration', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ errorMessage: 'User already exists', errorCode: 409 }, 409))
    renderRoutes(routes(), '/signup')

    await userEvent.click(screen.getByRole('button', { name: 'Register' }))
    expect(await screen.findByText('Use at least 8 characters')).toBeInTheDocument()
    expect(screen.getByText('Use at least 3 characters')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()

    await userEvent.type(screen.getByLabelText('Email'), 'erin@test.local')
    await userEvent.type(screen.getByLabelText('Password'), 'senha123')
    await userEvent.type(screen.getByLabelText('Username'), 'erin')
    await userEvent.click(screen.getByLabelText('Country'))
    await userEvent.click(screen.getByRole('option', { name: /Brazil/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('This email or username is already in use.')).toBeInTheDocument()
  })

  it('blocks users without the required role', async () => {
    localStorage.setItem(TOKEN_KEY, fakeToken({ username: 'erin', role: 'USER' }))
    renderRoutes(routes(), '/moderation')

    expect(screen.getByRole('heading', { name: 'Restricted area' })).toBeInTheDocument()
  })

  it('ignores expired sessions', () => {
    localStorage.setItem(TOKEN_KEY, fakeToken({ username: 'erin', role: 'USER', exp: 1 }))
    renderRoutes(routes(), '/submit')

    expect(screen.getByRole('heading', { name: 'Login to your account' })).toBeInTheDocument()
  })

  it('shows the user menu and logs out', async () => {
    localStorage.setItem(TOKEN_KEY, fakeToken({ username: 'mod', role: 'MODERATOR' }))
    renderRoutes(routes(), '/moderation')

    expect(screen.getByText('Moderation page')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /mod/ }))
    const menu = screen.getByRole('menu')
    expect(within(menu).getByText('Moderator')).toBeInTheDocument()

    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Log out' }))

    await waitFor(() => expect(screen.getByText('Home page')).toBeInTheDocument())
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('redirects signed in users away from the login page', () => {
    localStorage.setItem(TOKEN_KEY, fakeToken({ username: 'erin', role: 'USER' }))
    renderRoutes(routes(), '/login')

    expect(screen.getByText('Home page')).toBeInTheDocument()
  })
})
