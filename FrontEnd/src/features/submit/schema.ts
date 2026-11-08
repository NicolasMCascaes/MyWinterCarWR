import { z } from 'zod'
import { parseRunTime, totalHundredths } from '../../lib/time'
import { isAllowedVideoLink } from '../../lib/video'
import { isCategory, type Category } from '../categories/categories'

export const DESCRIPTION_MAX = 256

export const submitRunSchema = z.object({
  category: z
    .custom<Category | ''>((value) => value === '' || (typeof value === 'string' && isCategory(value)))
    .refine((value) => value !== '', 'Select a category'),
  videoLink: z
    .string()
    .trim()
    .min(1, 'Paste the link of your run')
    .refine(isAllowedVideoLink, 'Use a YouTube or Twitch link'),
  time: z
    .string()
    .min(1, 'Enter the time of your run')
    .refine((value) => parseRunTime(value) !== null, 'Use the format HH:MM:SS or HH:MM:SS.cc')
    .refine((value) => {
      const parsed = parseRunTime(value)
      return parsed === null || totalHundredths(parsed) > 0
    }, 'The time must be greater than zero'),
  description: z.string().trim().max(DESCRIPTION_MAX, `Use at most ${DESCRIPTION_MAX} characters`),
})

export type SubmitRunForm = z.input<typeof submitRunSchema>

export const STEP_FIELDS = [
  ['category'],
  ['videoLink', 'time'],
  ['description'],
  [],
] as const satisfies ReadonlyArray<ReadonlyArray<keyof SubmitRunForm>>
