import { z } from 'zod'
import { COUNTRIES } from '../../lib/countries'

const COUNTRY_CODES = new Set(COUNTRIES.map((country) => country.code))

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email').pipe(z.email('Enter a valid email')),
  password: z.string().min(1, 'Enter your password'),
})

export const registerSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email').pipe(z.email('Enter a valid email')),
  password: z.string().min(8, 'Use at least 8 characters'),
  username: z
    .string()
    .trim()
    .min(3, 'Use at least 3 characters')
    .max(20, 'Use at most 20 characters')
    .regex(/^[\p{L}\p{N}_-]+$/u, 'Use only letters, numbers, - and _'),
  country: z.string().refine((code) => COUNTRY_CODES.has(code), 'Select your country'),
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
