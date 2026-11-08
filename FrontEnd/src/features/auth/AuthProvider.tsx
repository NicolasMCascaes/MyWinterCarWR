import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { configureHttp } from '../../lib/http'
import { AuthContext, type AuthContextValue } from './authContext'
import { clearToken, loadSession, saveToken, sessionFromToken, type Session } from './session'

const MAX_TIMEOUT = 2_147_483_647

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(loadSession)

  const signOut = useCallback(() => {
    clearToken()
    setSession(null)
    queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'leaderboard' })
  }, [queryClient])

  const signIn = useCallback((token: string) => {
    const next = sessionFromToken(token)
    if (!next) {
      throw new Error('Received an invalid session token')
    }
    saveToken(token)
    setSession(next)
    return next.user
  }, [])

  useEffect(() => {
    configureHttp({
      getToken: () => loadSession()?.token ?? null,
      onUnauthorized: () => {
        signOut()
        toast.error('Your session has expired. Please log in again.')
      },
    })
  }, [signOut])

  useEffect(() => {
    if (!session) {
      return
    }
    const remaining = Math.min(session.user.expiresAt - Date.now(), MAX_TIMEOUT)
    const timer = window.setTimeout(() => {
      signOut()
      toast.info('Your session has ended. Please log in again.')
    }, remaining)
    return () => window.clearTimeout(timer)
  }, [session, signOut])

  const value = useMemo<AuthContextValue>(
    () => ({ user: session?.user ?? null, signIn, signOut }),
    [session, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
