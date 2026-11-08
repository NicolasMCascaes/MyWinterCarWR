import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { cn } from '../../lib/cn'

export interface NavItem {
  to: string
  label: string
}

interface HeaderProps {
  nav?: NavItem[]
  center?: ReactNode
  right?: ReactNode
}

export function Header({ nav = [], center, right }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-primary shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="hidden font-display text-2xl font-bold text-bg transition-colors group-hover:text-white sm:inline">
            My Winter Car WR
          </span>
          <img
            src={logo}
            alt=""
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"
          />
        </Link>
        {center}
        <nav className="flex items-center gap-4 sm:gap-6">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative font-display text-base font-semibold whitespace-nowrap text-white/90 transition-colors hover:text-white sm:text-xl',
                  'after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform hover:after:scale-x-100',
                  isActive && 'text-white after:scale-x-100',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {right}
        </nav>
      </div>
    </header>
  )
}
