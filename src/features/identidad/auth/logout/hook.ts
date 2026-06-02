// features/identidad/auth/logout/hook.ts
// onSettled: siempre limpia aunque el backend falle
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { clearAccessToken, clearRefreshToken } from '@/shared/api/auth/token-store'
import { clearTenantId } from '@/shared/api/tenant/tenant-store'
import { useAuthStore } from '@/shared/state/auth.store'
import type { ApiError } from '@/shared/api/errors/ApiError'
import { logoutUsuario } from './api'

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const authLogout = useAuthStore((s) => s.logout)

  return useMutation<void, ApiError, void>({
    mutationFn: logoutUsuario,
    onSettled: () => {
      clearAccessToken()
      clearRefreshToken()
      clearTenantId()
      authLogout()
      queryClient.clear()
      void navigate({ to: '/login' })
    },
  })
}
