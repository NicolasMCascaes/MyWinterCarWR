import { Outlet } from 'react-router-dom'
import { Header, type NavItem } from '../../components/layout/Header'
import { SkipLink } from '../../components/layout/SkipLink'
import { UserMenu } from '../../features/auth/UserMenu'
import { useAuth } from '../../features/auth/useAuth'

const BASE_NAV: NavItem[] = [
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/categories', label: 'Compete now!' },
]

const GUEST_NAV: NavItem[] = [...BASE_NAV, { to: '/login', label: 'Login' }]

const MODERATOR_NAV: NavItem[] = [...BASE_NAV, { to: '/moderation', label: 'Moderation' }]

export function PublicLayout() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <Header
        nav={!user ? GUEST_NAV : user.role === 'MODERATOR' ? MODERATOR_NAV : BASE_NAV}
        right={user && <UserMenu />}
      />
      <Outlet />
    </div>
  )
}
