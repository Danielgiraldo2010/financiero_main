// features/identidad/auth/logout/api.ts
// LogoutCommand: { refreshToken }
import { fetcher } from '@/shared/api/fetcher'
import { getRefreshToken } from '@/shared/api/auth/token-store'

export async function logoutUsuario(): Promise<void> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return
  return fetcher<void>('/api/v1/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
}
