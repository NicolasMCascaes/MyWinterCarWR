import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, User } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Input, PasswordInput } from '../../components/ui'
import { guessCountry } from '../../lib/countries'
import { registerErrorMessage, useRegister } from './api'
import { AuthCard } from './AuthCard'
import { CountrySelect } from './CountrySelect'
import { redirectTarget } from './redirect'
import { registerSchema, type RegisterForm } from './schemas'
import { useAuth } from './useAuth'

export function SignupPage() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', username: '', country: guessCountry(navigator.language) },
  })

  if (user && !registerMutation.isSuccess) {
    return <Navigate to="/" replace />
  }

  const onSubmit = handleSubmit((form) =>
    registerMutation.mutate(form, {
      onSuccess: (signedUser) => {
        toast.success(`Welcome to My Winter Car WR, ${signedUser.username}!`)
        navigate(redirectTarget(location.state), { replace: true })
      },
    }),
  )

  return (
    <AuthCard
      title="Register"
      description="Enter the required information below to register your account"
      switchLabel="Already have an account? Login!"
      switchTo="/login"
      onSubmit={onSubmit}
      footer={
        <>
          {registerMutation.isError && (
            <p role="alert" className="w-full rounded-xl bg-danger/15 px-4 py-3 text-center text-danger">
              {registerErrorMessage(registerMutation.error)}
            </p>
          )}
          <Button type="submit" size="lg" loading={registerMutation.isPending} className="w-full rounded-2xl">
            Register
          </Button>
        </>
      }
    >
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        icon={<Mail className="size-5" aria-hidden />}
        error={errors.email?.message}
        {...register('email')}
      />
      <PasswordInput
        label="Password"
        autoComplete="new-password"
        hint="At least 8 characters"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="Username"
        autoComplete="username"
        icon={<User className="size-5" aria-hidden />}
        hint="This is how you will appear on the leaderboard"
        error={errors.username?.message}
        {...register('username')}
      />
      <Controller
        control={control}
        name="country"
        render={({ field, fieldState }) => (
          <CountrySelect
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
    </AuthCard>
  )
}
