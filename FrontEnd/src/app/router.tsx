import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { Spinner } from '../components/ui'
import { NotFoundPage } from '../features/errors/NotFoundPage'
import { RequireAuth } from '../features/auth/RequireAuth'
import { CategorySelectPage } from '../features/categories/CategorySelectPage'
import { LandingPage } from '../features/landing/LandingPage'
import { LeaderboardPage } from '../features/leaderboard/LeaderboardPage'
import { PublicLayout } from './layouts/PublicLayout'

function RouteFallback() {
  return <Spinner className="m-auto min-h-dvh" />
}

const UiShowcasePage = lazy(() => import('../features/dev/UiShowcasePage'))
const SubmitRunPage = lazy(() =>
  import('../features/submit/SubmitRunPage').then((module) => ({ default: module.SubmitRunPage })),
)
const ModeratorLayout = lazy(() =>
  import('../features/moderation/ModeratorLayout').then((module) => ({ default: module.ModeratorLayout })),
)

const moderationRoutes: RouteObject = {
  path: '/moderation',
  hydrateFallbackElement: <RouteFallback />,
  element: (
    <RequireAuth roles={['MODERATOR']}>
      <Suspense fallback={<Spinner className="m-auto min-h-dvh" />}>
        <ModeratorLayout />
      </Suspense>
    </RequireAuth>
  ),
  children: [
    { index: true, element: <Navigate to="/moderation/dashboard" replace /> },
    {
      path: 'dashboard',
      lazy: () =>
        import('../features/dashboard/DashboardPage').then((module) => ({ Component: module.DashboardPage })),
    },
    {
      path: 'queue',
      lazy: () =>
        import('../features/moderation/QueuePage').then((module) => ({ Component: module.QueuePage })),
    },
    {
      path: 'history',
      lazy: () =>
        import('../features/moderation/HistoryPage').then((module) => ({ Component: module.HistoryPage })),
    },
    {
      path: 'attempts/:id',
      lazy: () =>
        import('../features/moderation/VerificationPage').then((module) => ({
          Component: module.VerificationPage,
        })),
    },
  ],
}

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
  moderationRoutes,
  {
    element: <PublicLayout />,
    hydrateFallbackElement: <RouteFallback />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/categories', element: <CategorySelectPage /> },
      { path: '/leaderboard/:category?', element: <LeaderboardPage /> },
      {
        path: '/login',
        lazy: () => import('../features/auth/LoginPage').then((module) => ({ Component: module.LoginPage })),
      },
      {
        path: '/signup',
        lazy: () =>
          import('../features/auth/SignupPage').then((module) => ({ Component: module.SignupPage })),
      },
      {
        path: '/submit/:category?',
        element: (
          <RequireAuth roles={['USER', 'MODERATOR']}>
            <Suspense fallback={<Spinner className="m-auto" />}>
              <SubmitRunPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      ...devRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
