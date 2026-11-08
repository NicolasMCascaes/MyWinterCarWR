import { CATEGORIES, categoryFromSlug, leaderboardPath } from './categories'

describe('categories', () => {
  it('resolves every slug back to its category', () => {
    for (const category of CATEGORIES) {
      expect(categoryFromSlug(category.slug)).toBe(category)
      expect(leaderboardPath(category)).toBe(`/leaderboard/${category.slug}`)
    }
  })

  it('falls back to Rally without a slug and rejects unknown slugs', () => {
    expect(categoryFromSlug(undefined)?.id).toBe('RALLY')
    expect(categoryFromSlug('rally-race')).toBeNull()
  })
})
