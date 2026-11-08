import deathImage from '../../assets/categories/death.webp'
import fullAssemblyImage from '../../assets/categories/full-assembly.png'
import iceRaceImage from '../../assets/categories/ice-race.png'
import rallyImage from '../../assets/categories/rally.png'

export type Category = 'RALLY' | 'DEATH' | 'ICE_RACE' | 'FULL_ASSEMBLY'

export interface CategoryInfo {
  id: Category
  slug: string
  label: string
  description: string
  image: string
  colorVar: string
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'RALLY',
    slug: 'rally',
    label: 'Rally',
    description: 'Show your strength by beating the times of other competitors in the world.',
    image: rallyImage,
    colorVar: 'var(--color-cat-rally)',
  },
  {
    id: 'ICE_RACE',
    slug: 'ice-race',
    label: 'Ice Race',
    description: 'Keep it on the track and beat the times of other competitors on the ice.',
    image: iceRaceImage,
    colorVar: 'var(--color-cat-ice-race)',
  },
  {
    id: 'FULL_ASSEMBLY',
    slug: 'full-assembly',
    label: 'Full Assembly',
    description: 'Assemble every Rivett part as fast as you can, starting from zero to hero!',
    image: fullAssemblyImage,
    colorVar: 'var(--color-cat-full-assembly)',
  },
  {
    id: 'DEATH',
    slug: 'death',
    label: 'Death',
    description: 'Make the front page of the newspaper as fast as you can.',
    image: deathImage,
    colorVar: 'var(--color-cat-death)',
  },
]

const BY_ID = new Map(CATEGORIES.map((category) => [category.id, category]))

export function categoryInfo(id: Category): CategoryInfo {
  const info = BY_ID.get(id)
  if (!info) {
    throw new Error(`Unknown category: ${id}`)
  }
  return info
}

export function isCategory(value: string | null | undefined): value is Category {
  return value !== null && value !== undefined && BY_ID.has(value as Category)
}

const BY_SLUG = new Map(CATEGORIES.map((category) => [category.slug, category]))

export const DEFAULT_CATEGORY: CategoryInfo = CATEGORIES[0]

export function categoryFromSlug(slug: string | undefined): CategoryInfo | null {
  if (slug === undefined) {
    return DEFAULT_CATEGORY
  }
  return BY_SLUG.get(slug) ?? null
}

export function categoryBySlug(slug: string | undefined): CategoryInfo | null {
  return slug === undefined ? null : (BY_SLUG.get(slug) ?? null)
}

export function submitPath(category?: CategoryInfo): string {
  return category ? `/submit/${category.slug}` : '/submit'
}

export function leaderboardPath(category: CategoryInfo): string {
  return `/leaderboard/${category.slug}`
}
