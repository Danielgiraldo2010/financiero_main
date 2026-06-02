// features/identidad/auth/perfil/api.ts
import { fetcher } from '@/shared/api/fetcher'
import type { UsuarioResponse, UpdatePerfilData, ChangePasswordData } from '../../model/types'

export async function getMiPerfil(): Promise<UsuarioResponse> {
  return fetcher<UsuarioResponse>('/api/v1/auth/me')
}

export async function updateMiPerfil(data: UpdatePerfilData): Promise<UsuarioResponse> {
  return fetcher<UsuarioResponse>('/api/v1/auth/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Invariante 01a-I5: invalida sesion -- hook llama useLogout() tras exito
export async function changePassword(data: ChangePasswordData): Promise<void> {
  return fetcher<void>('/api/v1/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
