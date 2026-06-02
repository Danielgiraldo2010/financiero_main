import { fetcher } from '@/shared/api/fetcher'
import type { Proyecto, ModificarProyectoPayload } from '../model/types'

export async function modificarProyecto(id: number, payload: ModificarProyectoPayload): Promise<Proyecto> {
  return fetcher<Proyecto>(`/api/v1/proyectos/${id}`, {
    method: 'PUT',
    body:   JSON.stringify(payload),
  })
}
