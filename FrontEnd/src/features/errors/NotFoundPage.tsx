import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <PageContainer className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <p className="animate-rise font-display text-8xl font-bold text-accent">404</p>
      <h1 className="font-display text-3xl font-bold">You drove off the map</h1>
      <p className="max-w-md text-muted">This page does not exist, or it is still being built.</p>
      <Button
        variant="dark"
        leftIcon={<ArrowLeft className="size-5" aria-hidden />}
        onClick={() => navigate('/')}
      >
        Back to home
      </Button>
    </PageContainer>
  )
}
