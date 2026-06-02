// features/identidad/auth/login/api.ts
// G1: usa fetcher -- nunca fetch directo
import { fetcher } from '@/shared/api/fetcher'
import type { LoginCredentials, LoginResponse } from '../../model/types'

export async function loginUsuario(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return fetcher<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}
