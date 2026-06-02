// features/identidad/auth/dos-factores/hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api/errors/ApiError'
import type { Manage2FaResponse } from '../../model/types'
import { enable2FA, disable2FA } from './api'

export function useEnable2FA() {
  return useMutation<Manage2FaResponse, ApiError, void>({ mutationFn: enable2FA })
}

export function useDisable2FA() {
  const queryClient = useQueryClient()
  return useMutation<Manage2FaResponse, ApiError, void>({
    mutationFn: disable2FA,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth', 'perfil'] }),
  })
}
