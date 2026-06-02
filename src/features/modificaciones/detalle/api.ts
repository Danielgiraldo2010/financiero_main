// GET /api/v1/modificaciones/{id}
// GET /api/v1/modificaciones/{id}/timeline
import { fetcher } from '@/shared/api/fetcher'
import type { SolicitudModificacion, TimelineEvento } from '../model/types'

export async function fetchModificacion(id: number): Promise<SolicitudModificacion> {
  return fetcher<SolicitudModificacion>(`/api/v1/modificaciones/${id}`)
}

export async function fetchTimeline(id: number): Promise<TimelineEvento[]> {
  return fetcher<TimelineEvento[]>(`/api/v1/modificaciones/${id}/timeline`)
}
