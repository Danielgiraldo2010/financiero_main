// features/presupuesto/etapas/listar/api.ts
// GET /api/v1/presupuesto/etapas?vigencia=&unidadEjecutoraId=
import { fetcher } from '@/shared/api/fetcher'
import type { EtapaAprobacionResponse } from '../../model/types'

export async function fetchEtapasAprobacion(
  vigencia: number,
  unidadEjecutoraId?: number,
): Promise<EtapaAprobacionResponse[]> {
  const query = new URLSearchParams()
  query.set('vigencia', String(vigencia))
  if (unidadEjecutoraId != null) query.set('unidadEjecutoraId', String(unidadEjecutoraId))
  return fetcher<EtapaAprobacionResponse[]>(
    `/api/v1/presupuesto/etapas?${query.toString()}`,
  )
}
