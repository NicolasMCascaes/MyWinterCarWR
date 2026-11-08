import { createContext } from 'react'
import type { SessionUser } from '../../lib/jwt'

export interface AuthContextValue {
  user: SessionUser | null
  signIn: (token: string) => SessionUser
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
