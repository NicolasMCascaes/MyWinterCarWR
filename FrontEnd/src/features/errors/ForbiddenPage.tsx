import { ArrowLeft, ShieldX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui'

export function ForbiddenPage() {
  const navigate = useNavigate()
  return (
    <PageContainer className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <ShieldX className="size-20 animate-rise text-danger" aria-hidden />
      <h1 className="font-display text-3xl">Restricted area</h1>
      <p className="max-w-md text-muted">Your account does not have access to this page.</p>
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
