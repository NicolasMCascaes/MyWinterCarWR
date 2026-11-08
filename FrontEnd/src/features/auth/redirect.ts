import type { Location } from 'react-router-dom'

export interface RedirectState {
  from?: Pick<Location, 'pathname' | 'search'>
}

export function redirectTarget(state: unknown): string {
  const from = (state as RedirectState | null)?.from
  if (!from || from.pathname === '/login' || from.pathname === '/signup') {
    return '/'
  }
  return `${from.pathname}${from.search ?? ''}`
}
