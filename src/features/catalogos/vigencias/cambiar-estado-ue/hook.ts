// features/catalogos/vigencias/cambiar-estado-ue/hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { vigenciasKeys } from '../model/queryKeys'
import { cambiarEstadoUe } from './api'
import type { CambiarEstadoUeRequest } from '../model/types'

export function useCambiarEstadoUe(vigenciaId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ueId, req }: { ueId: number; req: CambiarEstadoUeRequest }) =>
      cambiarEstadoUe(vigenciaId, ueId, req),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vigenciasKeys.unidades(vigenciaId),
      })
    },
  })
}
