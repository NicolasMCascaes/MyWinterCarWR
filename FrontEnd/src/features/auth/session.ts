import { decodeToken, isExpired, type SessionUser } from '../../lib/jwt'

const TOKEN_KEY = 'mwc.token'

export interface Session {
  token: string
  user: SessionUser
}

export function sessionFromToken(token: string): Session | null {
  const user = decodeToken(token)
  if (!user || isExpired(user)) {
    return null
  }
  return { token, user }
}

export function loadSession(): Session | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    return token ? sessionFromToken(token) : null
  } catch {
    return null
  }
}

export function saveToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    return
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    return
  }
}
