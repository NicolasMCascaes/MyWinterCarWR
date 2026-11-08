import { PageContainer } from '../../components/layout/PageContainer'
import { useWorldRecords } from '../leaderboard/api'
import { CategoryCard } from './CategoryCard'

export function CategorySelectPage() {
  const records = useWorldRecords()

  return (
    <PageContainer className="flex flex-col gap-12 py-12">
      <h1 className="max-w-4xl animate-rise font-display text-5xl leading-tight sm:text-7xl">
        Select the category that you want to compete
      </h1>
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {records.map(({ category, record }, index) => (
          <li key={category.id} className="animate-rise" style={{ animationDelay: `${index * 80}ms` }}>
            <CategoryCard category={category} record={record} />
          </li>
        ))}
      </ul>
    </PageContainer>
  )
}
