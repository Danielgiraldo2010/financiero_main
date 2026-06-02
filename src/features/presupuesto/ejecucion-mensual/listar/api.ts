import { fetcher } from '@/shared/api/fetcher'
import type { EjecucionMensualResponse, EjecucionMensualParams } from '../../model/types'
import type { PagedResult } from '@/shared/api/types'

export async function fetchEjecucionMensual(
  params: EjecucionMensualParams & { unidadEjecutoraId?: number } = {},
): Promise<PagedResult<EjecucionMensualResponse>> {
  const query = new URLSearchParams()
  if (params.vigencia != null)          query.set('vigencia', String(params.vigencia))
  if (params.mes != null)               query.set('mes', String(params.mes))
  if (params.unidadEjecutoraId != null) query.set('unidadEjecutoraId', String(params.unidadEjecutoraId))
  const qs = query.toString()
  return fetcher<PagedResult<EjecucionMensualResponse>>(
    `/api/v1/presupuesto/ejecucion-mensual${qs ? `?${qs}` : ''}`,
  )
}
