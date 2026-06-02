// src/features/proyectos/anular/api.ts
import { fetcher } from '@/shared/api/fetcher'

export interface AnularProyectoPayload {
  motivo: string
}

export async function anularProyecto(id: number, payload: AnularProyectoPayload): Promise<void> {
  await fetcher<void>(`/api/v1/proyectos/${id}/anular`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}