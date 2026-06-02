// features/catalogos/vigencias/modificar/hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { vigenciasKeys } from '../model/queryKeys'
import { modificarVigencia } from './api'

export function useModificarVigencia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarVigencia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vigenciasKeys.all })
    },
  })
}
