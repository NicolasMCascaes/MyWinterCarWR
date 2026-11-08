import { Outlet } from 'react-router-dom'
import { Header, type NavItem } from '../../components/layout/Header'

const PUBLIC_NAV: NavItem[] = [
  { to: '/categories', label: 'Compete now!' },
  { to: '/login', label: 'Login' },
]

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header nav={PUBLIC_NAV} />
      <Outlet />
    </div>
  )
}
