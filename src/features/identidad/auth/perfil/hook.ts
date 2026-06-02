// features/identidad/auth/perfil/hook.ts
// 01a-I4: queryKey ['auth','perfil'], staleTime 10min
// 01a-I5: ChangePassword -> logout automatico
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api/errors/ApiError'
import type { UsuarioResponse, UpdatePerfilData, ChangePasswordData } from '../../model/types'
import { getMiPerfil, updateMiPerfil, changePassword } from './api'
import { useLogout } from '../logout/hook'

const PERFIL_KEY = ['auth', 'perfil'] as const

export function useMiPerfil() {
  return useQuery<UsuarioResponse, ApiError>({
    queryKey: PERFIL_KEY,
    queryFn: getMiPerfil,
    staleTime: 10 * 60 * 1000,
  })
}

export function useUpdatePerfil() {
  const queryClient = useQueryClient()
  return useMutation<UsuarioResponse, ApiError, UpdatePerfilData>({
    mutationFn: updateMiPerfil,
    onSuccess: (data) => queryClient.setQueryData(PERFIL_KEY, data),
  })
}

export function useChangePassword() {
  const { mutate: logout } = useLogout()
  return useMutation<void, ApiError, ChangePasswordData>({
    mutationFn: changePassword,
    onSuccess: () => logout(),
  })
}
