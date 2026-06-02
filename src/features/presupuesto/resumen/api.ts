// features/presupuesto/resumen/api.ts
// GET /api/v1/presupuesto/resumen?vigencia=&unidadEjecutoraId=
import { fetcher } from '@/shared/api/fetcher'
import type { ResumenEjecucionPresupuestal } from '../model/types'

export async function fetchResumenPresupuesto(
  vigencia: number,
  unidadEjecutoraId?: number,
): Promise<ResumenEjecucionPresupuestal> {
  const query = new URLSearchParams()
  query.set('vigencia', String(vigencia))
  if (unidadEjecutoraId != null) query.set('unidadEjecutoraId', String(unidadEjecutoraId))
  return fetcher<ResumenEjecucionPresupuestal>(
    `/api/v1/presupuesto/resumen?${query.toString()}`,
  )
}
