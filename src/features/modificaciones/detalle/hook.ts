import { useQuery } from '@tanstack/react-query'
import { modificacionesKeys } from '../model/queryKeys'
import { fetchModificacion, fetchTimeline } from './api'

export function useModificacion(id: number) {
  return useQuery({
    queryKey: modificacionesKeys.detail(id),
    queryFn:  () => fetchModificacion(id),
    enabled:  id > 0,
  })
}

export function useTimeline(id: number) {
  return useQuery({
    queryKey: modificacionesKeys.timeline(id),
    queryFn:  () => fetchTimeline(id),
    enabled:  id > 0,
  })
}
