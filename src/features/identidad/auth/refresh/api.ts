// features/identidad/auth/refresh/api.ts
// Sin UI -- solo lo usa shared/api/auth/refresh-token.ts
// Exportado para que fe_01b pueda re-usarlo si necesita
import { fetcher } from '@/shared/api/fetcher'
import type { LoginResponse } from '../../model/types'

export async function refreshToken(currentRefreshToken: string): Promise<LoginResponse> {
  return fetcher<LoginResponse>('/api/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: currentRefreshToken }),
    headers: { 'X-Skip-Auth': '1' },
  })
}
