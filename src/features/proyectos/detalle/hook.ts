import { useQuery } from '@tanstack/react-query'
import { proyectosKeys } from '../model/queryKeys'
import { getProyecto } from './api'

export function useProyecto(id: number) {
  return useQuery({
    queryKey:  proyectosKeys.detail(id),
    queryFn:   () => getProyecto(id),
    enabled:   id > 0,
    staleTime: 30_000,
  })
}
