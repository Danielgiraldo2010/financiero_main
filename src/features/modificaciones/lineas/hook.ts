import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { modificacionesKeys } from '../model/queryKeys'
import { agregarLinea, fetchLineas } from './api'
import type { AgregarLineaInput } from '../model/schema'

export function useLineasModificacion(modId: number) {
  return useQuery({
    queryKey: modificacionesKeys.lineas(modId),
    queryFn:  () => fetchLineas(modId),
    enabled:  modId > 0,
  })
}

export function useAgregarLinea(modId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AgregarLineaInput) => agregarLinea(modId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: modificacionesKeys.lineas(modId) })
      void queryClient.invalidateQueries({ queryKey: modificacionesKeys.detail(modId) })
    },
  })
}
