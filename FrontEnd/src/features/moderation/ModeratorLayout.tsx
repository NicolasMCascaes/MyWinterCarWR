import { ArrowLeft, ClockAlert, History, LayoutDashboard, type LucideIcon } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { cn } from '../../lib/cn'
import { UserMenu } from '../auth/UserMenu'
import { usePendingAttempts } from './api'

interface SidebarItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  soon?: boolean
}

const ITEMS: SidebarItem[] = [
  { to: '/moderation/dashboard', label: 'Dashboard', icon: LayoutDashboard, soon: true },
  { to: '/moderation/queue', label: 'Verification Queue', icon: ClockAlert },
  { to: '/moderation/history', label: 'Review History', icon: History },
]

function PendingCount() {
  const { data } = usePendingAttempts()
  if (!data?.length) {
    return null
  }
  return (
    <span
      aria-label={`${data.length} pending`}
      className="ml-auto rounded-full bg-gold px-2 py-0.5 font-display text-xs text-bg"
    >
      {data.length}
    </span>
  )
}

function SidebarLink({ item }: { item: SidebarItem }) {
  const Icon = item.icon
  const content = (
    <>
      <Icon className="size-6 shrink-0" aria-hidden />
      <span className="whitespace-nowrap">{item.label}</span>
      {item.soon && (
        <span className="ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-xs text-muted">Soon</span>
      )}
      {item.to === '/moderation/queue' && <PendingCount />}
    </>
  )
  const base = 'flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-lg transition-colors'

  if (item.soon) {
    return (
      <span aria-disabled="true" className={cn(base, 'cursor-not-allowed text-muted/60')}>
        {content}
      </span>
    )
  }
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(base, isActive ? 'bg-surface-3 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white')
      }
    >
      {content}
    </NavLink>
  )
}

export function ModeratorLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-deep md:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 bg-sidebar px-4 py-4 md:sticky md:top-0 md:h-dvh md:w-64 md:py-8">
        <Link to="/" className="group flex items-center gap-3 px-2">
          <img
            src={logo}
            alt=""
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"
          />
          <span className="font-display text-lg text-muted transition-colors group-hover:text-white">
            Moderation
          </span>
        </Link>
        <nav aria-label="Moderation" className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {ITEMS.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </nav>
        <div className="mt-auto hidden flex-col gap-2 border-t border-border pt-4 md:flex">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden /> Back to site
          </Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-end px-4 pt-4 sm:px-8">
          <UserMenu />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
