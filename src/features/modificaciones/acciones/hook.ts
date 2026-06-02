import { useMutation, useQueryClient } from '@tanstack/react-query'
import { modificacionesKeys } from '../model/queryKeys'
import {
  aprobarModificacion,
  refrendarModificacion,
  rechazarModificacion,
} from './api'
import type {
  AprobarModificacionInput,
  RefrendarModificacionInput,
  RechazarModificacionInput,
} from '../model/schema'

// Factory interna — todos los hooks de acción invalidan el mismo conjunto de keys
function useAccionModificacion<TInput>(
  id: number,
  mutationFn: (id: number, data: TInput) => Promise<unknown>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TInput) => mutationFn(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: modificacionesKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: modificacionesKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: modificacionesKeys.timeline(id) })
    },
  })
}

export function useAprobar(id: number) {
  return useAccionModificacion<AprobarModificacionInput>(id, aprobarModificacion)
}

export function useRefrendar(id: number) {
  return useAccionModificacion<RefrendarModificacionInput>(id, refrendarModificacion)
}

export function useRechazar(id: number) {
  return useAccionModificacion<RechazarModificacionInput>(id, rechazarModificacion)
}
