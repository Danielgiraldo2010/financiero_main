// features/catalogos/vigencias/habilitar-unidad/hook.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vigenciasKeys } from '../model/queryKeys'
import { habilitarUnidad, listarUesVigencia } from './api'

export function useUesVigencia(vigenciaId: number | null) {
  return useQuery({
    queryKey: vigenciasKeys.unidades(vigenciaId ?? 0),
    queryFn:  () => listarUesVigencia(vigenciaId!),
    enabled:  vigenciaId !== null,
  })
}

export function useHabilitarUnidad() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: habilitarUnidad,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: vigenciasKeys.unidades(variables.vigenciaId),
      })
    },
  })
}
