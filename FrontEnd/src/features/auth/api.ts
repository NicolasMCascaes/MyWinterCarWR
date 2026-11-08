import { useMutation } from '@tanstack/react-query'
import { ApiError, http } from '../../lib/http'
import type { LoginRequest, LoginResponse, RegisterRequest } from './types'
import { useAuth } from './useAuth'

export function login(request: LoginRequest): Promise<LoginResponse> {
  return http.post<LoginResponse>('/user/login', request)
}

export function register(request: RegisterRequest): Promise<void> {
  return http.post<void>('/user/register', request)
}

export function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
    return 'Invalid email or password.'
  }
  return 'Could not log in right now. Please try again.'
}

export function registerErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return 'This email or username is already in use.'
    }
    if (error.status === 400) {
      return error.message
    }
  }
  return 'Could not create your account right now. Please try again.'
}

export function useLogin() {
  const { signIn } = useAuth()
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => signIn(response.token),
  })
}

export function useRegister() {
  const { signIn } = useAuth()
  return useMutation({
    mutationFn: async (request: RegisterRequest) => {
      await register(request)
      return login({ email: request.email, password: request.password })
    },
    onSuccess: (response) => signIn(response.token),
  })
}
