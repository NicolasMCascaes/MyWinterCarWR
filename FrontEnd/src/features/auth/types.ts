export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest extends LoginRequest {
  username: string
  country: string
}

export interface LoginResponse {
  token: string
  username: string
}
