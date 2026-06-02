import { useMutation, useQueryClient } from '@tanstack/react-query'
import { modificacionesKeys } from '../model/queryKeys'
import { registrarModificacion } from './api'
import type { RegistrarModificacionInput } from '../model/schema'

export function useRegistrarModificacion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegistrarModificacionInput) => registrarModificacion(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: modificacionesKeys.lists(),
      })
    },
  })
}
