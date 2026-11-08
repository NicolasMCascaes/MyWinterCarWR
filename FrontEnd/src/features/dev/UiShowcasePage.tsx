import {
  ArrowLeft,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  ClockAlert,
  Headphones,
  History,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Medal,
  Timer,
  Trophy,
  Upload,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { PageContainer } from '../../components/layout/PageContainer'
import { Avatar, Button, Card, Chip, EmptyState, Flag, Input, Skeleton, Spinner } from '../../components/ui'
import { CATEGORIES, type Category } from '../categories/categories'

const COLORS: Array<[string, string]> = [
  ['bg', 'Page background'],
  ['surface', 'Cards and panels'],
  ['surface-2', 'Rows and inputs'],
  ['surface-3', 'Dark buttons'],
  ['border', 'Borders'],
  ['primary', 'Header and main actions'],
  ['accent', 'Feature cards, focus'],
  ['brand-text', 'Brand highlight'],
  ['podium', 'Podium blocks'],
  ['gold', '1st place'],
  ['silver', '2nd place'],
  ['bronze', '3rd place'],
  ['success', 'Approve'],
  ['danger', 'Reject'],
  ['chip', 'Category chips'],
  ['muted', 'Secondary text'],
]

const ICONS: Array<[LucideIcon, string]> = [
  [ArrowLeft, 'ArrowLeft'],
  [CircleUser, 'CircleUser'],
  [LogOut, 'LogOut'],
  [Trophy, 'Trophy'],
  [Medal, 'Medal'],
  [ChevronLeft, 'ChevronLeft'],
  [ChevronRight, 'ChevronRight'],
  [LayoutDashboard, 'LayoutDashboard'],
  [ClockAlert, 'ClockAlert'],
  [History, 'History'],
  [Headphones, 'Headphones'],
  [Bell, 'Bell'],
  [Check, 'Check'],
  [X, 'X'],
  [Video, 'Video'],
  [Upload, 'Upload'],
  [Timer, 'Timer'],
  [Loader2, 'Loader2'],
  [Inbox, 'Inbox'],
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b border-border pb-2 font-display text-2xl font-bold">{title}</h2>
      {children}
    </section>
  )
}

export default function UiShowcasePage() {
  const [category, setCategory] = useState<Category>('RALLY')

  return (
    <div>
      <PageContainer className="flex flex-col gap-12">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-5xl font-bold">UI kit</h1>
          <p className="text-muted">
            Base visual for the app: Freeman typography, palette, icons and components.
          </p>
        </header>

        <Section title="Typography">
          <div className="flex flex-col gap-3">
            <p className="font-display text-6xl font-bold">Why My Winter Car WR?</p>
            <p className="font-display text-4xl font-bold">
              Compete with other people on the world to be the ultimate{' '}
              <span className="text-brand-text">My Winter Car</span> player!
            </p>
            <p className="font-display text-2xl font-semibold">
              Please enter the correct information about your run
            </p>
            <p className="text-lg">
              Moderators active every day to analyze your attempt and that of everyone around the world.
            </p>
            <p className="text-sm text-muted">
              (Incorrect information may cause your attempt to be rejected)
            </p>
          </div>
        </Section>

        <Section title="Palette">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {COLORS.map(([token, usage]) => (
              <div key={token} className="flex flex-col gap-2">
                <div
                  className="h-16 rounded-xl border border-white/10"
                  style={{ backgroundColor: `var(--color-${token})` }}
                />
                <p className="font-display font-semibold">{token}</p>
                <p className="text-xs text-muted">{usage}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {CATEGORIES.map((item) => (
              <span key={item.id} className="flex items-center gap-2">
                <span className="size-4 rounded-full" style={{ backgroundColor: item.colorVar }} />
                {item.label}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Icons">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 lg:grid-cols-10">
            {ICONS.map(([Icon, name]) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-xl bg-surface p-3 transition-colors hover:bg-surface-2"
              >
                <Icon className="size-7" aria-hidden />
                <span className="text-xs text-muted">{name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="size-8 text-gold" aria-hidden />
            <Trophy className="size-8 text-silver" aria-hidden />
            <Trophy className="size-8 text-bronze" aria-hidden />
            <Flag code="BR" className="text-2xl" />
            <Flag code="PT" className="text-2xl" />
            <Flag code="FI" className="text-2xl" />
            <Flag code="US" className="text-2xl" />
            <Flag code={null} />
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="dark" size="lg">
              Compete now!
            </Button>
            <Button variant="dark" size="lg" rightIcon={<Trophy className="size-7 text-gold" aria-hidden />}>
              Leaderboard
            </Button>
            <Button variant="light" rightIcon={<ChevronRight className="size-5" aria-hidden />}>
              Next
            </Button>
            <Button variant="danger" leftIcon={<X className="size-5" aria-hidden />}>
              Reprove
            </Button>
            <Button variant="success" leftIcon={<Check className="size-5" aria-hidden />}>
              Approve
            </Button>
            <Button variant="ghost">Ghost</Button>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Category chips">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((item) => (
              <Chip
                key={item.id}
                selected={category === item.id}
                dotColor={item.colorVar}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </Chip>
            ))}
          </div>
        </Section>

        <Section title="Cards">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((item) => (
              <Card key={item.id} interactive tone="light" padded={false} className="overflow-hidden">
                <img src={item.image} alt="" className="h-44 w-full object-cover object-top" />
                <div className="flex flex-col gap-1 p-4">
                  <p className="font-display text-2xl font-bold">{item.label}</p>
                  <p className="text-sm">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card interactive tone="accent" className="text-center">
              <p className="font-display text-3xl font-bold">Active moderators!</p>
              <p className="mt-4 text-lg">Moderators active every day to analyze your attempt.</p>
            </Card>
            <Card>
              <p className="font-display text-2xl font-bold">Run Information</p>
              <p className="mt-3">Player: Nicolas</p>
              <p>Attempt time: 00:06:54.14</p>
            </Card>
            <Card className="flex flex-col gap-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Spinner />
            </Card>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input
              label="Attempt time"
              placeholder="00:06:54.14"
              icon={<Timer className="size-5" aria-hidden />}
            />
            <Input
              label="Video link"
              placeholder="https://youtu.be/..."
              error="Video link must be a YouTube or Twitch URL"
            />
            <Input label="Username" hint="This is how you will appear on the leaderboard" />
          </div>
        </Section>

        <Section title="Avatars, states and toasts">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name="Nicolas" size="lg" ringColor="var(--color-gold)" />
            <Avatar name="Pedro" ringColor="var(--color-silver)" />
            <Avatar name="Joao" ringColor="var(--color-bronze)" />
            <Avatar name="Erin" size="sm" />
            <Button
              variant="dark"
              onClick={() => toast.success('Run submitted! A moderator will review it soon.')}
            >
              Success toast
            </Button>
            <Button variant="dark" onClick={() => toast.error('You already have a pending attempt.')}>
              Error toast
            </Button>
          </div>
          <EmptyState
            title="No runs yet"
            description="Be the first to set a record in this category!"
            action={<Button variant="accent">Submit a run</Button>}
          />
        </Section>
      </PageContainer>
    </div>
  )
}
