import { fetcher } from '@/shared/api/fetcher'
import type { Proyecto } from '../model/types'

export async function getProyecto(id: number): Promise<Proyecto> {
  return fetcher<Proyecto>(`/api/v1/proyectos/${id}`)
}
