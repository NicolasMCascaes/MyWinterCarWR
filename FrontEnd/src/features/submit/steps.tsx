import { Link2, Pencil, Timer, Video } from 'lucide-react'
import type { ReactNode } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Chip, Input, Textarea, VideoEmbed } from '../../components/ui'
import { formatRunTime, maskRunTime } from '../../lib/time'
import { isAllowedVideoLink } from '../../lib/video'
import { CATEGORIES, categoryInfo, isCategory } from '../categories/categories'
import { DESCRIPTION_MAX, type SubmitRunForm } from './schema'

function StepTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="max-w-xl font-display text-2xl leading-snug sm:text-3xl">
      {children}
    </h2>
  )
}

export function CategoryStep() {
  const { control } = useFormContext<SubmitRunForm>()

  return (
    <Controller
      control={control}
      name="category"
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-6">
          <StepTitle id="category-step">In which category do you want to register your attempt?</StepTitle>
          <div role="radiogroup" aria-labelledby="category-step" className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => {
              const selected = field.value === category.id
              return (
                <Chip
                  key={category.id}
                  role="radio"
                  aria-checked={selected}
                  aria-pressed={undefined}
                  selected={selected}
                  dotColor={category.colorVar}
                  onClick={() => field.onChange(category.id)}
                >
                  {category.label}
                </Chip>
              )
            })}
          </div>
          {fieldState.error && (
            <p role="alert" className="text-sm text-danger">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  )
}

function VideoPreview({ link }: { link: string }) {
  if (!isAllowedVideoLink(link)) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center text-muted">
        <Video className="size-10" aria-hidden />
        <p className="px-6">Paste a YouTube or Twitch link to preview your run here</p>
      </div>
    )
  }
  return <VideoEmbed link={link} title="Preview of your run" />
}

export function RunStep() {
  const { register, control, formState } = useFormContext<SubmitRunForm>()
  const videoLink = useWatch({ control, name: 'videoLink' })

  return (
    <div className="flex flex-col gap-6">
      <StepTitle id="run-step">Place the video link and time of your run below</StepTitle>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Input
            label="Video url"
            type="url"
            inputMode="url"
            placeholder="https://www.youtube.com/watch?v=..."
            icon={<Link2 className="size-5" aria-hidden />}
            error={formState.errors.videoLink?.message}
            hint="YouTube or Twitch only"
            {...register('videoLink')}
          />
          <Controller
            control={control}
            name="time"
            render={({ field, fieldState }) => (
              <Input
                label="Time"
                inputMode="numeric"
                placeholder="00:00:00.00"
                autoComplete="off"
                icon={<Timer className="size-5" aria-hidden />}
                hint="Hours, minutes, seconds and hundredths"
                error={fieldState.error?.message}
                className="font-display text-xl tracking-wider"
                ref={field.ref}
                name={field.name}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(maskRunTime(event.target.value))}
              />
            )}
          />
        </div>
        <VideoPreview link={videoLink} />
      </div>
    </div>
  )
}

export function DescriptionStep() {
  const { register, control, formState } = useFormContext<SubmitRunForm>()
  const description = useWatch({ control, name: 'description' })

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <StepTitle id="description-step">
        Place the description of your run below <span className="text-muted">(Optional)</span>
      </StepTitle>
      <Textarea
        label="Description"
        maxLength={DESCRIPTION_MAX}
        placeholder="Car setup, route, anything the moderators should know..."
        hint={`${description.length}/${DESCRIPTION_MAX}`}
        error={formState.errors.description?.message}
        {...register('description')}
      />
    </div>
  )
}

interface ReviewItemProps {
  label: string
  onEdit: () => void
  children: ReactNode
}

function ReviewItem({ label, onEdit, children }: ReviewItemProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-surface-2 p-4">
      <dt className="flex items-center justify-between gap-2 text-sm text-muted">
        {label}
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${label.toLowerCase()}`}
          className="rounded-lg p-1 transition-colors hover:bg-surface-3 hover:text-white"
        >
          <Pencil className="size-4" aria-hidden />
        </button>
      </dt>
      <dd className="min-w-0 break-words text-white">{children}</dd>
    </div>
  )
}

interface ReviewStepProps {
  username: string
  onEdit: (step: number) => void
}

export function ReviewStep({ username, onEdit }: ReviewStepProps) {
  const { control } = useFormContext<SubmitRunForm>()
  const [category, videoLink, time, description] = useWatch({
    control,
    name: ['category', 'videoLink', 'time', 'description'],
  })
  const info = isCategory(category) ? categoryInfo(category) : null

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-center font-display text-3xl text-accent sm:text-4xl">
        {info?.label} - {username}
      </h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <dl className="flex flex-col gap-3">
          <ReviewItem label="Category" onEdit={() => onEdit(0)}>
            <span className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: info?.colorVar }}
                aria-hidden
              />
              {info?.label}
            </span>
          </ReviewItem>
          <ReviewItem label="Video link" onEdit={() => onEdit(1)}>
            {videoLink.trim()}
          </ReviewItem>
          <ReviewItem label="Time" onEdit={() => onEdit(1)}>
            <span className="font-display text-2xl tracking-wider">{formatRunTime(time)}</span>
          </ReviewItem>
          <ReviewItem label="Description" onEdit={() => onEdit(2)}>
            {description.trim() || <span className="text-muted">No description</span>}
          </ReviewItem>
        </dl>
        <VideoEmbed link={videoLink.trim()} title="Preview of your run" />
      </div>
    </div>
  )
}
