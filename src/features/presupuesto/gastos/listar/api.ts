import { fetcher } from '@/shared/api/fetcher'
import type { LineaGastoResponse, PresupuestoLineasParams } from '../../model/types'
import type { PagedResult } from '@/shared/api/types'

export async function fetchPresupuestoGastos(
  params: PresupuestoLineasParams & { unidadEjecutoraId?: number } = {},
): Promise<PagedResult<LineaGastoResponse>> {
  const query = new URLSearchParams()
  if (params.vigencia != null)          query.set('vigencia', String(params.vigencia))
  if (params.proyecto)                  query.set('proyecto', params.proyecto)
  if (params.unidadEjecutoraId != null) query.set('unidadEjecutoraId', String(params.unidadEjecutoraId))
  const qs = query.toString()
  return fetcher<PagedResult<LineaGastoResponse>>(
    `/api/v1/presupuesto/gastos${qs ? `?${qs}` : ''}`,
  )
}
