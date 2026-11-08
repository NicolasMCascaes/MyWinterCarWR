import { lazy, Suspense } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { Spinner } from '../components/ui'
import { NotFoundPage } from '../features/errors/NotFoundPage'
import { HomePlaceholderPage } from '../features/landing/HomePlaceholderPage'
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
      { path: '/', element: <HomePlaceholderPage /> },
      ...devRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
