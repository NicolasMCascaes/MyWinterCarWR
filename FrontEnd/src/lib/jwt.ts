export type Role = 'USER' | 'MODERATOR' | 'ADMIN'

export interface SessionUser {
  id: string
  email: string
  username: string
  role: Role
  expiresAt: number
}

interface TokenClaims {
  id?: string
  email?: string
  username?: string
  role?: Role
  exp?: number
}

function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function decodeToken(token: string): SessionUser | null {
  const payload = token.split('.')[1]
  if (!payload) {
    return null
  }
  try {
    const claims = JSON.parse(decodeBase64Url(payload)) as TokenClaims
    if (!claims.id || !claims.username || !claims.role || !claims.exp) {
      return null
    }
    return {
      id: claims.id,
      email: claims.email ?? '',
      username: claims.username,
      role: claims.role,
      expiresAt: claims.exp * 1000,
    }
  } catch {
    return null
  }
}

export function isExpired(user: SessionUser, now: number = Date.now()): boolean {
  return user.expiresAt <= now
}

export function hasAnyRole(user: SessionUser | null, roles: readonly Role[]): boolean {
  return user !== null && roles.includes(user.role)
}
