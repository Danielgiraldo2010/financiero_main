import { fetcher } from '@/shared/api/fetcher'
import type { PagedResult } from '../../model/types'

export interface DetalleNomina {
  id:            number
  conceptoId:    number
  conceptoNombre: string
  tipoConcepto:  string
  valor:         number
  baseCalculo:   number | null
  descripcion:   string | null
}

export interface NominaEmpleado {
  id:               number
  empleadoId:       number
  empleadoNombre:   string
  tipoNomina:       string
  vigencia:         number
  mes:              number
  nombreMes:        string
  diasLaborados:    number
  totalDevengado:   number
  totalDeducciones: number
  totalNeto:        number
  estado:           string
  detalle:          DetalleNomina[]
}

export interface ListarLiquidacionesParams {
  vigencia?:   number
  mes?:        number
  empleadoId?: number
  estado?:     string
  page?:       number
  pageSize?:   number
}

export async function listarLiquidaciones(
  params?: ListarLiquidacionesParams,
): Promise<PagedResult<NominaEmpleado>> {
  const qs = new URLSearchParams()
  if (params?.vigencia)   qs.set('vigencia',   String(params.vigencia))
  if (params?.mes)        qs.set('mes',        String(params.mes))
  if (params?.empleadoId) qs.set('empleadoId', String(params.empleadoId))
  if (params?.estado)     qs.set('estado',     params.estado)
  if (params?.page)       qs.set('page',       String(params.page))
  if (params?.pageSize)   qs.set('pageSize',   String(params.pageSize))
  const query = qs.toString() ? `?${qs}` : ''
  return fetcher(`/api/v1/nomina/liquidacion${query}`)
}
