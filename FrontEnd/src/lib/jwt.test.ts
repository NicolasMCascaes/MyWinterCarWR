import { decodeToken, hasAnyRole, isExpired } from './jwt'

function encode(value: object): string {
  const binary = String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function token(claims: object): string {
  return `${encode({ alg: 'HS256' })}.${encode(claims)}.signature`
}

const claims = {
  id: '30822147-f1ca-4639-aa08-3535fcb325e5',
  email: 'joao@test.local',
  username: 'João',
  role: 'MODERATOR',
  exp: 1_900_000_000,
}

describe('decodeToken', () => {
  it('reads the claims issued by the backend, including non-ascii usernames', () => {
    expect(decodeToken(token(claims))).toEqual({
      id: claims.id,
      email: claims.email,
      username: 'João',
      role: 'MODERATOR',
      expiresAt: 1_900_000_000_000,
    })
  })

  it('returns null for malformed tokens or missing claims', () => {
    expect(decodeToken('not-a-token')).toBeNull()
    expect(decodeToken('a.%%%.c')).toBeNull()
    expect(decodeToken(token({ username: 'x' }))).toBeNull()
  })
})

describe('isExpired', () => {
  it('compares the expiry with the current time', () => {
    const user = decodeToken(token(claims))
    expect(user).not.toBeNull()
    expect(isExpired(user!, 1_800_000_000_000)).toBe(false)
    expect(isExpired(user!, 1_900_000_000_001)).toBe(true)
  })
})

describe('hasAnyRole', () => {
  it('matches the exact roles accepted by the backend', () => {
    const moderator = decodeToken(token(claims))
    expect(hasAnyRole(moderator, ['MODERATOR'])).toBe(true)
    expect(hasAnyRole(moderator, ['USER'])).toBe(false)
    expect(hasAnyRole(null, ['USER'])).toBe(false)
  })
})
