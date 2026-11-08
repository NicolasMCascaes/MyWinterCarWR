import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { hasAnyRole, type Role } from '../../lib/jwt'
import { ForbiddenPage } from '../errors/ForbiddenPage'
import type { RedirectState } from './redirect'
import { useAuth } from './useAuth'

interface RequireAuthProps {
  roles?: readonly Role[]
  children: ReactNode
}

export function RequireAuth({ roles, children }: RequireAuthProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    const state: RedirectState = { from: { pathname: location.pathname, search: location.search } }
    return <Navigate to="/login" replace state={state} />
  }

  if (roles && !hasAnyRole(user, roles)) {
    return <ForbiddenPage />
  }

  return children
}
