import { useNavigate } from 'react-router-dom'
import { Chip } from '../../components/ui'
import { CATEGORIES, leaderboardPath, type CategoryInfo } from '../categories/categories'

export function CategoryTabs({ current }: { current: CategoryInfo }) {
  const navigate = useNavigate()

  return (
    <div role="group" aria-label="Categories" className="flex flex-wrap gap-3">
      {CATEGORIES.map((category) => (
        <Chip
          key={category.id}
          selected={category.id === current.id}
          dotColor={category.colorVar}
          onClick={() => navigate(leaderboardPath(category))}
        >
          {category.label}
        </Chip>
      ))}
    </div>
  )
}
