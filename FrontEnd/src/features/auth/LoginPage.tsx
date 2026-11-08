import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Input, PasswordInput } from '../../components/ui'
import { loginErrorMessage, useLogin } from './api'
import { AuthCard } from './AuthCard'
import { redirectTarget } from './redirect'
import { loginSchema, type LoginForm } from './schemas'
import { useAuth } from './useAuth'

export function LoginPage() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  if (user && !loginMutation.isSuccess) {
    return <Navigate to="/" replace />
  }

  const onSubmit = handleSubmit((form) =>
    loginMutation.mutate(form, {
      onSuccess: (signedUser) => {
        toast.success(`Welcome back, ${signedUser.username}!`)
        navigate(redirectTarget(location.state), { replace: true })
      },
    }),
  )

  return (
    <AuthCard
      title="Login to your account"
      description="Enter your email and password below to login to your account"
      switchLabel="Sign up"
      switchTo="/signup"
      onSubmit={onSubmit}
      footer={
        <>
          {loginMutation.isError && (
            <p role="alert" className="w-full rounded-xl bg-danger/15 px-4 py-3 text-center text-danger">
              {loginErrorMessage(loginMutation.error)}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            loading={loginMutation.isPending}
            className="w-full max-w-60 rounded-2xl"
          >
            Login
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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
    </AuthCard>
  )
}
