import { fetcher } from '@/shared/api/fetcher'
import type { PlanClases, PagedResult } from '../../model/types'

export interface ListarPlanClasesParams {
  empleadoId?:         number
  periodoAcademicoId?: number
  estado?:             string
  page?:               number
  pageSize?:           number
}

export async function listarPlanClases(
  params?: ListarPlanClasesParams,
): Promise<PagedResult<PlanClases>> {
  const qs = new URLSearchParams()
  if (params?.empleadoId)         qs.set('empleadoId',         String(params.empleadoId))
  if (params?.periodoAcademicoId) qs.set('periodoAcademicoId', String(params.periodoAcademicoId))
  if (params?.estado)             qs.set('estado',             params.estado)
  if (params?.page)               qs.set('page',               String(params.page))
  if (params?.pageSize)           qs.set('pageSize',           String(params.pageSize))
  const query = qs.toString() ? `?${qs}` : ''
  return fetcher(`/api/v1/nomina/plan-clases${query}`)
}
