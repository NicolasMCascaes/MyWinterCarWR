import { ChevronDown, LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Avatar } from '../../components/ui'
import { cn } from '../../lib/cn'
import type { Role } from '../../lib/jwt'
import { useAuth } from './useAuth'

const ROLE_LABEL: Record<Role, string> = { USER: 'Player', MODERATOR: 'Moderator', ADMIN: 'Admin' }

export function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (
        event instanceof KeyboardEvent
          ? event.key === 'Escape'
          : !containerRef.current?.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    setOpen(false)
    await navigate('/')
    signOut()
    toast.success('You have been logged out.')
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-white/15"
      >
        <Avatar name={user.username} size="sm" />
        <span className="hidden max-w-32 truncate font-display text-xl sm:inline">{user.username}</span>
        <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 animate-fade-in overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-2xl"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate font-display text-lg">{user.username}</p>
            <p className="truncate text-sm text-muted">{user.email}</p>
            <span className="mt-2 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
              {ROLE_LABEL[user.role]}
            </span>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-surface-2"
          >
            <LogOut className="size-4" aria-hidden />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
