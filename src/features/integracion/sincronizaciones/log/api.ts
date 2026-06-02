// features/integracion/sincronizaciones/log/api.ts

import { fetcher } from "@/shared/api/fetcher"
import type { Sincronizacion } from "../../model/types"
import type { PagedResult } from "@/shared/api/types"

export interface ListarSincronizacionesParams {
  pagina?: number
  elementosPorPagina?: number
}

export function listarSincronizaciones(
  params: ListarSincronizacionesParams = {}
): Promise<PagedResult<Sincronizacion>> {
  const { pagina = 1, elementosPorPagina = 50 } = params

  const qs = new URLSearchParams()
  qs.set("pagina", String(pagina))
  qs.set("elementosPorPagina", String(elementosPorPagina))

  return fetcher(`/api/v1/integracion/sincronizaciones?${qs}`)
}