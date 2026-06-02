// POST /api/v1/modificaciones
import { fetcher } from '@/shared/api/fetcher'
import type { SolicitudModificacion } from '../model/types'
import type { RegistrarModificacionInput } from '../model/schema'

export async function registrarModificacion(
  data: RegistrarModificacionInput,
): Promise<SolicitudModificacion> {
  return fetcher<SolicitudModificacion>('/api/v1/modificaciones', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
