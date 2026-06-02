// features/presupuesto/techo/listar/api.ts
// GET /api/v1/presupuesto/techo?vigencia=&unidadEjecutoraId=
import { fetcher } from '@/shared/api/fetcher'
import type { TechoPresupuestalResponse } from '../../model/types'

export async function fetchTechosPresupuestales(
  vigencia: number,
  unidadEjecutoraId?: number,
): Promise<TechoPresupuestalResponse[]> {
  const query = new URLSearchParams()
  query.set('vigencia', String(vigencia))
  if (unidadEjecutoraId != null) query.set('unidadEjecutoraId', String(unidadEjecutoraId))
  return fetcher<TechoPresupuestalResponse[]>(
    `/api/v1/presupuesto/techo?${query.toString()}`,
  )
}
