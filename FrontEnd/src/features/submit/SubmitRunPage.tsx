import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ChevronLeft, ChevronRight, CircleCheck, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button, Spinner } from '../../components/ui'
import {
  categoryBySlug,
  categoryInfo,
  DEFAULT_CATEGORY,
  isCategory,
  leaderboardPath,
  type CategoryInfo,
} from '../categories/categories'
import { useAuth } from '../auth/useAuth'
import { submitErrorMessage, useMyAttempts, useSubmitAttempt } from './api'
import { PendingAttemptNotice } from './PendingAttemptNotice'
import { STEP_FIELDS, submitRunSchema, type SubmitRunForm } from './schema'
import { CategoryStep, DescriptionStep, ReviewStep, RunStep } from './steps'
import { WizardProgress } from './WizardProgress'

const STEPS = ['Category', 'Run', 'Description', 'Review'] as const
const LAST_STEP = STEPS.length - 1

export function SubmitRunPage() {
  const myAttempts = useMyAttempts()
  const [submittedCategory, setSubmittedCategory] = useState<CategoryInfo | null>(null)

  if (submittedCategory) {
    return <SubmitSuccess category={submittedCategory} />
  }
  if (myAttempts.isPending) {
    return <Spinner className="m-auto" />
  }
  const pendingAttempt = myAttempts.data?.find((attempt) => attempt.attemptStatus === 'PENDING')
  if (pendingAttempt) {
    return <PendingAttemptNotice attempt={pendingAttempt} />
  }
  return <SubmitRunWizard onSubmitted={setSubmittedCategory} />
}

function SubmitRunWizard({ onSubmitted }: { onSubmitted: (category: CategoryInfo) => void }) {
  const { category: slug } = useParams()
  const preset = categoryBySlug(slug)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(preset ? 1 : 0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const submitMutation = useSubmitAttempt()

  const form = useForm<SubmitRunForm>({
    resolver: zodResolver(submitRunSchema),
    mode: 'onTouched',
    defaultValues: { category: preset?.id ?? '', videoLink: '', time: '', description: '' },
  })
  const selectedCategory = useWatch({ control: form.control, name: 'category' })
  const backTarget = leaderboardPath(
    isCategory(selectedCategory) ? categoryInfo(selectedCategory) : DEFAULT_CATEGORY,
  )

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const goToStep = (target: number) => {
    submitMutation.reset()
    setStep(target)
  }

  const goNext = async () => {
    if (await form.trigger(STEP_FIELDS[step])) {
      goToStep(step + 1)
    }
  }

  const goBack = () => (step === 0 ? navigate(backTarget) : goToStep(step - 1))

  const submit = form.handleSubmit((values) => {
    if (!isCategory(values.category)) {
      return
    }
    const category = values.category
    submitMutation.mutate(
      { ...values, category },
      {
        onSuccess: () => {
          toast.success('Run submitted for review!')
          onSubmitted(categoryInfo(category))
        },
      },
    )
  })

  return (
    <PageContainer className="flex flex-col gap-4">
      <Link
        to={backTarget}
        className="inline-flex items-center gap-2 self-start font-display text-lg text-muted transition-colors hover:text-white"
      >
        <ArrowLeft className="size-5" aria-hidden /> Back to leaderboard
      </Link>

      <FormProvider {...form}>
        <form
          noValidate
          onSubmit={(event) => {
            if (step < LAST_STEP) {
              event.preventDefault()
              void goNext()
              return
            }
            void submit(event)
          }}
          className="animate-rise rounded-3xl border border-border bg-gradient-to-b from-surface to-bg-deep shadow-2xl"
        >
          <header className="flex flex-col gap-6 border-b border-white/20 px-6 pt-8 pb-6 sm:px-12">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="font-display text-5xl sm:text-6xl">Submit run</h1>
                <p className="font-display text-xl sm:text-2xl">
                  Please enter the correct information about your run
                </p>
                <p className="text-sm text-muted">
                  (Incorrect information may cause your attempt to be rejected)
                </p>
              </div>
              <button
                type="button"
                onClick={goBack}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 font-display text-xl transition-colors hover:bg-white/10"
              >
                <ChevronLeft className="size-5" aria-hidden /> Back
              </button>
            </div>
            <WizardProgress steps={STEPS} current={step} />
          </header>

          <section className="flex min-h-80 flex-col gap-8 px-6 py-8 sm:px-12">
            <h2 ref={headingRef} tabIndex={-1} className="sr-only">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </h2>
            <div key={step} className="flex-1 animate-fade-in">
              {step === 0 && <CategoryStep />}
              {step === 1 && <RunStep />}
              {step === 2 && <DescriptionStep />}
              {step === 3 && <ReviewStep username={user?.username ?? ''} onEdit={goToStep} />}
            </div>

            {submitMutation.isError && (
              <p role="alert" className="rounded-xl bg-danger/15 px-4 py-3 text-center text-danger">
                {submitErrorMessage(submitMutation.error)}
              </p>
            )}

            <div className="flex justify-end">
              {step < LAST_STEP ? (
                <Button
                  type="submit"
                  variant="light"
                  size="lg"
                  rightIcon={<ChevronRight className="size-5" aria-hidden />}
                  className="min-w-40 rounded-2xl"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="light"
                  size="lg"
                  loading={submitMutation.isPending}
                  rightIcon={<Send className="size-5" aria-hidden />}
                  className="mx-auto min-w-56 rounded-full"
                >
                  Submit!
                </Button>
              )}
            </div>
          </section>
        </form>
      </FormProvider>
    </PageContainer>
  )
}

function SubmitSuccess({ category }: { category: CategoryInfo }) {
  return (
    <PageContainer className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
      <CircleCheck className="size-20 animate-rise text-success" aria-hidden />
      <h1 className="font-display text-4xl sm:text-5xl">Run submitted!</h1>
      <p className="max-w-lg text-lg text-muted">
        Your {category.label} run is waiting for a moderator. Once it is approved it will show up on the
        leaderboard.
      </p>
      <Link
        to={leaderboardPath(category)}
        className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-display text-lg transition-colors hover:bg-primary-hover"
      >
        <ArrowLeft className="size-5" aria-hidden /> Back to leaderboard
      </Link>
    </PageContainer>
  )
}
