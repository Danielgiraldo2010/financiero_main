import { useQuery } from '@tanstack/react-query'
import { modificacionesKeys } from '../model/queryKeys'
import { fetchModificaciones } from './api'
import type { ModificacionesParams } from '../model/types'

export function useModificaciones(params: ModificacionesParams = {}) {
  return useQuery({
    queryKey: modificacionesKeys.list(params),
    queryFn:  () => fetchModificaciones(params),
  })
}
