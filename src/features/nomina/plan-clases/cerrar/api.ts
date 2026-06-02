import { fetcher } from '@/shared/api/fetcher'

export interface CerrarPlanClasesPayload {
  observaciones: string | null
}

export async function cerrarPlanClases(
  id: number,
  payload: CerrarPlanClasesPayload,
): Promise<void> {
  return fetcher(`/api/v1/nomina/plan-clases/${id}/cerrar`, {
    method: 'POST',
    body:   JSON.stringify({ id, ...payload }),
  })
}
