import { Link } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'

export function HomePlaceholderPage() {
  return (
    <PageContainer className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="animate-rise font-display text-5xl font-bold">
        <span className="text-brand-text">My Winter Car</span> WR
      </h1>
      <p className="text-muted">The landing page arrives in Sprint 1.</p>
      {import.meta.env.DEV && (
        <Link to="/ui" className="font-display text-lg text-accent underline-offset-4 hover:underline">
          Open the UI kit
        </Link>
      )}
    </PageContainer>
  )
}
