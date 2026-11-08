import { Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui'
import { WorldRecordsStrip } from '../leaderboard/WorldRecordsStrip'
import { FeatureCards } from './FeatureCards'
import { Hero } from './Hero'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <>
      <Hero />
      <PageContainer className="flex flex-col gap-20 py-16">
        <section aria-labelledby="why" className="flex flex-col gap-10">
          <h2 id="why" className="text-center font-display text-5xl sm:text-6xl">
            Why My Winter Car WR?
          </h2>
          <FeatureCards />
        </section>

        <section aria-labelledby="records" className="flex flex-col gap-6">
          <h2 id="records" className="text-center font-display text-4xl">
            Current world records
          </h2>
          <WorldRecordsStrip />
        </section>

        <section className="flex flex-col items-center gap-4">
          <Button variant="dark" size="lg" className="min-w-72" onClick={() => navigate('/categories')}>
            Compete now!
          </Button>
          <span className="font-display text-xl text-muted">Or</span>
          <Button
            variant="dark"
            size="lg"
            className="min-w-72"
            rightIcon={<Trophy className="size-7 text-gold" aria-hidden />}
            onClick={() => navigate('/leaderboard')}
          >
            Leaderboard
          </Button>
        </section>
      </PageContainer>
    </>
  )
}
