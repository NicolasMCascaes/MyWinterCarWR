import { lazy, Suspense } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { Spinner } from '../components/ui'
import { NotFoundPage } from '../features/errors/NotFoundPage'
import { LoginPage } from '../features/auth/LoginPage'
import { RequireAuth } from '../features/auth/RequireAuth'
import { SignupPage } from '../features/auth/SignupPage'
import { SubmitRunPage } from '../features/submit/SubmitRunPage'
import { CategorySelectPage } from '../features/categories/CategorySelectPage'
import { LandingPage } from '../features/landing/LandingPage'
import { LeaderboardPage } from '../features/leaderboard/LeaderboardPage'
import { PublicLayout } from './layouts/PublicLayout'

const UiShowcasePage = lazy(() => import('../features/dev/UiShowcasePage'))

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: '/ui',
        element: (
          <Suspense fallback={<Spinner className="m-8" />}>
            <UiShowcasePage />
          </Suspense>
        ),
      },
    ]
  : []

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/categories', element: <CategorySelectPage /> },
      { path: '/leaderboard/:category?', element: <LeaderboardPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      {
        path: '/submit/:category?',
        element: (
          <RequireAuth roles={['USER', 'MODERATOR']}>
            <SubmitRunPage />
          </RequireAuth>
        ),
      },
      ...devRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
