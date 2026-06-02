// src/features/proyectos/timeline/api.ts
import { fetcher } from '@/shared/api/fetcher'
import type { TimelineItemProyecto } from '../model/types'

// El backend retorna ProyectoTimelineResponse — objeto wrapper con .historial[]
interface ProyectoTimelineResponse {
  proyectoId:              number
  proyectoNombre:          string
  estadoPresupuestoActual: string
  siguientePaso:           string
  historial:               TimelineItemProyecto[]
}

// GET /api/v1/proyectos/{id}/timeline?vigencia={vigencia}
export async function getProyectoTimeline(
  id: number,
  vigencia: number,
): Promise<TimelineItemProyecto[]> {
  const response = await fetcher<ProyectoTimelineResponse>(
    `/api/v1/proyectos/${id}/timeline?vigencia=${vigencia}`,
  )
  // Extraer el array de historial del objeto wrapper
  return response.historial ?? []
}