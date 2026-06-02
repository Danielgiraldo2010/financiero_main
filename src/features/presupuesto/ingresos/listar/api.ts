import { fetcher } from '@/shared/api/fetcher'
import type { LineaIngresoResponse, PresupuestoLineasParams } from '../../model/types'
import type { PagedResult } from '@/shared/api/types'

export async function fetchPresupuestoIngresos(
  params: PresupuestoLineasParams & { unidadEjecutoraId?: number } = {},
): Promise<PagedResult<LineaIngresoResponse>> {
  const query = new URLSearchParams()
  if (params.vigencia != null)          query.set('vigencia', String(params.vigencia))
  if (params.proyecto)                  query.set('proyecto', params.proyecto)
  if (params.unidadEjecutoraId != null) query.set('unidadEjecutoraId', String(params.unidadEjecutoraId))
  const qs = query.toString()
  return fetcher<PagedResult<LineaIngresoResponse>>(
    `/api/v1/presupuesto/ingresos${qs ? `?${qs}` : ''}`,
  )
}
