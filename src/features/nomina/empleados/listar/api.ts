import { fetcher } from '@/shared/api/fetcher'
import type { Empleado, PagedResult } from '../model/types'

export interface ListarEmpleadosParams {
  tipoEmpleado?: string
  estado?:       string
  search?:       string
  page?:         number
  pageSize?:     number
}

export async function listarEmpleados(
  params?: ListarEmpleadosParams,
): Promise<PagedResult<Empleado>> {
  const qs = new URLSearchParams()
  if (params?.tipoEmpleado) qs.set('tipoEmpleado', params.tipoEmpleado)
  if (params?.estado)       qs.set('estado',       params.estado)
  if (params?.search)       qs.set('search',       params.search)
  if (params?.page)         qs.set('page',         String(params.page))
  if (params?.pageSize)     qs.set('pageSize',     String(params.pageSize))
  const query = qs.toString() ? `?${qs}` : ''
  return fetcher(`/api/v1/nomina/empleados${query}`)
}
