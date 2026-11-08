import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import { AuthProvider } from '../features/auth/AuthProvider'

interface RenderRouteOptions {
  path: string
  url: string
  extraRoutes?: RouteObject[]
}

export function renderRoute(element: ReactElement, { path, url, extraRoutes = [] }: RenderRouteOptions) {
  return renderRoutes([{ path, element }, ...extraRoutes], url)
}

export function renderRoutes(routes: RouteObject[], url: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const router = createMemoryRouter(routes, { initialEntries: [url] })
  const result = render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )
  return { ...result, router }
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

function base64Url(value: object): string {
  const binary = String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function fakeToken(claims: {
  username: string
  role: string
  id?: string
  exp?: number
  email?: string
}): string {
  const payload = {
    id: `${claims.username}-id`,
    email: claims.email ?? `${claims.username}@test.local`,
    exp: claims.exp ?? Math.floor(Date.now() / 1000) + 3600,
    ...claims,
  }
  return `${base64Url({ alg: 'HS256' })}.${base64Url(payload)}.signature`
}
