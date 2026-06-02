// src/features/proyectos/timeline/hook.ts
import { useQuery } from '@tanstack/react-query'
import { proyectosKeys } from '../model/queryKeys'
import { getProyectoTimeline } from './api'

// vigencia es requerido por el backend — viene de proyecto.vigenciaActiva
export function useProyectoTimeline(id: number, vigencia: number) {
  return useQuery({
    queryKey: [...proyectosKeys.timeline(id), vigencia],
    queryFn:  () => getProyectoTimeline(id, vigencia),
    enabled:  id > 0 && vigencia > 0,
  })
}