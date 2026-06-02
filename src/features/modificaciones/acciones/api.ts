// POST /api/v1/modificaciones/{id}/aprobar    ← AprobarModificacionCommand
// POST /api/v1/modificaciones/{id}/refrendar  ← RefrendarModificacionCommand
// POST /api/v1/modificaciones/{id}/rechazar   ← RechazarModificacionCommand
import { fetcher } from '@/shared/api/fetcher'
import type { SolicitudModificacion } from '../model/types'
import type {
  AprobarModificacionInput,
  RefrendarModificacionInput,
  RechazarModificacionInput,
} from '../model/schema'

export async function aprobarModificacion(
  id: number,
  data: AprobarModificacionInput,
): Promise<SolicitudModificacion> {
  return fetcher<SolicitudModificacion>(`/api/v1/modificaciones/${id}/aprobar`, {
    method: 'POST',
    body: JSON.stringify({ id, ...data }),
  })
}

export async function refrendarModificacion(
  id: number,
  data: RefrendarModificacionInput,
): Promise<SolicitudModificacion> {
  return fetcher<SolicitudModificacion>(`/api/v1/modificaciones/${id}/refrendar`, {
    method: 'POST',
    body: JSON.stringify({ id, ...data }),
  })
}

export async function rechazarModificacion(
  id: number,
  data: RechazarModificacionInput,
): Promise<SolicitudModificacion> {
  return fetcher<SolicitudModificacion>(`/api/v1/modificaciones/${id}/rechazar`, {
    method: 'POST',
    body: JSON.stringify({ id, ...data }),
  })
}
