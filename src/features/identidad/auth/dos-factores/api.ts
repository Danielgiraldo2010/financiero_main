// features/identidad/auth/dos-factores/api.ts
// Endpoint: POST /api/v1/auth/2fa con Manage2FaCommand { habilitar: bool }
import { fetcher } from '@/shared/api/fetcher'
import type { Manage2FaResponse } from '../../model/types'

export async function enable2FA(): Promise<Manage2FaResponse> {
  return fetcher<Manage2FaResponse>('/api/v1/auth/2fa', {
    method: 'POST',
    body: JSON.stringify({ habilitar: true }),
  })
}

export async function disable2FA(): Promise<Manage2FaResponse> {
  return fetcher<Manage2FaResponse>('/api/v1/auth/2fa', {
    method: 'POST',
    body: JSON.stringify({ habilitar: false }),
  })
}
