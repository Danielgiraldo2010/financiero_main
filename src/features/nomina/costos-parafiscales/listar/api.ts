import { fetcher } from '@/shared/api/fetcher'
import type { PagedResult } from '../../model/types'

export interface CostosParafiscales {
  id:                  number
  vigencia:            number
  mes:                 number
  tipoNomina:          string
  porcSaludEmpleador:  number
  porcPensionEmpleador: number
  porcArl:             number
  porcCajaCompensacion: number
  porcIcbf:            number
  porcSena:            number
  factorPrestaciones:  number
  cargadoPor:          string | null
  fechaCarga:          string        // datetime ISO
  estado:              string
  factorTotalCosto:    number        // calculado por backend
}

export interface ListarCostosParams {
  vigencia?: number
  mes?:      number
  page?:     number
  pageSize?: number
}

export async function listarCostosParafiscales(
  params?: ListarCostosParams,
): Promise<PagedResult<CostosParafiscales>> {
  const qs = new URLSearchParams()
  if (params?.vigencia) qs.set('vigencia', String(params.vigencia))
  if (params?.mes)      qs.set('mes',      String(params.mes))
  if (params?.page)     qs.set('page',     String(params.page))
  if (params?.pageSize) qs.set('pageSize', String(params.pageSize))
  const query = qs.toString() ? `?${qs}` : ''
  return fetcher(`/api/v1/nomina/costos-parafiscales${query}`)
}
