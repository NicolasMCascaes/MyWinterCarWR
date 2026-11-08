export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type TokenProvider = () => string | null
type UnauthorizedHandler = () => void

let tokenProvider: TokenProvider = () => null
let unauthorizedHandler: UnauthorizedHandler = () => {}

export function configureHttp(options: { getToken: TokenProvider; onUnauthorized: UnauthorizedHandler }) {
  tokenProvider = options.getToken
  unauthorizedHandler = options.onUnauthorized
}

interface ErrorInfo {
  errorMessage?: string
  errorCode?: number
}

async function readError(response: Response): Promise<ApiError> {
  let message = response.statusText || 'Unexpected error'
  try {
    const body = (await response.json()) as ErrorInfo
    if (body.errorMessage) {
      message = body.errorMessage
    }
  } catch {
    return new ApiError(message, response.status)
  }
  return new ApiError(message, response.status)
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenProvider()
  const headers = new Headers(init.headers)
  if (init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })

  if (!response.ok) {
    if (response.status === 401 && token) {
      unauthorizedHandler()
    }
    throw await readError(response)
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body === undefined ? undefined : JSON.stringify(body) }),
}
