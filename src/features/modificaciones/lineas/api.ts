// POST /api/v1/modificaciones/{id}/lineas  ← un movimiento individual por llamada
// GET  /api/v1/modificaciones/{id}/lineas
import { fetcher } from '@/shared/api/fetcher'
import type { LineaModificacion } from '../model/types'
import type { AgregarLineaInput } from '../model/schema'

export async function agregarLinea(
  modId: number,
  data: AgregarLineaInput,
): Promise<LineaModificacion> {
  return fetcher<LineaModificacion>(`/api/v1/modificaciones/${modId}/lineas`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function fetchLineas(modId: number): Promise<LineaModificacion[]> {
  return fetcher<LineaModificacion[]>(`/api/v1/modificaciones/${modId}/lineas`)
}
