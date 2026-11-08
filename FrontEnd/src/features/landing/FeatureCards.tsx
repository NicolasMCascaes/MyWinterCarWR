import { Gauge, Save, ShieldCheck, type LucideIcon } from 'lucide-react'
import { Card } from '../../components/ui'

const FEATURES: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: 'Choose your category!',
    description:
      'Have the freedom to choose which category you want to compete in (Rally, Ice Race, Assembly Car, etc.)',
    icon: Gauge,
  },
  {
    title: 'Active moderators!',
    description: 'Moderators active every day to analyze your attempt and that of everyone around the world',
    icon: ShieldCheck,
  },
  {
    title: 'Predefined save games',
    description: "Don't waste your time! Use our save games to try to beat the world record",
    icon: Save,
  },
]

export function FeatureCards() {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {FEATURES.map(({ title, description, icon: Icon }, index) => (
        <li key={title} className="animate-rise" style={{ animationDelay: `${index * 100}ms` }}>
          <Card
            tone="accent"
            interactive
            className="group flex h-full flex-col items-center gap-4 text-center"
          >
            <Icon
              className="size-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              aria-hidden
            />
            <h3 className="font-display text-3xl">{title}</h3>
            <p className="text-lg leading-snug text-white/90">{description}</p>
          </Card>
        </li>
      ))}
    </ul>
  )
}
